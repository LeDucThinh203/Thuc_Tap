/**
 * PageWrapper.jsx — Main layout shell for protected pages.
 * Contains Sidebar + Navbar + main content area.
 * Handles sidebar collapse state.
 */
import { useState } from 'react';
import Sidebar from 'components/layout/Sidebar';
import Navbar  from 'components/layout/Navbar';
import Footer  from 'components/layout/Footer';

export default function PageWrapper({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarW = collapsed ? '4rem' : 'var(--sidebar-width)';

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarW }}
      >
        {/* Navbar */}
        <Navbar title={title} />

        {/* Page content */}
        <main
          className="flex-1 pt-[var(--navbar-height)] animate-fade-in"
        >
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
