/**
 * UserProfilePage.jsx — Profile settings page for normal users.
 * Allows updating Full Name, License Plate, Phone Number, and changing Password.
 */
import { useState, useEffect } from 'react';
import { useAuth } from 'hooks/useAuth';
import { formatVietnamesePlate } from 'utils/formatters';
import { validatePlate, validateEmail, validateOtp } from 'utils/validators';
import { User, Shield, Key, Car, Mail, Check, AlertTriangle, Loader2, Send } from 'lucide-react';

export default function UserProfilePage() {
  const { user, updateProfile, changePassword, sendEmailVerification, verifyEmailUpdate } = useAuth();
  
  // Profile Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [plate, setPlate] = useState('');
  
  // Email Verification State
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const [emailVerifySuccess, setEmailVerifySuccess] = useState('');
  const [emailVerifyError, setEmailVerifyError] = useState('');
  
  // Status State
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  
  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setUsername(user.username ?? '');
      setEmail(user.email ?? '');
      setPlate(user.plate ?? '');
    }
  }, [user]);

  // Handle license plate formatting on blur
  const handlePlateBlur = () => {
    setPlate(formatVietnamesePlate(plate));
  };

  // Handle start email update
  const handleStartEmailUpdate = () => {
    setNewEmail(email);
    setShowEmailVerify(true);
    setEmailVerifySuccess('');
    setEmailVerifyError('');
  };

  // Handle send email verification OTP
  const handleSendEmailOtp = async () => {
    const emailErr = validateEmail(newEmail);
    if (emailErr) {
      setEmailVerifyError(emailErr);
      return;
    }

    setEmailVerifyLoading(true);
    setEmailVerifySuccess('');
    setEmailVerifyError('');

    try {
      await sendEmailVerification(newEmail);
      setEmailVerifySuccess('Mã OTP đã được gửi đến email mới!');
    } catch (err) {
      setEmailVerifyError(err.message ?? 'Gửi mã OTP thất bại.');
    } finally {
      setEmailVerifyLoading(false);
    }
  };

  // Handle verify email update
  const handleVerifyEmail = async () => {
    const otpErr = validateOtp(emailOtp);
    if (otpErr) {
      setEmailVerifyError(otpErr);
      return;
    }

    setEmailVerifyLoading(true);
    setEmailVerifySuccess('');
    setEmailVerifyError('');

    try {
      await verifyEmailUpdate(newEmail, emailOtp);
      setEmail(newEmail);
      setShowEmailVerify(false);
      setProfileSuccess('Cập nhật email thành công!');
    } catch (err) {
      setEmailVerifyError(err.message ?? 'Xác thực email thất bại.');
    } finally {
      setEmailVerifyLoading(false);
    }
  };

  // Submit Profile Attributes update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    
    // Validate Plate
    const plateErr = validatePlate(plate);
    if (plateErr) {
      setProfileError(plateErr);
      return;
    }

    setProfileLoading(true);
    try {
      // Form attributes payload
      const attrs = {
        'custom:plate': formatVietnamesePlate(plate),
      };

      await updateProfile(attrs);
      setProfileSuccess('Cập nhật thông tin tài khoản thành công!');
    } catch (err) {
      setProfileError(err.message ?? 'Đã xảy ra lỗi khi cập nhật thông tin.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Submit Password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Mật khẩu mới phải dài tối thiểu 8 ký tự.');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message ?? 'Đã xảy ra lỗi khi thay đổi mật khẩu.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 select-none">
        <h2 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">Cài đặt tài khoản</h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
          Quản lý thông tin phương tiện, liên hệ và cập nhật bảo mật tài khoản.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left column: Summary Card */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-md mb-4">
            {(username || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white truncate max-w-full">
            {username || 'Khách hàng'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-full">{email}</p>
          <span className="mt-3 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] dark:text-[#60A5FA] border border-blue-100 dark:border-blue-900/30 rounded-full text-[11px] font-bold capitalize">
            Khách hàng (User)
          </span>
          
          <div className="w-full border-t border-slate-100 dark:border-slate-800/80 mt-5 pt-4 text-left space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <Mail size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <Car size={14} className="text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">{plate || 'Chưa thiết lập'}</span>
            </div>
          </div>
        </div>

        {/* Right column: Settings panels */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Panel 1: Profile Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
              <User size={16} className="text-[#2563EB]" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Thông tin cá nhân</h4>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-5 space-y-4">
              {profileSuccess && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <Check size={16} className="shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tên tài khoản (Read-only) */}
                <div className="space-y-1.5 opacity-70">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tên tài khoản</label>
                  <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>

                {/* Email (Editable with verify) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Địa chỉ Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="flex-1 px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] dark:text-white transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={handleStartEmailUpdate}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 transition-all"
                    >
                      Đổi
                    </button>
                  </div>
                </div>

                {/* Email Verification Modal */}
                {showEmailVerify && (
                  <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    {emailVerifySuccess && (
                      <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
                        <Check size={16} className="shrink-0" />
                        <span>{emailVerifySuccess}</span>
                      </div>
                    )}

                    {emailVerifyError && (
                      <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold mb-4">
                        <AlertTriangle size={16} className="shrink-0" />
                        <span>{emailVerifyError}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email mới</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] dark:text-white transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Mã OTP</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={emailOtp}
                            onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                            className="flex-1 px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-center tracking-[0.3em] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] dark:text-white transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={handleSendEmailOtp}
                            disabled={emailVerifyLoading}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all disabled:opacity-50"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowEmailVerify(false)}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={handleVerifyEmail}
                          disabled={emailVerifyLoading}
                          className="px-4 py-2 bg-[#2563EB] hover:bg-blue-600 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                        >
                          {emailVerifyLoading ? 'Đang xác thực...' : 'Xác thực'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Biển số xe */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Biển số xe đăng ký</label>
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    onBlur={handlePlateBlur}
                    required
                    placeholder="Ví dụ: 30A-123.45"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] dark:text-white transition-all duration-200 font-semibold uppercase"
                  />
                  <p className="text-[10px] text-slate-400">Tự động định dạng (Ví dụ: 51f12345 → 51F-123.45)</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {profileLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu thay đổi</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Panel 2: Change Password */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
              <Key size={16} className="text-[#2563EB]" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Thay đổi mật khẩu</h4>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4">
              {passwordSuccess && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <Check size={16} className="shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Mật khẩu cũ */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] dark:text-white transition-all duration-200"
                  />
                </div>

                {/* Mật khẩu mới */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] dark:text-white transition-all duration-200"
                  />
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] dark:text-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Đang đổi...</span>
                    </>
                  ) : (
                    <span>Đổi mật khẩu</span>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
