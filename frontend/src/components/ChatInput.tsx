import React from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleAsk: () => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, handleAsk, isLoading }) => {
  return (
    <div className="flex gap-3 w-full max-w-3xl mx-auto items-center relative">
      <input
        type="text"
        placeholder="Message AI Assistant..."
        className="flex-1 border border-gray-300 rounded-full px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-neutral-500 shadow-sm transition-shadow"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isLoading && message.trim()) {
            handleAsk();
          }
        }}
        disabled={isLoading}
      />
      <button
        onClick={handleAsk}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
          isLoading || !message.trim() 
            ? 'text-gray-400 bg-transparent cursor-not-allowed' 
            : 'text-white bg-neutral-900 hover:bg-neutral-600 shadow-sm'
        }`}
        disabled={isLoading || !message.trim()}
      >
        {isLoading ? <Square size={18} fill='black'/> : <ArrowUp size={24}/>}
      </button>
    </div>
  );
};

export default ChatInput;
