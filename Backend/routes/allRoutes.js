// List of all API routes and test objects for testing

const routes = [
  // AUTH
  { method: 'POST', path: '/api/auth/signup', description: 'Register new user' },
  { method: 'POST', path: '/api/auth/login', description: 'Login and return JWT token' },

  // USER
  { method: 'GET', path: '/api/user/me', description: 'Get current user (JWT required)' },
  { method: 'GET', path: '/api/user/:id', description: 'Get public profile' },
  { method: 'PUT', path: '/api/user/me', description: 'Update profile info' },
  { method: 'POST', path: '/api/user/follow/:id', description: 'Follow/unfollow user' },
  { method: 'GET', path: '/api/user/followers', description: 'Get list of followers' },
  { method: 'GET', path: '/api/user/following', description: 'Get list of following' },
  { method: 'POST', path: '/api/user/block/:id', description: 'Block or unblock user' },

  // POST
  { method: 'POST', path: '/api/posts', description: 'Create new post' },
  { method: 'GET', path: '/api/posts', description: 'Get home feed (public + followed)' },
  { method: 'GET', path: '/api/posts/explore', description: 'Get trending/explore posts' },
  { method: 'GET', path: '/api/posts/:id', description: 'Get single post' },
  { method: 'PUT', path: '/api/posts/:id', description: 'Update post' },
  { method: 'DELETE', path: '/api/posts/:id', description: 'Delete post' },
  { method: 'POST', path: '/api/posts/:id/like', description: 'Like/unlike post' },
  { method: 'POST', path: '/api/posts/:id/comment', description: 'Add a comment' },
  { method: 'GET', path: '/api/posts/:id/comments', description: 'Get post comments' },
  { method: 'POST', path: '/api/posts/:id/bookmark', description: 'Save post' },

  // STORY
  { method: 'POST', path: '/api/stories', description: 'Create new story' },
  { method: 'GET', path: '/api/stories', description: 'Get active stories' },
  { method: 'GET', path: '/api/stories/archive', description: 'Get archived stories (self only)' },
  { method: 'PUT', path: '/api/stories/:id', description: 'Archive story' },
  { method: 'POST', path: '/api/stories/:id/view', description: 'Mark as viewed' },
  { method: 'POST', path: '/api/stories/:id/reply', description: 'Send DM reply to story owner' },

  // MESSAGE
  { method: 'POST', path: '/api/messages', description: 'Send direct message' },
  { method: 'GET', path: '/api/messages/:userId', description: 'Get messages with user' },
  { method: 'GET', path: '/api/messages', description: 'Get all conversations' },

  // NOTIFICATION
  { method: 'GET', path: '/api/notifications', description: 'Get notifications' },
  { method: 'PUT', path: '/api/notifications', description: 'Mark all as read' },

  // ADMIN
  { method: 'GET', path: '/api/admin/users', description: 'Get all users (admin only)' },
  { method: 'GET', path: '/api/admin/reports', description: 'View reported content' },
  { method: 'POST', path: '/api/admin/ban/:id', description: 'Ban user' },
  { method: 'DELETE', path: '/api/admin/content/:id', description: 'Remove post/story/comment' },

  // UPLOAD
  { method: 'POST', path: '/api/upload', description: 'Upload file to Cloudinary' },
];

// Test objects for each main resource
const testObjects = {
  signup: {
    username: "testuser" + Date.now(),
    email: `testuser${Date.now()}@example.com`,
    password: "TestPass123!"
  },
  login: {
    email: "",  // Will be populated after signup
    password: "TestPass123!"
  },
  post: {
    content: "Test post content",
    image: "https://example.com/test.jpg"
  },
  story: {
    media: "https://example.com/story.jpg",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  message: {
    content: "Test message",
    media: null
  },
  comment: {
    content: "Test comment"
  }
};

module.exports = { routes, testObjects };