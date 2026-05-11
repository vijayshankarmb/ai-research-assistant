import React from 'react';
import type { ChatMessageType } from '@/types/chat';

const ChatMessage: React.FC<ChatMessageType> = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${isUser ? 'bg-neutral-200 text-neutral-800 rounded-br-none shadow-sm' : ' text-neutral-800 rounded-bl-none'}`}>
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
