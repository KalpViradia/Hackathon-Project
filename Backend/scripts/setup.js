#!/usr/bin/env node

const { spawn } = require('child_process');
const { seedDatabase } = require('../seeders/databaseSeeder');
const connectDB = require('../config/db');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    
    // Connect to database
    console.log('📡 Connecting to MongoDB...');
    await connectDB();
    
    // Seed database
    console.log('🌱 Seeding database with sample data...');
    await seedDatabase();
    
    console.log('✅ Database setup completed successfully!');
    console.log('\n🎉 Your social media app is ready to use!');
    console.log('\n📝 Login credentials:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
    console.log('Email: mike@example.com | Password: password123');
    console.log('\n🚀 Start the server with: npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Check if we should also start the server
const args = process.argv.slice(2);
const shouldStartServer = args.includes('--start-server');

if (shouldStartServer) {
  setupDatabase().then(() => {
    console.log('🚀 Starting server...');
    const server = spawn('npm', ['start'], {
      stdio: 'inherit',
      shell: true
    });
    
    server.on('error', (error) => {
      console.error('Failed to start server:', error);
    });
  });
} else {
  setupDatabase();
}