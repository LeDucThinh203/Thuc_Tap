/**
 * authService.js — Authentication via Amazon Cognito
 * and admin user management via Lambda Function URL.
 */
import { 
  signIn as amplifySignIn, 
  signUp as amplifySignUp, 
  confirmSignUp as amplifyConfirmSignUp, 
  resendSignUpCode as amplifyResendSignUpCode, 
  signOut as amplifySignOut, 
  resetPassword as amplifyResetPassword, 
  confirmResetPassword as amplifyConfirmResetPassword, 
  getCurrentUser as amplifyGetCurrentUser, 
  fetchAuthSession, 
  fetchUserAttributes, 
  updateUserAttributes as amplifyUpdateUserAttributes, 
  updatePassword as amplifyUpdatePassword, 
} from 'aws-amplify/auth';
import { ROLES } from 'constants/roles';
import apiClient from 'services/apiClient';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

const API_URL =
  import.meta.env.VITE_AUTH_API_URL ||
  'https://hmnbkhu2atupibr7objnnvk4qm0vuytd.lambda-url.ap-southeast-1.on.aws/';

const ROLE_OVERRIDE_KEY = 'sp-role-overrides';

const COGNITO_ERROR_MESSAGES = {
  UsernameExistsException: 'Email đã được đăng ký.',
  InvalidPasswordException: 'Mật khẩu không đủ điều kiện bảo mật.',
  CodeMismatchException: 'Mã OTP không đúng. Vui lòng thử lại.',
  ExpiredCodeException: 'Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.',
  UserNotConfirmedException: 'Tài khoản chưa xác thực. Vui lòng nhập mã OTP.',
  UserNotFoundException: 'Không tìm thấy tài khoản với email hoặc tên tài khoản này.',
  NotAuthorizedException: 'Tài khoản hoặc mật khẩu không đúng.',
  LimitExceededException: 'Quá nhiều lần thử. Vui lòng đợi vài phút rồi thử lại.',
  InvalidParameterException: 'Thông tin không hợp lệ. Kiểm tra lại email.',
};

function mapCognitoError(error) {
  console.error('Original Cognito error:', error);
  console.error('Error name:', error?.name);
  console.error('Error message:', error?.message);
  console.error('Error cause:', error?.cause);
  const mapped = new Error(
    COGNITO_ERROR_MESSAGES[error?.name] || error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.'
  );
  mapped.code = error?.name;
  mapped.original = error;
  return mapped;
}

