'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share, Play, Pause } from 'lucide-react'
import api from '../lib/api'

export default function ReelCard({ reel }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(reel.likes?.length || 0)

  const handleLike = async () => {
    try {
      await api.post(`/reels/${reel._id}/like`)
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    } catch (error) {
      console.error('Error liking reel:', error)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] max-h-[600px]">
      {/* Video */}
      <div className="relative w-full h-full">
        <video
          src={reel.video?.url}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          onClick={togglePlay}
        />
        
        {/* Play/Pause Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {!isPlaying && (
            <div className="bg-black bg-opacity-50 rounded-full p-4">
              <Play className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-end justify-between">
          {/* Left side - User info and caption */}
          <div className="flex-1 mr-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {reel.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  {reel.user?.username || 'Unknown User'}
                </p>
                <p className="text-gray-300 text-xs">
                  {formatDate(reel.createdAt)}
                </p>
              </div>
            </div>
            
            {reel.caption && (
              <p className="text-white text-sm leading-relaxed">
                {reel.caption}
              </p>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleLike}
              className={`p-3 rounded-full ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              } transition-colors`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-white text-xs font-medium">{likesCount}</span>

            <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <span className="text-white text-xs font-medium">
              {reel.comments?.length || 0}
            </span>

            <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
              <Share className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}