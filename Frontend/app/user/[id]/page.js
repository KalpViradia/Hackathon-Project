'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import Sidebar from '../../components/Sidebar'
import PostCard from '../../components/PostCard'
import { Grid, Film, UserPlus, UserMinus } from 'lucide-react'
import { useAuth } from '../../providers/AuthProvider'
import api from '../../lib/api'

export default function UserProfilePage() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userReels, setUserReels] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchUserProfile()
    }
  }, [id])

  const fetchUserProfile = async () => {
    try {
      // Fetch user profile
      const userResponse = await api.get(`/user/${id}`)
      setUser(userResponse.data)
      
      // Check if following
      setIsFollowing(userResponse.data.followers?.some(follower => follower._id === currentUser?.id))
      
      // Fetch user posts
      const postsResponse = await api.get('/posts')
      const allPosts = postsResponse.data || []
      const userPosts = allPosts.filter(post => post.user?._id === id)
      setUserPosts(userPosts)
      
      // Fetch user reels
      try {
        const reelsResponse = await api.get(`/reels/user/${id}`)
        setUserReels(reelsResponse.data || [])
      } catch (reelsError) {
        console.error('Error fetching reels:', reelsError)
        setUserReels([])
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      const response = await api.post(`/user/follow/${id}`)
      setIsFollowing(response.data.following)
      
      // Update follower count
      setUser(prev => ({
        ...prev,
        followers: response.data.following 
          ? [...(prev.followers || []), { _id: currentUser.id }]
          : (prev.followers || []).filter(f => f._id !== currentUser.id)
      }))
    } catch (error) {
      console.error('Error following user:', error)
    } finally {
      setFollowLoading(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )
    }

    if (activeTab === 'posts') {
      return userPosts.length > 0 ? (
        <div className="space-y-6">
          {userPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
        </div>
      )
    }

    if (activeTab === 'reels') {
      return userReels.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {userReels.map((reel) => (
            <div key={reel._id} className="aspect-[9/16] bg-gray-200 dark:bg-dark-700 rounded-lg overflow-hidden">
              <video
                src={reel.video?.url}
                className="w-full h-full object-cover"
                muted
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No reels yet</p>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
          <Sidebar />
          <main className="flex-1 ml-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
          <Sidebar />
          <main className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                User not found
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                The user you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Profile Header */}
            <div className="card p-8 mb-8">
              <div className="flex items-start space-x-8">
                <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
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
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {user.username}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400">
                        @{user.username}
                      </p>
                    </div>
                    
                    {currentUser?.id !== id && (
                      <button
                        onClick={handleFollow}
                        disabled={followLoading}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isFollowing
                            ? 'bg-gray-200 hover:bg-gray-300 dark:bg-dark-700 dark:hover:bg-dark-600 text-gray-900 dark:text-gray-100'
                            : 'bg-primary-500 hover:bg-primary-600 text-white'
                        }`}
                      >
                        {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        <span>{followLoading ? 'Loading...' : (isFollowing ? 'Unfollow' : 'Follow')}</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-8 mb-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {userPosts.length}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {user.followers?.length || 0}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {user.following?.length || 0}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Following</p>
                    </div>
                  </div>
                  
                  {user.bio && (
                    <p className="text-gray-800 dark:text-gray-200">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="border-b border-gray-200 dark:border-dark-700 mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'posts'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Grid className="w-4 h-4" />
                    <span>Posts</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('reels')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reels'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Film className="w-4 h-4" />
                    <span>Reels</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}