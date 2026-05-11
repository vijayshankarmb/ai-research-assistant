'use client'

import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const Home = () => {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
    <div>
      <h1>Home Page</h1>
      <input
        type="text"
        placeholder='Ask anything'
        className='border rounded p-2 w-full max-w-md'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
      />
      <button
      onClick={handleAsk}
      className={`bg-black text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isLoading}
      >Ask</button> 

      {isLoading && <p>Thinking...</p>}

      {messages.map((msg, index)=> (
        <p key={index}>
          <strong>{msg.role}:{' '}</strong>
          {msg.content}
        </p>
      ))}
    </div>
  )
}

export default Home

