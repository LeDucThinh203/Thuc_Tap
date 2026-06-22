/**
 * VerifyOtpPage.jsx — Xác thực OTP sau đăng ký (email qua Cognito).
 */
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ParkingSquare, Sun, Moon, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from 'hooks/useAuth';
import { useTheme } from 'context/ThemeContext';
import { ROUTES } from 'constants/routes';
import { validateOtp } from 'utils/validators';

export default function VerifyOtpPage() {
  const { confirmRegister, resendCode } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || '';
  const nextStep = location.state?.nextStep;

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendMsg, setResendMsg] = useState('');

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.
          </p>
          <Link to={ROUTES.REGISTER} className="text-primary-600 hover:underline font-semibold text-sm">
            Quay lại đăng ký
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpErr = validateOtp(otp);
    if (otpErr) {
      setErrors({ otp: otpErr });
      return;
    }

    setLoading(true);
    setAuthError('');
    setSuccess('');

    try {
      await confirmRegister(email, otp);
      setSuccess('Xác thực thành công! Bạn có thể đăng nhập ngay.');
      setTimeout(() => {
        navigate(ROUTES.LOGIN, {
          replace: true,
          state: { successMessage: 'Xác thực OTP thành công! Vui lòng đăng nhập.', email },
        });
      }, 1500);
    } catch (err) {
      setAuthError(err.message || 'Xác thực OTP thất bại.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg('');
    setAuthError('');
    try {
      await resendCode(email);
      setResendMsg('Mã OTP mới đã được gửi qua email.');
    } catch (err) {
      setAuthError(err.message || 'Gửi lại OTP thất bại.');
    } finally {
      setResendLoading(false);
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

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
          <ShieldCheck size={48} className="text-blue-200" />
          <h1 className="text-4xl font-bold text-white leading-tight">
            Xác thực<br />
            <span className="text-blue-200">OTP bảo mật</span>
          </h1>
          <p className="text-blue-100 text-lg">
            Mã xác thực 6 số được gửi qua Gmail (Amazon SES).
          </p>
        </div>

        <p className="relative text-blue-200/60 text-xs">
          © {new Date().getFullYear()} Smart Parking System
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
                Nhập mã OTP 🔐
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Kiểm tra email để lấy mã 6 số
              </p>
            </div>

            <div className="mb-5 space-y-2">
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                <Mail size={15} />
                <span>{maskedEmail}</span>
              </div>
            </div>

            {success && (
              <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-sm text-emerald-600">
                {success}
              </div>
            )}

            {resendMsg && (
              <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 text-sm text-blue-600">
                {resendMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="otp-code" className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  Mã OTP (6 số)
                </label>
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setErrors({}); }}
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

              {authError && (
                <div className="px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 text-sm text-red-600">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 transition-all"
              >
                {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-primary-600 hover:underline font-medium disabled:opacity-60"
              >
                {resendLoading ? 'Đang gửi lại...' : 'Gửi lại mã OTP'}
              </button>
            </div>

            <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <Link to={ROUTES.LOGIN} className="text-primary-600 hover:underline font-semibold">
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
