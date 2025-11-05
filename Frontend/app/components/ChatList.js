'use client'

export default function ChatList({ conversations, selectedChat, onSelectChat, loading }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 dark:bg-dark-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto">
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          <div
            key={conversation._id}
            onClick={() => onSelectChat(conversation)}
            className={`p-4 border-b border-gray-100 dark:border-dark-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
              selectedChat?._id === conversation._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                U
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    User {conversation._id}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(conversation.lastMessageAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {conversation.lastMessage || 'No messages yet'}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
        </div>
      )}
    </div>
  )
}