/**
 * formatters.js — Pure JS helper functions for formatting display values.
 * No React imports. No side effects.
 */

// ── Date & Time ──────────────────────────────────────────────

/**
 * Format ISO string to Vietnamese locale datetime.
 * @param {string|Date} date
 * @returns {string} e.g. "12/06/2026 14:30:05"
 */
export function formatDateTime(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day:    '2-digit', month: '2-digit', year: 'numeric',
    hour:   '2-digit', minute: '2-digit', second: '2-digit',
  }).format(new Date(date));
}

/**
 * Format date only (no time).
 */
export function formatDate(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(date));
}

/**
 * Return relative time string, e.g. "3 phút trước".
 */
export function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const rtf  = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });
  const MINUTE = 60_000, HOUR = 3_600_000, DAY = 86_400_000;
  if (diff < MINUTE)  return rtf.format(-Math.round(diff / 1_000), 'second');
  if (diff < HOUR)    return rtf.format(-Math.round(diff / MINUTE), 'minute');
  if (diff < DAY)     return rtf.format(-Math.round(diff / HOUR),   'hour');
  return rtf.format(-Math.round(diff / DAY), 'day');
}

// ── Numbers ──────────────────────────────────────────────────

/**
 * Format integer with thousands separator (VN locale).
 * @param {number} num
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format percentage, e.g. 0.85 → "85%".
 */
export function formatPercent(ratio, decimals = 1) {
  if (ratio === null || ratio === undefined) return '—';
  return `${(ratio * 100).toFixed(decimals)}%`;
}

/**
 * Format VND currency.
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// ── Vehicle Plates ───────────────────────────────────────────

/**
 * Normalize plate string: uppercase, remove spaces.
 * @param {string} plate e.g. "51a-12345" → "51A-12345"
 */
export function normalizePlate(plate) {
  if (!plate) return '';
  return plate.toUpperCase().replace(/\s/g, '');
}

/**
 * Format a string to standard Vietnamese vehicle plate format (e.g. 30A-123.45 or 51F-1234)
 * @param {string} value
 * @returns {string}
 */
export function formatVietnamesePlate(value) {
  if (!value) return '';
  
  // Clean: uppercase and strip characters except letters, digits, dots, hyphens
  let val = value.toUpperCase().replace(/[^A-Z0-9.-]/g, '');
  
  // Strip dots and hyphens to parse pure alphanumeric characters
  const clean = val.replace(/[-.]/g, '');
  
  // Extract province code (first 2 digits), series (next 1-2 letters), and number (4-5 digits)
  const match = clean.match(/^(\d{0,2})([A-Z]{0,2})(.*)$/);
  if (!match) return val;
  
  const [, province, series, rest] = match;
  
  // Keep only digits for the tail number
  const number = rest.replace(/[^0-9]/g, '');
  
  let result = province;
  if (series) {
    result += series;
  }
  
  if (number) {
    if (number.length <= 4) {
      result += `-${number}`;
    } else {
      // 5-digit number format: 123.45
      const num5 = number.slice(0, 5);
      result += `-${num5.slice(0, 3)}.${num5.slice(3)}`;
    }
  }
  
  return result;
}

// ── Parking ──────────────────────────────────────────────────

/**
 * Map slot status code to human-readable label.
 */
export function formatSlotStatus(status) {
  const map = {
    available: 'Trống',
    occupied:  'Có xe',
    reserved:  'Đặt trước',
    disabled:  'Hỏng',
  };
  return map[status] ?? status;
}

/**
 * Calculate occupancy rate.
 * @param {number} occupied
 * @param {number} total
 */
export function calcOccupancy(occupied, total) {
  if (!total) return 0;
  return occupied / total;
}
