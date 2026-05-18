import React from 'react'
import axios from 'axios'

interface SidebarProps {
    sessions: {
        session_id: string
        title: string
    }[]
    setSessionId: (id: string) => void
    fetchSessions: () => void
    setMessages: React.Dispatch<React.SetStateAction<any[]>>
}

const Sidebar = ({
    sessions,
    setSessionId,
    fetchSessions,
    setMessages
}: SidebarProps) => {

    const handleNewChat = async () => {
        try {
            const res = await axios.post(
                'http://localhost:8000/sessions',
                {},
                { withCredentials: true }
            )
            setSessionId(res.data.session_id)
            setMessages([])
            fetchSessions()
        } catch (error) {
            console.log(error)
        }
    }

    const loadSession = async (sessionId: string) => {
        try {
            const res = await axios.get(
                `http://localhost:8000/sessions/${sessionId}/messages`,
                { withCredentials: true }
            )
            setSessionId(sessionId)
            setMessages(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-72 bg-[#F9FAFB] border-r border-gray-200 h-screen flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-200">
                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Recent Chats</div>
                <div className="flex flex-col gap-1">
                    {sessions.map((session) => (
                        <button
                            key={session.session_id}
                            onClick={() => loadSession(session.session_id)}
                            className="flex items-center gap-3 text-left w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-white hover:shadow-sm hover:text-black border border-transparent hover:border-gray-200 transition-all truncate"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            <span className="truncate">{session.title || 'New Conversation'}</span>
                        </button>
                    ))}
                    {sessions.length === 0 && (
                        <div className="text-sm text-gray-500 italic px-2">No recent chats</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Sidebar