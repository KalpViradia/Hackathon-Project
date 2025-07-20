const Story = require('../models/Story');
const User = require('../models/User');
const Message = require('../models/Message');
const { createNotification } = require('./notificationController');
const cloudinary = require('../config/cloudinary');

exports.createStory = async (req, res) => {
  try {
    const { caption, backgroundColor, textColor } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const story = new Story({
      user: req.user.id,
      media: {
        url: req.file.path,
        type: req.file.mimetype.startsWith('video/') ? 'video' : 'image',
        publicId: req.file.filename
      },
      caption: caption || '',
      backgroundColor: backgroundColor || '#000000',
      textColor: textColor || '#ffffff'
    });

    await story.save();
    await story.populate('user', 'username avatar');

    res.status(201).json({
      message: 'Story created successfully',
      story
    });
  } catch (err) {
    console.error('Create story error:', err);
    res.status(500).json({ message: 'Error creating story' });
  }
};

exports.getStories = async (req, res) => {
  try {
    // Get stories from followed users and own stories
    const currentUser = await User.findById(req.user.id).populate('following');
    const followingIds = currentUser.following.map(user => user._id);
    followingIds.push(req.user.id); // Include own stories

    const stories = await Story.find({ 
      user: { $in: followingIds },
      archived: false, 
      expiresAt: { $gt: new Date() } 
    })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 });

    // Group stories by user
    const groupedStories = {};
    stories.forEach(story => {
      const userId = story.user._id.toString();
      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          user: story.user,
          stories: []
        };
      }
      groupedStories[userId].stories.push(story);
    });

    res.status(200).json(Object.values(groupedStories));
  } catch (err) {
    console.error('Get stories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserStories = async (req, res) => {
  try {
    const stories = await Story.find({ 
      user: req.params.userId,
      archived: false, 
      expiresAt: { $gt: new Date() } 
    })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getArchivedStories = async (req, res) => {
  try {
    const stories = await Story.find({ 
      user: req.user.id, 
      archived: true 
    })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 });
    
    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate('viewers.user', 'username avatar');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if story has expired
    if (story.expiresAt < new Date() && !story.archived) {
      return res.status(404).json({ message: 'Story has expired' });
    }

    res.status(200).json(story);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.archiveStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    story.archived = true;
    await story.save();
    res.status(200).json({ message: 'Story archived successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    
    // Don't add view if it's the story owner
    if (story.user.toString() === req.user.id) {
      return res.status(200).json({ message: 'Story viewed' });
    }

    // Check if user already viewed this story
    const alreadyViewed = story.viewers.some(
      viewer => viewer.user && viewer.user.toString() === req.user.id
    );

    if (!alreadyViewed) {
      story.viewers.push({
        user: req.user.id,
        viewedAt: new Date()
      });
      await story.save();

      // Create notification for story owner
      await createNotification(
        story.user,
        req.user.id,
        'story_view',
        'viewed your story',
        { relatedStory: story._id }
      );
    }

    res.status(200).json({ message: 'Story viewed' });
  } catch (err) {
    console.error('View story error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.replyToStory = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    
    const reply = new Message({ 
      sender: req.user.id, 
      receiver: story.user, 
      content: `Replied to your story: ${content}` 
    });
    await reply.save();
    
    story.replies.push(reply._id);
    await story.save();

    // Create notification
    await createNotification(
      story.user,
      req.user.id,
      'story_reply',
      'replied to your story',
      { relatedStory: story._id }
    );

    res.status(200).json({ 
      message: 'Reply sent successfully',
      reply 
    });
  } catch (err) {
    console.error('Reply to story error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete media from Cloudinary
    if (story.media.publicId) {
      const resourceType = story.media.type === 'video' ? 'video' : 'image';
      await cloudinary.uploader.destroy(story.media.publicId, { resource_type: resourceType });
    }

    await story.remove();
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (err) {
    console.error('Delete story error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};