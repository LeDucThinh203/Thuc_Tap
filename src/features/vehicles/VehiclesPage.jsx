import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { getVehicleHistory } from 'services/vehicleService';
import FilterBar from './components/FilterBar';
import TableRow from './components/TableRow';
import Pagination from './components/Pagination';
import Spinner from 'components/common/Spinner';

export default function VehiclesPage() {
  const location = useLocation();
  const { role, user } = useAuth();
  const isMyVehiclePage = location.pathname === '/app/my-vehicle';

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    plate: '',
    status: 'ALL', // Maps to direction: ALL / IN / OUT
    startDate: '',
    endDate: '',
  });

  // Sort states
  const [sortField, setSortField] = useState('entryTime'); // plate, status, entryTime
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Load real history data from BE
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const response = await getVehicleHistory();
        const items = response?.items || [];
        
        // Default sort newest first by timestamp or created_at
        items.sort((a, b) => {
          const aTime = a.timestamp || (a.created_at ? new Date(a.created_at).getTime() : 0);
          const bTime = b.timestamp || (b.created_at ? new Date(b.created_at).getTime() : 0);
          return bTime - aTime;
        });
        
        setRecords(items);
      } catch (err) {
        console.error('Failed to load vehicle history:', err);
        setError(err.message || 'Không thể tải lịch sử xe từ hệ thống.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter change handler
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page
  };

  // Reset filters handler
  const handleReset = () => {
    setFilters({
      plate: '',
      status: 'ALL',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
  };

  // Sort handler
  const handleSort = (field) => {
    let order = 'asc';
    if (sortField === field && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  // Filter & Sort logic
  const filteredAndSortedRecords = useMemo(() => {
    let result = [...records];

    // 1. Filter by Plate (strict matching for normal users, partial search for staff)
    if (role?.toLowerCase() === 'user') {
      const userPlate = (user?.plate ?? '30A-888.88').toUpperCase().replace(/\s/g, '').replace(/[-.]/g, '');
      result = result.filter((r) => {
        const plateStr = (r.display_plate_number || r.plate_number || '').toUpperCase().replace(/\s/g, '').replace(/[-.]/g, '');
        return plateStr === userPlate;
      });
    } else if (filters.plate.trim()) {
      const searchPlate = filters.plate.toUpperCase().replace(/\s/g, '').replace(/[-.]/g, '');
      result = result.filter((r) => {
        const plateStr = (r.display_plate_number || r.plate_number || '').toUpperCase().replace(/\s/g, '').replace(/[-.]/g, '');
        return plateStr.includes(searchPlate);
      });
    }

    // 2. Filter by Direction (status: ALL / IN / OUT)
    if (filters.status !== 'ALL') {
      result = result.filter((r) => r.direction === filters.status);
    }

    // 3. Filter by Date Range (StartDate)
    if (filters.startDate) {
      const start = new Date(filters.startDate + 'T00:00:00');
      result = result.filter((r) => {
        const rTime = r.created_at ? new Date(r.created_at) : (r.timestamp ? new Date(r.timestamp) : null);
        return rTime && rTime >= start;
      });
    }

    // 4. Filter by Date Range (EndDate)
    if (filters.endDate) {
      const end = new Date(filters.endDate + 'T23:59:59');
      result = result.filter((r) => {
        const rTime = r.created_at ? new Date(r.created_at) : (r.timestamp ? new Date(r.timestamp) : null);
        return rTime && rTime <= end;
      });
    }

    // 5. Sorting logic
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Custom fields mapping for sorting
      if (sortField === 'plate') {
        aVal = a.display_plate_number || a.plate_number || '';
        bVal = b.display_plate_number || b.plate_number || '';
      } else if (sortField === 'entryTime') {
        // Map entryTime sorting to created_at / timestamp
        aVal = a.timestamp || (a.created_at ? new Date(a.created_at).getTime() : 0);
        bVal = b.timestamp || (b.created_at ? new Date(b.created_at).getTime() : 0);
      } else if (sortField === 'status') {
        aVal = a.direction || '';
        bVal = b.direction || '';
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [records, filters, sortField, sortOrder, role, user]);

  // Paginated records slice
  const paginatedRecords = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredAndSortedRecords.slice(startIdx, startIdx + pageSize);
  }, [filteredAndSortedRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedRecords.length / pageSize);

  const formatDateForCSV = (isoString) => {
    if (!isoString || isoString === '—') return '—';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // CSV Export logic
  const handleExportCSV = () => {
    const headers = ['STT', 'Biển số', 'Trạng thái', 'Thời gian', 'Camera', 'Độ tin cậy', 'Ảnh URL'];
    const csvRows = ['sep=,', headers.join(',')];

    filteredAndSortedRecords.forEach((r, idx) => {
      const displayPlate = r.display_plate_number || r.plate_number || '—';
      const displayDirection = r.direction === 'IN' ? 'Xe vào' : 'Xe ra';
      const displayTime = r.created_at || (r.timestamp ? new Date(r.timestamp).toISOString() : '—');
      const displayConfidence = r.confidence !== undefined ? `${Number(r.confidence).toFixed(1)}%` : '—';
      const s3Bucket = r.bucket || 'smart-parking-images-075647413376-ap-southeast-1-an';
      const imageUrl = r.image_key ? `https://${s3Bucket}.s3.ap-southeast-1.amazonaws.com/${r.image_key}` : '—';

      const row = [
        idx + 1,
        displayPlate,
        displayDirection,
        formatDateForCSV(displayTime),
        r.camera_id || '—',
        displayConfidence,
        imageUrl
      ];
      // Escape columns containing quotes/commas
      const escapedRow = row.map(val => `"${String(val).replace(/"/g, '""')}"`);
      csvRows.push(escapedRow.join(','));
    });

    const csvContent = "\uFEFF" + csvRows.join('\n'); // Excel friendly UTF-8 BOM
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SmartParking_LichSuXe_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Rendering sort indicator helper
  const SortIndicator = ({ field }) => {
    if (sortField !== field) {
      return <span className="text-[#94A3B8] text-xs ml-1 select-none">↕</span>;
    }
    return sortOrder === 'asc' 
      ? <span className="text-[#2563EB] text-xs ml-1 select-none">↑</span> 
      : <span className="text-[#2563EB] text-xs ml-1 select-none">↓</span>;
  };

  const pageTitle = role?.toLowerCase() === 'user' 
    ? (isMyVehiclePage ? 'Xe của tôi' : 'Lịch sử gửi xe') 
    : 'Lịch sử xe ra vào';
  const pageSubtitle = role?.toLowerCase() === 'user'
    ? (isMyVehiclePage ? 'Thông tin chi tiết và vị trí ô đỗ hiện tại của bạn.' : 'Lịch sử chi tiết các lượt xe ra vào bãi đỗ của bạn.')
    : 'Quản lý, tìm kiếm, sắp xếp và lọc thông tin phương tiện ra vào bãi đỗ thời gian thực.';

  return (
    <div className="page-container flex flex-col gap-6 animate-fade-in text-[14px] leading-[1.6]">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">{pageTitle}</h2>
        <p className="text-[#475569] text-[13px] mt-0.5">
          {pageSubtitle}
        </p>
      </div>

      {/* Row 1 — Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onExportCSV={handleExportCSV}
        isUser={role?.toLowerCase() === 'user'}
        isMyVehicle={isMyVehiclePage}
      />

      {/* Row 2 — Data table card */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden min-h-0 flex flex-col">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="py-16 text-center text-red-500 font-semibold select-none flex flex-col items-center justify-center gap-2">
            <span>⚠️ {error}</span>
            <button 
              onClick={() => {
                // simple reload logic
                window.location.reload();
              }}
              className="px-3.5 py-1.5 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors active:scale-[0.98]"
            >
              Thử lại
            </button>
          </div>
        ) : filteredAndSortedRecords.length === 0 ? (
          <div className="py-16 text-center text-[#94A3B8] select-none">
            Không tìm thấy bản ghi lịch sử xe phù hợp
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#94A3B8] font-medium uppercase text-[11px] tracking-wider select-none">
                  {/* STT Header - Hidden on Mobile */}
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">STT</th>
                  
                  {/* Plate Header (Sortable) */}
                  <th 
                    onClick={() => handleSort('plate')}
                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#E2E8F0]/30 transition-colors"
                  >
                    <span className="inline-flex items-center">Biển số <SortIndicator field="plate" /></span>
                  </th>

                  {/* Status Header (Sortable) */}
                  <th 
                    onClick={() => handleSort('status')}
                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#E2E8F0]/30 transition-colors"
                  >
                    <span className="inline-flex items-center">Trạng thái <SortIndicator field="status" /></span>
                  </th>

                  {/* Entry Header (Sortable) */}
                  <th 
                    onClick={() => handleSort('entryTime')}
                    className="px-4 py-3 font-semibold cursor-pointer hover:bg-[#E2E8F0]/30 transition-colors"
                  >
                    <span className="inline-flex items-center">Thời gian <SortIndicator field="entryTime" /></span>
                  </th>

                  {/* Camera Header - Hidden on Mobile */}
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Camera</th>

                  {/* Confidence Header - Hidden on Mobile */}
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Độ tin cậy</th>

                  {/* Image Header */}
                  <th className="px-4 py-3 font-semibold">Ảnh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                {paginatedRecords.map((record, index) => (
                  <TableRow
                    key={record.event_id || record.id || index}
                    record={record}
                    index={(currentPage - 1) * pageSize + index + 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {!loading && !error && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
