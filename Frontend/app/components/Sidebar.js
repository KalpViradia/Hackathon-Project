'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Search, 
  Heart, 
  MessageCircle, 
  PlusSquare, 
  User, 
  Film,
  Clock,
  Shield,
  LogOut
} from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'
import ThemeToggle from './ThemeToggle'
import NotificationBadge from './NotificationBadge'

const sidebarItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Explore', href: '/explore', icon: Search },
  { name: 'Reels', href: '/reels', icon: Film },
  { name: 'Stories', href: '/stories', icon: Clock },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  // { name: 'Notifications', href: '/notifications', icon: Heart },
  { name: 'Create', href: '/create', icon: PlusSquare },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Link href="/home">
          <div className="relative h-16 w-48">
            <Image
              src="/Logo.jpg"
              alt="App Logo"
              fill
              style={{ objectFit: 'contain' }}
              className="hover:opacity-90 transition-opacity"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''} relative`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium">{item.name}</span>
              {item.name === 'Notifications' && <NotificationBadge />}
            </Link>
          )
        })}
        
        {/* Admin Link (only for admins) */}
        {user?.isAdmin && (
          <Link
            href="/admin"
            className={`sidebar-item ${pathname === '/admin' ? 'active' : ''}`}
          >
            <Shield className="w-6 h-6" />
            <span className="font-medium">Admin</span>
          </Link>
        )}
      </nav>

      {/* User Info & Controls */}
      <div className="border-t border-gray-200 dark:border-dark-700 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        {user && (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
            <div className="avatar w-10 h-10 flex-shrink-0">
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
            <div className="content-container">
              <p className="text-sm font-medium text-truncate">{user.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-truncate">
                @{user.username}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}