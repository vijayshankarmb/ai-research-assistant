import React from 'react';
import type { ChatMessageType } from '@/types/chat';

const ChatMessage: React.FC<ChatMessageType> = ({ role, content, sources }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${isUser ? 'bg-neutral-200 text-neutral-800 rounded-br-none shadow-sm' : ' text-neutral-800 rounded-bl-none'}`}>
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        {sources && sources.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Sources: {sources.map((s) => `Page ${s}`).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
