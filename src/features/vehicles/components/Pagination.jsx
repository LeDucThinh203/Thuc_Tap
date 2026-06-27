/**
 * Pagination.jsx — Component for pagination controls.
 * Styles follow B2B guidelines: clean borders, white bg, primary colors.
 */
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 20,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#FFFFFF] border-t border-[#E2E8F0] select-none text-[13px] text-[#475569]">
      {/* Items status summary */}
      <div>
        Hiển thị <span className="font-semibold text-[#0F172A]">{startIdx}-{endIdx}</span> trong tổng số <span className="font-semibold text-[#0F172A]">{totalItems}</span> bản ghi
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FFFFFF] transition-colors"
          aria-label="Trang trước"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded text-[13px] font-medium transition-all ${
              currentPage === page
                ? 'bg-[#2563EB] text-[#FFFFFF]'
                : 'border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC]'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FFFFFF] transition-colors"
          aria-label="Trang sau"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
