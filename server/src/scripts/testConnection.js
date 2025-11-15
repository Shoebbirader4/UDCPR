import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

async function testConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env file');
    console.log('\n📝 Please add MONGODB_URI to server/.env file');
    console.log('Example: MONGODB_URI=mongodb://localhost:27017/udcpr-master');
    process.exit(1);
  }

  console.log('📍 Connection URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
  console.log('⏳ Attempting to connect...\n');

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB Connected Successfully!\n');

    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Database:', db.databaseName);
    console.log('📁 Collections:', collections.length);
    
    if (collections.length > 0) {
      console.log('\nExisting collections:');
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  - ${col.name}: ${count} documents`);
      }
    } else {
      console.log('\n⚠️  No collections found. Run "npm run seed" to populate database.');
    }

    console.log('\n✨ Connection test completed successfully!');
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!\n');
    console.error('Error:', error.message);
    
    console.log('\n🔧 Troubleshooting:');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('  - MongoDB service is not running');
      console.log('  - For local: Run "net start MongoDB" (Windows)');
      console.log('  - For Atlas: Check internet connection');
    } else if (error.message.includes('authentication failed')) {
      console.log('  - Check username and password in connection string');
      console.log('  - Ensure database user has correct permissions');
    } else if (error.message.includes('Could not connect')) {
      console.log('  - For Atlas: Check IP whitelist in Network Access');
      console.log('  - Verify connection string is correct');
    } else {
      console.log('  - Check MONGODB_URI in server/.env file');
      console.log('  - Refer to MONGODB_SETUP.md for detailed instructions');
    }
    
    process.exit(1);
  }
}

testConnection();
