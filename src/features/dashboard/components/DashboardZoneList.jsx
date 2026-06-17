/**
 * DashboardZoneList.jsx — List of zones with progress bar indicating % occupancy.
 */
import Card from 'components/common/Card';
import { formatPercent } from 'utils/formatters';

export default function DashboardZoneList({ zones }) {
  const displayZones = zones || [];

  return (
    <Card 
      title="Hiệu suất khu vực" 
      subtitle="Tỉ lệ lấp đầy theo từng phân khu đỗ xe"
      className="h-full flex flex-col"
    >
      <div className="space-y-5 flex-1 justify-center flex flex-col">
        {displayZones.map((zone) => {
          const occupancyRate = zone.total > 0 ? zone.occupied / zone.total : 0;
          const percentage = Math.round(occupancyRate * 100);
          
          // Determine progress bar color based on occupancy rate
          let barColor = 'bg-[#2563EB]'; // primary
          if (occupancyRate >= 0.8) {
            barColor = 'bg-red-500'; // high occupancy
          } else if (occupancyRate >= 0.6) {
            barColor = 'bg-amber-500'; // moderate occupancy
          } else {
            barColor = 'bg-emerald-500'; // low occupancy
          }

          return (
            <div key={zone.id} className="space-y-1.5 select-none">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-semibold text-[#0F172A]">{zone.name}</span>
                <span className="text-[#475569] font-medium">
                  {zone.occupied}/{zone.total} xe ({formatPercent(occupancyRate)})
                </span>
              </div>
              
              {/* Progress bar container */}
              <div className="w-full bg-[#EFF6FF] h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Detail stats */}
              <div className="flex justify-between text-[12px] text-[#94A3B8]">
                <span>Còn trống: {zone.available} chỗ</span>
                <span>{percentage >= 80 ? '⚠️ Sắp đầy' : 'Đang ổn định'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
