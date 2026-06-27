/**
 * AdminTopbar.jsx — Top navigation bar for AdminLayout.
 *
 * Features:
 *  - Hamburger menu button (mobile only)
 *  - Breadcrumb / page title
 *  - Search shortcut
 *  - Notification bell with badge
 *  - Dark/light mode toggle
 *  - User avatar dropdown
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, Bell, Sun, Moon, Search, ChevronDown,
  User, LogOut, Settings,
} from 'lucide-react';
import { useAuth }  from 'hooks/useAuth';
import { useTheme } from 'context/ThemeContext';
import { ROUTES }   from 'constants/routes';
import { searchByPlate } from 'services/vehicleService';

// Map path → page title
const PAGE_TITLES = {
  [ROUTES.ADMIN.DASHBOARD]:    'Dashboard',
  [ROUTES.ADMIN.ANALYTICS]:    'Analytics',
  [ROUTES.ADMIN.VEHICLES]:     'Phương tiện',
  [ROUTES.ADMIN.AI_ASSISTANT]: 'AI Assistant',
  [ROUTES.ADMIN.SETTINGS]:     'Cài đặt',
};

// ── Theme toggle button ────────────────────────────────────────
function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Chuyển sang Light mode' : 'Chuyển sang Dark mode'}
      className="
        relative flex items-center justify-center w-9 h-9 rounded-lg
        transition-all duration-200
        hover:bg-slate-100 dark:hover:bg-surface-700
        text-slate-500 dark:text-slate-400
        hover:text-slate-700 dark:hover:text-slate-200
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

// ── Notification bell ──────────────────────────────────────────
function NotificationBell({ count = 3 }) {
  return (
    <button
      aria-label={`${count} thông báo mới`}
      className="
        relative flex items-center justify-center w-9 h-9 rounded-lg
        transition-colors duration-200
        hover:bg-slate-100 dark:hover:bg-surface-700
        text-slate-500 dark:text-slate-400
        hover:text-slate-700 dark:hover:text-slate-200
      "
    >
      <Bell size={18} />
      {count > 0 && (
        <span className="
          absolute top-1.5 right-1.5 w-4 h-4
          flex items-center justify-center
          text-2xs font-bold text-white
          bg-red-500 rounded-full
          ring-2 ring-white dark:ring-surface-800
        ">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

// ── User dropdown ──────────────────────────────────────────────
function UserMenu({ user, role, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = user?.signInDetails?.loginId?.split('@')[0]
    ?? user?.username
    ?? 'Admin';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg
          hover:bg-slate-100 dark:hover:bg-surface-700
          transition-colors duration-200
          text-slate-700 dark:text-slate-200
        "
        aria-expanded={open}
        aria-haspopup="true"
        id="user-menu-btn"
      >
        {/* Avatar */}
        <div className="
          w-7 h-7 rounded-full bg-primary-600
          flex items-center justify-center
          text-white text-xs font-bold shrink-0
        ">
          {initial}
        </div>

        {/* Name (hidden on small screens) */}
        <span className="hidden sm:block text-sm font-medium">{displayName}</span>

        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="
            absolute right-0 top-full mt-2 w-52 z-50
            bg-white dark:bg-surface-800
            border border-surface-200 dark:border-surface-700
            rounded-xl shadow-panel
            py-1.5 animate-fade-in
          "
          role="menu"
          aria-labelledby="user-menu-btn"
        >
          {/* User info header */}
          <div className="px-4 py-2.5 border-b border-surface-200 dark:border-surface-700">
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{displayName}</p>
            <p className="text-xs text-slate-400 capitalize">{role}</p>
          </div>

          <div className="py-1">
            <DropdownItem icon={User} label="Hồ sơ cá nhân" onClick={() => setOpen(false)} />
            <DropdownItem icon={Settings} label="Cài đặt" onClick={() => setOpen(false)} />
          </div>

          <div className="border-t border-surface-200 dark:border-surface-700 py-1">
            <DropdownItem
              icon={LogOut}
              label="Đăng xuất"
              danger
              onClick={() => { setOpen(false); onLogout(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownItem({ icon: Icon, label, danger = false, onClick }) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className={`
        w-full flex items-center gap-3 px-4 py-2 text-sm
        transition-colors duration-150
        ${danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-700'
        }
      `}
    >
      <Icon size={15} className="shrink-0" />
      {label}
    </button>
  );
}

// ── Global Search ──────────────────────────────────────────────
function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Cache to store the full vehicle history locally
  const fullDataRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        wrapperRef.current?.querySelector('input')?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time search with local filtering
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        let items = fullDataRef.current;
        
        // Fetch all history data once if we haven't yet
        if (!items) {
          const { getVehicleHistory } = await import('services/vehicleService');
          const data = await getVehicleHistory();
          items = Array.isArray(data) ? data : (data.items || []);
          fullDataRef.current = items;
        }

        const searchStr = query.toUpperCase().replace(/\s/g, '').replace(/[-.]/g, '');
        
        // Filter locally
        const filtered = items.filter(r => {
          const plateStr = (r.display_plate_number || r.plate_number || r.plate || '').toUpperCase().replace(/\s/g, '').replace(/[-.]/g, '');
          return plateStr.includes(searchStr);
        });

        // Map the data to match our UI rendering
        const formattedResults = filtered.map(v => ({
          id: v.event_id || v.id || Math.random().toString(),
          plate: v.display_plate_number || v.plate_number || v.plate || 'N/A',
          zone: v.camera_id || v.zone || 'N/A', // fallback zone if any
          status: v.direction === 'IN' ? 'Đang đỗ' : (v.direction === 'OUT' ? 'Đã ra' : (v.status || 'N/A')),
          rawStatus: v.direction
        }));

        // Remove duplicate plates so we don't show the same car 10 times in search results
        const uniquePlates = [];
        const uniqueResults = [];
        for (const item of formattedResults) {
          if (!uniquePlates.includes(item.plate)) {
            uniquePlates.push(item.plate);
            uniqueResults.push(item);
          }
        }

        setResults(uniqueResults);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200); // 200ms debounce is snappy enough for local filter

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative hidden md:block mr-2" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search size={14} className="absolute left-3 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm biển số..."
          className="
            pl-8 pr-10 py-1.5 rounded-lg text-sm w-48 lg:w-64
            bg-slate-100 dark:bg-surface-800
            border border-surface-200 dark:border-surface-700
            focus:outline-none focus:border-primary-400 dark:focus:border-primary-600
            focus:ring-2 focus:ring-primary-400/20 dark:focus:ring-primary-600/20
            transition-all duration-200
            text-slate-700 dark:text-slate-200
          "
        />
        {!query && (
          <kbd className="absolute right-2 px-1.5 py-0.5 text-2xs bg-white dark:bg-surface-700 rounded border border-surface-200 dark:border-surface-600 font-mono text-slate-400">
            ⌘K
          </kbd>
        )}
      </div>

      {isOpen && query.trim() !== '' && (
        <div className="
          absolute top-full right-0 mt-2 w-[320px] z-50
          bg-white dark:bg-surface-800
          border border-surface-200 dark:border-surface-700
          rounded-xl shadow-panel py-2 max-h-96 overflow-y-auto animate-fade-in
        ">
          {loading ? (
            <div className="px-4 py-4 text-sm text-slate-500 flex items-center justify-center gap-2">
               <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
               Đang tìm kiếm...
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col">
              <div className="px-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kết quả ({results.length})</div>
              {results.slice(0, 5).map(v => (
                <button
                  key={v.id}
                  className="flex flex-col px-4 py-2 hover:bg-slate-50 dark:hover:bg-surface-700 text-left transition-colors w-full border-b border-surface-50 dark:border-surface-700 last:border-0"
                >
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{v.plate}</span>
                  <span className="text-xs text-slate-500 mt-0.5">Vị trí: {v.zone} • <span className={v.rawStatus === 'IN' || v.status === 'Đang đỗ' ? 'text-emerald-500' : 'text-slate-400'}>{v.status}</span></span>
                </button>
              ))}
              {results.length > 5 && (
                <div className="px-4 pt-2 text-center border-t border-surface-50 dark:border-surface-700 mt-1">
                   <span className="text-xs text-primary-500 hover:underline cursor-pointer font-medium">Xem thêm {results.length - 5} kết quả</span>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-4 text-sm text-slate-500 text-center">Không tìm thấy biển số phù hợp.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main AdminTopbar ───────────────────────────────────────────
export default function AdminTopbar({ onMenuClick, sidebarWidth }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Admin';

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header
      id="admin-topbar"
      className="
        fixed top-0 right-0 z-20
        flex items-center gap-3 px-4 sm:px-6
        bg-white/90 dark:bg-surface-900/90 backdrop-blur-md
        border-b border-surface-200 dark:border-surface-800
        transition-all duration-[var(--transition-base)]
      "
      style={{
        left: sidebarWidth,
        height: 'var(--topbar-height)',
        boxShadow: '0 1px 0 0 rgba(0,0,0,0.06)',
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        aria-label="Mở menu"
        className="
          lg:hidden flex items-center justify-center
          w-9 h-9 rounded-lg
          text-slate-500 hover:text-slate-700
          dark:text-slate-400 dark:hover:text-slate-200
          hover:bg-slate-100 dark:hover:bg-surface-700
          transition-colors duration-150
        "
      >
        <Menu size={20} />
      </button>

      {/* Page title (desktop) / Logo text (mobile) */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-800 dark:text-white truncate">
          {pageTitle}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        {/* Realtime Search Component */}
        <GlobalSearch />

        <ThemeToggle />
        <NotificationBell count={3} />

        {/* Divider */}
        <div className="w-px h-6 bg-surface-200 dark:bg-surface-700 mx-1" />

        <UserMenu user={user} role={role} onLogout={handleLogout} />
      </div>
    </header>
  );
}
