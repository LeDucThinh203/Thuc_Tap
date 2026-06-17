/**
 * routes/index.jsx — Root router with nested layout routing.
 *
 * Architecture:
 *   /login              → PublicRoutes → LoginPage
 *   /admin/*            → ProtectedRoutes → AdminLayout → [page]
 *   /app/*              → ProtectedRoutes → UserLayout  → [page]
 *   /                   → redirect to /admin/dashboard
 *   *                   → NotFoundPage
 *
 * All pages are lazy-loaded for optimal code splitting.
 */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import { ROUTES }         from 'constants/routes';
import ProtectedRoutes    from 'routes/ProtectedRoutes';
import PublicRoutes       from 'routes/PublicRoutes';
import AdminLayout        from 'components/layout/AdminLayout';
import UserLayout         from 'components/layout/UserLayout';
import Spinner            from 'components/common/Spinner';
import { useAuth }        from 'hooks/useAuth';

// ── Lazy page imports ──────────────────────────────────────────
// Auth
const LoginPage     = lazy(() => import('features/auth/LoginPage'));
const RegisterPage  = lazy(() => import('features/auth/RegisterPage'));
const NotFoundPage  = lazy(() => import('features/auth/NotFoundPage'));

// Admin pages
const AdminDashboard = lazy(() => import('features/dashboard/DashboardPage'));
const AdminAnalytics = lazy(() => import('features/analytics/AnalyticsPage'));
const AdminVehicles  = lazy(() => import('features/vehicles/VehiclesPage'));
const AdminAIChat    = lazy(() => import('features/ai-assistant/AIChatPage'));
const AdminSettings  = lazy(() => import('features/settings/SettingsPage'));

// User pages
const UserDashboard  = lazy(() => import('features/dashboard/UserDashboardPage'));
const UserMyVehicle  = lazy(() => import('features/vehicles/VehiclesPage'));
const UserHistory    = lazy(() => import('features/vehicles/VehiclesPage'));
const UserProfile    = lazy(() => import('features/profile/UserProfilePage'));

// ── Loading fallback ───────────────────────────────────────────
const PageLoader = () => (
  <div
    className="flex items-center justify-center"
    style={{ minHeight: 'calc(100vh - var(--topbar-height))' }}
  >
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Đang tải...</p>
    </div>
  </div>
);

// Helper: wrap lazy page in Suspense
const page = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// ── Router config ──────────────────────────────────────────────
const router = createBrowserRouter([

  // ── Public routes (no auth needed) ──────────────────────────
  {
    element: <PublicRoutes />,
    children: [
      { path: ROUTES.LOGIN, element: page(LoginPage) },
      { path: ROUTES.REGISTER, element: page(RegisterPage) },
    ],
  },

  // ── Admin routes ─────────────────────────────────────────────
  {
    element: <ProtectedRoutes allowedRoles={['admin', 'operator']} />,   // protect with admin/operator roles
    children: [
      {
        element: <AdminLayout />,   // layout wrapper
        children: [
          { path: ROUTES.ADMIN.DASHBOARD,    element: page(AdminDashboard) },
          { path: ROUTES.ADMIN.ANALYTICS,    element: page(AdminAnalytics) },
          { path: ROUTES.ADMIN.VEHICLES,     element: page(AdminVehicles)  },
          { path: ROUTES.ADMIN.AI_ASSISTANT, element: page(AdminAIChat)    },
          { path: ROUTES.ADMIN.SETTINGS,     element: page(AdminSettings)  },
          // Default /admin → dashboard
          { path: ROUTES.ADMIN.ROOT, element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace /> },
        ],
      },
    ],
  },

  // ── User routes ───────────────────────────────────────────────
  {
    element: <ProtectedRoutes allowedRoles={['user']} />,   // protect with user role only
    children: [
      {
        element: <UserLayout />,
        children: [
          { path: '/',                    element: page(UserDashboard) },
          { path: '/ai-assistant',        element: page(AdminAIChat)   }, // User AI Chat assistant
          { path: ROUTES.USER.MY_VEHICLE, element: page(UserMyVehicle) },
          { path: ROUTES.USER.HISTORY,    element: page(UserHistory)   },
          { path: ROUTES.USER.PROFILE,    element: page(UserProfile)   },
        ],
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────
  { path: ROUTES.NOT_FOUND, element: page(NotFoundPage) },
  { path: '*',              element: page(NotFoundPage) },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
