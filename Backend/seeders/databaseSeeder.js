const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Reel = require('../models/Reel');
const Story = require('../models/Story');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Comment = require('../models/Comment');

// Sample data
const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    bio: 'Travel enthusiast and photographer 📸',
    avatar: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      publicId: 'sample_avatar_1'
    }
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    bio: 'Food blogger & chef 👩‍🍳 Sharing delicious recipes',
    avatar: {
      url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      publicId: 'sample_avatar_2'
    }
  },
  {
    username: 'mike_wilson',
    email: 'mike@example.com',
    password: 'password123',
    bio: 'Fitness trainer 💪 Helping you achieve your goals',
    avatar: {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      publicId: 'sample_avatar_3'
    }
  },
  {
    username: 'sarah_jones',
    email: 'sarah@example.com',
    password: 'password123',
    bio: 'Artist & designer 🎨 Creating beautiful things',
    avatar: {
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      publicId: 'sample_avatar_4'
    }
  },
  {
    username: 'alex_brown',
    email: 'alex@example.com',
    password: 'password123',
    bio: 'Tech enthusiast & developer 💻 Building the future',
    avatar: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      publicId: 'sample_avatar_5'
    }
  },
  {
    username: 'emma_davis',
    email: 'emma@example.com',
    password: 'password123',
    bio: 'Nature lover 🌿 Exploring the great outdoors',
    avatar: {
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      publicId: 'sample_avatar_6'
    }
  }
];

const samplePosts = [
  {
    content: 'Just had an amazing sunset at the beach! 🌅 Nature never fails to amaze me.',
    media: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      type: 'image',
      publicId: 'sample_post_1'
    }
  },
  {
    content: 'Tried a new recipe today - homemade pasta with truffle sauce! 🍝 The aroma was incredible.',
    media: {
      url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
      type: 'image',
      publicId: 'sample_post_2'
    }
  },
  {
    content: 'Morning workout complete! 💪 Remember, consistency is key to achieving your fitness goals.',
    media: {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      type: 'image',
      publicId: 'sample_post_3'
    }
  },
  {
    content: 'Working on a new digital art piece. The creative process is so therapeutic! 🎨',
    media: {
      url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      type: 'image',
      publicId: 'sample_post_4'
    }
  },
  {
    content: 'Just deployed a new feature to production! The feeling of seeing your code come to life is unmatched. 🚀',
    media: {
      url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
      type: 'image',
      publicId: 'sample_post_5'
    }
  },
  {
    content: 'Hiking through the mountains today. The fresh air and beautiful views are exactly what I needed! 🏔️',
    media: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      type: 'image',
      publicId: 'sample_post_6'
    }
  },
  {
    content: 'Coffee and code - the perfect combination for a productive morning! ☕💻'
  },
  {
    content: 'Grateful for all the amazing people in my life. Friendship is truly a blessing! 🙏'
  }
];

const sampleReels = [
  {
    caption: 'Quick morning workout routine! 💪 #fitness #motivation',
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      publicId: 'sample_reel_1',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop'
    }
  },
  {
    caption: 'Cooking pasta from scratch! 🍝 #cooking #foodie',
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      publicId: 'sample_reel_2',
      thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=600&fit=crop'
    }
  },
  {
    caption: 'Digital art process timelapse! 🎨 #art #creative',
    video: {
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      publicId: 'sample_reel_3',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop'
    }
  }
];

