'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProtectedRoute from '../components/ProtectedRoute'
import Sidebar from '../components/Sidebar'
import PostCard from '../components/PostCard'
import FollowersModal from '../components/FollowersModal'
import FollowingModal from '../components/FollowingModal'
import { Settings, Grid, Film } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'
import api from '../lib/api'

export default function ProfilePage() {
  const { user } = useAuth()
  const [userPosts, setUserPosts] = useState([])
  const [userReels, setUserReels] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0
  })

  useEffect(() => {
    if (user) {
      fetchUserContent()
    }
  }, [user])

  const fetchUserContent = async () => {
    try {
      // Fetch user posts - filter from all posts for now
      const postsResponse = await api.get('/posts')
      const allPosts = postsResponse.data || []
      const userPosts = allPosts.filter(post => post.user?._id === user.id)
      setUserPosts(userPosts)
      
      // Fetch user reels
      try {
        const reelsResponse = await api.get(`/reels/user/${user.id}`)
        setUserReels(reelsResponse.data || [])
      } catch (reelsError) {
        console.error('Error fetching reels:', reelsError)
        setUserReels([])
      }
      
      // Update stats
      setStats({
        posts: userPosts.length,
        followers: user.followers?.length || 0,
        following: user.following?.length || 0
      })
    } catch (error) {
      console.error('Error fetching user content:', error)
    } finally {
      setLoading(false)
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

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Profile Header */}
            <div className="card p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="avatar w-32 h-32 text-4xl flex-shrink-0">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.username?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
                    <div className="content-container">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-truncate">
                        {user?.username || 'Unknown User'}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 text-truncate">
                        @{user?.username}
                      </p>
                    </div>
                    
                    <Link href="/profile/edit" className="btn-secondary space-x-2 flex-shrink-0">
                      <Settings className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </Link>
                  </div>
                  
                  <div className="flex justify-center md:justify-start space-x-8 mb-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.posts}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Posts</p>
                    </div>
                    <button 
                      onClick={() => setShowFollowersModal(true)}
                      className="text-center hover:bg-gray-100 dark:hover:bg-dark-700 p-2 rounded-lg transition-colors"
                    >
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.followers}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Followers</p>
                    </button>
                    <button 
                      onClick={() => setShowFollowingModal(true)}
                      className="text-center hover:bg-gray-100 dark:hover:bg-dark-700 p-2 rounded-lg transition-colors"
                    >
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.following}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Following</p>
                    </button>
                  </div>
                  
                  {user?.bio && (
                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <p className="text-gray-800 dark:text-gray-200 text-wrap whitespace-pre-wrap leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
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

        {/* Modals */}
        {showFollowersModal && (
          <FollowersModal 
            onClose={() => setShowFollowersModal(false)} 
          />
        )}
        {showFollowingModal && (
          <FollowingModal 
            onClose={() => setShowFollowingModal(false)} 
          />
        )}
      </div>
    </ProtectedRoute>
  )
}