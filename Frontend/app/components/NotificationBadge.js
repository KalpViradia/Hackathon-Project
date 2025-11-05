'use client'

import { useState, useEffect } from 'react'
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates'
import api from '../lib/api'

export default function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count')
      setUnreadCount(response.data.count || 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
      // Fallback to old method
      try {
        const response = await api.get('/notifications')
        const notifications = response.data.notifications || response.data || []
        const unread = notifications.filter(n => !n.read).length
        setUnreadCount(unread)
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError)
      }
    }
  }

  useEffect(() => {
    fetchUnreadCount()
  }, [])

  // Update every 30 seconds
  useRealTimeUpdates(fetchUnreadCount, 30000)

  if (unreadCount === 0) return null

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}