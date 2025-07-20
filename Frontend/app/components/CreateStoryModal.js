'use client'

import { useState } from 'react'
import { X, Upload, Image, Video } from 'lucide-react'
import api from '../lib/api'

export default function CreateStoryModal({ onClose, onStoryCreated }) {
  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaType, setMediaType] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMedia(file)
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image')
      
      const reader = new FileReader()
      reader.onload = (e) => setMediaPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeMedia = () => {
    setMedia(null)
    setMediaPreview(null)
    setMediaType(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!media) return

    setLoading(true)
    try {
      // Create story with file upload
      const formData = new FormData()
      formData.append('file', media)
      formData.append('caption', '') // Add caption if needed
      
      const response = await api.post('/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      if (onStoryCreated) {
        onStoryCreated(response.data.story)
      }
      
      onClose()
    } catch (error) {
      console.error('Error creating story:', error)
      alert('Failed to create story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Create Story
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          {!mediaPreview ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload a photo or video for your story
              </p>
              <div className="flex justify-center space-x-4">
                <label className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors">
                  <Image className="w-4 h-4" />
                  <span>Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>
                <label className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors">
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Media Preview */}
              <div className="relative aspect-[9/16] bg-gray-200 dark:bg-dark-700 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {mediaType === 'image' ? (
                  <img
                    src={mediaPreview}
                    alt="Story preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Story...' : 'Share Story'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}