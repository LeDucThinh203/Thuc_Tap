/**
 * FilterBar.jsx — Filtering controls for vehicle log list.
 * Includes search plate, zone dropdown, date range, status, reset, and CSV export.
 */
import { FileDown, RotateCcw } from 'lucide-react';

export default function FilterBar({
  filters,
  onFilterChange,
  onReset,
  onExportCSV,
  isUser = false,
  isMyVehicle = false
}) {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-4 select-none">
      
      {/* Filters row 1: Search plate + Zone dropdown + Status dropdown */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isUser ? (isMyVehicle ? 'lg:grid-cols-2' : 'lg:grid-cols-3') : 'lg:grid-cols-3'} gap-3`}>
        {/* Search Plate - Hidden for normal users */}
        {!isUser && (
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#475569]">Biển số xe</label>
            <input
              type="text"
              value={filters.plate}
              onChange={(e) => onFilterChange('plate', e.target.value)}
              placeholder="Tìm biển số... (VD: 30A)"
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] bg-transparent outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </div>
        )}

        {/* Status Dropdown */}
        {!isMyVehicle && (
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#475569]">Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] bg-[#FFFFFF] outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="IN">Xe vào</option>
              <option value="OUT">Xe ra</option>
            </select>
          </div>
        )}

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-[#475569]">Từ ngày</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] bg-transparent outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Filters row 2: End Date + Action buttons */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 border-t border-[#E2E8F0] pt-3">
        {/* End Date */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[12px] font-semibold text-[#475569]">Đến ngày</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] bg-transparent outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Reset & Export Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end">
          {/* Reset button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors active:scale-[0.98]"
          >
            <RotateCcw size={14} />
            <span>Đặt lại bộ lọc</span>
          </button>
          
          {/* Export CSV button */}
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] text-[#FFFFFF] rounded-lg text-[13px] font-semibold hover:bg-[#1D4ED8] transition-colors active:scale-[0.98]"
          >
            <FileDown size={14} />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

    </div>
  );
}
