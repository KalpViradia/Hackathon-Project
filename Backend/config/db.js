const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/social_media_db';

    if (!mongoUri || mongoUri === 'undefined') {
      throw new Error('MongoDB URI is not defined. Please set MONGODB_URI in your .env file');
    }

    // Remove deprecated options - they're no longer needed in newer versions
    await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB connected successfully to: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 