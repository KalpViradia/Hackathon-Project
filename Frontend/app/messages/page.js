'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import Sidebar from '../components/Sidebar'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import { MessageCircle } from 'lucide-react'
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates'
import api from '../lib/api'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages')
      const newConversations = response.data || []
      
      // Only update if conversations have changed
      if (JSON.stringify(newConversations) !== JSON.stringify(conversations)) {
        setConversations(newConversations)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Set up real-time updates for conversations
  useRealTimeUpdates(fetchConversations, 3000, [conversations])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        
        <main className="flex-1 ml-64 flex">
          {/* Chat List */}
          <div className="w-80 border-r border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
            <div className="p-4 border-b border-gray-200 dark:border-dark-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Messages
              </h1>
            </div>
            
            <ChatList
              conversations={conversations}
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
              loading={loading}
            />
          </div>

          {/* Chat Window */}
          <div className="flex-1">
            {selectedChat ? (
              <ChatWindow conversation={selectedChat} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Select a conversation
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}