const sampleStories = [
  {
    media: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
      type: 'image',
      publicId: 'sample_story_1'
    },
    caption: 'Beautiful morning! ☀️'
  },
  {
    media: {
      url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=700&fit=crop',
      type: 'image',
      publicId: 'sample_story_2'
    },
    caption: 'Lunch prep! 🥗'
  },
  {
    media: {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=700&fit=crop',
      type: 'image',
      publicId: 'sample_story_3'
    },
    caption: 'Gym time! 💪'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    const deletePromises = [
      User.deleteMany({}),
      Post.deleteMany({}),
      Reel.deleteMany({}),
      Story.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Comment.deleteMany({})
    ];
    
    await Promise.all(deletePromises);
    console.log('✅ Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      users.push(user);
    }

    console.log(`👥 Created ${users.length} users`);

    // Create follow relationships
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const followCount = Math.floor(Math.random() * 3) + 1; // 1-3 follows
      
      for (let j = 0; j < followCount; j++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const userToFollow = users[randomIndex];
        
        if (userToFollow._id.toString() !== user._id.toString() && 
            !user.following.includes(userToFollow._id)) {
          user.following.push(userToFollow._id);
          userToFollow.followers.push(user._id);
        }
      }
      
      await user.save();
    }

    // Save all users with updated followers
    for (const user of users) {
      await user.save();
    }

    console.log('🤝 Created follow relationships');

    // Create posts
    const posts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const post = new Post({
        ...postData,
        user: randomUser._id
      });
      
      // Add some random likes
      const likeCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < likeCount; j++) {
        const randomLiker = users[Math.floor(Math.random() * users.length)];
        if (!post.likes.includes(randomLiker._id)) {
          post.likes.push(randomLiker._id);
        }
      }
      
      await post.save();
      posts.push(post);
    }

    console.log(`📝 Created ${posts.length} posts`);

    // Create comments
    for (const post of posts) {
      const commentCount = Math.floor(Math.random() * 3) + 1; // 1-3 comments per post
      
      for (let i = 0; i < commentCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const comments = [
          'Great post!',
          'Love this! 😍',
          'Amazing work!',
          'So inspiring!',
          'Beautiful! ✨',
          'This is awesome!',
          'Keep it up! 👏'
        ];
        
        const comment = new Comment({
          post: post._id,
          user: randomUser._id,
          content: comments[Math.floor(Math.random() * comments.length)]
        });
        
        await comment.save();
        post.comments.push(comment._id);
      }
      
      await post.save();
    }

    console.log('💬 Created comments');

    // Create reels
    for (let i = 0; i < sampleReels.length; i++) {
      const reelData = sampleReels[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const reel = new Reel({
        ...reelData,
        user: randomUser._id
      });
      
      // Add some random likes and views
      const likeCount = Math.floor(Math.random() * 8) + 2;
      const viewCount = Math.floor(Math.random() * 50) + 10;
      
      for (let j = 0; j < likeCount; j++) {
        const randomLiker = users[Math.floor(Math.random() * users.length)];
        if (!reel.likes.includes(randomLiker._id)) {
          reel.likes.push(randomLiker._id);
        }
      }
      
      reel.views = viewCount;
      await reel.save();
    }

    console.log(`🎬 Created ${sampleReels.length} reels`);

    // Create stories
    for (let i = 0; i < sampleStories.length; i++) {
      const storyData = sampleStories[i];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const story = new Story({
        ...storyData,
        user: randomUser._id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      });
      
      // Add some random viewers
      const viewerCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < viewerCount; j++) {
        const randomViewer = users[Math.floor(Math.random() * users.length)];
        if (!story.viewers.some(v => v.user && v.user.toString() === randomViewer._id.toString())) {
          story.viewers.push({
            user: randomViewer._id,
            viewedAt: new Date()
          });
        }
      }
      
      await story.save();
    }

    console.log(`📖 Created ${sampleStories.length} stories`);

    // Create messages
    for (let i = 0; i < 10; i++) {
      const sender = users[Math.floor(Math.random() * users.length)];
      const receiver = users[Math.floor(Math.random() * users.length)];
      
      if (sender._id.toString() !== receiver._id.toString()) {
        const messages = [
          'Hey! How are you doing?',
          'Great post today!',
          'Thanks for the follow!',
          'Love your content! 😊',
          'Hope you have a great day!',
          'Your latest reel was amazing!',
          'Let\'s collaborate sometime!'
        ];
        
        const message = new Message({
          sender: sender._id,
          receiver: receiver._id,
          content: messages[Math.floor(Math.random() * messages.length)]
        });
        
        await message.save();
      }
    }

    console.log('💌 Created messages');

    // Create notifications
    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const fromUser = users[Math.floor(Math.random() * users.length)];
      
      if (user._id.toString() !== fromUser._id.toString()) {
        const notificationTypes = [
          { type: 'like', message: 'liked your post' },
          { type: 'comment', message: 'commented on your post' },
          { type: 'follow', message: 'started following you' },
          { type: 'story_view', message: 'viewed your story' }
        ];
        
        const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        const notification = new Notification({
          user: user._id,
          from: fromUser._id,
          type: randomNotif.type,
          message: randomNotif.message,
          read: Math.random() > 0.5 // 50% chance of being read
        });
        
        await notification.save();
      }
    }

    console.log('🔔 Created notifications');

    console.log('✅ Database seeding completed successfully!');
    console.log(`
📊 Summary:
- Users: ${users.length}
- Posts: ${posts.length}
- Reels: ${sampleReels.length}
- Stories: ${sampleStories.length}
- Messages: ~10
- Notifications: ~15
- Comments: Multiple per post
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

module.exports = { seedDatabase };

// Run seeder if called directly
if (require.main === module) {
  const connectDB = require('../config/db');
  
  connectDB().then(() => {
    seedDatabase().then(() => {
      process.exit(0);
    });
  });
}