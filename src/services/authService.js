/**
 * authService.js — Custom auth operations using provided Lambda Function URL.
 */
import { ROLES } from 'constants/roles';

const API_URL = 'https://hmnbkhu2atupibr7objnnvk4qm0vuytd.lambda-url.ap-southeast-1.on.aws/';
const MOCK_SESSION_KEY = 'sp-mock-user';

/**
 * Sign in user using username and password.
 */
export async function signIn(username, password) {
  try {
    const res = await fetch(`${API_URL}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Tài khoản hoặc mật khẩu không đúng.');
    }
    
    const data = await res.json();
    const account = data.user;
    const userRole = account.role || ROLES.USER;
    
    const authUser = {
      username: account.username,
      signInDetails: { loginId: account.username },
      role: userRole,
      account_id: account.account_id,
      name: account.username,
    };

    // Lưu session cục bộ
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify({ user: authUser, role: userRole }));

    return {
      isSignedIn: true,
      user: authUser,
      groups: [userRole]
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Signs out the current user, clearing sessions.
 */
export async function signOut() {
  sessionStorage.removeItem(MOCK_SESSION_KEY);
}

/**
 * Returns current authenticated user email, normalized role, and user object.
 */
export async function getCurrentUser() {
  try {
    const saved = sessionStorage.getItem(MOCK_SESSION_KEY);
    if (saved) {
      const session = JSON.parse(saved);
      return {
        email: session.user.signInDetails.loginId,
        role: session.role,
        user: session.user
      };
    }
  } catch { /**/ }
  return null;
}

/**
 * Retrieves the current JWT access token string (used for authorization headers).
 */
export async function getAccessToken() {
  return 'mock-access-token';
}

/**
 * Register a new user account via API POST.
 */
export async function signUp(username, password, plate) {
  // Vì json mẫu có định dạng là admin, operator, user
  const account_id = username;
  const role = ROLES.USER; 

  const payload = {
    account_id,
    username,
    password,
    role
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
    }

    return {
      isSignUpComplete: true,
      nextStep: { signUpStep: 'DONE' }
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Confirm a registered user account via verification code (OTP).
 * Bỏ qua vì backend không hỗ trợ.
 */
export async function confirmSignUp(email, code) {
  return { isSignUpComplete: true };
}

/**
 * Resend Cognito verification code (OTP).
 */
export async function resendVerificationCode(email) {
  return { destination: email };
}

/**
 * Update current user attributes.
 */
export async function updateAttributes(attributes) {
  return { status: 'success' };
}

/**
 * Update current user's password.
 */
export async function changePassword(oldPassword, newPassword) {
  try {
    const sessionStr = sessionStorage.getItem(MOCK_SESSION_KEY);
    if (!sessionStr) throw new Error('Vui lòng đăng nhập lại.');
    
    const session = JSON.parse(sessionStr);
    const username = session.user.username;

    const res = await fetch(`${API_URL}change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        oldPassword,
        newPassword
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Đổi mật khẩu thất bại.');
    }

    return { status: 'success' };
  } catch (error) {
    throw error;
  }
}

