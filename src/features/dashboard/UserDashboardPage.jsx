/**
 * UserDashboardPage.jsx — Mobile-first user landing dashboard.
 * Displays available slots, responsive zone cards, and quick AI chat widget (or live sidebar on desktop).
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingData } from 'hooks/useParkingData';
import { useChat } from 'features/ai-assistant/hooks/useChat';
import ChatMessage from 'features/ai-assistant/components/ChatMessage';
import ChatInput from 'features/ai-assistant/components/ChatInput';
import TypingIndicator from 'features/ai-assistant/components/TypingIndicator';
import { MessageSquare, RefreshCw } from 'lucide-react';
import Skeleton from 'components/common/Skeleton';

function UserDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 min-h-screen text-[14px] leading-[1.6]">
      {/* Main Grid: Responsive 2 Columns on Desktop (>768px), stack on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* Left Column (Hero + Zones) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Hero Section Card Skeleton */}
          <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <Skeleton className="h-3 w-20 bg-blue-400/30" />
            </div>
            <Skeleton className="h-3 w-40 bg-blue-400/30 mb-4" />
            <Skeleton className="h-16 w-40 bg-blue-400/30 mb-2" />
            <Skeleton className="h-6 w-32 bg-blue-400/30 mb-6" />
            <Skeleton className="h-2 w-full bg-blue-400/30 mb-2" />
            <div className="w-full flex justify-between">
              <Skeleton className="h-3 w-28 bg-blue-400/30" />
              <Skeleton className="h-3 w-28 bg-blue-400/30" />
            </div>
          </div>

          {/* Zones list Skeleton */}
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI chat widget (Mobile only) Skeleton */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4 md:hidden">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-12 w-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

        </div>

        {/* Right Column (AI Chat - Visible on Desktop only) Skeleton */}
        <div className="hidden md:flex md:col-span-5 flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden h-[calc(100vh-var(--topbar-height)-90px)] min-h-[480px]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E2E8F0]">
            <Skeleton className="w-8 h-8 rounded-md" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center p-6 my-auto">
              <Skeleton className="w-10 h-10 rounded-lg mb-3" />
              <Skeleton className="h-3 w-40 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
        </div>

      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  // ALL React hooks MUST be called FIRST, before any conditional returns!
  const navigate = useNavigate();
  const { slots, zones, stats, isLoading, refresh } = useParkingData();
  const [updateTime, setUpdateTime] = useState('');
  
  // Embedded chat state for desktop view
  const {
    messages,
    input,
    setInput,
    loading: chatLoading,
    handleSend,
    clearHistory
  } = useChat();

  // Keep track of the last update time
  useEffect(() => {
    if (stats?.lastUpdated) {
      // Extract HH:MM
      const parts = stats.lastUpdated.split(':');
      if (parts.length >= 2) {
        setUpdateTime(`${parts[0]}:${parts[1]}`);
      } else {
        setUpdateTime(stats.lastUpdated);
      }
    } else {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      setUpdateTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
    }
  }, [stats]);

  // Now the conditional return comes AFTER all hooks are called!
  if (isLoading) {
    return <UserDashboardSkeleton />;
  }

  const total = stats?.total ?? 0;
  const available = stats?.available ?? 0;
  const occupied = stats?.occupied ?? 0;
  const pctAvail = total > 0 ? available / total : 0;

  // Determine status badge properties (tailored for premium dark gradient background)
  let badgeText = "Còn chỗ";
  let badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  let dotColor = "bg-emerald-400 animate-pulse";

  if (pctAvail <= 0.05) {
    badgeText = "Hết chỗ";
    badgeColor = "bg-red-500/20 text-red-300 border-red-500/30";
    dotColor = "bg-red-400";
  } else if (pctAvail <= 0.2) {
    badgeText = "Gần đầy";
    badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/30";
    dotColor = "bg-amber-400";
  }

  // Handle suggested questions navigation
  const handleQuestionClick = (question) => {
    navigate('/ai-assistant', { state: { initialMessage: question } });
  };

  // Horizontal scroll zones data
  const zoneList = zones || [];

  return (
    <div className="flex flex-col gap-6 min-h-screen text-[14px] leading-[1.6]">
      
      {/* Main Grid: Responsive 2 Columns on Desktop (>768px), stack on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* Left Column (Hero + Zones) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Hero Section Card — Big available number with premium blue gradient */}
          <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] rounded-2xl p-6 select-none flex flex-col items-center text-center relative overflow-hidden shadow-lg shadow-blue-900/10 text-white">
            {/* Decorative background glows */}
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />
            
            {/* Refresh timestamp */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] text-blue-200/80">
              <RefreshCw size={11} className="animate-spin-slow" />
              <span>Cập nhật lúc {updateTime}</span>
            </div>

            <div className="text-[11px] font-bold text-blue-200 tracking-[0.15em] uppercase mb-4 relative z-10">
              TRẠNG THÁI HIỆN TẠI
            </div>

            {/* Big available number */}
            <div className="flex items-baseline gap-1 mb-2 relative z-10">
              <span className="text-[56px] font-black text-white leading-none tracking-tight drop-shadow-sm">
                {available}
              </span>
              <span className="text-[20px] text-blue-100/90 font-medium">
                / {total} chỗ trống
              </span>
            </div>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border backdrop-blur-sm relative z-10 ${badgeColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
              {badgeText}
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-white/25 h-2 rounded-full overflow-hidden mt-6 shadow-inner relative z-10">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500" 
                style={{ width: `${total > 0 ? (occupied / total) * 100 : 0}%` }}
              />
            </div>
            <div className="w-full flex justify-between text-[11px] text-blue-100/80 mt-2 font-medium relative z-10">
              <span>Đã lấp đầy: {occupied} xe</span>
              <span>Mức sử dụng: {total > 0 ? Math.round((occupied / total) * 100) : 0}%</span>
            </div>
          </div>

          {/* Zones list - responsive grid layout */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[13px] font-semibold text-[#94A3B8] uppercase tracking-wider px-1">
              Hiệu suất phân khu
            </h3>
            
            {/* Grid container to prevent truncation on mobile & tablet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {zoneList.map((zone) => {
                const occupancyRate = zone.total > 0 ? zone.occupied / zone.total : 0;
                const percentage = Math.round(occupancyRate * 100);

                let barColor = 'bg-blue-600';
                if (occupancyRate >= 0.8) barColor = 'bg-red-500';
                else if (occupancyRate >= 0.6) barColor = 'bg-amber-500';
                else barColor = 'bg-emerald-500';

                return (
                  <div 
                    key={zone.id} 
                    className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col gap-3 select-none hover:shadow-md hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="font-bold text-[#0F172A]">{zone.name}</span>
                      <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg text-xs">
                        {zone.available} trống
                      </span>
                    </div>

                    <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-[#64748B] font-medium">
                      <span>{zone.occupied}/{zone.total} xe đỗ</span>
                      <span>{percentage}% sử dụng</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick AI chat widget (Mobile only) */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4 md:hidden shadow-sm">
            <div className="flex items-center gap-2 text-[14px] font-bold text-[#0F172A]">
              <MessageSquare size={18} className="text-[#2563EB]" />
              <span>Hỏi đáp nhanh AI</span>
            </div>
            
            {/* Tap input to navigate to /ai-assistant */}
            <div 
              onClick={() => navigate('/ai-assistant')}
              className="w-full flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#94A3B8] text-[13px] cursor-pointer hover:bg-[#F1F5F9] transition-all duration-200 shadow-inner"
            >
              Hỏi AI về bãi xe...
            </div>

            {/* Inline suggested questions */}
            <div className="flex flex-col gap-2">
              {[
                "Còn bao nhiêu chỗ trống hiện tại?",
                "Zone nào đang có nhiều chỗ nhất?",
                "Giờ cao điểm hôm nay là lúc nào?"
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuestionClick(q)}
                  className="w-full text-left text-[12px] text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] border border-[#E2E8F0] rounded-xl px-4 py-2.5 transition-all duration-200 font-medium bg-[#FFFFFF] shadow-sm hover:border-blue-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (AI Chat - Visible on Desktop only, >768px) */}
        <div className="hidden md:flex md:col-span-5 flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden h-[calc(100vh-var(--topbar-height)-90px)] min-h-[480px] shadow-sm">
          {/* Header chatbox */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E2E8F0] bg-[#FFFFFF] select-none shrink-0">
            <div className="w-8 h-8 rounded-md bg-[#EFF6FF] flex items-center justify-center font-bold text-[#2563EB] text-[15px] shrink-0 border border-[#E2E8F0]">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[#0F172A] text-[14px]">ParkAI Portal</span>
              <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                <span>Tư vấn thời gian thực</span>
              </div>
            </div>
          </div>

          {/* Message scroll log container */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-[#F8FAFC] flex flex-col gap-4 min-h-0">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6 my-auto select-none">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center font-bold text-[#2563EB] text-[20px] border border-[#E2E8F0] mb-3">
                  P
                </div>
                <div className="text-[11px] font-semibold text-[#94A3B8] tracking-[0.15em] uppercase mb-1">
                  PARKING INTELLIGENCE
                </div>
                <div className="text-[13px] text-[#475569] max-w-[200px] leading-[1.6]">
                  Hãy hỏi tôi bất kỳ câu hỏi nào về Zone A, B, C!
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <ChatMessage key={i} {...msg} />
                ))}
                {chatLoading && messages[messages.length - 1]?.content === '' && (
                  <TypingIndicator />
                )}
              </>
            )}
          </div>

          {/* Inline Chat Input */}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => handleSend()}
            onClear={messages.length > 0 ? clearHistory : null}
            loading={chatLoading}
          />
        </div>

      </div>
    </div>
  );
}

