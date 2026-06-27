/**
 * Card.jsx — Generic card container.
 *
 * Usage:
 *   <Card title="Tổng xe" footer={<Button>Xem thêm</Button>}>
 *     <p>Content here</p>
 *   </Card>
 */
export default function Card({ title, subtitle, footer, children, className = '', noPadding = false }) {
  return (
    <div className={`card flex flex-col gap-4 ${className}`}>
      {(title || subtitle) && (
        <div className="flex items-start justify-between gap-2">
          <div>
            {title    && <h3 className="font-semibold text-slate-800 dark:text-white">{title}</h3>}
            {subtitle && <p  className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}

      <div className={noPadding ? '-mx-5 -mb-4' : ''}>{children}</div>

      {footer && (
        <div className="pt-2 border-t border-slate-100 dark:border-surface-700">
          {footer}
        </div>
      )}
    </div>
  );
}
