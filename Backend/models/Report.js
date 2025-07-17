const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentType: { type: String, enum: ['post', 'story', 'comment'], required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema); 