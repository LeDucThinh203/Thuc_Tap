/**
 * ChatInput.jsx — Text input area with auto-expanding textarea,
 * send via Enter, trash icon to clear history, and B2B branding.
 */
import { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function ChatInput({ value, onChange, onSend, onClear, loading }) {
  const textareaRef = useRef(null);

  // Reset textarea height when value is cleared
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-[#E2E8F0] bg-[#FFFFFF] rounded-b-xl">
      <div className="flex gap-2 items-end">
        {/* Clear History Button */}
        {onClear && (
          <button
            onClick={onClear}
            disabled={loading}
            title="Xóa lịch sử chat"
            className="p-2.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#94A3B8] hover:text-red-500 hover:border-red-200 transition-colors shrink-0 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
          </button>
        )}

        <div className="flex-1 relative flex items-end bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:border-transparent transition-all px-3 py-2 min-h-[40px]">
          {/* Left logo icon 🅿 */}
          <span className="text-[#94A3B8] font-bold text-[14px] mr-2.5 select-none mb-1">
            🅿
          </span>

          {/* Auto-expanding textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
              onChange(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about parking availability..."
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] resize-none max-h-32 py-0.5 leading-[1.4] min-w-0"
            disabled={loading}
          />

          {/* Send button with text 'Ask' */}
          <button
            onClick={onSend}
            disabled={!value.trim() || loading}
            className={`px-4 py-1.5 rounded text-[13px] font-semibold transition-colors shrink-0 ml-2 mb-0.5 ${
              value.trim() && !loading
                ? "bg-[#2563EB] text-[#FFFFFF] hover:bg-[#1D4ED8]"
                : "bg-[#EFF6FF] text-[#94A3B8] cursor-not-allowed"
            }`}
          >
            Ask
          </button>
        </div>
      </div>
      
      {/* Subtext info */}
      <div className="text-[12px] text-[#94A3B8] mt-1.5 text-center select-none">
        ParkAI uses real-time sensor data
      </div>
    </div>
  );
}
