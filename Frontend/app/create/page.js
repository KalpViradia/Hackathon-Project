'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import Sidebar from '../components/Sidebar'
import { Image, Video, X, Upload } from 'lucide-react'
import api from '../lib/api'

export default function CreatePage() {
  const [postType, setPostType] = useState('post') // 'post' or 'reel'
  const [content, setContent] = useState('')
  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
    
    if (postType === 'post' && !content.trim() && !media) {
      alert('Please add some content or media')
      return
    }
    
    if (postType === 'reel' && !media) {
      alert('Please select a video for your reel')
      return
    }

    setLoading(true)
    try {

      if (postType === 'post') {
        // Create post using FormData
        const formData = new FormData()
        formData.append('content', content.trim())
        if (media) {
          formData.append('file', media)
        }

        await api.post('/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        router.push('/home')
      } else {
        // Create reel using FormData
        const formData = new FormData()
        formData.append('caption', content.trim())
        if (media) {
          formData.append('file', media)
        }

        await api.post('/reels', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        router.push('/reels')
      }
    } catch (error) {
      console.error('Error creating content:', error)
      alert('Failed to create content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Create New Content
            </h1>

            {/* Content Type Selector */}
            <div className="card p-6 mb-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setPostType('post')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    postType === 'post'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'
                  }`}
                >
                  <Image className="w-5 h-5" />
                  <span>Post</span>
                </button>
                
                <button
                  onClick={() => setPostType('reel')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    postType === 'reel'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>Reel</span>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Content Input */}
                <div className="mb-6">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={postType === 'post' ? "What's on your mind?" : "Add a caption for your reel..."}
                    className="w-full p-4 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows="4"
                  />
                </div>

                {/* Media Upload */}
                <div className="mb-6">
                  {!mediaPreview ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {postType === 'post' 
                          ? 'Upload a photo or video (optional)'
                          : 'Upload a video for your reel'
                        }
                      </p>
                      <label className="btn-primary cursor-pointer">
                        Choose File
                        <input
                          type="file"
                          accept={postType === 'post' ? 'image/*,video/*' : 'video/*'}
                          onChange={handleMediaChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {media?.type?.startsWith('image/') ? (
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="w-full h-auto max-h-96 object-cover"
                        />
                      ) : media?.type?.startsWith('video/') ? (
                        <video
                          src={mediaPreview}
                          className="w-full h-auto max-h-96"
                          controls
                        />
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || (postType === 'post' && !content.trim() && !media) || (postType === 'reel' && !media)}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : `Create ${postType === 'post' ? 'Post' : 'Reel'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}