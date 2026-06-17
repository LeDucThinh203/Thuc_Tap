/**
 * NotFoundPage.jsx — 404 error page.
 */
import { Link } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface-950 text-white">
      <h1 className="text-8xl font-black text-primary-500">404</h1>
      <p className="text-2xl font-semibold">Trang không tồn tại</p>
      <p className="text-slate-400 text-sm">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <Link
        to={ROUTES.DASHBOARD}
        className="mt-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 rounded-xl text-sm font-medium transition-colors"
      >
        Về Dashboard
      </Link>
    </div>
  );
}