function getRoleOverrides() {
  try {
    const stored = localStorage.getItem(ROLE_OVERRIDE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function getRoleOverride(username) {
  if (!username) return null;
  return getRoleOverrides()[username] || null;
}

function setRoleOverride(username, role) {
  if (!username || !role) return;
  const overrides = getRoleOverrides();
  overrides[username] = role.toLowerCase();
  localStorage.setItem(ROLE_OVERRIDE_KEY, JSON.stringify(overrides));
}

function clearRoleOverride(username) {
  if (!username) return;
  const overrides = getRoleOverrides();
  if (!(username in overrides)) return;
  delete overrides[username];
  localStorage.setItem(ROLE_OVERRIDE_KEY, JSON.stringify(overrides));
}

function resolveRole(username, role) {
  return (getRoleOverride(username) || role || ROLES.USER).toLowerCase();
}

function extractRoleFromSession(session) {
  const groups = session?.tokens?.accessToken?.payload?.['cognito:groups'];
  if (Array.isArray(groups) && groups.length > 0) return groups[0].toLowerCase();
  return ROLES.USER;
}

/**
 * Lấy thông tin tài khoản từ DynamoDB qua API
 */
async function getAccountFromDB(usernameOrEmail) {
  try {
    const users = await getUsers();
    const normalizedInput = usernameOrEmail.trim().toLowerCase();
    return users.find(user => 
      user.username.toLowerCase() === normalizedInput || 
      user.email?.toLowerCase() === normalizedInput
    );
  } catch (error) {
    console.warn('Không thể lấy thông tin tài khoản từ DB:', error);
    return null;
  }
}

async function buildAuthUser(cognitoUser, attrs, session) {
  // Lấy thông tin từ DynamoDB
  const dbAccount = await getAccountFromDB(cognitoUser.username);
  
  // Ưu tiên role từ DB, nếu không có thì dùng Cognito hoặc override
  const role = dbAccount?.role || resolveRole(cognitoUser.username, extractRoleFromSession(session));
  
  return {
    username: cognitoUser.username,
    signInDetails: { loginId: attrs.email || cognitoUser.username },
    email: attrs.email || cognitoUser.username,
    name: attrs.name || attrs.email || cognitoUser.username,
    plate: attrs['custom:plate'] || '',
    role,
    account_id: dbAccount?.account_id || cognitoUser.userId || cognitoUser.username,
    // Thêm thông tin từ DB
    dbAccount: dbAccount,
  };
}

async function parseErrorMessage(res, fallbackMessage) {
  const bodyText = await res.text().catch(() => '');
  if (!bodyText) return fallbackMessage;
  try {
    const parsed = JSON.parse(bodyText);
    return parsed.message || parsed.error || bodyText || fallbackMessage;
  } catch {
    return bodyText;
  }
}

/**
 * Sign in with username or email and password via Cognito,
 * then verify account in DynamoDB.
 */
export async function signIn(usernameOrEmail, password) {
  const normalizedInput = usernameOrEmail.trim().toLowerCase();
  
  try {
    // Đăng nhập với Cognito
    const result = await amplifySignIn({ username: normalizedInput, password });

    if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
      const err = new Error('Tài khoản chưa xác thực OTP.');
      err.code = 'UserNotConfirmedException';
      err.email = normalizedInput;
      throw err;
    }

    if (!result.isSignedIn) {
      throw new Error('Đăng nhập chưa hoàn tất. Vui lòng thử lại.');
    }

    const session = await getCurrentUser();
    
    // Kiểm tra tài khoản có tồn tại trong DynamoDB không
    if (session?.user) {
      const dbAccount = await getAccountFromDB(session.user.username);
      if (!dbAccount) {
        await amplifySignOut();
        throw new Error('Tài khoản không tồn tại trong hệ thống.');
      }
      
      // Kiểm tra tài khoản có bị vô hiệu không
      if (isAccountDeactivated(session.user.email || normalizedInput)) {
        await amplifySignOut();
        throw new Error('Tài khoản đã bị vô hiệu, vui lòng liên hệ Quản trị viên.');
      }
    }

    return {
      isSignedIn: true,
      user: session.user,
      groups: [session.role],
      role: session.role,
    };
  } catch (error) {
    if (error.code === 'UserNotConfirmedException') throw error;
    throw mapCognitoError(error);
  }
}

export async function signOut() {
  try {
    await amplifySignOut();
  } catch {
    // Session may already be cleared
  }
}

/**
 * Register via Cognito — OTP gửi qua email (SES).
 */
export async function signUp(email, password, name) {
  const normalizedEmail = email.trim().toLowerCase();
  const username = name.trim().toLowerCase(); // Dùng "Tên tài khoản" làm username
  
  console.log('signUp called with:', { normalizedEmail, name, username });

  try {
    const result = await amplifySignUp({
      username: username,
      password,
      options: {
        userAttributes: {
          email: normalizedEmail,
          name: name.trim(),
        },
      },
    });
    
    console.log('amplifySignUp result:', result);
    console.log('nextStep:', result.nextStep);
    console.log('codeDeliveryDetails:', result.nextStep?.codeDeliveryDetails);
    
    // Store the username in localStorage for confirm/resend
    localStorage.setItem(`cognito_username_${normalizedEmail}`, username);

    return {
      isSignUpComplete: result.isSignUpComplete,
      nextStep: result.nextStep,
      userId: result.userId,
      email: normalizedEmail,
    };
  } catch (error) {
    console.error('signUp error:', error);
    throw mapCognitoError(error);
  }
}

/**
 * Xác nhận đăng ký bằng mã OTP.
 */
export async function confirmSignUp(email, code) {
  const normalizedEmail = email.trim().toLowerCase();
  const storedUsername = localStorage.getItem(`cognito_username_${normalizedEmail}`);
  
  console.log('confirmSignUp called with:', { normalizedEmail, storedUsername });

  try {
    const result = await amplifyConfirmSignUp({
      username: storedUsername || normalizedEmail,
      confirmationCode: code.trim(),
    });
    
    // Clear stored username after successful confirmation
    if (result.isSignUpComplete) {
      localStorage.removeItem(`cognito_username_${normalizedEmail}`);
    }
    
    return { isSignUpComplete: result.isSignUpComplete ?? true };
  } catch (error) {
    throw mapCognitoError(error);
  }
}

/**
 * Gửi lại mã OTP đăng ký.
 */
export async function resendVerificationCode(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const storedUsername = localStorage.getItem(`cognito_username_${normalizedEmail}`);
  
  console.log('resendVerificationCode called with:', { normalizedEmail, storedUsername });

  try {
    const result = await amplifyResendSignUpCode({
      username: storedUsername || normalizedEmail,
    });
    return {
      destination: result.destination,
      deliveryMedium: result.deliveryMedium,
    };
  } catch (error) {
    throw mapCognitoError(error);
  }
}

/**
 * Yêu cầu mã OTP quên mật khẩu.
 */
export async function forgotPassword(email) {
  const normalizedEmail = email.trim().toLowerCase();
  let usernameToUse = normalizedEmail;

  try {
    // Thử tìm tài khoản từ email để lấy username (tên tài khoản)
    try {
      const users = await getUsers();
      const user = users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
      
      if (user) {
        usernameToUse = user.username;
      }
    } catch (dbError) {
      console.warn('Không thể kết nối đến DB, thử dùng email làm username:', dbError);
    }

    // Lưu username vào localStorage để dùng cho confirmForgotPassword
    localStorage.setItem(`forgot_password_username_${normalizedEmail}`, usernameToUse);

    const result = await amplifyResetPassword({
      username: usernameToUse,
    });
    return {
      nextStep: result.nextStep,
      isPasswordReset: result.isPasswordReset,
    };
  } catch (error) {
    throw mapCognitoError(error);
  }
}

/**
 * Xác nhận OTP và đặt mật khẩu mới.
 */
export async function confirmForgotPassword(email, code, newPassword) {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Lấy username từ localStorage
    const storedUsername = localStorage.getItem(`forgot_password_username_${normalizedEmail}`);
    
    if (!storedUsername) {
      throw new Error('Vui lòng yêu cầu mã OTP lại.');
    }

    await amplifyConfirmResetPassword({
      username: storedUsername,
      confirmationCode: code.trim(),
      newPassword,
    });

    // Xóa username khỏi localStorage sau khi thành công
    localStorage.removeItem(`forgot_password_username_${normalizedEmail}`);
    
    return { status: 'success' };
  } catch (error) {
    throw mapCognitoError(error);
  }
}

export async function getCurrentUser() {
  try {
    const cognitoUser = await amplifyGetCurrentUser();
    const [attrs, session] = await Promise.all([
      fetchUserAttributes(),
      fetchAuthSession(),
    ]);
    const authUser = await buildAuthUser(cognitoUser, attrs, session);
    const normalizedRole = resolveRole(authUser.username, authUser.role);

    return {
      email: authUser.email,
      role: normalizedRole,
      user: { ...authUser, role: normalizedRole },
    };
  } catch {
    return null;
  }
}

export async function getAccessToken() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() || null;
  } catch {
    return null;
  }
}

