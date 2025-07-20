'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MoreVertical } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'
import api from '../lib/api'

export default function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    if (conversation) {
      fetchMessages()
      // Set up polling for real-time messages
      const interval = setInterval(fetchMessages, 2000)
      return () => clearInterval(interval)
    }
  }, [conversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/${conversation._id}`)
      const newMessages = response.data || []
      
      // Only update if messages have changed to prevent unnecessary re-renders
      if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
        setMessages(newMessages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    // Optimistic update - add message immediately
    const optimisticMessage = {
      _id: Date.now().toString(),
      content: messageText,
      sender: user?.id,
      receiver: conversation._id,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    }
    
    setMessages(prev => [...prev, optimisticMessage])

    try {
      const response = await api.post('/messages', {
        receiver: conversation._id,
        content: messageText
      })
      
      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.isOptimistic && msg.content === messageText 
            ? response.data.messageData 
            : msg
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => !msg.isOptimistic))
      setNewMessage(messageText) // Restore message on error
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-800">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="avatar w-10 h-10">
              {conversation.avatar?.url ? (
                <img
                  src={conversation.avatar.url}
                  alt={conversation.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                conversation.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="content-container">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-truncate">
                {conversation.username || 'Unknown User'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-truncate">
                @{conversation.username}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-dark-900"
      >
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const isOwn = message.sender === user?.id
            const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.sender !== message.sender)
            
            return (
              <div
                key={message._id}
                className={`flex items-end space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwn && (
                  <div className="avatar w-8 h-8 mb-1" style={{ visibility: showAvatar ? 'visible' : 'hidden' }}>
                    {conversation.avatar?.url ? (
                      <img
                        src={conversation.avatar.url}
                        alt={conversation.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      conversation.username?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                )}
                
                <div
                  className={`message-bubble ${
                    isOwn ? 'message-sent' : 'message-received'
                  } ${message.isOptimistic ? 'opacity-70' : ''}`}
                >
                  <p className="text-sm text-wrap leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                    {message.isOptimistic && ' • Sending...'}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12">
            <div className="avatar w-16 h-16 mx-auto mb-4 text-2xl">
              {conversation.avatar?.url ? (
                <img
                  src={conversation.avatar.url}
                  alt={conversation.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                conversation.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {conversation.username}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Start a conversation with {conversation.username}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-dark-600 rounded-2xl bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32 min-h-[48px]"
              rows="1"
              style={{ 
                height: 'auto',
                minHeight: '48px',
                maxHeight: '128px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
              }}
            />
            <div className="absolute right-2 bottom-2">
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className={`p-2 rounded-full transition-all duration-200 ${
                  newMessage.trim() && !sending
                    ? 'bg-primary-500 text-white hover:bg-primary-600 hover:scale-105'
                    : 'bg-gray-300 dark:bg-dark-600 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className={`w-4 h-4 ${sending ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  )
}