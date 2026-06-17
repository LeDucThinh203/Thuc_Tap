/**
 * Spinner.jsx — Loading spinner.
 * Sizes: sm | md | lg
 */
const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-10 h-10 border-3',
};

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <span
      role="status"
      aria-label="Đang tải..."
      className={`
        inline-block rounded-full
        border-current border-t-transparent
        animate-spin
        ${SIZES[size]} ${className}
      `}
    />
  );
}
