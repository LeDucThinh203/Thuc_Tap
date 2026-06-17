/**
 * UserMobileHeader.jsx — Slim top navbar for Mobile/Tablet in UserLayout.
 * Contains Logo, Theme Toggle, and User profile dropdown menu.
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ParkingSquare, Sun, Moon, LogOut, ChevronDown, User
} from 'lucide-react';
import { useAuth } from 'hooks/useAuth';
import { useTheme } from 'context/ThemeContext';
import { ROUTES } from 'constants/routes';

function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Chuyển Light mode' : 'Chuyển Dark mode'}
      className="
        relative flex items-center justify-center w-9 h-9 rounded-lg
        text-slate-500 dark:text-slate-400
        hover:bg-slate-100 dark:hover:bg-slate-800
        transition-colors duration-150
      "
    >
      <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <Sun size={18} />
      </span>
      <span className={`absolute transition-all duration-300 ${isDark ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
        <Moon size={18} />
      </span>
    </button>
  );
}

function UserMenu({ user, role, onLogout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const displayName = user?.signInDetails?.loginId?.split('@')[0] ?? user?.username ?? 'Bạn';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-1.5 px-2 py-1 rounded-lg
          hover:bg-slate-100 dark:hover:bg-slate-800
          transition-colors duration-150
        "
        aria-expanded={open}
      >
        <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {initial}
        </div>
        <ChevronDown size={12} className="text-slate-400" />
      </button>

      {open && (
        <div className="
          absolute right-0 top-full mt-2 w-48 z-40
          bg-white dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          rounded-xl shadow-lg py-1.5 animate-fade-in
        ">
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{displayName}</p>
            <p className="text-2xs text-slate-400 capitalize">{role}</p>
          </div>
          <button
            onClick={() => { setOpen(false); navigate(ROUTES.USER.PROFILE); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <User size={14} /> Hồ sơ & Cài đặt
          </button>
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-t border-slate-100 dark:border-slate-700/50 transition-colors"
          >
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}

export default function UserMobileHeader() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 w-full h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shadow-sm md:hidden select-none">
      {/* Left Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7.5 h-7.5 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow">
          <ParkingSquare size={15} className="text-white" />
        </div>
        <span className="font-extrabold text-sm text-slate-800 dark:text-white tracking-tight">
          SmartParking
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <UserMenu user={user} role={role} onLogout={handleLogout} />
      </div>
    </header>
  );
}
