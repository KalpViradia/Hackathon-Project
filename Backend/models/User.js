const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {
    url: { type: String },
    publicId: { type: String }
  },
  bio: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-remove middleware to cleanup avatar from Cloudinary
UserSchema.pre('remove', async function(next) {
  try {
    if (this.avatar && this.avatar.publicId) {
      const cloudinary = require('../config/cloudinary');
      await cloudinary.uploader.destroy(this.avatar.publicId);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema); 