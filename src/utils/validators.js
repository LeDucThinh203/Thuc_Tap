/**
 * validators.js — Form validation helpers.
 * Each function returns null (valid) or an error message string.
 */

// ── Auth ─────────────────────────────────────────────────────

export function validateEmail(value) {
  if (!value?.trim()) return 'Email không được để trống.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return 'Email không hợp lệ.';
  return null;
}

export function validatePassword(value) {
  if (!value) return 'Mật khẩu không được để trống.';
  if (value.length < 8) return 'Mật khẩu tối thiểu 8 ký tự.';
  if (!/[A-Z]/.test(value)) return 'Mật khẩu phải có ít nhất 1 chữ hoa.';
  if (!/[0-9]/.test(value)) return 'Mật khẩu phải có ít nhất 1 chữ số.';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt (ví dụ: @, #, $, ...).';
  return null;
}

/** Validate 6-digit OTP code from Cognito. */
export function validateOtp(value) {
  if (!value?.trim()) return 'Vui lòng nhập mã OTP.';
  if (!/^\d{6}$/.test(value.trim())) return 'Mã OTP phải gồm 6 chữ số.';
  return null;
}

// ── Vehicle ──────────────────────────────────────────────────

/**
 * Validate Vietnamese vehicle plate number.
 * Accepts formats: 51A-12345, 51A-1234, 30A-123.45
 */
export function validatePlate(value) {
  if (!value?.trim()) return 'Biển số không được để trống.';
  // Hỗ trợ định dạng 4 số, 5 số liền nhau, hoặc 5 số có dấu chấm ở giữa (VD: 123.45)
  const re = /^\d{2}[A-Z]{1,2}[-.]?(\d{4,5}|\d{3}\.\d{2})$/i;
  if (!re.test(value.replace(/\s/g, '')))
    return 'Biển số không đúng định dạng (VD: 30A-123.45 hoặc 51F-12345).';
  return null;
}

// ── General ──────────────────────────────────────────────────

export function validateRequired(value, label = 'Trường này') {
  if (value === null || value === undefined || value === '') {
    return `${label} không được để trống.`;
  }
  return null;
}

export function validateMaxLength(value, max, label = 'Trường này') {
  if (value && value.length > max) {
    return `${label} tối đa ${max} ký tự.`;
  }
  return null;
}

/**
 * Run multiple validators and return the first error.
 * @param {any} value
 * @param {Array<Function>} validators
 */
export function runValidators(value, validators) {
  for (const fn of validators) {
    const err = fn(value);
    if (err) return err;
  }
  return null;
}
