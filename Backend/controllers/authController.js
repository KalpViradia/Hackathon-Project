const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create user with admin flag if specified (for testing)
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been banned' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Get token from auth header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Add token to blacklist
    await TokenBlacklist.create({
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed' });
  }
};

exports.autoLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been banned' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error('Auto-login error:', err);
    res.status(500).json({ message: 'Auto-login failed' });
  }
};