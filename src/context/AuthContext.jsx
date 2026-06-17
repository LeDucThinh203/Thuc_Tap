/**
 * AuthContext.jsx — Global authentication state provider.
 * Persists session on reload using getCurrentUser on mount.
 *
 * Provides: { user, role, isAuthenticated, isLoading, login, logout }
 */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { 
  signIn as authSignIn, 
  signOut as authSignOut, 
  getCurrentUser, 
  signUp as authSignUp, 
  confirmSignUp as authConfirmSignUp,
  resendVerificationCode,
  updateAttributes,
  changePassword as authChangePassword
} from 'services/authService';
import { ROLES } from 'constants/roles';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [role,      setRole]      = useState(ROLES.USER);
  const [isLoading, setIsLoading] = useState(true);

  // ── Bootstrap: check existing session on mount ──
  useEffect(() => {
    (async () => {
      try {
        const session = await getCurrentUser();
        if (session) {
          setUser(session.user);
          setRole(session.role);
        }
      } catch (err) {
        console.warn('Failed to restore authentication session:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /**
   * Log in user and populate auth state.
   */
  const login = useCallback(async (email, password) => {
    const result = await authSignIn(email, password);
    if (result.isSignedIn) {
      const session = await getCurrentUser();
      if (session) {
        setUser(session.user);
        setRole(session.role);
        return { ...result, role: session.role };
      }
    }
    return result;
  }, []);

  /**
   * Register a new user with email, password, and custom plate.
   */
  const register = useCallback(async (email, password, plate) => {
    return await authSignUp(email, password, plate);
  }, []);

  /**
   * Confirm sign up via OTP verification.
   */
  const confirmRegister = useCallback(async (email, code) => {
    return await authConfirmSignUp(email, code);
  }, []);

  /**
   * Sign out and clear auth state.
   */
  const logout = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setRole(ROLES.USER);
  }, []);

  /**
   * Resend signup verification OTP.
   */
  const resendCode = useCallback(async (email) => {
    return await resendVerificationCode(email);
  }, []);

  /**
   * Update current user profile attributes.
   */
  const updateProfile = useCallback(async (attributes) => {
    const result = await updateAttributes(attributes);
    const session = await getCurrentUser();
    if (session) {
      setUser(session.user);
    }
    return result;
  }, []);

  /**
   * Change current user password.
   */
  const changeUserPassword = useCallback(async (oldPassword, newPassword) => {
    return await authChangePassword(oldPassword, newPassword);
  }, []);

  const value = useMemo(() => ({
    user,
    role,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    confirmRegister,
    resendCode,
    updateProfile,
    changePassword: changeUserPassword,
    logout,
  }), [user, role, isLoading, login, register, confirmRegister, resendCode, updateProfile, changeUserPassword, logout]);


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
