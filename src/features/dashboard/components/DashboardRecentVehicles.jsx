/**
 * DashboardRecentVehicles.jsx — Table of the 10 most recent vehicles entering/leaving.
 */
import Card from 'components/common/Card';
import { formatDateTime } from 'utils/formatters';

export default function DashboardRecentVehicles({ vehicles }) {
  const displayVehicles = vehicles || [];

  return (
    <Card 
      title="Hoạt động gần đây" 
      subtitle="Danh sách 10 lượt xe vào/ra bãi đỗ mới nhất"
      className="w-full flex flex-col"
    >
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-[13px] text-left border-collapse select-none">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#94A3B8] font-medium uppercase text-[11px] tracking-wider">
              <th className="pb-3 pt-1 font-semibold">Biển số</th>
              <th className="pb-3 pt-1 font-semibold">Trạng thái</th>
              <th className="pb-3 pt-1 font-semibold">Thời gian</th>
              <th className="pb-3 pt-1 font-semibold">Camera</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
            {displayVehicles.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#94A3B8]">
                  Không có hoạt động gần đây
                </td>
              </tr>
            ) : (
              displayVehicles.map((v, idx) => {
                const isEntry = v.direction === 'IN';
                const displayPlate = v.display_plate_number || v.plate_number || '—';
                const displayDirection = isEntry ? 'Xe vào' : 'Xe ra';
                
                let displayTime = '—';
                if (v.created_at) {
                  displayTime = formatDateTime(v.created_at);
                } else if (v.timestamp) {
                  displayTime = formatDateTime(new Date(v.timestamp).toISOString());
                }

                return (
                  <tr key={v.event_id || v.id || idx} className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="py-3 font-semibold text-[#0F172A]">{displayPlate}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isEntry
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isEntry ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                        {displayDirection}
                      </span>
                    </td>
                    <td className="py-3 text-[#475569]">{displayTime}</td>
                    <td className="py-3 text-[#475569]">{v.camera_id || '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
