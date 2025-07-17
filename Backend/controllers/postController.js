const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const post = new Post({ author: req.user.id, content, image });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    // Home feed: posts by self and following
    const user = await User.findById(req.user.id);
    const ids = [user._id, ...user.following];
    const posts = await Post.find({ author: { $in: ids } }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExplorePosts = async (req, res) => {
  try {
    // Trending: posts with most likes
    const posts = await Post.find().sort({ likes: -1, createdAt: -1 }).limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    post.content = req.body.content || post.content;
    post.image = req.body.image || post.image;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const liked = post.likes.includes(req.user.id);
    if (liked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json({ liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new Comment({ post: req.params.id, author: req.user.id, content });
    await comment.save();
    const post = await Post.findById(req.params.id);
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({ path: 'comments', populate: { path: 'author', select: 'username avatar' } });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bookmarkPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);
    const bookmarked = user.bookmarks && user.bookmarks.includes(post._id);
    if (bookmarked) {
      user.bookmarks.pull(post._id);
    } else {
      if (!user.bookmarks) user.bookmarks = [];
      user.bookmarks.push(post._id);
    }
    await user.save();
    res.json({ bookmarked: !bookmarked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 