import React, { useRef, useState } from 'react';
import { ArrowUp, Square, Plus, Loader2, FileText, X } from 'lucide-react';
import axios from 'axios';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleAsk: () => void;
  isLoading: boolean;
  mode: "chat" | "rag";
  setMode: (mode: "chat" | "rag") => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, handleAsk, isLoading, mode, setMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:8000/upload-pdf", formData);
      setUploadedFileName(file.name);
    } catch (error) {
      console.log(error);
      alert("Failed to upload PDF");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input to allow re-uploading the same file
      }
    }
  };

  const removeFile = () => {
    setUploadedFileName(null);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto">
      <div className="flex gap-2 mb-2 ml-2">
        <button
          onClick={() => setMode("chat")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            mode === "chat"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setMode("rag")}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            mode === "rag"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          PDF Chat
        </button>
      </div>

      {uploadedFileName && (
        <div className="flex items-center gap-2 bg-neutral-100 text-neutral-800 px-3 py-2 rounded-xl w-max shadow-sm border border-neutral-200 ml-4">
          <FileText size={16} className="text-blue-500" />
          <span className="text-sm font-medium truncate max-w-[200px]">{uploadedFileName}</span>
          <button 
            onClick={removeFile}
            className="p-1 hover:bg-neutral-200 rounded-full transition-colors ml-1"
            title="Remove file"
          >
            <X size={14} className="text-neutral-500" />
          </button>
        </div>
      )}
      <div className="flex gap-3 w-full items-center relative">
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isLoading}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          title="Upload PDF"
        >
          {isUploading ? <Loader2 size={20} className="animate-spin text-neutral-600" /> : <Plus size={20} />}
        </button>

        <input
          type="text"
          placeholder="Message AI Assistant..."
          className="flex-1 border border-gray-300 rounded-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-500 shadow-sm transition-shadow"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading && message.trim()) {
              handleAsk();
            }
          }}
          disabled={isLoading || isUploading}
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
    </div>
  );
};

export default ChatInput;
