'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import api from '../lib/api'

export default function FollowingModal({ onClose }) {
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFollowing()
  }, [])

  const fetchFollowing = async () => {
    try {
      const response = await api.get('/user/following/list')
      setFollowing(response.data.following || [])
    } catch (error) {
      console.error('Error fetching following:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async (userId) => {
    try {
      await api.post(`/user/follow/${userId}`)
      // Remove from local state
      setFollowing(prev => prev.filter(user => user._id !== userId))
    } catch (error) {
      console.error('Error unfollowing user:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Following
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : following.length > 0 ? (
            <div className="p-4 space-y-4">
              {following.map((user) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold overflow-hidden">
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
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {user.username}
                      </h3>
                      {user.bio && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnfollow(user._id)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-dark-700 dark:hover:bg-dark-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors text-sm"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Not following anyone yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}