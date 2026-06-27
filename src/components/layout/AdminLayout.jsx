/**
 * AdminLayout.jsx — Main shell layout for all admin pages.
 *
 * Layout:
 *   ┌──────────────┬─────────────────────────────────┐
 *   │   Sidebar    │         Topbar                  │
 *   │   (fixed)    ├─────────────────────────────────┤
 *   │              │         Main content             │
 *   │              │         (scrollable)             │
 *   └──────────────┴─────────────────────────────────┘
 *
 * Responsive:
 *   - Desktop (lg+): sidebar always visible, collapsible
 *   - Mobile (<lg): sidebar hidden, hamburger → overlay drawer
 */
import { useState, useEffect } from 'react';
import { Outlet }   from 'react-router-dom';
import AdminSidebar from 'components/layout/AdminSidebar';
import AdminTopbar  from 'components/layout/AdminTopbar';

export default function AdminLayout() {
  // Desktop: sidebar collapsed state
  const [collapsed,   setCollapsed]   = useState(false);
  // Mobile: drawer open state
  const [mobileOpen,  setMobileOpen]  = useState(false);
  
  // Responsive check for desktop screens (>= 1024px)
  const [isDesktop,   setIsDesktop]   = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(min-width: 1024px)');
    const listener = (e) => {
      setIsDesktop(e.matches);
      if (e.matches) {
        setMobileOpen(false); // Close mobile drawer when returning to desktop screen size
      }
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Compute left offset for topbar & main content
  const sidebarW = isDesktop
    ? (collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)')
    : '0px';

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* ── Sidebar ────────────────────────────────────────── */}
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Right panel ────────────────────────────────────── */}
      <div
        className="flex flex-col min-h-screen transition-all duration-[var(--transition-base)]"
        style={{ marginLeft: `max(0px, ${sidebarW})` }}
      >
        {/* Topbar */}
        <AdminTopbar
          onMenuClick={() => setMobileOpen(true)}
          sidebarWidth={`max(0px, ${sidebarW})`}
        />

        {/* Page content */}
        <main
          className="flex-1 animate-fade-in"
          style={{ paddingTop: 'var(--topbar-height)' }}
        >
          {/* Nested route renders here */}
          <Outlet />
        </main>

        {/* Footer */}
        <footer
          className="
            px-6 py-3
            border-t border-surface-200 dark:border-surface-800
            text-xs text-center
          "
          style={{ color: 'var(--color-text-muted)' }}
        >
          © {new Date().getFullYear()} Smart Parking System — Powered by AWS
        </footer>
      </div>
    </div>
  );
}
