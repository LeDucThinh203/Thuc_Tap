/**
 * apiClient.js — Axios singleton with:
 *   - Base URL from env
 *   - Request interceptor: attach Cognito JWT Bearer token
 *   - Response interceptor: handle 401 (token refresh / redirect to login)
 */
import axios from 'axios';
import { API_BASE_URL } from 'constants/api';
import { getAccessToken, signOut } from 'services/authService';

console.log('🔧 apiClient.js: API_BASE_URL =', API_BASE_URL);

const apiClient = axios.create({
  baseURL:         API_BASE_URL,
  timeout:         15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach JWT ──────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    console.log('🔧 apiClient request:', config.method.toUpperCase(), config.url, '→ Full URL:', config.baseURL + config.url);
    try {
      const token = await getAccessToken();
      if (token && token !== 'mock-access-token') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // No active session — proceed without token (public endpoints)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle auth errors ─────────────────
apiClient.interceptors.response.use(
  (response) => {
    console.log('🔧 apiClient response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('🔧 apiClient error:', error.config?.url, error.message);
    const status = error.response?.status;

    if (status === 401) {
      // Token expired — sign out and redirect to login
      await signOut();
      window.location.href = '/login';
    }

    // Normalize error shape for easier consumption in services
    const message =
      error.response?.data?.message ??
      error.response?.data?.error   ??
      error.message                 ??
      'Đã xảy ra lỗi không xác định.';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
