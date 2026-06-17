/**
 * Input.jsx — Labeled text input with error state.
 *
 * Usage:
 *   <Input
 *     id="email"
 *     label="Email"
 *     type="email"
 *     value={email}
 *     onChange={(e) => setEmail(e.target.value)}
 *     error={errors.email}
 *     placeholder="admin@example.com"
 *   />
 */
export default function Input({
  id,
  label,
  error,
  hint,
  className = '',
  leftAddon,
  rightAddon,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftAddon && (
          <span className="absolute left-3 text-slate-400 pointer-events-none">
            {leftAddon}
          </span>
        )}

        <input
          id={id}
          className={`
            w-full rounded-lg border px-3 py-2 text-sm
            bg-white dark:bg-surface-800
            text-slate-800 dark:text-slate-100
            placeholder:text-slate-400
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-slate-50 disabled:cursor-not-allowed
            ${error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-slate-300 dark:border-surface-600'
            }
            ${leftAddon ? 'pl-9' : ''}
            ${rightAddon ? 'pr-9' : ''}
          `}
          {...props}
        />

        {rightAddon && (
          <span className="absolute right-3 text-slate-400">
            {rightAddon}
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
