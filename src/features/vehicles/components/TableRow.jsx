/**
 * TableRow.jsx — Row item in the vehicle log history table.
 * Responsive: hides secondary columns on mobile/tablet viewports.
 */
import { formatDateTime } from 'utils/formatters';

export default function TableRow({ record, index }) {
  const { 
    display_plate_number, 
    plate_number, 
    direction, 
    created_at, 
    timestamp, 
    camera_id, 
    confidence, 
    bucket, 
    image_key 
  } = record;

  const isEntry = direction === 'IN';
  const displayPlate = display_plate_number || plate_number || '—';
  const displayDirection = isEntry ? 'Xe vào' : 'Xe ra';
  
  // Format datetime correctly
  let displayTime = '—';
  if (created_at) {
    displayTime = formatDateTime(created_at);
  } else if (timestamp) {
    displayTime = formatDateTime(new Date(timestamp).toISOString());
  }

  const displayConfidence = confidence !== undefined ? `${Number(confidence).toFixed(1)}%` : '—';
  
  // Construct S3 image URL if key exists
  const s3Bucket = bucket || 'smart-parking-images-075647413376-ap-southeast-1-an';
  const imageUrl = image_key 
    ? `https://${s3Bucket}.s3.ap-southeast-1.amazonaws.com/${image_key}`
    : null;

  return (
    <tr className="hover:bg-[#F8FAFC]/50 transition-colors select-none text-[13px] border-b border-[#E2E8F0]">
      {/* Index (STT) - Hidden on Mobile */}
      <td className="px-4 py-3 text-[#475569] font-medium hidden md:table-cell">
        {index}
      </td>

      {/* License Plate (Biển số) */}
      <td className="px-4 py-3 font-mono font-bold text-[#0F172A]">
        {displayPlate}
      </td>

      {/* Status (Trạng thái) */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          isEntry
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isEntry ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
          {displayDirection}
        </span>
      </td>

      {/* Time (Thời gian) */}
      <td className="px-4 py-3 text-[#475569]">
        {displayTime}
      </td>

      {/* Camera */}
      <td className="px-4 py-3 text-[#475569] hidden sm:table-cell">
        {camera_id || '—'}
      </td>

      {/* Confidence (Độ tin cậy) - Hidden on Mobile */}
      <td className="px-4 py-3 text-[#475569] hidden md:table-cell">
        {displayConfidence}
      </td>

      {/* S3 Image (Ảnh) */}
      <td className="px-4 py-3">
        {imageUrl ? (
          <a 
            href={imageUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-12 h-8 rounded border border-[#E2E8F0] overflow-hidden hover:opacity-80 transition-opacity"
            title="Nhấn để mở ảnh gốc trong tab mới"
          >
            <img 
              src={imageUrl} 
              alt="Vehicle" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<span class="text-[11px] text-[#2563EB] hover:underline font-semibold cursor-pointer">Xem ảnh</span>`;
              }}
            />
          </a>
        ) : (
          <span className="text-[#94A3B8]">—</span>
        )}
      </td>
    </tr>
  );
}
