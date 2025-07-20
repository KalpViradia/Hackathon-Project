'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'
import ShareModal from './ShareModal'
import api from '../lib/api'

export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])
  const [showShareModal, setShowShareModal] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  const handleLike = async () => {
    try {
      await api.post(`/posts/${post._id}/like`)
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || commentSubmitting) return

    setCommentSubmitting(true)
    const commentText = newComment.trim()
    setNewComment('')

    try {
      const response = await api.post(`/posts/${post._id}/comment`, {
        content: commentText
      })
      // Fetch updated comments
      await fetchComments()
    } catch (error) {
      console.error('Error adding comment:', error)
      setNewComment(commentText) // Restore comment on error
      alert('Failed to add comment. Please try again.')
    } finally {
      setCommentSubmitting(false)
    }
  }

  const fetchComments = async () => {
    if (commentsLoading) return
    
    setCommentsLoading(true)
    try {
      const response = await api.get(`/posts/${post._id}/comments`)
      setComments(response.data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setCommentsLoading(false)
    }
  }

  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments()
    }
  }, [showComments])

  // Real-time comment updates
  useEffect(() => {
    if (showComments) {
      const interval = setInterval(fetchComments, 5000)
      return () => clearInterval(interval)
    }
  }, [showComments])

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
    <div className="card p-6">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="avatar w-10 h-10">
            {post.user?.avatar?.url ? (
              <img
                src={post.user.avatar.url}
                alt={post.user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              post.user?.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="content-container">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-truncate">
              {post.user?.username || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-truncate">
              @{post.user?.username} • {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full flex-shrink-0">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="mb-4">
          <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-wrap whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      )}

      {/* Post Media */}
      {post.media?.url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.media.type === 'image' ? (
            <img
              src={post.media.url}
              alt="Post media"
              className="w-full h-auto max-h-96 object-cover"
            />
          ) : post.media.type === 'video' ? (
            <video
              src={post.media.url}
              controls
              className="w-full h-auto max-h-96"
            />
          ) : null}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{comments.length}</span>
          </button>

          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <Share className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
          {/* Add Comment */}
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-3">
              <div className="avatar w-8 h-8 flex-shrink-0">
                U
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex space-x-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleComment(e)
                      }
                    }}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows="1"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || commentSubmitting}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    {commentSubmitting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {commentsLoading && comments.length === 0 ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <div className="avatar w-8 h-8 flex-shrink-0">
                    {comment.user?.avatar?.url ? (
                      <img
                        src={comment.user.avatar.url}
                        alt={comment.user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      comment.user?.username?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="content-container">
                    <div className="bg-gray-100 dark:bg-dark-700 rounded-lg px-3 py-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 text-truncate">
                        {comment.user?.username || 'Unknown User'}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200 text-sm text-wrap whitespace-pre-wrap leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-3">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal 
          postId={post._id}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  )
}