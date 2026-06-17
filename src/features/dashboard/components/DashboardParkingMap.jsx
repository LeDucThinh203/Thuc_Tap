/**
 * DashboardParkingMap.jsx — Sơ đồ bãi đỗ xe trực quan phân theo Zone.
 */
import { useState, useMemo } from 'react';
import Card from 'components/common/Card';

export default function DashboardParkingMap({ slots }) {
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredSlots = useMemo(() => {
    if (activeTab === 'ALL') return slots;
    return slots.filter((slot) => slot.zone === `Zone ${activeTab}`);
  }, [slots, activeTab]);

  // Statistics for active view
  const stats = useMemo(() => {
    const total = filteredSlots.length;
    const available = filteredSlots.filter(s => s.is_occupied === 0).length;
    const occupied = filteredSlots.filter(s => s.is_occupied === 1).length;
    return { total, available, occupied };
  }, [filteredSlots]);

  return (
    <Card 
      title="Sơ đồ bãi xe" 
      subtitle="Trạng thái các vị trí đỗ xe theo thời gian thực"
      className="h-full flex flex-col"
    >
      {/* Zone selection Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-[#E2E8F0] pb-2">
        {['ALL', 'A', 'B', 'C'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#2563EB] text-[#FFFFFF]'
                : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            {tab === 'ALL' ? 'Tất cả' : `Khu ${tab}`}
          </button>
        ))}
      </div>

      {/* Stats legend */}
      <div className="flex items-center gap-4 mb-4 text-[13px] text-[#475569]">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 inline-block"></span>
          <span>Trống ({stats.available})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-sm bg-red-500 inline-block"></span>
          <span>Có xe ({stats.occupied})</span>
        </div>
        <div className="text-[#94A3B8] ml-auto">
          Tổng: {stats.total}
        </div>
      </div>

      {/* Grid container with custom scrollbar */}
      <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
          {filteredSlots.map((slot) => {
            const isOccupied = slot.is_occupied === 1;
            return (
              <div
                key={slot.id}
                title={`${slot.id} - ${isOccupied ? 'Có xe' : 'Trống'} (${slot.zone})`}
                className={`
                  aspect-square rounded flex flex-col items-center justify-center text-[10px] font-bold text-white transition-all
                  ${isOccupied ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}
                  cursor-pointer select-none py-1
                `}
              >
                <span>{slot.id}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
