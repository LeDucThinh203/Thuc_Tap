/**
 * ProtectedRoutes.jsx — Auth + role guard for protected routes.
 *
 * Rules:
 *   - If not logged in → redirect to /login
 *   - If logged in but unauthorized:
 *     - Admin/operator accessing user-only route → redirect to /admin/dashboard
 *     - User accessing admin-only route → redirect to /
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth }  from 'hooks/useAuth';
import { ROUTES }   from 'constants/routes';
import Spinner      from 'components/common/Spinner';

export default function ProtectedRoutes({ allowedRoles = null }) {
  const { isAuthenticated, isLoading, role } = useAuth();

  // Show loader while session is bootstrapping
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  // 1. Nếu chưa login → redirect /login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const currentRole = role?.toLowerCase();

  // 2. Nếu đã login nhưng sai role → redirect về trang phù hợp
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    if (currentRole === 'admin' || currentRole === 'operator') {
      // Admin/operator vào / → redirect /admin/dashboard
      return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
    } else {
      // User vào /admin/* → redirect /
      return <Navigate to={ROUTES.ROOT} replace />;
    }
  }

  // Render sub-routes
  return <Outlet />;
}
