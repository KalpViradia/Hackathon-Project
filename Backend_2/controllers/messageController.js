const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver,
      content
    });

    await message.save();

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: message
    });
  } catch (err) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

exports.getMessagesWithUser = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'username avatar')
    .populate('receiver', 'username avatar');

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

exports.getAllConversations = async (req, res) => {
  try {
    // Get the latest message for each conversation
    const messages = await Message.aggregate([
      { $match: { $or: [ { sender: req.user._id }, { receiver: req.user._id } ] } },
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', req.user._id] },
            '$receiver',
            '$sender'
          ]
        },
        lastMessage: { $first: '$content' },
        lastMessageAt: { $first: '$createdAt' },
        sender: { $first: '$sender' },
        receiver: { $first: '$receiver' }
      } },
      { $sort: { lastMessageAt: -1 } }
    ]);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};