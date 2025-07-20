# Database Seeding Guide

## 🌱 Overview

This guide explains how to seed your MongoDB database with sample data for the social media application.

## 📋 Prerequisites

1. **MongoDB** running locally or connection to MongoDB Atlas
2. **Environment variables** properly configured in `.env` file
3. **Dependencies** installed (`npm install`)

## 🚀 Quick Start

### Option 1: Run Seeder Script
```bash
cd Backend
npm run seed
```

### Option 2: Fresh Seed (same as above)
```bash
cd Backend
npm run seed:fresh
```

### Option 3: Direct Execution
```bash
cd Backend
node scripts/seed.js
```

## 📊 What Gets Created

### 👥 Users (6 sample users)
- **john_doe** - Travel enthusiast and photographer
- **jane_smith** - Food blogger & chef
- **mike_wilson** - Fitness trainer
- **sarah_jones** - Artist & designer
- **alex_brown** - Tech enthusiast & developer
- **emma_davis** - Nature lover

Each user includes:
- Username, email, password (all passwords: `password123`)
- Bio and avatar
- Random follow relationships

### 📝 Posts (8 sample posts)
- Text content with engaging captions
- High-quality images from Unsplash
- Random likes from other users
- Comments from community members

### 💬 Comments
- 1-3 comments per post
- Realistic engagement messages
- Random users as commenters

### 🎬 Reels (3 sample reels)
- Video content with captions
- Hashtags and descriptions
- Like counts and view statistics

### 📖 Stories (3 sample stories)
- 24-hour expiring content
- Image-based stories with captions
- Viewer tracking

### 💌 Messages (10 sample messages)
- Conversations between users
- Friendly and engaging content
- Realistic social interactions

### 🔔 Notifications (15 sample notifications)
- Like notifications
- Comment notifications
- Follow notifications
- Story view notifications
- Mix of read/unread status

## 🔧 Customization

### Adding More Sample Data

Edit `Backend/seeders/databaseSeeder.js` to add more:

```javascript
const sampleUsers = [
  // Add more users here
  {
    username: 'new_user',
    email: 'newuser@example.com',
    password: 'password123',
    bio: 'Your bio here',
    avatar: {
      url: 'https://your-image-url.com',
      publicId: 'avatar_id'
    }
  }
];
```

### Modifying Content

Update the sample arrays in the seeder file:
- `samplePosts` - Add more post content
- `sampleReels` - Add more reel data
- `sampleStories` - Add more story content

## 🗑️ Clearing Data

The seeder automatically clears existing data before creating new data:

```javascript
// These collections are cleared:
await User.deleteMany({});
await Post.deleteMany({});
await Reel.deleteMany({});
await Story.deleteMany({});
await Message.deleteMany({});
await Notification.deleteMany({});
await Comment.deleteMany({});
```

## 🔐 Login Credentials

After seeding, you can login with any of these accounts:

| Username | Email | Password |
|----------|-------|----------|
| john_doe | john@example.com | password123 |
| jane_smith | jane@example.com | password123 |
| mike_wilson | mike@example.com | password123 |
| sarah_jones | sarah@example.com | password123 |
| alex_brown | alex@example.com | password123 |
| emma_davis | emma@example.com | password123 |

## 📈 Expected Results

After successful seeding, you should see:

```
✅ Database seeding completed successfully!

📊 Summary:
- Users: 6
- Posts: 8
- Reels: 3
- Stories: 3
- Messages: ~10
- Notifications: ~15
- Comments: Multiple per post
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Make sure MongoDB is running

2. **Environment Variables**
   ```
   Error: JWT_SECRET is not defined
   ```
   **Solution**: Check your `.env` file has all required variables

3. **Permission Error**
   ```
   Error: permission denied
   ```
   **Solution**: Run with appropriate permissions or check file paths

### Required Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/social_media_db
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## 🔄 Re-seeding

To re-seed the database:

1. **Stop your application**
2. **Run the seeder**: `npm run seed`
3. **Restart your application**

The seeder will automatically clear existing data and create fresh sample data.

## 📱 Frontend Integration

After seeding, the frontend will automatically display:

- ✅ User profiles with avatars and bios
- ✅ Posts with images and engagement
- ✅ Stories in the stories section
- ✅ Reels with video content
- ✅ Messages between users
- ✅ Notifications with proper types
- ✅ Follow relationships and social features

## 🎯 Production Notes

**⚠️ Important**: This seeder is for development only. Do not run in production as it will delete all existing data.

For production data migration, create separate migration scripts that don't clear existing data.

## 🤝 Contributing

To add more sample data:

1. Edit the sample arrays in `databaseSeeder.js`
2. Test the seeder locally
3. Update this documentation
4. Submit a pull request

## 📞 Support

If you encounter issues with seeding:

1. Check the console output for specific error messages
2. Verify your database connection
3. Ensure all dependencies are installed
4. Check file permissions

The seeder provides detailed logging to help diagnose issues.