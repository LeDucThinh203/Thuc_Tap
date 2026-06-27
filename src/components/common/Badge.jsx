/**
 * Badge.jsx — Small status/label indicator.
 * Variants: primary | success | warning | danger | gray
 */
const VARIANTS = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  success: 'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300',
  warning: 'bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300',
  danger:  'bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-300',
  gray:    'bg-slate-100  text-slate-600  dark:bg-slate-700     dark:text-slate-300',
};

export default function Badge({ variant = 'gray', children, className = '', dot = false }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5
        rounded-full text-xs font-medium
        ${VARIANTS[variant]} ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'success' ? 'bg-green-500' :
            variant === 'warning' ? 'bg-amber-500' :
            variant === 'danger'  ? 'bg-red-500'   :
            variant === 'primary' ? 'bg-primary-500' :
            'bg-slate-400'
          }`}
        />
      )}
      {children}
    </span>
  );
}
