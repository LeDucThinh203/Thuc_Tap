/**
 * BarChart.jsx — Placeholder bar chart component.
 * TODO: Replace with Recharts or Chart.js implementation.
 *
 * Usage:
 *   <BarChart
 *     data={[{ label: 'T2', value: 120 }, ...]}
 *     title="Lượt vào/ra theo ngày"
 *   />
 */
export default function BarChart({ data = [], title, height = 200 }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-slate-400 text-sm" style={{ height }}>
        Không có dữ liệu
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {title && <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h4>}
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full bg-primary-500 rounded-t hover:bg-primary-400 transition-all duration-300"
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.label}: ${d.value}`}
            />
            <span className="text-xs text-slate-500 truncate max-w-full">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
