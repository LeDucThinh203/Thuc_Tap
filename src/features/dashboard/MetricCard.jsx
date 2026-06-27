/**
 * MetricCard.jsx — KPI metric display card.
 */
const COLOR_CLASSES = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  success: 'bg-green-50  text-green-600  dark:bg-green-900/30  dark:text-green-400',
  danger:  'bg-red-50    text-red-600    dark:bg-red-900/30    dark:text-red-400',
  warning: 'bg-amber-50  text-amber-600  dark:bg-amber-900/30  dark:text-amber-400',
};

export default function MetricCard({ icon, label, value, trend, color = 'primary' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${COLOR_CLASSES[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{value}</p>
        {trend && <p className="text-xs text-slate-400 mt-0.5">{trend}</p>}
      </div>
    </div>
  );
}
