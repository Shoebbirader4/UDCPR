import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Rule from '../models/Rule.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing rules...');
    await Rule.deleteMany({});
    
    // Load UDCPR rules
    const rulesData = JSON.parse(
      readFileSync(join(__dirname, '../data/udcprRules.json'), 'utf-8')
    );
    
    console.log(`Inserting ${rulesData.length} UDCPR rules...`);
    await Rule.insertMany(rulesData);
    console.log('Rules inserted successfully!');

    // Create sample users
    console.log('Creating sample users...');
    await User.deleteMany({});
    
    const sampleUsers = [
      {
        name: 'Demo Architect',
        email: 'architect@demo.com',
        role: 'Architect',
        subscriptionStatus: 'pro',
        organization: 'ABC Architects'
      },
      {
        name: 'Demo Engineer',
        email: 'engineer@demo.com',
        role: 'StructuralEngineer',
        subscriptionStatus: 'free',
        organization: 'XYZ Engineering'
      }
    ];
    
    await User.insertMany(sampleUsers);
    console.log('Sample users created!');

    console.log('\n✅ Database seeded successfully!');
    console.log(`Total rules: ${rulesData.length}`);
    console.log(`Total users: ${sampleUsers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
