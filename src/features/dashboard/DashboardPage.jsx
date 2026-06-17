/**
 * DashboardPage.jsx — Core Smart Parking dashboard displaying realtime metrics,
 * parking layout maps, zone status, traffic chart, and recent events.
 */
import { useParkingData } from 'hooks/useParkingData';
import Spinner from 'components/common/Spinner';
import EmptyState from 'components/common/EmptyState';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Subcomponents
import DashboardMetricCards from './components/DashboardMetricCards';
import DashboardParkingMap from './components/DashboardParkingMap';
import DashboardZoneList from './components/DashboardZoneList';
import DashboardTrafficChart from './components/DashboardTrafficChart';
import DashboardRecentVehicles from './components/DashboardRecentVehicles';

export default function DashboardPage() {
  const { 
    slots, 
    zones, 
    stats, 
    traffic, 
    recentVehicles, 
    isLoading, 
    error, 
    refresh 
  } = useParkingData();

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <EmptyState
          icon={<AlertCircle size={48} className="text-red-500" />}
          title="Không thể tải dữ liệu"
          description={error}
        />
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col gap-6 animate-fade-in text-[14px] leading-[1.6]">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4 select-none">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Dashboard</h2>
          <p className="text-[13px] text-[#475569] mt-0.5">
            Tổng quan hệ thống bãi đỗ xe và lưu lượng giao thông thời gian thực.
          </p>
        </div>
        
        {/* Refresh and Realtime stats */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          {stats?.lastUpdated && (
            <span className="text-[12px] text-[#94A3B8]">
              Cập nhật lúc: {stats.lastUpdated}
            </span>
          )}
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[13px] text-[#475569] bg-[#FFFFFF] hover:bg-[#F8FAFC] transition-colors active:scale-[0.98] font-medium"
          >
            <RefreshCw size={14} className="text-[#475569]" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Row 1 — Metric Cards */}
      <DashboardMetricCards stats={stats} />

      {/* Row 2 — Parking Map + Zone List (Grid on desktop, stack on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <DashboardParkingMap slots={slots} />
        </div>
        <div>
          <DashboardZoneList zones={zones} />
        </div>
      </div>

      {/* Row 3 — Traffic Chart */}
      <DashboardTrafficChart trafficData={traffic} />

      {/* Row 4 — Recent Vehicles */}
      <DashboardRecentVehicles vehicles={recentVehicles} />

    </div>
  );
}
