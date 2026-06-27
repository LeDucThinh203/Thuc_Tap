/**
 * ForgotPasswordPage.jsx — Quên mật khẩu với OTP qua email (SES).
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ParkingSquare, Sun, Moon, Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { useAuth } from 'hooks/useAuth';
import { useTheme } from 'context/ThemeContext';
import { ROUTES } from 'constants/routes';
import { validateEmail, validatePassword, validateOtp } from 'utils/validators';

export default function ForgotPasswordPage() {
  const { forgotPassword, confirmForgotPassword } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [success, setSuccess] = useState('');

  const validateStep1 = () => {
    const errs = {};
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const validateStep2 = () => {
    const errs = {};
    const otpErr = validateOtp(otp);
    if (otpErr) errs.otp = otpErr;
    const pwdErr = validatePassword(newPassword);
    if (pwdErr) errs.newPassword = pwdErr;
    if (newPassword !== confirmPwd) errs.confirmPwd = 'Mật khẩu xác nhận không khớp.';
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    setAuthError('');

    try {
      await forgotPassword(email);
      setStep(2);
      setSuccess('Mã OTP đã được gửi đến email đã đăng ký. Hãy kiểm tra thùng rác nếu không có!');
    } catch (err) {
      setAuthError(err.message || 'Gửi OTP thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setAuthError('');
    setSuccess('');

    try {
      await confirmForgotPassword(email, otp, newPassword);
      setSuccess('Đặt lại mật khẩu thành công! Đang chuyển sang đăng nhập...');
      setTimeout(() => {
        navigate(ROUTES.LOGIN, {
          replace: true,
          state: { successMessage: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập.', email },
        });
      }, 1600);
    } catch (err) {
      setAuthError(err.message || 'Đặt lại mật khẩu thất bại.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)' }}
      >
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <ParkingSquare size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">SmartParking</span>
        </div>

        <div className="relative space-y-6">
          <KeyRound size={48} className="text-blue-200" />
          <h1 className="text-4xl font-bold text-white leading-tight">
            Khôi phục<br />
            <span className="text-blue-200">mật khẩu</span>
          </h1>
          <p className="text-blue-100 text-lg">
            Nhận mã OTP qua Gmail để đặt lại mật khẩu an toàn.
          </p>
        </div>

        <p className="relative text-blue-200/60 text-xs">
          © {new Date().getFullYear()} Smart Parking System · Amazon Cognito
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-end px-6 sm:px-10 py-5">
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Chuyển Light mode' : 'Chuyển Dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-lg border transition-all"
            style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-sm animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {step === 1 ? 'Quên mật khẩu?' : 'Nhập OTP & mật khẩu mới'}
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {step === 1
                  ? 'Nhập email đã đăng ký để nhận mã OTP'
                  : 'Nhập mã OTP từ email và mật khẩu mới'}
              </p>
            </div>

            {success && (
              <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-sm text-emerald-600">
                {success}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestOtp} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="forgot-email" className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Email đăng ký
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                      placeholder="email@example.com"
                      autoComplete="email"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'ring-2 ring-red-400' : ''}`}
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        border: `1px solid ${errors.email ? '#f87171' : 'var(--color-border)'}`,
                      }}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                {authError && (
                  <div className="px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-sm text-red-600">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60"
                >
                  {loading ? 'Đang gửi OTP...' : 'Gửi mã OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reset-otp" className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Mã OTP (6 số)
                  </label>
                  <input
                    id="reset-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setErrors((p) => ({ ...p, otp: '' })); }}
                    placeholder="123456"
                    autoComplete="one-time-code"
                    className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-center tracking-[0.3em] font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.otp ? 'ring-2 ring-red-400' : ''}`}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-primary)',
                      border: `1px solid ${errors.otp ? '#f87171' : 'var(--color-border)'}`,
                    }}
                  />
                  {errors.otp && <p className="text-xs text-red-500">{errors.otp}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reset-new-pwd" className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      id="reset-new-pwd"
                      type={showPwd ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: '' })); }}
                      placeholder="Tối thiểu 8 ký tự"
                      autoComplete="new-password"
                      className={`w-full pl-3.5 pr-10 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.newPassword ? 'ring-2 ring-red-400' : ''}`}
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        border: `1px solid ${errors.newPassword ? '#f87171' : 'var(--color-border)'}`,
                      }}
                    />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reset-confirm-pwd" className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      id="reset-confirm-pwd"
                      type={showConfirmPwd ? 'text' : 'password'}
                      value={confirmPwd}
                      onChange={(e) => { setConfirmPwd(e.target.value); setErrors((p) => ({ ...p, confirmPwd: '' })); }}
                      placeholder="Nhập lại mật khẩu mới"
                      autoComplete="new-password"
                      className={`w-full px-3.5 pr-10 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.confirmPwd ? 'ring-2 ring-red-400' : ''}`}
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        border: `1px solid ${errors.confirmPwd ? '#f87171' : 'var(--color-border)'}`,
                      }}
                    />
                    <button type="button" onClick={() => setShowConfirmPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                      {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPwd && <p className="text-xs text-red-500">{errors.confirmPwd}</p>}
                </div>

                {authError && (
                  <div className="px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-sm text-red-600">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60"
                >
                  {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep(1); setAuthError(''); setSuccess(''); }}
                  className="w-full py-2 text-sm text-primary-600 hover:underline"
                >
                  Gửi lại OTP
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Nhớ mật khẩu?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary-600 hover:underline font-semibold">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
