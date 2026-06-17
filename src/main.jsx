/**
 * main.jsx — Application entry point.
 * Bootstraps AWS Amplify, wraps app with providers.
 *
 * Provider order (inside-out):
 *   ThemeProvider  → dark/light mode (reads localStorage, sets .dark on <html>)
 *   AuthProvider   → Cognito session state
 *   AppRouter      → React Router
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify }    from 'aws-amplify';

import { ThemeProvider } from 'context/ThemeContext';
import { AuthProvider }  from 'context/AuthContext';
import AppRouter         from 'routes/index';
import 'styles/index.css';

// ── Configure AWS Amplify v6 ─────────────────────────────────
const identityPoolId = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;
const isValidIdentityPool = identityPoolId && !identityPoolId.includes('xxxxxx');

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      ...(isValidIdentityPool ? { identityPoolId } : {}),
      loginWith: {
        email: true,
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
