/**
 * DashboardTrafficChart.jsx — Traffic chart showing vehicle volume over time.
 * Supports selecting Today, Yesterday, or This Week.
 */
import { useState, useMemo } from 'react';
import Card from 'components/common/Card';
import LineChart from 'components/charts/LineChart';
import { MOCK_TRAFFIC } from 'features/dashboard/mockData';

export default function DashboardTrafficChart({ trafficData }) {
  const [activeRange, setActiveRange] = useState('TODAY'); // TODAY, YESTERDAY, WEEK
  const activeTraffic = trafficData || MOCK_TRAFFIC;

  const chartData = useMemo(() => {
    let sourceData = [];
    if (activeRange === 'TODAY') sourceData = activeTraffic.today;
    else if (activeRange === 'YESTERDAY') sourceData = activeTraffic.yesterday;
    else if (activeRange === 'WEEK') sourceData = activeTraffic.week;

    return sourceData.map(item => ({
      label: item.hour,
      value: item.vehicles
    }));
  }, [activeRange, activeTraffic]);

  return (
    <Card 
      title="Lưu lượng xe" 
      subtitle="Thống kê số lượng lượt xe theo thời gian"
      className="w-full flex flex-col"
    >
      {/* Date Range selectors */}
      <div className="flex items-center justify-between mb-4 border-b border-[#E2E8F0] pb-2">
        <div className="flex gap-1">
          {[
            { id: 'TODAY', label: 'Hôm nay' },
            { id: 'YESTERDAY', label: 'Hôm qua' },
            { id: 'WEEK', label: 'Tuần này' }
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setActiveRange(range.id)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                activeRange === range.id
                  ? 'bg-[#2563EB] text-[#FFFFFF]'
                  : 'text-[#475569] hover:bg-[#F8FAFC]'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        <div className="text-[12px] text-[#94A3B8]">
          Đơn vị: Lượt xe
        </div>
      </div>

      {/* Traffic Line/Area Chart */}
      <div className="flex-1 min-h-[220px]">
        <LineChart data={chartData} height={220} color="#2563EB" />
      </div>
    </Card>
  );
}
