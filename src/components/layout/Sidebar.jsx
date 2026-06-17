/**
 * Sidebar.jsx — Collapsible navigation sidebar.
 * Highlights the active route. Shows admin-only items based on role.
 */
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Car, Bot, Settings, ParkingSquare, LogOut, ChevronLeft,
} from 'lucide-react';
import { useAuth }  from 'hooks/useAuth';
import { ROUTES }   from 'constants/routes';
import { ROLES }    from 'constants/roles';

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD,    icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.ANALYTICS,    icon: BarChart3,       label: 'Analytics' },
  { to: ROUTES.VEHICLES,     icon: Car,             label: 'Phương tiện' },
  { to: ROUTES.AI_ASSISTANT, icon: Bot,             label: 'AI Assistant' },
];

const ADMIN_ITEMS = [
  { to: ROUTES.SETTINGS, icon: Settings, label: 'Cài đặt' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { role, logout } = useAuth();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-30
        bg-surface-900 border-r border-surface-700
        flex flex-col transition-all duration-300
        ${collapsed ? 'w-16' : 'w-[var(--sidebar-width)]'}
      `}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-surface-700 h-[var(--navbar-height)]">
        <ParkingSquare className="text-primary-400 shrink-0" size={26} />
        {!collapsed && (
          <span className="text-white font-bold text-sm leading-tight animate-fade-in">
            Smart<br />Parking
          </span>
        )}
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item--active' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate animate-fade-in">{label}</span>}
          </NavLink>
        ))}

        {/* Admin-only section */}
        {role === ROLES.ADMIN && (
          <>
            <div className="pt-4 pb-1 px-3">
              {!collapsed && (
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Admin
                </p>
              )}
            </div>
            {ADMIN_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item--active' : ''}`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate animate-fade-in">{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* ── Footer: Collapse toggle + Logout ── */}
      <div className="px-2 py-3 border-t border-surface-700 space-y-1">
        <button
          onClick={() => logout()}
          className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
          title={collapsed ? 'Đăng xuất' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="animate-fade-in">Đăng xuất</span>}
        </button>

        <button
          onClick={onToggle}
          className="nav-item w-full justify-center"
          title={collapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </aside>
  );
}
