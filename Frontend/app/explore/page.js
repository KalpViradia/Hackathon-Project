'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import Sidebar from '../components/Sidebar'
import PostCard from '../components/PostCard'
import { Search } from 'lucide-react'
import api from '../lib/api'

export default function ExplorePage() {
  const [posts, setPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExplorePosts()
  }, [])

  const fetchExplorePosts = async () => {
    try {
      const response = await api.get('/posts/explore')
      setPosts(response.data || [])
    } catch (error) {
      console.error('Error fetching explore posts:', error)
      // Fallback to regular posts if explore endpoint fails
      try {
        const fallbackResponse = await api.get('/posts')
        setPosts(fallbackResponse.data || [])
      } catch (fallbackError) {
        console.error('Error fetching fallback posts:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      fetchExplorePosts()
      return
    }

    setLoading(true)
    try {
      // Implement search functionality when available in API
      // For now, filter existing posts
      const filteredPosts = posts.filter(post => 
        post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setPosts(filteredPosts)
    } catch (error) {
      console.error('Error searching posts:', error)
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
            {/* Search Bar */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, users..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </form>
            </div>

            {/* Posts Grid */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {searchQuery ? `Search results for "${searchQuery}"` : 'Discover'}
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <>
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No posts found matching your search' : 'No posts to explore'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}