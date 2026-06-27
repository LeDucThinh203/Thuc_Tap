/**
 * UserLayout.jsx — Layout shell for user-facing pages.
 *
 * Responsive Layout:
 *   - Mobile/Tablet: Slim Mobile Header + Outlet content + Bottom Navigation Bar
 *   - Desktop/Laptop: Left Sidebar + Outlet content scrolling container
 */
import { Outlet } from 'react-router-dom';
import UserSidebar from 'components/layout/UserSidebar';
import UserMobileHeader from 'components/layout/UserMobileHeader';
import UserBottomNav from 'components/layout/UserBottomNav';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      
      {/* Desktop Left Sidebar (hidden on mobile) */}
      <UserSidebar />

      {/* Mobile Top Header (hidden on desktop) */}
      <UserMobileHeader />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-y-auto pb-16 md:pb-0">
        
        {/* Page content wrapper */}
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 max-w-5xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-800 text-[11px] text-center text-slate-400 dark:text-slate-500 select-none">
          © {new Date().getFullYear()} Smart Parking System
          <span className="mx-2 opacity-40">·</span>
          <a
            href="/admin/dashboard"
            className="text-primary-600 hover:underline font-semibold"
          >
            Admin Portal
          </a>
        </footer>
      </div>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <UserBottomNav />
    </div>
  );
}
