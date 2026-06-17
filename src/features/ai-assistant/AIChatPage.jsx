/**
 * AIChatPage.jsx — Redesigned AI Assistant page.
 * Displays the chat screen utilizing custom subcomponents and the useChat hook.
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useChat } from './hooks/useChat';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';

// Inline CSS style block for keyframe animations (progress bar and pulsing dot)
const styleBlock = `
@keyframes indeterminate-progress {
  0% { left: -35%; right: 100%; }
  60% { left: 100%; right: -90%; }
  100% { left: 100%; right: -90%; }
}
.animate-progress {
  animation: indeterminate-progress 1.5s infinite linear;
}

@keyframes gentle-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.95); }
}
.animate-pulse-dot {
  animation: gentle-pulse 2s infinite ease-in-out;
}
`;

export default function AIChatPage() {
  const location = useLocation();
  const {
    messages,
    input,
    setInput,
    loading,
    handleSend,
    clearHistory,
    handleSuggestedClick
  } = useChat();

  const bottomRef = useRef(null);
  const initializedRef = useRef(false);

  // Handle initial message passed in location state
  useEffect(() => {
    if (location.state?.initialMessage && !initializedRef.current) {
      initializedRef.current = true;
      handleSend(location.state.initialMessage);
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleSend]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="page-container h-[calc(100vh-var(--topbar-height)-120px)] flex flex-col gap-4 animate-fade-in text-[14px] leading-[1.6]">
      <style>{styleBlock}</style>
      
      {/* Page Title */}
      <div>
        <h2 className="text-[15px] font-semibold text-[#0F172A]">Trợ lý ảo ParkAI</h2>
        <p className="text-[#475569] text-[13px] mt-0.5">
          Tra cứu vị trí trống, phân tích lưu lượng, dự đoán khung giờ cao điểm và dọn dẹp lịch sử tiện lợi.
        </p>
      </div>

      {/* Main Chat Interface Widget (Max 12px border radius, no dark shadow, flat border) */}
      <div className="flex-1 flex flex-col bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden min-h-0">
        
        {/* Header chatbox */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#FFFFFF] select-none shrink-0">
          {/* Left: Avatar + Name + Online badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#EFF6FF] flex items-center justify-center font-bold text-[#2563EB] text-[15px] shrink-0 border border-[#E2E8F0]">
              P
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-semibold text-[#0F172A] text-[14px]">ParkAI</span>
                <span className="text-[12px] text-[#94A3B8] font-normal px-1.5 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                  Powered by AWS Bedrock
                </span>
              </div>
              <div className="flex items-center gap-1 text-[12px] text-[#475569]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]"></span>
                </span>
                <span>Online</span>
              </div>
            </div>
          </div>
          
          {/* Right: stats */}
          <div className="text-[13px] text-[#475569] font-medium hidden sm:block">
            73 slots available <span className="text-[#94A3B8] mx-1">•</span> Zone B has most space
          </div>
        </div>

        {/* Message scroll area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 bg-[#F8FAFC] flex flex-col gap-4 min-h-0">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center p-6 my-auto select-none w-full">
              <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center font-bold text-[#2563EB] text-[22px] border border-[#E2E8F0] mb-4 animate-fade-in">
                P
              </div>
              <div className="text-[11px] font-semibold text-[#94A3B8] tracking-[0.15em] uppercase mb-2 animate-fade-in">
                PARKING INTELLIGENCE
              </div>
              <div className="text-[15px] text-[#475569] max-w-sm leading-[1.6] mb-8 animate-fade-in">
                Ask me anything about Zone A, B, C — availability, forecasts, peak hours.
              </div>

              {/* 2x2 Grid Suggested Questions */}
              <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
                <button
                  onClick={() => handleSuggestedClick("Còn bao nhiêu chỗ trống hiện tại?")}
                  className="flex items-center gap-2 px-4 py-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#475569] hover:bg-[#F1F5F9] transition-all text-left font-medium active:scale-[0.98] select-none"
                >
                  <span className="text-[#2563EB]">🅿</span>
                  <span>Còn bao nhiêu chỗ trống?</span>
                </button>
                <button
                  onClick={() => handleSuggestedClick("Zone nào đang có nhiều chỗ nhất?")}
                  className="flex items-center gap-2 px-4 py-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#475569] hover:bg-[#F1F5F9] transition-all text-left font-medium active:scale-[0.98] select-none"
                >
                  <span className="text-[#2563EB]">🗺</span>
                  <span>Zone nào nhiều chỗ nhất?</span>
                </button>
                <button
                  onClick={() => handleSuggestedClick("Giờ cao điểm hôm nay là lúc nào?")}
                  className="flex items-center gap-2 px-4 py-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#475569] hover:bg-[#F1F5F9] transition-all text-left font-medium active:scale-[0.98] select-none"
                >
                  <span className="text-[#2563EB]">📊</span>
                  <span>Giờ cao điểm hôm nay?</span>
                </button>
                <button
                  onClick={() => handleSuggestedClick("Dự báo bãi xe lúc 5 giờ chiều thế nào?")}
                  className="flex items-center gap-2 px-4 py-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#475569] hover:bg-[#F1F5F9] transition-all text-left font-medium active:scale-[0.98] select-none"
                >
                  <span className="text-[#2563EB]">🔮</span>
                  <span>Dự báo lúc 5 giờ chiều?</span>
                </button>
              </div>
            </div>
          ) : (
            /* Chat message logs */
            <>
              {messages.map((msg, i) => (
                <ChatMessage key={i} {...msg} />
              ))}
              {loading && messages[messages.length - 1]?.content === '' && (
                <TypingIndicator />
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input box + send controls */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          onClear={messages.length > 0 ? clearHistory : null}
          loading={loading}
        />

      </div>
    </div>
  );
}
