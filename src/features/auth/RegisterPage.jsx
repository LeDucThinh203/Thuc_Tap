/**
 * RegisterPage.jsx — Split layout sign-up page.
 * Includes User Account details (Username, Password).
 */
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ParkingSquare, Sun, Moon, Eye, EyeOff, Car, Shield, Activity } from 'lucide-react';
import { useAuth }  from 'hooks/useAuth';
import { useTheme } from 'context/ThemeContext';
import { ROUTES }   from 'constants/routes';
import { validatePassword } from 'utils/validators';

const FEATURES = [
  { icon: Car,      text: 'Đăng ký tài khoản nhanh chóng' },
  { icon: Activity, text: 'Theo dõi hành trình và lịch sử gửi xe tức thì' },
  { icon: Shield,   text: 'Hệ thống quản lý thông minh và an toàn' },
];

export default function RegisterPage() {
  const { register, login } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const location = useLocation();
  const initialState = location.state || {};

  // Input states
  const [username, setUsername] = useState(initialState.username || '');
  const [password, setPassword] = useState('');

  const [showPwd,   setShowPwd]   = useState(false);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [authError, setAuthError] = useState('');
  const [success,   setSuccess]   = useState('');

  // Validate Register
  const validateReg = () => {
    const errs = {};
    if (!username) errs.username = 'Vui lòng nhập tên đăng nhập';
    const pErr = validatePassword(password);
    if (pErr) errs.password = pErr;
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  // Submit Sign Up
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateReg()) return;
    
    setLoading(true);
    setAuthError('');
    setSuccess('');
    
    try {
      await register(username, password);
      setSuccess('Tạo tài khoản thành công! Đang tự động đăng nhập...');
      
      // Auto login
      setTimeout(async () => {
        try {
          const loginRes = await login(username, password);
          if (loginRes.isSignedIn) {
            const userRole = loginRes.role?.toLowerCase();
            if (userRole === 'user') {
              navigate(ROUTES.USER.DASHBOARD, { replace: true });
            } else {
              navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
            }
          }
        } catch (loginErr) {
          navigate(ROUTES.LOGIN, { 
            state: { 
              successMessage: 'Tài khoản đã được tạo. Vui lòng đăng nhập.' 
            },
            replace: true 
          });
        }
      }, 1500);

    } catch (err) {
      console.error('Registration error:', err);
      let errMsg = 'Đăng ký tài khoản thất bại. Vui lòng thử lại.';
      if (err.message) {
        errMsg = err.message;
      }
      setAuthError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      
      {/* ── LEFT PANEL — Branding ──────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-reg" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-reg)" />
          </svg>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <ParkingSquare size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">SmartParking</span>
        </div>

        {/* Branding text */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Gia nhập cổng<br />
              <span className="text-blue-200">thành viên</span>
            </h1>
            <p className="mt-4 text-blue-100 text-lg leading-relaxed">
              Nhận thông báo vị trí đỗ xe còn trống thực tế<br />và trò chuyện giải đáp trực tuyến cùng trợ lý ParkAI.
            </p>
          </div>

          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-blue-100" />
                </div>
                <span className="text-blue-50 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-blue-200/60 text-xs">
          © {new Date().getFullYear()} Smart Parking System · Secure authentication
        </p>
      </div>

      {/* ── RIGHT PANEL — Form ───────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <ParkingSquare size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
              SmartParking
            </span>
          </div>
          <div className="hidden lg:block" />

          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Chuyển Light mode' : 'Chuyển Dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-150 hover:bg-slate-100 dark:hover:bg-surface-700"
            style={{
              color: 'var(--color-text-muted)',
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Centered form container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-sm animate-fade-in">

            <div className="mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Đăng ký tài khoản 📝
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Tạo tài khoản thành viên gửi xe thông minh
              </p>
            </div>

            {success && (
              <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-sm text-emerald-600 dark:text-emerald-400">
                {success}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="reg-username" className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  Tên đăng nhập
                </label>
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })); }}
                  placeholder="Ví dụ: user123"
                  autoComplete="username"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.username ? 'ring-2 ring-red-400' : ''}`}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    border: `1px solid ${errors.username ? '#f87171' : 'var(--color-border)'}`,
                  }}
                />
                {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                    placeholder="Tối thiểu 8 ký tự, 1 hoa, 1 số, 1 ký tự đặc biệt"
                    autoComplete="new-password"
                    required
                    className={`w-full pl-3.5 pr-10 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'ring-2 ring-red-400' : ''}`}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      border: `1px solid ${errors.password ? '#f87171' : 'var(--color-border)'}`,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {authError && (
                <div className="px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-sm text-red-600 dark:text-red-400">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 mt-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : 'Đăng ký tài khoản'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Đã có tài khoản?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary-600 hover:underline font-semibold">
                Đăng nhập ngay
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
