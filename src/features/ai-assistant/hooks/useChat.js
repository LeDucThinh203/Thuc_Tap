/**
 * useChat.js — Hook for managing chat state, sending messages,
 * mock streaming, and injecting real-time parking slot context.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { streamMessage } from 'services/aiService';
import { useParkingData } from 'hooks/useParkingData';

const SESSION_KEY = 'sp-chat-history';

export function useChat() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);
  
  // Get real-time parking data for context injection
  const { stats, zones } = useParkingData();

  // Save to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
  }, [messages]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const handleSend = useCallback(async (customText) => {
    const text = (typeof customText === 'string' ? customText : input).trim();
    if (!text || loading) return;

    if (typeof customText !== 'string') {
      setInput('');
    }

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    const userMsg = {
      role: 'user',
      content: text,
      timestamp
    };

    const botMsg = {
      role: 'assistant',
      content: '',
      timestamp
    };

    // Update messages to include both user and empty bot message for streaming
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setLoading(true);

    const isMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

    // Construct context payload to help AI answer accurately
    const totalSlots = stats?.total ?? 200;
    const availableSlots = stats?.available ?? 73;
    const occupiedSlots = stats?.occupied ?? 127;
    const zoneA_avail = zones?.find(z => z.id === 'A')?.available ?? 12;
    const zoneA_total = zones?.find(z => z.id === 'A')?.total ?? 50;
    const zoneB_avail = zones?.find(z => z.id === 'B')?.available ?? 35;
    const zoneB_total = zones?.find(z => z.id === 'B')?.total ?? 80;
    const zoneC_avail = zones?.find(z => z.id === 'C')?.available ?? 26;
    const zoneC_total = zones?.find(z => z.id === 'C')?.total ?? 70;

    const parkingContext = `[REALTIME CONTEXT: Total slots = ${totalSlots}, Available slots = ${availableSlots}, Occupied = ${occupiedSlots}. Zone A: ${zoneA_avail}/${zoneA_total} available. Zone B: ${zoneB_avail}/${zoneB_total} available. Zone C: ${zoneC_avail}/${zoneC_total} available.]`;

    if (isMock) {
      // Simulate mock response
      let mockReply = "";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("bao nhiêu chỗ trống") || lowerText.includes("available now") || lowerText.includes("chỗ trống hiện tại")) {
        mockReply = `Hiện tại hệ thống ghi nhận còn **${availableSlots} chỗ trống** trên tổng số **${totalSlots} ô đỗ**.\n\nThông tin chi tiết từng phân khu:\n[DATA:Zone A|${zoneA_avail}|${zoneA_total}]\n[DATA:Zone B|${zoneB_avail}|${zoneB_total}]\n[DATA:Zone C|${zoneC_avail}|${zoneC_total}]`;
      } else if (lowerText.includes("nhiều chỗ nhất") || lowerText.includes("zone nào") || lowerText.includes("nhiều chỗ trống nhất")) {
        // Find zone with most slots available
        const availList = [
          { name: 'Khu B (Zone B)', avail: zoneB_avail, total: zoneB_total },
          { name: 'Khu C (Zone C)', avail: zoneC_avail, total: zoneC_total },
          { name: 'Khu A (Zone A)', avail: zoneA_avail, total: zoneA_total },
        ].sort((a, b) => b.avail - a.avail);

        mockReply = `Phân khu đang còn nhiều chỗ trống nhất hiện tại là **${availList[0].name}** với **${availList[0].avail} chỗ trống**.\n\nSơ đồ phân khu tiêu biểu:\n[DATA:Zone B|${zoneB_avail}|${zoneB_total}]\nBạn có thể hướng dẫn các xe di chuyển vào phân khu này để tối ưu hóa chỗ đỗ.`;
      } else if (lowerText.includes("cao điểm") || lowerText.includes("peak")) {
        mockReply = "Dựa trên dữ liệu cảm biến lưu lượng, **khung giờ cao điểm hôm nay là từ 08:00 - 09:00 AM** với tỉ lệ lấp đầy bãi đạt đỉnh **92%**.\n\n- Khung giờ này thường tập trung nhiều xe công sở và giao hàng.\n- Khuyến nghị điều phối nhân sự tăng cường giám sát tại lối vào chính trong khung giờ này.";
      } else if (lowerText.includes("dự báo") || lowerText.includes("5 giờ") || lowerText.includes("5pm") || lowerText.includes("5 chiều")) {
        mockReply = "Mô hình dự báo AI cho thấy lúc **05:00 PM chiều nay**:\n- **Zone A**: Đạt mức **94%** (Rất đông xe tan ca).\n- **Zone B**: Đạt mức **75%** (Mức trung bình).\n- **Zone C**: Đạt mức **85%** (Khá đông).\n\nKhuyến nghị điều hướng các phương tiện mới vào khu vực **Zone B** để giảm tải ùn tắc lối ra.";
      } else {
        mockReply = `Xin chào! Tôi đã nhận được câu hỏi: "${text}".\n\nHệ thống đỗ xe hiện ghi nhận:\n- Còn trống: **${availableSlots} chỗ**\n- Đang sử dụng: **${occupiedSlots} chỗ**\n\nBạn có muốn tìm hiểu chi tiết về sơ đồ các Zone hay dự báo khung giờ cao điểm tiếp theo không?`;
      }

      let currentLen = 0;
      const interval = setInterval(() => {
        const chunkSize = Math.floor(Math.random() * 5) + 3;
        currentLen += chunkSize;
        
        if (currentLen >= mockReply.length) {
          currentLen = mockReply.length;
          clearInterval(interval);
          setLoading(false);
        }

        const currentText = mockReply.substring(0, currentLen);
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: currentText
            };
          }
          return updated;
        });
      }, 30);

      return;
    }

    // Live backend mode with Bedrock/Haiku
    abortRef.current = new AbortController();
    try {
      // Prepend context to the current prompt message to supply stats to the model
      const contextualMessage = `${parkingContext}\nUser Query: ${text}`;
      
      // Filter out timestamps and format conversation history for Bedrock API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      await streamMessage(
        contextualMessage,
        conversationHistory,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + chunk,
              };
            }
            return updated;
          });
        },
        abortRef.current.signal
      );
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: 'Xin lỗi, đã xảy ra lỗi kết nối với hệ thống ParkAI. Vui lòng thử lại.',
            };
          }
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, stats, zones]);

  const handleSuggestedClick = useCallback((questionText) => {
    handleSend(questionText);
  }, [handleSend]);

  return {
    messages,
    input,
    setInput,
    loading,
    handleSend,
    clearHistory,
    handleSuggestedClick
  };
}
