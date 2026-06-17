/**
 * useAuth.js — Custom hook to consume AuthContext.
 * Throws if used outside of <AuthProvider>.
 *
 * Usage:
 *   const { user, role, isAuthenticated, login, logout } = useAuth();
 */
import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return ctx;
}
