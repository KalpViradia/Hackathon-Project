'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import Sidebar from '../components/Sidebar'
import StoryCard from '../components/StoryCard'
import CreateStoryModal from '../components/CreateStoryModal'
import { Plus } from 'lucide-react'
import api from '../lib/api'

export default function StoriesPage() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await api.get('/stories')
      const storyGroups = response.data || []
      
      // Flatten the grouped stories for display
      const allStories = []
      storyGroups.forEach(group => {
        if (group.stories && group.stories.length > 0) {
          allStories.push(...group.stories)
        }
      })
      
      setStories(allStories)
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStoryCreated = (newStory) => {
    setStories(prev => [newStory, ...prev])
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Stories
              </h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Story</span>
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stories.length > 0 ? (
                  stories.map((story) => (
                    <StoryCard key={story._id} story={story} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No stories available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Create Story Modal */}
        {showCreateModal && (
          <CreateStoryModal
            onClose={() => setShowCreateModal(false)}
            onStoryCreated={handleStoryCreated}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}