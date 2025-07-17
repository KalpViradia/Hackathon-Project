const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/jwt');

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            avatar: `https://ui-avatars.com/api/?name=${username}&background=random`
        });

        // Generate token
        const token = signToken({ id: user._id });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = signToken({ id: user._id });

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
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};