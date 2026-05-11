'use client'

import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const Home = () => {
  const [message, setMessage] = useState<string>('')
  const [aiResponse, setAiResponse] = useState<string>('')

  const handleAsk = async () => {
    try {
      const res = await axios.post('http://localhost:8000/chat', {
        query: message
      })
      setAiResponse(res.data.response)
    } catch (error) {
      console.log(error)
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
      />
      <button
      onClick={handleAsk}
      className='bg-black text-white px-4 py-2 rounded'
      >Ask</button>
      <p>Ai: {aiResponse}</p>
    </div>
  )
}

export default Home

