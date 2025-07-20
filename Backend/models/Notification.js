const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['like', 'comment', 'follow', 'mention', 'story_view', 'story_reply'],
    required: true 
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  relatedReel: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel' },
  relatedStory: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
}, { timestamps: true });

// Index for better query performance
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', NotificationSchema); 