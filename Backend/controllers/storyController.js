const Story = require('../models/Story');
const User = require('../models/User');
const Message = require('../models/Message');

exports.createStory = async (req, res) => {
  try {
    const { media, expiresAt } = req.body;
    const story = new Story({ author: req.user.id, media, expiresAt });
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStories = async (req, res) => {
  try {
    // Active stories (not archived, not expired)
    const now = new Date();
    const stories = await Story.find({ isArchived: false, expiresAt: { $gt: now } }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getArchivedStories = async (req, res) => {
  try {
    const stories = await Story.find({ author: req.user.id, isArchived: true });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.archiveStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    story.isArchived = true;
    await story.save();
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (!story.viewers.includes(req.user.id)) {
      story.viewers.push(req.user.id);
      await story.save();
    }
    res.json({ viewed: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.replyToStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    const { content } = req.body;
    const message = new Message({ sender: req.user.id, receiver: story.author, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 