'use client'

import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import type { ChatMessageType } from '@/types/chat'

const Home = () => {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleAsk = async () => {
    if (!message.trim()) return
    try {
      setMessages((prev) => [...prev, {role: "user", content: message}])
      setIsLoading(true)
      setMessage('')
      const res = await axios.post('http://localhost:8000/chat', {
        query: message
      })
      setMessages((prev)=>[...prev, {role: 'assistant', content: res.data.response}])
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-center items-center z-10 shrink-0">
        <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl flex flex-col gap-2 pb-4">
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
              <ChatMessage key={index} role={msg.role} content={msg.content} />
            ))
          )}
          
          {isLoading && (
            <div className="flex w-full justify-start mb-4">
              <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-1 shadow-sm max-w-[80%]">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <ChatInput 
          message={message} 
          setMessage={setMessage} 
          handleAsk={handleAsk} 
          isLoading={isLoading} 
        />
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">AI can make mistakes. Consider verifying important information.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
