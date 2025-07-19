// const mongoose = require('mongoose');

// const CommentSchema = new mongoose.Schema({
//   post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   content: { type: String, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Comment', CommentSchema); 

const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: false },
  reel: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel', required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

// Ensure at least one of post or reel is present
CommentSchema.pre('validate', function (next) {
  if (!this.post && !this.reel) {
    this.invalidate('post', 'Either post or reel must be provided');
    this.invalidate('reel', 'Either post or reel must be provided');
  }
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);
