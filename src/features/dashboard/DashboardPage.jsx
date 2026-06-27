/**
 * DashboardPage.jsx — Core Smart Parking dashboard displaying realtime metrics,
 * parking layout maps, zone status, traffic chart, and recent events.
 */
import { useParkingData } from 'hooks/useParkingData';
import EmptyState from 'components/common/EmptyState';
import Skeleton from 'components/common/Skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Subcomponents
import DashboardMetricCards from './components/DashboardMetricCards';
import DashboardParkingMap from './components/DashboardParkingMap';
import DashboardZoneList from './components/DashboardZoneList';
import DashboardTrafficChart from './components/DashboardTrafficChart';
import DashboardRecentVehicles from './components/DashboardRecentVehicles';

function DashboardSkeleton() {
  return (
    <div className="page-container flex flex-col gap-6 text-[14px] leading-[1.6]">
      {/* Dashboard Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Row 1 — Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3">
              <Skeleton className="w-11 h-11 rounded-lg" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 — Parking Map + Zone List Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-4" />
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            {Array.from({ length: 40 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
        <div className="card">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-4" />
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-2.5 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — Traffic Chart Skeleton */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <Skeleton className="h-[220px] w-full" />
      </div>

      {/* Row 4 — Recent Vehicles Skeleton */}
      <div className="card">
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-4 w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    return <DashboardSkeleton />;
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
