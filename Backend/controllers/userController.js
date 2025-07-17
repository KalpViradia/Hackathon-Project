const User = require('../models/User');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.followUnfollowUser = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const isFollowing = me.following.includes(target._id);
    if (isFollowing) {
      me.following.pull(target._id);
      target.followers.pull(me._id);
    } else {
      me.following.push(target._id);
      target.followers.push(me._id);
    }
    await me.save();
    await target.save();
    res.json({ following: !isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('followers', 'username avatar');
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('following', 'username avatar');
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.blockUnblockUser = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const isBlocked = me.blocked.includes(target._id);
    if (isBlocked) {
      me.blocked.pull(target._id);
    } else {
      me.blocked.push(target._id);
    }
    await me.save();
    res.json({ blocked: !isBlocked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 