export async function updateAttributes(attributes) {
  try {
    await amplifyUpdateUserAttributes({ userAttributes: attributes });
    return { status: 'success' };
  } catch (error) {
    throw mapCognitoError(error);
  }
}

export async function changePassword(oldPassword, newPassword) {
  try {
    await amplifyUpdatePassword({ oldPassword, newPassword });
    return { status: 'success' };
  } catch (error) {
    throw mapCognitoError(error);
  }
}

// Send email verification OTP for email update
export async function sendEmailVerification(newEmail) {
  try {
    const output = await amplifyUpdateUserAttributes({
      userAttributes: {
        email: newEmail,
      },
    });
    console.log('Update attributes output:', output);
    return { status: 'success', nextStep: output.nextStep };
  } catch (error) {
    throw mapCognitoError(error);
  }
}

// Verify email update with OTP
export async function verifyEmailUpdate(email, code) {
  try {
    const { confirmUserAttribute } = await import('aws-amplify/auth');
    await confirmUserAttribute({
      userAttributeKey: 'email',
      confirmationCode: code,
    });
    return { status: 'success' };
  } catch (error) {
    throw mapCognitoError(error);
  }
}

// ── Lambda admin API (giữ nguyên cho quản trị) ─────────────────

export async function getUsers() {
  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch users');
    }
    const data = await res.json();
    return (Array.isArray(data) ? data : []).map((item) => ({
      id: item.account_id || item.username,
      username: item.username,
      email: item.email,
      role: resolveRole(item.username, item.role),
      active: !isAccountDeactivated(item.username),
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function adminResetPassword(username, newPassword) {
  try {
    const res = await fetch(`${API_URL}reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account_id: username,
        username,
        role: 'admin',
        password: newPassword,
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      let errMsg = 'Admin reset password failed';
      try {
        const parsed = JSON.parse(errBody);
        errMsg = parsed.message || parsed.error || errMsg;
      } catch { /* ignore */ }
      throw new Error(errMsg);
    }
    return { status: 'success', data: await res.json().catch(() => ({})) };
  } catch (error) {
    console.error('Admin reset password exception:', error);
    throw error;
  }
}

export function deactivateAccount(username) {
  try {
    const stored = localStorage.getItem('deactivatedAccounts');
    const list = stored ? JSON.parse(stored) : [];
    if (!list.includes(username)) {
      list.push(username);
      localStorage.setItem('deactivatedAccounts', JSON.stringify(list));
    }
  } catch (e) {
    console.error('Failed to store deactivated account:', e);
  }
}

export function reactivateAccount(username) {
  try {
    const stored = localStorage.getItem('deactivatedAccounts');
    const list = stored ? JSON.parse(stored) : [];
    const index = list.indexOf(username);
    if (index !== -1) {
      list.splice(index, 1);
      localStorage.setItem('deactivatedAccounts', JSON.stringify(list));
    }
  } catch (e) {
    console.error('Failed to remove deactivated account:', e);
  }
}

export function isAccountDeactivated(username) {
  try {
    const stored = localStorage.getItem('deactivatedAccounts');
    const list = stored ? JSON.parse(stored) : [];
    return list.includes(username);
  } catch {
    return false;
  }
}

export async function deleteAccount(username) {
  try {
    const res = await fetch(`${API_URL}delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id: username }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Xóa tài khoản thất bại');
    }
    clearRoleOverride(username);
    return { status: 'success' };
  } catch (e) {
    console.error('deleteAccount error:', e);
    throw e;
  }
}

export async function updateUserRole({ account_id, username, role }) {
  try {
    const normalizedRole = (role || ROLES.USER).toLowerCase();
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id, username, role: normalizedRole }),
    });
    if (!res.ok) {
      const errorMessage = await parseErrorMessage(res, 'Cập nhật vai trò thất bại');
      const isReservedKeywordError =
        res.status >= 500 &&
        /reserved keyword|invalid updateexpression|attribute name is a reserved keyword/i.test(
          errorMessage
        );

      if (isReservedKeywordError) {
        setRoleOverride(username, normalizedRole);
        return {
          status: 'success',
          mode: 'local_fallback',
          message:
            'Backend đang lỗi cập nhật role, ứng dụng đã lưu role cục bộ trên trình duyệt này.',
        };
      }
      throw new Error(errorMessage || 'Cập nhật vai trò thất bại');
    }
    clearRoleOverride(username);
    return { status: 'success', mode: 'server' };
  } catch (e) {
    console.error('updateUserRole error:', e);
    throw e;
  }
}
