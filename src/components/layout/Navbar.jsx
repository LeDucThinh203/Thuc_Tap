/**
 * Navbar.jsx — Top navigation bar.
 * Shows page title, user info, and notification bell.
 */
import { Bell, User } from 'lucide-react';
import { useAuth } from 'hooks/useAuth';
import Badge from 'components/common/Badge';

export default function Navbar({ title = 'Dashboard' }) {
  const { user, role } = useAuth();

  return (
    <header
      className="
        fixed top-0 right-0 z-20
        h-[var(--navbar-height)]
        bg-white/80 dark:bg-surface-900/80
        backdrop-blur-md
        border-b border-slate-200 dark:border-surface-700
        flex items-center justify-between
        px-6 gap-4
        transition-all duration-300
      "
      style={{ left: 'var(--sidebar-width, 240px)' }}
    >
      {/* Page title */}
      <h1 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h1>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors">
          <Bell size={20} className="text-slate-500" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar + role */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-surface-700">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-800 dark:text-white leading-none">
              {user?.username ?? 'Người dùng'}
            </p>
            <Badge variant={role === 'admin' ? 'primary' : 'gray'} className="mt-0.5">
              {role}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
