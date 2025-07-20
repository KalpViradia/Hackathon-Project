#!/usr/bin/env node

const connectDB = require('../config/db');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    await connectDB();
    console.log('✅ Database connection successful!');
    
    // Test basic operations
    const mongoose = require('mongoose');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections in database`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();