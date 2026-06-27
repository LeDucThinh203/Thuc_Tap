/**
 * LineChart.jsx — Real Recharts implementation of the line/area chart.
 */
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function LineChart({ data = [], height = 200, color = '#2563EB' }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-[#94A3B8] text-[13px]" style={{ height }}>
        Không có dữ liệu
      </div>
    );
  }

  // Format tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-2 rounded-md shadow-sm text-[12px] font-medium text-[#0F172A] select-none">
          <p className="font-semibold text-[#475569]">{payload[0].payload.label}</p>
          <p className="text-[#2563EB]">{payload[0].value} lượt xe</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.01}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="label" 
            stroke="#94A3B8" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94A3B8" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTraffic)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
