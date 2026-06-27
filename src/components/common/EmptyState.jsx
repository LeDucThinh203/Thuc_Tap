/**
 * EmptyState.jsx — Friendly empty state placeholder.
 *
 * Usage:
 *   <EmptyState
 *     icon={<Car size={40} />}
 *     title="Không có dữ liệu"
 *     description="Chưa có phương tiện nào được ghi nhận."
 *     action={<Button>Làm mới</Button>}
 *   />
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      {icon && (
        <div className="text-slate-300 dark:text-slate-600">
          {icon}
        </div>
      )}
      {title && (
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">{title}</p>
      )}
      {description && (
        <p className="text-sm text-slate-400 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
