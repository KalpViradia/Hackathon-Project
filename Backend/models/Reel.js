const mongoose = require('mongoose');

const ReelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    maxLength: 500
  },
  video: {
    url: {
      type: String,
      required: true
    },
    publicId: String,
    thumbnail: String,
    duration: Number
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  shares: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  music: {
    name: String,
    artist: String,
    url: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Reel', ReelSchema);
