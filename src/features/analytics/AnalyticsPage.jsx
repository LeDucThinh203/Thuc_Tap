/**
 * AnalyticsPage.jsx — Traffic charts, forecasts, and peak-hour heatmap.
 * TODO: Wire in real API_ENDPOINTS.ANALYTICS data.
 */
import { useState, useEffect } from 'react';
import Card      from 'components/common/Card';
import BarChart  from 'components/charts/BarChart';
import LineChart from 'components/charts/LineChart';
import Skeleton from 'components/common/Skeleton';

const WEEKLY_DATA = [
  { label: 'T2', value: 320 }, { label: 'T3', value: 450 },
  { label: 'T4', value: 280 }, { label: 'T5', value: 510 },
  { label: 'T6', value: 620 }, { label: 'T7', value: 750 },
  { label: 'CN', value: 430 },
];

const HOURLY_DATA = [
  { label: '6h',  value: 10 }, { label: '8h',  value: 55 },
  { label: '10h', value: 70 }, { label: '12h', value: 90 },
  { label: '14h', value: 75 }, { label: '16h', value: 85 },
  { label: '18h', value: 95 }, { label: '20h', value: 40 },
  { label: '22h', value: 15 },
];

function AnalyticsSkeleton() {
  return (
    <div className="page-container flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64 mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div className="card">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64 mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>

      <div className="card">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="page-container flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics</h2>
        <p className="text-slate-500 text-sm mt-1">Phân tích lưu lượng xe và dự báo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Lượt xe theo tuần" subtitle="Số lượt vào/ra theo ngày trong tuần">
          <BarChart data={WEEKLY_DATA} height={200} />
        </Card>
        <Card title="Lưu lượng theo giờ" subtitle="Phân bổ xe theo khung giờ hôm nay">
          <LineChart data={HOURLY_DATA} height={200} />
        </Card>
      </div>

      <Card title="Dự báo AI" subtitle="Dự báo lưu lượng 7 ngày tới bởi Amazon Bedrock">
        <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
          🚧 Đang tích hợp Amazon Bedrock Forecast...
        </div>
      </Card>
    </div>
  );
}
