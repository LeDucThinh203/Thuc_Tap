/**
 * TypingIndicator.jsx — Visual indicator when AI is thinking.
 * Combines standard bouncing dots with a premium horizontal progress bar.
 */
export default function TypingIndicator() {
  return (
    <div className="flex flex-col gap-1 self-start max-w-[85%] select-none animate-fade-in">
      <span className="text-[12px] font-semibold text-[#2563EB] ml-1">
        ParkAI
      </span>
      <div className="bg-[#FFFFFF] border-y border-r border-[#E2E8F0] border-l-[3px] border-l-[#2563EB] rounded-tr-lg rounded-br-lg rounded-bl-lg px-4 py-3 text-[14px] text-[#0F172A] leading-[1.6] w-60">
        <div className="flex items-center gap-1.5 text-[13px] text-[#475569] mb-2 font-medium">
          <span>ParkAI is analyzing data</span>
          <span className="flex gap-0.5 items-center mt-1">
            <span className="w-1 h-1 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 h-1 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 h-1 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </span>
        </div>
        <div className="w-full bg-[#EFF6FF] h-[2px] rounded-full overflow-hidden relative">
          <div className="bg-[#2563EB] h-full absolute top-0 w-1/3 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
}
