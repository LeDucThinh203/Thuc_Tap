/**
 * UserSidebar.jsx — Desktop left sidebar for UserLayout.
 * Visible on desktop screen sizes (>= md breakpoint).
 */
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Car, MessageSquare, ClipboardList,
  ParkingSquare, LogOut, Sun, Moon, Settings
} from 'lucide-react';
import { useAuth } from 'hooks/useAuth';
import { useTheme } from 'context/ThemeContext';
import { ROUTES } from 'constants/routes';

const SIDEBAR_NAV_ITEMS = [
  { to: ROUTES.USER.DASHBOARD,  icon: LayoutDashboard, label: 'Tổng quan' },
  { to: ROUTES.USER.MY_VEHICLE, icon: Car,             label: 'Xe của tôi' },
  { to: '/ai-assistant',        icon: MessageSquare,   label: 'Trợ lý AI' },
  { to: ROUTES.USER.HISTORY,    icon: ClipboardList,   label: 'Lịch sử' },
];

export default function UserSidebar() {
  const { user, role, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const displayName = user?.signInDetails?.loginId?.split('@')[0] ?? user?.username ?? 'Bạn';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">
      
      {/* ── Logo ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow">
          <ParkingSquare size={16} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-slate-800 dark:text-white leading-none">SmartParking</p>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold tracking-wider uppercase">User Portal</p>
        </div>
      </div>

      {/* ── Navigation Links ────────────────────────────── */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
        {SIDEBAR_NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200
              ${isActive 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] dark:text-[#60A5FA]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
              }
            `}
          >
            <Icon size={18} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Footer / Theme & Profile ─────────────────────── */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-200"
        >
          <span className="flex items-center gap-3">
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
            <span>{isDark ? 'Giao diện tối' : 'Giao diện sáng'}</span>
          </span>
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold capitalize">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* Profile / Logout card */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
          <div 
            onClick={() => navigate(ROUTES.USER.PROFILE)}
            className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer group"
          >
            <div className="w-8.5 h-8.5 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0 group-hover:scale-105 transition-transform duration-200">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate leading-tight group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 capitalize truncate mt-0.5">
                {role}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => navigate(ROUTES.USER.PROFILE)}
              title="Cài đặt tài khoản"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Settings size={15} />
            </button>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

    </aside>
  );
}
