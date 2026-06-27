/**
 * ChatMessage.jsx — Chat bubble rendering component.
 * Supports Markdown formatting (bold, lists), timestamp, and custom B2B statistics card.
 */
import React from 'react';

// Helper component for message inline statistics card
function ParkingStatCard({ zone, available, total }) {
  const occupied = total - available;
  const pct = Math.round((occupied / total) * 100);
  
  const blockCount = Math.round(pct / 10);
  const filledBlocks = '█'.repeat(blockCount);
  const emptyBlocks = '░'.repeat(10 - blockCount);
  
  return (
    <div className="my-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg max-w-[240px] font-mono text-[13px] text-[#475569] leading-relaxed select-none">
      <div className="flex items-center gap-1 font-semibold text-[#0F172A] mb-1">
        <span className="text-[#2563EB]">🅿</span>
        <span>{zone}</span>
      </div>
      <div className="text-[13px] text-[#475569] mb-1">
        {available} / {total} available
      </div>
      <div className="flex items-center gap-1.5 text-[12px] text-[#94A3B8]">
        <span className="text-[#2563EB] tracking-tight">{filledBlocks}</span>
        <span className="tracking-tight text-[#E2E8F0]">{emptyBlocks}</span>
        <span className="text-[#475569] font-medium text-xs ml-0.5">{pct}%</span>
      </div>
    </div>
  );
}

// Markdown parser helper
function parseMarkdown(text) {
  if (!text) return '';
  
  const lines = text.split('\n');
  const elements = [];
  
  let inList = false;
  let listItems = [];
  
  const flushList = (key) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 my-2 space-y-1">
          {listItems}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };
  
  lines.forEach((line, idx) => {
    const listMatch = line.match(/^[-*+]\s+(.*)/);
    if (listMatch) {
      inList = true;
      listItems.push(
        <li key={`li-${idx}`}>
          {renderInlineFormatting(listMatch[1])}
        </li>
      );
    } else {
      if (inList) {
        flushList(idx);
      }
      
      if (line.trim() === '') {
        elements.push(<div key={`br-${idx}`} className="h-2" />);
      } else {
        elements.push(
          <p key={`p-${idx}`} className="mb-1.5 last:mb-0">
            {renderInlineFormatting(line)}
          </p>
        );
      }
    }
  });
  
  if (inList) {
    flushList('final');
  }
  
  return elements;
}

function renderInlineFormatting(text) {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = boldRegex.exec(text)) !== null) {
    const startIndex = match.index;
    if (startIndex > lastIndex) {
      parts.push(text.substring(lastIndex, startIndex));
    }
    parts.push(<strong key={startIndex} className="font-semibold text-[#0F172A]">{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

// Main parser to extract ASCII data cards and render Markdown
function renderMessageContent(content) {
  if (!content) return null;
  
  const regex = /\[DATA:([^|]+)\|(\d+)\|(\d+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const startIndex = match.index;
    
    // Add text before the card (parsed with markdown)
    if (startIndex > lastIndex) {
      const textChunk = content.substring(lastIndex, startIndex);
      parts.push(
        <React.Fragment key={`md-${lastIndex}`}>
          {parseMarkdown(textChunk)}
        </React.Fragment>
      );
    }
    
    // Add the card
    const zoneName = match[1];
    const available = parseInt(match[2], 10);
    const total = parseInt(match[3], 10);
    parts.push(
      <ParkingStatCard
        key={`card-${startIndex}`}
        zone={zoneName}
        available={available}
        total={total}
      />
    );
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < content.length) {
    const textChunk = content.substring(lastIndex);
    parts.push(
      <React.Fragment key={`md-${lastIndex}`}>
        {parseMarkdown(textChunk)}
      </React.Fragment>
    );
  }
  
  return parts.length > 0 ? parts : parseMarkdown(content);
}

export default function ChatMessage({ role, content, timestamp }) {
  const isBot = role === 'assistant';
  
  if (isBot) {
    return (
      <div className="flex flex-col gap-1 max-w-[85%] self-start animate-fade-in">
        {/* AI display name */}
        <span className="text-[12px] font-semibold text-[#2563EB] ml-1">
          ParkAI
        </span>
        {/* White B2B bubble with blue left border */}
        <div className="bg-[#FFFFFF] border-y border-r border-[#E2E8F0] border-l-[3px] border-l-[#2563EB] rounded-tr-lg rounded-br-lg rounded-bl-lg px-4 py-3 text-[14px] text-[#475569] leading-[1.6]">
          <div className="text-[#475569]">{renderMessageContent(content)}</div>
          {/* Timestamp */}
          <div className="text-right text-[12px] text-[#94A3B8] mt-1 select-none">
            {timestamp}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-1 max-w-[85%] self-end animate-fade-in">
        {/* User blue bubble */}
        <div className="bg-[#2563EB] text-[#FFFFFF] rounded-tl-lg rounded-bl-lg rounded-br-lg px-4 py-3 text-[14px] leading-[1.6]">
          <div className="whitespace-pre-wrap">{content}</div>
          {/* Timestamp */}
          <div className="text-right text-[12px] text-[#EFF6FF]/70 mt-1 select-none">
            {timestamp}
          </div>
        </div>
      </div>
    );
  }
}
