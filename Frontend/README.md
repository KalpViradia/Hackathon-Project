# Next.js Social Media App

A modern, responsive social media application built with Next.js 14, Tailwind CSS, and integrated with a Node.js backend API.

## Features

- 🔐 **Authentication**: Login/Signup with JWT tokens
- 🏠 **Home Feed**: View and interact with posts from followed users
- 📝 **Create Posts**: Share text, images, and videos
- 🎬 **Reels**: Create and view short video content
- 💬 **Messaging**: Real-time chat with other users
- 🔍 **Explore**: Discover new content and users
- 🔔 **Notifications**: Stay updated with likes, comments, and follows
- 👤 **Profile**: Manage your profile and view your content
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Theme**: Next-themes for dark/light mode
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database
- Cloudinary account (for media uploads)

### Installation

1. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure Backend Environment**
   Create `.env` file in Backend folder:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Setup Frontend**
   ```bash
   cd nextjs-social-app
   npm install
   ```

4. **Start Both Servers**
   
   **Option 1: Start both together**
   ```bash
   cd nextjs-social-app
   npm run dev-full
   ```
   
   **Option 2: Start separately**
   ```bash
   # Terminal 1 - Backend
   cd Backend
   npm start
   
   # Terminal 2 - Frontend
   cd nextjs-social-app
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nextjs-social-app/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.js      # Navigation sidebar
│   │   ├── PostCard.js     # Post display component
│   │   ├── CreatePost.js   # Post creation form
│   │   ├── ReelCard.js     # Reel display component
│   │   ├── ChatList.js     # Chat conversations list
│   │   ├── ChatWindow.js   # Chat interface
│   │   ├── ThemeToggle.js  # Dark/light mode toggle
│   │   └── ProtectedRoute.js # Route protection
│   ├── lib/                # Utility functions
│   │   ├── api.js          # Axios configuration
│   │   └── authService.js  # Authentication service
│   ├── providers/          # React context providers
│   │   ├── AuthProvider.js # Authentication context
│   │   └── ThemeProvider.js # Theme context
│   ├── home/              # Home feed page
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   ├── reels/             # Reels page
│   ├── messages/          # Messages page
│   ├── explore/           # Explore page
│   ├── notifications/     # Notifications page
│   ├── profile/           # Profile page
│   ├── create/            # Content creation page
│   ├── globals.css        # Global styles
│   └── layout.js          # Root layout
├── public/                # Static assets
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies
```

## API Integration

The app integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Posts
- `GET /api/posts/feed` - Get feed posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Reels
- `GET /api/reels` - Get reels
- `POST /api/reels` - Create new reel
- `POST /api/reels/:id/like` - Like/unlike reel

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Upload
- `POST /api/upload` - Upload media files

## Styling

The app uses Tailwind CSS with custom components and utilities:

- **Custom Colors**: Primary blue palette with dark mode variants
- **Components**: Reusable button, input, and card styles
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Automatic theme switching with smooth transitions

## Key Features Implementation

### Authentication
- JWT token storage in cookies and localStorage
- Automatic token refresh and logout on expiry
- Protected routes with redirect to login

### Real-time Features
- Optimistic UI updates for likes and comments
- Instant message sending with error handling
- Live notification updates

### Media Handling
- Image and video upload with preview
- Cloudinary integration for media storage
- Responsive media display

### Theme System
- System preference detection
- Persistent theme selection
- Smooth transitions between themes

## Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run start-backend` - Start backend server only
- `npm run dev-full` - Start both backend and frontend together

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.