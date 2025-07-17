const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  media: { type: String, required: true },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Story', storySchema); 