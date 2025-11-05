'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import Sidebar from '../components/Sidebar'
import ReelCard from '../components/ReelCard'
import api from '../lib/api'

export default function ReelsPage() {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReels()
  }, [])

  const fetchReels = async () => {
    try {
      const response = await api.get('/reels')
      setReels(response.data || [])
    } catch (error) {
      console.error('Error fetching reels:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
        <Sidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-md mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
              Reels
            </h1>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {reels.length > 0 ? (
                  reels.map((reel) => (
                    <ReelCard key={reel._id} reel={reel} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No reels available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}