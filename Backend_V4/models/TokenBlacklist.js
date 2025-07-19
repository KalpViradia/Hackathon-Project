const mongoose = require('mongoose');

const TokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0 // Document will be automatically deleted when expiresAt is reached
  }
}, { timestamps: true });

module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema);
