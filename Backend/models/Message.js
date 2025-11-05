const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  media: { type: String },
  read: { type: Boolean, default: false },
  reelShare: {
    reelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel' },
    thumbnail: String,
    caption: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);