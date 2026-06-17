/**
 * DashboardMetricCards.jsx — Row 1 metric cards.
 */
import MetricCard from 'features/dashboard/MetricCard';
import { formatNumber, formatPercent } from 'utils/formatters';
import { ParkingSquare, Activity, Car, TrendingUp } from 'lucide-react';

export default function DashboardMetricCards({ stats }) {
  const { total = 0, available = 0, occupied = 0, todayVehicles = 0, peakHour = "—" } = stats || {};
  const occupancyRate = total > 0 ? occupied / total : 0;
  const occupancyColor = occupancyRate > 0.8 ? 'warning' : 'success';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
      {/* Available Slots */}
      <MetricCard
        icon={<ParkingSquare size={22} />}
        label="Chỗ trống còn lại"
        value={formatNumber(available)}
        color="primary"
        trend={`Tổng số: ${total} ô đỗ`}
      />

      {/* Occupancy Rate */}
      <MetricCard
        icon={<TrendingUp size={22} />}
        label="Tỉ lệ lấp đầy"
        value={formatPercent(occupancyRate)}
        color={occupancyColor}
        trend={occupancyRate > 0.8 ? "Cảnh báo: Sắp hết chỗ" : "Trạng thái bình thường"}
      />

      {/* Vehicles Today */}
      <MetricCard
        icon={<Car size={22} />}
        label="Tổng lượt xe hôm nay"
        value={formatNumber(todayVehicles)}
        color="primary"
        trend="Lượt xe ra/vào bãi"
      />

      {/* Current Peak */}
      <MetricCard
        icon={<Activity size={22} />}
        label="Khung giờ cao điểm"
        value={peakHour}
        color="warning"
        trend="Lượng xe tập trung nhiều nhất"
      />
    </div>
  );
}
