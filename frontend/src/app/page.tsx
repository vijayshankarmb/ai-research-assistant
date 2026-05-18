'use client'

import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import type { ChatMessageType } from '@/types/chat'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar'

const Home = () => {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [mode, setMode] = useState<"chat" | "rag">("chat")
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
  const [sessions, setSessions] = useState<{session_id: string, title: string}[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:8000/me', { withCredentials: true });
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/sessions", {
        withCredentials: true
      });
      setSessions(response.data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (isLoggedIn === true) {
        try {
          const response = await axios.get("http://localhost:8000/sessions", {
            withCredentials: true
          });
          const data = response.data;
          setSessions(data);
          
          if (data.length > 0) {
            const latest = data[data.length - 1];
            setSessionId(latest.session_id);
            const msgRes = await axios.get(`http://localhost:8000/sessions/${latest.session_id}/messages`, {
              withCredentials: true
            });
            setMessages(msgRes.data);
          } else {
             const createRes = await axios.post("http://localhost:8000/sessions", {}, { withCredentials: true });
             setSessionId(createRes.data.session_id);
             setMessages([]);
             const refresh = await axios.get("http://localhost:8000/sessions", { withCredentials: true });
             setSessions(refresh.data);
          }
        } catch (error) {
          console.error("Failed to initialize session", error);
        }
      }
    };
    init();
  }, [isLoggedIn]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleAsk = async () => {
    if (!message.trim()) return;

    if (isLoggedIn === false) {
      router.push('/login');
      return;
    }

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" }
    ]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: userMessage,
          mode,
          session_id: sessionId
        }),
      });

      const reader = response.body?.getReader();

      if (!reader) return;

      const decoder = new TextDecoder();

      let done = false;
      let fullText = "";

      while (!done) {
        const result = await reader.read();

        done = result.done;

        const chunk = decoder.decode(result.value || new Uint8Array());

        fullText += chunk;

        const sourceIndex = fullText.indexOf("__SOURCES__:");
        const content = sourceIndex !== -1 ? fullText.substring(0, sourceIndex) : fullText;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: content,
            sources: [],
          };
          return updated;
        });
      }

      const finalSourceIndex = fullText.indexOf("__SOURCES__:");
      let cleanText = fullText;
      let parsedSources = [];

      if (finalSourceIndex !== -1) {
        cleanText = fullText.substring(0, finalSourceIndex);
        const sourcesJsonStr = fullText.substring(finalSourceIndex + "__SOURCES__:".length);
        try {
          parsedSources = JSON.parse(sourcesJsonStr);
        } catch (err) {
          console.error("Error parsing sources", err);
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: cleanText,
          sources: parsedSources,
        };
        return updated;
      });
    } catch (error) {
      console.log(error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, seems like there's an Error",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      fetchSessions();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {isLoggedIn === null ? (
        <div className="w-72 bg-[#F9FAFB] border-r border-gray-200 h-screen flex flex-col flex-shrink-0 hidden md:flex">
          <div className="p-4 border-b border-gray-200">
            <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-full"></div>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-3 mt-2">
            <div className="h-4 bg-gray-200 animate-pulse w-24 rounded"></div>
            <div className="h-10 bg-gray-200 animate-pulse w-full rounded-lg"></div>
            <div className="h-10 bg-gray-200 animate-pulse w-full rounded-lg"></div>
            <div className="h-10 bg-gray-200 animate-pulse w-full rounded-lg"></div>
          </div>
        </div>
      ) : isLoggedIn === true ? (
        <>
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-20 md:hidden" 
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          {/* Sidebar container */}
          <div className={`fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex`}>
            <Sidebar
              sessions={sessions}
              setSessionId={setSessionId}
              fetchSessions={fetchSessions}
              setMessages={setMessages}
              onCloseMobile={() => setIsSidebarOpen(false)}
            />
          </div>
        </>
      ) : null}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 py-3 md:py-4 px-4 md:px-6 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          {isLoggedIn === true && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 text-gray-600 hover:text-black rounded-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          )}
          <h1 className="text-lg md:text-xl font-bold text-gray-800">AI Assistant</h1>
        </div>
        <div className="flex gap-2">
          {isLoggedIn === null && (
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-md"></div>
          )}
          {isLoggedIn === true && (
            <button 
              onClick={handleLogout} 
              className="text-sm font-medium text-gray-600 hover:text-black border border-gray-300 rounded-md px-3 py-1.5 transition-colors hover:bg-gray-50"
            >
              Logout
            </button>
          )}
          {isLoggedIn === false && (
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-600 hover:text-black border border-gray-300 rounded-md px-3 py-1.5 transition-colors hover:bg-gray-50"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="text-sm font-medium text-white bg-black hover:bg-gray-800 border border-transparent rounded-md px-3 py-1.5 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl flex flex-col gap-3 md:gap-4 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-32">
              <div className="w-16 h-16 bg-blue-100 text-neutral-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">How can I help you today?</h2>
              <p className="text-center max-w-md">Ask me anything, I'm here to assist you with your tasks and questions.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} content={msg.content} sources={msg.sources}/>
            ))
          )}
         
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 p-3 md:p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <ChatInput
          message={message}
          setMessage={setMessage}
          handleAsk={handleAsk}
          isLoading={isLoading}
          mode={mode}
          setMode={setMode}
          sessionId={sessionId}
        />
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">AI can make mistakes. Consider verifying important information.</p>
        </div>
      </footer>
      </div>
    </div>
  )
}

export default Home
