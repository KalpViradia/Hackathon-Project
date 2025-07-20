const Reel = require('../models/Reel');
const Comment = require('../models/Comment');
const cloudinary = require('../config/cloudinary');
const Message = require('../models/Message');

exports.createReel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    if (!req.file.path) {
      return res.status(400).json({ message: 'Video upload failed' });
    }

    const reel = new Reel({
      user: req.user.id,
      caption: req.body.caption || '',
      video: {
        url: req.file.path,
        publicId: req.file.filename,
        thumbnail: req.file.path.replace('/upload/', '/upload/w_720,h_1280,c_fill/'),
        duration: null // Will be updated after processing
      },
      music: req.body.music || null
    });

    await reel.save();
    await reel.populate('user', 'username avatar');

    res.status(201).json({
      message: 'Reel created successfully',
      reel
    });
  } catch (err) {
    console.error('Create reel error:', err);
    res.status(500).json({ 
      message: 'Error creating reel',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate('user', 'username avatar')
      .sort('-createdAt')
      .limit(20);
    
    res.json(reels);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reels' });
  }
};

exports.getUserReels = async (req, res) => {
  try {
    const reels = await Reel.find({ user: req.params.userId })
      .populate('user', 'username avatar')
      .sort('-createdAt');
    
    res.json(reels);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user reels' });
  }
};

exports.getReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username avatar' }
      });

    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    // Increment views
    reel.views += 1;
    await reel.save();

    res.json(reel);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reel' });
  }
};

exports.likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    const likeIndex = reel.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      reel.likes.splice(likeIndex, 1);
      await reel.save();
      return res.json({ message: 'Reel unliked' });
    }

    reel.likes.push(req.user.id);
    await reel.save();
    res.json({ message: 'Reel liked' });
  } catch (err) {
    res.status(500).json({ message: 'Error liking reel' });
  }
};

exports.commentOnReel = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    const comment = new Comment({
      user: req.user.id,
      content,
      reel: reel._id
    });

    await comment.save();
    await comment.populate({
      path: 'user',
      select: 'username avatar'
    });

    reel.comments.push(comment._id);
    await reel.save();

    // Return populated comment data
    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        id: comment._id,
        content: comment.content,
        user: comment.user,
        createdAt: comment.createdAt
      }
    });
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ 
      message: 'Error adding comment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

exports.shareReel = async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    // Create a new message with the reel
    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content: 'Shared a reel with you!',
      reelShare: {
        reelId: reel._id,
        thumbnail: reel.video.thumbnail,
        caption: reel.caption
      }
    });

    await message.save();
    reel.shares += 1;
    await reel.save();

    res.json({
      message: 'Reel shared successfully',
      shareCount: reel.shares,
      sharedMessage: await message.populate('sender receiver', 'username avatar')
    });
  } catch (err) {
    console.error('Share error:', err);
    res.status(500).json({ 
      message: 'Error sharing reel',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

exports.deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    if (reel.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete video from Cloudinary
    if (reel.video.publicId) {
      await cloudinary.uploader.destroy(reel.video.publicId, { resource_type: 'video' });
    }

    await reel.remove();
    res.json({ message: 'Reel deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting reel' });
  }
};
