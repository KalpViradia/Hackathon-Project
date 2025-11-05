'use client'

import { useState, useEffect } from 'react'
import { X, Send } from 'lucide-react'
import api from '../lib/api'

export default function ShareModal({ postId, onClose }) {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchFollowing()
  }, [])

  const fetchFollowing = async () => {
    try {
      const response = await api.get('/user/following/list')
      setUsers(response.data.following || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleShare = async () => {
    if (selectedUsers.length === 0) return

    setSharing(true)
    try {
      // Share with each selected user
      await Promise.all(
        selectedUsers.map(userId =>
          api.post('/messages', {
            receiver: userId,
            content: `Shared a post with you: ${window.location.origin}/posts/${postId}`
          })
        )
      )
      
      alert(`Post shared with ${selectedUsers.length} user(s)!`)
      onClose()
    } catch (error) {
      console.error('Error sharing post:', error)
      alert('Failed to share post. Please try again.')
    } finally {
      setSharing(false)
    }
  }

  const copyLink = () => {
    const postUrl = `${window.location.origin}/posts/${postId}`
    navigator.clipboard.writeText(postUrl)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Share Post
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copy Link Option */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <button
            onClick={copyLink}
            className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Copy Link
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share via link
            </p>
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-64">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="px-4 space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleUserSelection(user._id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.includes(user._id)
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.username?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {user.username}
                    </h3>
                    {user.bio && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  {selectedUsers.includes(user._id) && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No users found' : 'No users to share with'}
              </p>
            </div>
          )}
        </div>

        {/* Share Button */}
        {selectedUsers.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>
                {sharing 
                  ? 'Sharing...' 
                  : `Share with ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`
                }
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}