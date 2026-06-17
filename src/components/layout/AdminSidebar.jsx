/**
 * AdminSidebar.jsx — Fixed left sidebar for admin pages.
 *
 * Features:
 *  - Collapsible (icon-only) on desktop via toggle button
 *  - Mobile: slides in as overlay drawer
 *  - Active route highlighting
 *  - Role-based nav items
 *  - Dark/light aware via CSS variables
 */
import { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BarChart2, Car, Bot, Settings, ParkingSquare, LogOut, ChevronLeft, X, Users,
} from 'lucide-react';
import { useAuth }  from 'hooks/useAuth';
import { ROLES }    from 'constants/roles';
import { ROUTES }   from 'constants/routes';

// ── Navigation config ──────────────────────────────────────────
const BASE_NAV = [
  { to: ROUTES.ADMIN.DASHBOARD,    icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.ADMIN.ANALYTICS,    icon: BarChart2,        label: 'Analytics' },
  { to: ROUTES.ADMIN.VEHICLES,     icon: Car,              label: 'Phương tiện' },
  { to: ROUTES.ADMIN.AI_ASSISTANT, icon: Bot,              label: 'AI Assistant' },
];

const ADMIN_NAV = [
  { to: ROUTES.ADMIN.SETTINGS, icon: Settings, label: 'Cài đặt' },
];

// ── NavItem component ──────────────────────────────────────────
function SidebarNavItem({ to, icon: Icon, label, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
      }
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && (
        <span className="truncate transition-opacity duration-200">{label}</span>
      )}
    </NavLink>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, role, logout } = useAuth();
  console.log('🔧 AdminSidebar role:', role);
  const navigate = useNavigate();

  // Normalize role for comparison (case‑insensitive)
  const normalizedRole = typeof role === 'string' ? role.toLowerCase() : '';
  const isAdmin = normalizedRole === ROLES.ADMIN;

  // Build navigation items: base + conditional role link for admin
  const navItems = [...BASE_NAV];
  if (isAdmin) {
    // Insert Role link right after AI Assistant (index 4)
    navItems.splice(4, 0, { to: ROUTES.ADMIN.ROLES, icon: Users, label: 'Quản lý vai trò' });
  }

  const handleLogout = useCallback(async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [logout, navigate]);

  const userInitial = (user?.username ?? user?.signInDetails?.loginId ?? 'A')
    .charAt(0).toUpperCase();

  // Shared sidebar body (reused for both mobile and desktop)
  // DEBUG: show current role
  const SidebarBody = ({ onClose }) => (
    <div className="flex flex-col h-full">
      <p style={{ color: 'var(--color-text-primary)', marginLeft: '16px' }}>Role: {role}</p>

      {/* ── Logo ─────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 border-b shrink-0"
        style={{
          height: 'var(--topbar-height)',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shrink-0 shadow-glow">
          <ParkingSquare size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight tracking-tight">
              SmartParking
            </p>
            <p className="text-xs" style={{ color: 'var(--color-sidebar-text)' }}>
              Admin Portal
            </p>
          </div>
        )}

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors lg:hidden"
            aria-label="Đóng menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">

        {/* Section label */}
        {!collapsed && (
          <p className="px-3 mb-2 text-2xs font-semibold uppercase tracking-widest"
             style={{ color: 'rgba(148,163,184,0.6)' }}>
            Quản lý
          </p>
        )}

        {navItems.map(({ to, icon: Icon, label }) => (
          <SidebarNavItem
            key={to}
            to={to}
            icon={Icon}
            label={label}
            collapsed={collapsed}
            onClick={onClose}
          />
        ))}

        {/* Admin-only section */}
        {role === ROLES.ADMIN && (
          <>
            <div className="pt-4 pb-2">
              <div className="divider" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
              {!collapsed && (
                <p className="px-3 mt-3 mb-2 text-2xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.6)' }}>
                  Hệ thống
                </p>
              )}
            </div>
            {ADMIN_NAV.map((item) => (
              <SidebarNavItem
                key={item.to}
                {...item}
                collapsed={collapsed}
                onClick={onClose}
              />
            ))}
          </>
        )}
      </nav>

      {/* ── User info + Logout ────────────────────────────── */}
      <div
        className="shrink-0 px-2 py-3 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {/* User profile row */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg"
               style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.signInDetails?.loginId?.split('@')[0] ?? user?.username ?? 'Admin'}
              </p>
              <p className="text-2xs capitalize" style={{ color: 'var(--color-sidebar-text)' }}>
                {role}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Đăng xuất' : undefined}
          className={`
            nav-item w-full text-red-400 hover:text-red-300
            hover:!bg-red-500/10
            ${collapsed ? 'justify-center px-0' : ''}
          `}
        >
          <LogOut size={17} className="shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside
        className="
          hidden lg:flex flex-col fixed top-0 left-0 h-full z-30
          sidebar-transition overflow-hidden
        "
        style={{
          width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          backgroundColor: 'var(--color-sidebar-bg)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        }}
      >
        <SidebarBody />
      </aside>

      {/* Collapse toggle button — floats outside sidebar */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        className="
          hidden lg:flex fixed z-40 items-center justify-center
          w-6 h-6 rounded-full bg-white dark:bg-surface-800
          border border-surface-200 dark:border-surface-700
          shadow-sm hover:shadow-md transition-all duration-200
          text-slate-500 hover:text-slate-700 dark:hover:text-slate-300
        "
        style={{
          top: '36px',
          left: collapsed
            ? 'calc(var(--sidebar-collapsed) - 12px)'
            : 'calc(var(--sidebar-width) - 12px)',
          transition: 'left var(--transition-base)',
        }}
      >
        <ChevronLeft
          size={13}
          strokeWidth={2.5}
          className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Mobile overlay + drawer ──────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="mobile-overlay animate-fade-in"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside
            className="
              fixed top-0 left-0 h-full z-50 flex flex-col
              lg:hidden animate-slide-left
            "
            style={{
              width: 'var(--sidebar-width)',
              backgroundColor: 'var(--color-sidebar-bg)',
              boxShadow: '8px 0 32px rgba(0,0,0,0.25)',
            }}
          >
            <SidebarBody onClose={onMobileClose} />
          </aside>
        </>
      )}
    </>
  );
}
