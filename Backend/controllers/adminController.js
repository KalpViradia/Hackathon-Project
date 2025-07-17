const User = require('../models/User');
const Report = require('../models/Report');
const Post = require('../models/Post');
const Story = require('../models/Story');
const Comment = require('../models/Comment');

function requireAdmin(req, res) {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
}

exports.getAllUsers = async (req, res) => {
  if (requireAdmin(req, res)) return;
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReports = async (req, res) => {
  if (requireAdmin(req, res)) return;
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.banUser = async (req, res) => {
  if (requireAdmin(req, res)) return;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeContent = async (req, res) => {
  if (requireAdmin(req, res)) return;
  try {
    const { id } = req.params;
    // Try to remove from Post, Story, Comment
    await Post.findByIdAndDelete(id);
    await Story.findByIdAndDelete(id);
    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Content removed (if existed)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 