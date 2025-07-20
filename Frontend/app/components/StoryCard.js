'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import api from '../lib/api'

export default function StoryCard({ story }) {
  const [isViewed, setIsViewed] = useState(false)

  const handleView = async () => {
    if (!isViewed) {
      try {
        await api.post(`/stories/${story._id}/view`)
        setIsViewed(true)
      } catch (error) {
        console.error('Error viewing story:', error)
      }
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div 
      onClick={handleView}
      className="relative aspect-[9/16] bg-gray-200 dark:bg-dark-700 rounded-xl overflow-hidden cursor-pointer group"
    >
      {/* Story Media */}
      {story.media?.type === 'image' ? (
        <img
          src={story.media.url}
          alt="Story"
          className="w-full h-full object-cover"
        />
      ) : story.media?.type === 'video' ? (
        <video
          src={story.media.url}
          className="w-full h-full object-cover"
          muted
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No media</p>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30">
        {/* User Info */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
            {story.user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-white text-sm font-medium">
            {story.user?.username}
          </span>
        </div>

        {/* Time */}
        <div className="absolute top-4 right-4">
          <span className="text-white text-xs">
            {formatTime(story.createdAt)}
          </span>
        </div>

        {/* Views */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white">
          <Eye className="w-4 h-4" />
          <span className="text-sm">{story.viewers?.length || 0}</span>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  )
}