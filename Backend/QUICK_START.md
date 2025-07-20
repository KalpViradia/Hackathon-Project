# 🚀 Quick Start Guide

## Step 1: Test Database Connection
```bash
cd Backend
npm run test-db
```

## Step 2: Seed Database with Sample Data
```bash
npm run seed
```

## Step 3: Start Backend Server
```bash
npm start
```

## Step 4: Start Frontend (in another terminal)
```bash
cd ../nextjs-social-app
npm run dev
```

## 🔐 Login Credentials

After seeding, use these accounts:

| Email | Password | Role |
|-------|----------|------|
| john@example.com | password123 | User |
| jane@example.com | password123 | User |
| mike@example.com | password123 | User |
| sarah@example.com | password123 | User |
| alex@example.com | password123 | User |
| emma@example.com | password123 | User |

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection first
npm run test-db

# Check your .env file has:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Seeding Issues
```bash
# Clear and re-seed
npm run seed:fresh
```

### Server Issues
```bash
# Check if port 5000 is available
netstat -an | findstr :5000

# Or use different port
PORT=3001 npm start
```

## 📱 Frontend URLs

- **Home**: http://localhost:3000/home
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup

## 🎯 What You'll See After Seeding

- ✅ 6 users with profiles and avatars
- ✅ 8 posts with images and engagement
- ✅ 3 reels with video content
- ✅ 3 stories (24-hour expiring)
- ✅ Messages between users
- ✅ Notifications and social interactions
- ✅ Follow relationships

## 🔄 Reset Everything

```bash
# Stop servers
# Clear database
npm run seed
# Restart servers
```