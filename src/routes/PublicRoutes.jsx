/**
 * PublicRoutes.jsx — Routes accessible without authentication.
 * Redirects to /admin/dashboard if already logged in.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth }  from 'hooks/useAuth';
import { ROUTES }   from 'constants/routes';
import Spinner      from 'components/common/Spinner';

export default function PublicRoutes() {
  const { isAuthenticated, isLoading, role } = useAuth();

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

  const currentRole = role?.toLowerCase();

  return isAuthenticated
    ? (currentRole === 'admin' || currentRole === 'operator'
        ? <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
        : <Navigate to={ROUTES.ROOT} replace />)
    : <Outlet />;
}
