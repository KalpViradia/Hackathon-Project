const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, content, media } = req.body;
    const message = new Message({ sender: req.user.id, receiver, content, media });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessagesWithUser = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllConversations = async (req, res) => {
  try {
    const messages = await Message.find({ $or: [ { sender: req.user.id }, { receiver: req.user.id } ] });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 