# Social Media App - Code Arena 1.0 Hackathon Project

A full-stack social media application built during the Code Arena 1.0 Hackathon. This project implements a modern social media platform with real-time features, complete with both frontend and backend components.

## 🌟 Features

### Core Functionality
- User authentication (signup/login)
- Post creation and sharing
- Stories feature
- Reels support
- Real-time messaging
- Notifications system
- User profiles
- Admin dashboard

### Social Features
- Follow/Unfollow users
- Like and comment on posts
- Share posts
- Bookmark posts
- User blocking capability
- Report inappropriate content

### Technical Features
- Real-time updates using WebSocket
- Cloud-based media storage (Cloudinary)
- Responsive UI with dark/light theme
- Protected routes
- Admin moderation tools

## 🏗️ Architecture

### Frontend
- Built with Next.js
- Tailwind CSS for styling
- Real-time updates integration
- Component-based architecture
- Theme customization

### Backend
- Node.js/Express.js server
- MongoDB database
- RESTful API architecture
- JWT authentication
- File upload handling
- WebSocket integration

## 🚀 Quick Start

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file based on .env.example and configure your environment variables

4. Run the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env.local file based on .env.local.example

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
├── Backend/
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   └── config/          # Configuration files
├── Frontend/
│   ├── app/            # Next.js app directory
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks
│   └── providers/      # Context providers
└── Database/           # Database seed files
```

## 🔒 Authentication

- JWT-based authentication
- Token blacklisting for logout
- Protected route middleware
- Role-based access control

## 👥 User Features

- Profile customization
- Activity feed
- Story sharing
- Direct messaging
- Post creation and sharing
- Real-time notifications

## 🛠️ Admin Features

- User management
- Content moderation
- Report handling
- Analytics dashboard
- System monitoring

## 🧪 Testing

The project includes both automated and manual testing:
- API endpoint tests
- Authentication tests
- User interaction tests
- Story/Post functionality tests

## 💡 Technologies Used

- **Frontend**: Next.js, TailwindCSS, React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Real-time Features**: WebSocket

## 🏆 Hackathon Achievement

This project was developed during Code Arena 1.0 Hackathon, demonstrating rapid development and implementation of a full-featured social media platform.

## 📜 License

This project is open source and available under the MIT License.

---

Built with ❤️ during Code Arena 1.0 Hackathon