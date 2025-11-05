#!/usr/bin/env node

const { seedDatabase } = require('../seeders/databaseSeeder');
const connectDB = require('../config/db');

async function runSeeder() {
  try {
    console.log('🚀 Connecting to database...');
    await connectDB();
    
    console.log('🌱 Running database seeder...');
    await seedDatabase();
    
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeder();