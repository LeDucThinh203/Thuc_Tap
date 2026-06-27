/**
 * ParkingMap.jsx — Visual grid map of parking slots.
 * Renders each slot as a colored cell based on its status.
 *
 * Usage:
 *   <ParkingMap slots={slots} onSlotClick={(slot) => setSelected(slot)} />
 */
import { formatSlotStatus } from 'utils/formatters';

const STATUS_COLORS = {
  available: 'bg-slot-available hover:brightness-90',
  occupied:  'bg-slot-occupied  hover:brightness-90',
  reserved:  'bg-slot-reserved  hover:brightness-90',
  disabled:  'bg-slot-disabled  cursor-not-allowed',
};

export default function ParkingMap({ slots = [], onSlotClick }) {
  if (!slots.length) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
        Không có dữ liệu slot
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(STATUS_COLORS).map(([status]) => (
          <span key={status} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm bg-slot-${status}`} />
            {formatSlotStatus(status)}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-12">
        {slots.map((slot) => (
          <button
            key={slot.id}
            title={`${slot.id} — ${formatSlotStatus(slot.status)}`}
            onClick={() => onSlotClick?.(slot)}
            disabled={slot.status === 'disabled'}
            className={`
              h-10 rounded-md text-white text-xs font-bold
              transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500
              ${STATUS_COLORS[slot.status] ?? 'bg-gray-300'}
            `}
          >
            {slot.label ?? slot.id}
          </button>
        ))}
      </div>
    </div>
  );
}
