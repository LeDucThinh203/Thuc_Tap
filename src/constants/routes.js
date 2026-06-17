/**
 * ROUTES — Single source of truth for all application path strings.
 *
 * Usage:
 *   import { ROUTES } from 'constants/routes';
 *   navigate(ROUTES.ADMIN.DASHBOARD);
 */

// ── Public ─────────────────────────────────────────────────────
export const ROUTES = {
  ROOT:      '/',
  LOGIN:     '/login',
  REGISTER:  '/register',
  NOT_FOUND: '/404',

  // ── Admin routes (/admin/...) ─────────────────────────────
  ADMIN: {
    ROOT:         '/admin',
    DASHBOARD:    '/admin/dashboard',
    ANALYTICS:    '/admin/analytics',
    VEHICLES:     '/admin/vehicles',
    AI_ASSISTANT: '/admin/ai-assistant',
    SETTINGS:     '/admin/settings',
  },

  // ── User routes ────────────────────────────────
  USER: {
    ROOT:         '/',
    DASHBOARD:    '/',
    MY_VEHICLE:   '/app/my-vehicle',
    HISTORY:      '/app/history',
    PROFILE:      '/app/profile',
  },
};

/** Flat alias for backward compat (existing code uses ROUTES.DASHBOARD etc.) */
export const DASHBOARD    = ROUTES.ADMIN.DASHBOARD;
export const ANALYTICS    = ROUTES.ADMIN.ANALYTICS;
export const VEHICLES     = ROUTES.ADMIN.VEHICLES;
export const AI_ASSISTANT = ROUTES.ADMIN.AI_ASSISTANT;
export const SETTINGS     = ROUTES.ADMIN.SETTINGS;
export const LOGIN        = ROUTES.LOGIN;
