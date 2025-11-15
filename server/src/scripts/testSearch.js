import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistrictRule from '../models/DistrictRule.js';

dotenv.config();

async function testSearch() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Test 1: Aurangabad + FSI
    console.log('Test 1: Aurangabad + FSI');
    const test1 = await DistrictRule.find({
      district: 'Aurangabad',
      category: 'FSI',
      status: 'Active'
    }).limit(500);
    console.log(`   Found: ${test1.length} rules\n`);

    // Test 2: Aurangabad + Parking
    console.log('Test 2: Aurangabad + Parking');
    const test2 = await DistrictRule.find({
      district: 'Aurangabad',
      category: 'Parking',
      status: 'Active'
    }).limit(500);
    console.log(`   Found: ${test2.length} rules\n`);

    // Test 3: Aurangabad + Affordable Housing
    console.log('Test 3: Aurangabad + Affordable Housing');
    const test3 = await DistrictRule.find({
      district: 'Aurangabad',
      category: 'Affordable Housing',
      status: 'Active'
    }).limit(500);
    console.log(`   Found: ${test3.length} rules`);
    if (test3.length > 0) {
      console.log(`   Rule: ${test3[0].summary || test3[0].title || 'No title'}\n`);
    }

    // Test 4: Just Aurangabad (all categories)
    console.log('Test 4: Aurangabad (all categories)');
    const test4 = await DistrictRule.find({
      district: 'Aurangabad',
      status: 'Active'
    }).limit(500);
    console.log(`   Found: ${test4.length} rules\n`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testSearch();
