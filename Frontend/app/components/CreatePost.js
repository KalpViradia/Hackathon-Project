'use client'

import { useState } from 'react'
import { Image, Video, X } from 'lucide-react'
import api from '../lib/api'

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMedia(file)
      const reader = new FileReader()
      reader.onload = (e) => setMediaPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeMedia = () => {
    setMedia(null)
    setMediaPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() && !media) return

    setLoading(true)
    try {
      // Create FormData for the post
      const formData = new FormData()
      formData.append('content', content.trim())
      
      if (media) {
        formData.append('file', media)
      }

      const response = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      // Reset form
      setContent('')
      setMedia(null)
      setMediaPreview(null)
      
      // Notify parent component
      if (onPostCreated) {
        onPostCreated(response.data.post)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
            U
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 border-none resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg"
              rows="3"
            />

            {/* Media Preview */}
            {mediaPreview && (
              <div className="relative mt-4 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {media?.type?.startsWith('image/') ? (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full h-auto max-h-64 object-cover"
                  />
                ) : media?.type?.startsWith('video/') ? (
                  <video
                    src={mediaPreview}
                    className="w-full h-auto max-h-64"
                    controls
                  />
                ) : null}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 px-3 py-2 rounded-lg text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-colors">
                  <Image className="w-5 h-5" />
                  <span className="text-sm font-medium">Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>

                <label className="flex items-center space-x-2 px-3 py-2 rounded-lg text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-colors">
                  <Video className="w-5 h-5" />
                  <span className="text-sm font-medium">Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={(!content.trim() && !media) || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}