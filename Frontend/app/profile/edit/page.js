'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import Sidebar from '../../components/Sidebar'
import { Camera, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../providers/AuthProvider'
import api from '../../lib/api'

export default function EditProfilePage() {
  const { user, login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bio: ''
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || ''
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onload = (e) => setAvatarPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('bio', formData.bio)
      
      if (avatar) {
        formDataToSend.append('avatar', avatar)
      }

      const response = await api.put('/user/me', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Update user in auth context
      const updatedUserData = {
        token: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '',
        user: response.data.user
      }
      localStorage.setItem('user', JSON.stringify(updatedUserData))
      
      alert('Profile updated successfully!')
      router.push('/profile')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
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
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Edit Profile
              </h1>
            </div>

            {/* Edit Form */}
            <div className="card p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : user?.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt="Current avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user?.username?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full cursor-pointer hover:bg-primary-600 transition-colors">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click the camera icon to change your profile picture
                  </p>
                </div>

                {/* Bio Section */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows="4"
                    maxLength="160"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.bio.length}/160 characters
                  </p>
                </div>

                {/* User Info (Read-only) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-dark-700">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
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