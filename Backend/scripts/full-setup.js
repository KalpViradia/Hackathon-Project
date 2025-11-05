#!/usr/bin/env node

const { spawn } = require('child_process');
const { seedDatabase } = require('../seeders/databaseSeeder');
const connectDB = require('../config/db');

async function fullSetup() {
  console.log('🚀 Starting full application setup...\n');

  try {
    // Step 1: Test database connection
    console.log('📡 Step 1: Testing database connection...');
    await connectDB();
    console.log('✅ Database connection successful!\n');

    // Step 2: Seed database
    console.log('🌱 Step 2: Seeding database with sample data...');
    await seedDatabase();
    console.log('✅ Database seeded successfully!\n');

    // Step 3: Display login credentials
    console.log('🔐 Login Credentials:');
    console.log('┌─────────────────────┬─────────────┐');
    console.log('│ Email               │ Password    │');
    console.log('├─────────────────────┼─────────────┤');
    console.log('│ john@example.com    │ password123 │');
    console.log('│ jane@example.com    │ password123 │');
    console.log('│ mike@example.com    │ password123 │');
    console.log('│ sarah@example.com   │ password123 │');
    console.log('│ alex@example.com    │ password123 │');
    console.log('│ emma@example.com    │ password123 │');
    console.log('└─────────────────────┴─────────────┘\n');

    // Step 4: Instructions
    console.log('🎯 Next Steps:');
    console.log('1. Start Backend:  npm start');
    console.log('2. Start Frontend: cd ../nextjs-social-app && npm run dev');
    console.log('3. Open Browser:   http://localhost:3000/login\n');

    console.log('🎉 Setup completed successfully!');
    
    // Ask if user wants to start the server
    const args = process.argv.slice(2);
    if (args.includes('--start')) {
      console.log('\n🚀 Starting backend server...');
      const server = spawn('npm', ['start'], {
        stdio: 'inherit',
        shell: true
      });
      
      server.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
      });
    } else {
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env file has MONGODB_URI');
    console.log('2. Ensure MongoDB is running');
    console.log('3. Run: npm run test-db');
    process.exit(1);
  }
}

fullSetup();