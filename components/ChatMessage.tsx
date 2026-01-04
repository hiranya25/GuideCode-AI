
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  const parseStructuredContent = (text: string) => {
    // Split text by the specific mentor headers
    const sections = text.split(/(?=### \d\. |### PSEUDO STEPS)/g);
    
    if (sections.length <= 1 && !text.includes('###')) {
      return <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{text}</p>;
    }

    return (
      <div className="space-y-4">
        {sections.map((section, idx) => {
          const lines = section.trim().split('\n');
          const headerLine = lines[0];
          const contentLines = lines.slice(1);

          if (headerLine.startsWith('###')) {
            const title = headerLine.replace(/^### \d\. |^### /, '').trim();
            const icon = getIconForSection(title);
            
            return (
              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{icon}</span>
                  <h4 className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider">
                    {title}
                  </h4>
                </div>
                <div className="text-sm text-slate-700 space-y-2">
                  {contentLines.map((line, lIdx) => renderLine(line, lIdx))}
                </div>
              </div>
            );
          }
          
          return section.trim() ? (
            <div key={idx} className="text-sm text-slate-600 mb-2">
              {lines.map((line, lIdx) => renderLine(line, lIdx))}
            </div>
          ) : null;
        })}
      </div>
    );
  };

  const getIconForSection = (title: string) => {
    const t = title.toUpperCase();
    if (t.includes('UNDERSTANDING')) return '📖';
    if (t.includes('APPROACH')) return '💡';
    if (t.includes('HINTS')) return '🗝️';
    if (t.includes('EDGE')) return '🧪';
    if (t.includes('COMPLEXITY')) return '⚡';
    if (t.includes('PSEUDO')) return '🪜';
    return '✨';
  };

  const renderLine = (line: string, key: number) => {
    const trimmed = line.trim();
    if (!trimmed) return null;

    // Handle bold text
    let content: React.ReactNode = trimmed;
    if (trimmed.includes('**')) {
      const parts = trimmed.split('**');
      content = parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : part
      );
    }

    // List items
    if (trimmed.match(/^\d+\./) || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <div key={key} className="flex gap-2 ml-1 items-start">
          <span className="text-indigo-400 font-bold">•</span>
          <span className="flex-1">{content.toString().replace(/^\d+\.\s|[-*]\s/, '')}</span>
        </div>
      );
    }

    return <p key={key} className="leading-relaxed">{content}</p>;
  };

  return (
    <div className={`flex w-full mb-6 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[95%] md:max-w-[85%] px-5 py-4 rounded-2xl shadow-md border ${
        isAssistant 
          ? 'bg-white border-slate-200 rounded-tl-none' 
          : 'bg-indigo-600 border-indigo-700 text-white rounded-tr-none'
      }`}>
        <div className={`flex justify-between items-center mb-3 ${isAssistant ? 'text-indigo-600' : 'text-indigo-100'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${isAssistant ? 'bg-indigo-100' : 'bg-indigo-500'}`}>
              {isAssistant ? 'M' : 'U'}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {isAssistant ? 'Mentor Response' : 'User Query'}
            </span>
          </div>
          <span className="text-[9px] opacity-60">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className={!isAssistant ? 'text-white' : ''}>
          {isAssistant ? parseStructuredContent(message.content) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
