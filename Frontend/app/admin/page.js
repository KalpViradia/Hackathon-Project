'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'
import Sidebar from '../components/Sidebar'
import { Users, Flag, BarChart3, Shield } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'
import api from '../lib/api'

export default function AdminPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalReels: 0,
    activeUsers: 0
  })
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAdminData()
    }
  }, [user])

  const fetchAdminData = async () => {
    try {
      const [usersResponse, reportsResponse] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/reports')
      ])
      
      setUsers(usersResponse.data.users || [])
      setReports(reportsResponse.data.reports || [])
      
      // Calculate stats
      setStats({
        totalUsers: usersResponse.data.users?.length || 0,
        totalPosts: 0, // Would need separate endpoint
        totalReels: 0, // Would need separate endpoint
        activeUsers: usersResponse.data.users?.filter(u => !u.isBanned).length || 0
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId) => {
    try {
      await api.post(`/admin/ban/${userId}`)
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isBanned: !u.isBanned } : u
      ))
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const handleReportAction = async (reportId, action) => {
    try {
      await api.put(`/admin/reports/${reportId}`, { action })
      setReports(prev => prev.filter(r => r._id !== reportId))
    } catch (error) {
      console.error('Error handling report:', error)
    }
  }

  if (!user?.isAdmin) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
          <Sidebar />
          <main className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                You don't have permission to access the admin panel.
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
          <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Admin Dashboard
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-primary-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <Flag className="w-8 h-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reports</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{reports.length}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Banned Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {users.filter(u => u.isBanned).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Users Management */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  User Management
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {user.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBanUser(user._id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          user.isBanned
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports Management */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Content Reports
                </h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reports.length > 0 ? (
                    reports.map((report) => (
                      <div key={report._id} className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {report.type} Report
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Reason: {report.reason}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleReportAction(report._id, 'approve')}
                            className="px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200 rounded text-sm"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleReportAction(report._id, 'remove')}
                            className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-sm"
                          >
                            Remove Content
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No reports to review
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}