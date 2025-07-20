'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import api from '../lib/api'

export default function FollowersModal({ onClose }) {
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFollowers()
  }, [])

  const fetchFollowers = async () => {
    try {
      const response = await api.get('/user/followers/list')
      setFollowers(response.data.followers || [])
    } catch (error) {
      console.error('Error fetching followers:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Followers
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
          ) : followers.length > 0 ? (
            <div className="p-4 space-y-4">
              {followers.map((follower) => (
                <div key={follower._id} className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                    {follower.avatar?.url ? (
                      <img
                        src={follower.avatar.url}
                        alt={follower.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      follower.username?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {follower.username}
                    </h3>
                    {follower.bio && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {follower.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No followers yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}