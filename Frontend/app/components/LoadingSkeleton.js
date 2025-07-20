'use client'

export function PostSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 dark:bg-dark-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-32"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-3/4"></div>
      </div>
      
      {/* Media placeholder */}
      <div className="h-64 bg-gray-300 dark:bg-dark-600 rounded-lg mb-4"></div>
      
      {/* Actions */}
      <div className="flex space-x-6">
        <div className="h-8 bg-gray-300 dark:bg-dark-600 rounded w-16"></div>
        <div className="h-8 bg-gray-300 dark:bg-dark-600 rounded w-16"></div>
        <div className="h-8 bg-gray-300 dark:bg-dark-600 rounded w-16"></div>
      </div>
    </div>
  )
}

export function MessageSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gray-300 dark:bg-dark-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-48"></div>
        </div>
      </div>
    </div>
  )
}

export function UserSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-3 animate-pulse">
      <div className="w-12 h-12 bg-gray-300 dark:bg-dark-600 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-32"></div>
      </div>
    </div>
  )
}