const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: req.user.id })
      .populate('from', 'username avatar')
      .populate('relatedPost', 'content media')
      .populate('relatedReel', 'caption video')
      .populate('relatedStory', 'media caption')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const unreadCount = await Notification.countDocuments({ 
      user: req.user.id, 
      read: false 
    });

    res.status(200).json({
      notifications,
      unreadCount,
      hasMore: notifications.length === limit
    });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false }, 
      { $set: { read: true } }
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      user: req.user.id, 
      read: false 
    });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to create notifications
exports.createNotification = async (userId, fromUserId, type, message, relatedData = {}) => {
  try {
    const notification = new Notification({
      user: userId,
      from: fromUserId,
      type,
      message,
      ...relatedData
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}; 