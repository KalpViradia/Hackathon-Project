const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  media: {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    publicId: { type: String }
  },
  caption: { type: String, maxLength: 200 },
  expiresAt: { 
    type: Date, 
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  archived: { type: Boolean, default: false },
  viewers: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    viewedAt: { type: Date, default: Date.now }
  }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  backgroundColor: { type: String, default: '#000000' },
  textColor: { type: String, default: '#ffffff' },
}, { timestamps: true });

// Index for better query performance
StorySchema.index({ user: 1, createdAt: -1 });
StorySchema.index({ archived: 1, expiresAt: 1 });

// Auto-delete expired stories (this creates the expiresAt index automatically)
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', StorySchema); 