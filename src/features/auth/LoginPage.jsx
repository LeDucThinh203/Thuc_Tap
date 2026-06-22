/**
 * LoginPage.jsx — Light mode professional login page.
 * Split layout: left panel (branding) + right panel (form)
 */
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ParkingSquare, Sun, Moon, Eye, EyeOff, Car, Activity, Shield } from 'lucide-react';
import { useAuth }  from 'hooks/useAuth';
import { useTheme } from 'context/ThemeContext';
import { ROUTES }   from 'constants/routes';
import { validateEmail, validatePassword } from 'utils/validators';

const IS_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Quick-fill accounts shown in mock mode
const DEMO_ACCOUNTS = [
  { label: 'Admin',    username: 'admin',    password: 'Admin123@',    role: 'admin'    },
  { label: 'Operator', username: 'operator', password: 'Operator123@', role: 'operator' },
  { label: 'User',     username: 'user',     password: 'User123@',     role: 'user'     },
];

// ── Feature list shown on left panel ──────────────────────────
const FEATURES = [
  { icon: Car,      text: 'Theo dõi xe vào/ra theo thời gian thực' },
  { icon: Activity, text: 'Phân tích lưu lượng & dự báo bằng AI'  },
  { icon: Shield,   text: 'Bảo mật với Amazon Cognito + AWS IAM'   },
];

export default function LoginPage() {
  const { login }               = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate                = useNavigate();
  const location                = useLocation();

  const [identifier, setIdentifier] = useState(location.state?.email || '');
  const [password,  setPassword]  = useState('');
  const [showPwd,   setShowPwd]   = useState(false);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMsg(location.state.successMessage);
    }
  }, [location.state]);

  const validate = () => {
    const errs = {};
    if (!identifier.trim()) {
      errs.identifier = 'Vui lòng nhập Tên tài khoản hoặc Email';
    }
    const pErr = validatePassword(password);
    if (pErr) errs.password = pErr;
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setAuthError('');
    setSuccessMsg('');
    try {
      const result = await login(identifier.trim().toLowerCase(), password);

      const userRole = result.role?.toLowerCase();
      if (userRole === 'user') {
        navigate(ROUTES.USER.DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'UserNotConfirmedException') {
        navigate(ROUTES.VERIFY_OTP, {
          replace: true,
          state: { email: err.email || identifier.trim().toLowerCase() },
        });
        return;
      }
      setAuthError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ── LEFT PANEL — Branding (hidden on mobile) ──────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)' }}
      >
        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          {/* Glow circles */}
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

        {/* Hero text */}
        <div className="relative space-y-8">
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Quản lý bãi xe<br />
              <span className="text-blue-200">thông minh</span>
            </h1>
            <p className="mt-4 text-blue-100 text-lg leading-relaxed">
              Hệ thống giám sát bãi đỗ xe & giao thông tích hợp<br />AWS IoT Core và Amazon Bedrock AI.
            </p>
          </div>

          {/* Feature list */}
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

        {/* Bottom caption */}
        <p className="relative text-blue-200/60 text-xs">
          © {new Date().getFullYear()} Smart Parking System · Powered by AWS
        </p>
      </div>

      {/* ── RIGHT PANEL — Login form ───────────────────────────── */}
      <div className="flex-1 flex flex-col">

        {/* Top bar: logo (mobile) + theme toggle */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <ParkingSquare size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
              SmartParking
            </span>
          </div>
          <div className="hidden lg:block" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Chuyển Light mode' : 'Chuyển Dark mode'}
            className="
              flex items-center justify-center w-9 h-9 rounded-lg
              border transition-all duration-150
              hover:bg-slate-100 dark:hover:bg-surface-700
            "
            style={{
              color: 'var(--color-text-muted)',
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-sm animate-fade-in">

            {/* Heading */}
            <div className="mb-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Chào mừng trở lại 👋
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Đăng nhập để quản lý hệ thống bãi xe
              </p>
            </div>

            {/* Mock mode hint */}
            {IS_MOCK && (
              <div
                className="mb-5 rounded-xl p-4 border"
                style={{
                  background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                  borderColor: '#bfdbfe',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">DEMO MODE</span>
                  <span className="text-xs text-slate-500">Mật khẩu mẫu: <code className="font-mono font-bold text-slate-700">[Tên]123@</code></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => { setIdentifier(acc.username); setPassword(acc.password); setErrors({}); }}
                      className="
                        flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg
                        border border-blue-200 bg-white
                        hover:border-blue-400 hover:bg-blue-50
                        transition-all duration-150 text-center
                      "
                    >
                      <span className="text-xs font-semibold text-slate-700">{acc.label}</span>
                      <span className="text-2xs text-slate-400 capitalize">{acc.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-sm text-emerald-600 dark:text-emerald-400">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Tên tài khoản hoặc Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-identifier"
                  className="block text-sm font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Tên tài khoản hoặc Email
                </label>
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setErrors(p => ({ ...p, identifier: '' })); }}
                  placeholder="ten_tai_khoan hoặc email@gmail.com"
                  autoComplete="username"
                  required
                  className={`
                    w-full px-3.5 py-2.5 rounded-lg text-sm
                    transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${errors.identifier ? 'ring-2 ring-red-400' : ''}
                  `}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    border: `1px solid ${errors.identifier ? '#f87171' : 'var(--color-border)'}`,
                  }}
                />
                {errors.identifier && (
                  <p className="text-xs text-red-500">{errors.identifier}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Mật khẩu
                  </label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="text-xs text-primary-600 hover:underline font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className={`
                      w-full pl-3.5 pr-10 py-2.5 rounded-lg text-sm
                      transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-primary-500
                      ${errors.password ? 'ring-2 ring-red-400' : ''}
                    `}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                    aria-label={showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Auth error */}
              {authError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                  {authError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="
                  w-full flex items-center justify-center gap-2 mt-2
                  py-2.5 rounded-lg text-sm font-semibold text-white
                  bg-primary-600 hover:bg-primary-700
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-colors duration-150
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                "
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : 'Đăng nhập'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Chưa có tài khoản?{' '}
              <Link to={ROUTES.REGISTER} className="text-primary-600 hover:underline font-semibold">
                Đăng ký ngay
              </Link>
            </p>

            {/* Footer */}
            <p
              className="mt-6 text-center text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {IS_MOCK ? (
                <span className="text-amber-500 font-medium">⚠️ Đang sử dụng chế độ cục bộ</span>
              ) : (
                'Powered by Amazon Cognito · SES · SNS'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
