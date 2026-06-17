/**
 * UserBottomNav.jsx — Mobile bottom navigation bar.
 * Sticky at the bottom, thumb-friendly.
 */
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, MessageSquare, ClipboardList } from 'lucide-react';
import { ROUTES } from 'constants/routes';

const BOTTOM_NAV_ITEMS = [
  { to: ROUTES.USER.DASHBOARD,  icon: LayoutDashboard, label: 'Tổng quan' },
  { to: ROUTES.USER.MY_VEHICLE, icon: Car,             label: 'Xe của tôi' },
  { to: '/ai-assistant',        icon: MessageSquare,   label: 'Trợ lý AI' },
  { to: ROUTES.USER.HISTORY,    icon: ClipboardList,   label: 'Lịch sử' },
];

export default function UserBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] md:hidden">
      <div className="flex items-center justify-around h-16 px-2 pb-safe">
        {BOTTOM_NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-semibold transition-all duration-200 active:scale-95
              ${isActive 
                ? 'text-[#2563EB] dark:text-[#60A5FA]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <Icon size={20} className="transition-transform duration-200" />
                </div>
                <span className="text-[10px] tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
