import mongoose from 'mongoose';
import Rule from '../models/Rule.js';
import DistrictRule from '../models/DistrictRule.js';

const MONGODB_URI = 'mongodb://localhost:27017/udcpr-master';

async function quickTest() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected\n');

    // Check Rule collection
    console.log('=== RULE COLLECTION (General Rules) ===');
    const totalRules = await Rule.countDocuments();
    console.log(`Total rules: ${totalRules}`);
    
    const sampleRules = await Rule.find({}).limit(3);
    console.log('\nSample rules:');
    sampleRules.forEach((r, i) => {
      console.log(`${i+1}. ${r.summary?.substring(0, 100)}`);
      console.log(`   Category: ${r.category}, Chapter: ${r.chapter}`);
    });

    // Check if text search works
    console.log('\n=== TESTING TEXT SEARCH ===');
    const searchResults = await Rule.find({ $text: { $search: 'FSI' } }).limit(5);
    console.log(`Text search for "FSI": ${searchResults.length} results`);

    // Check DistrictRule collection
    console.log('\n=== DISTRICT RULE COLLECTION ===');
    const totalDistrictRules = await DistrictRule.countDocuments();
    console.log(`Total district rules: ${totalDistrictRules}`);
    
    const sampleDistrictRules = await DistrictRule.find({}).limit(3);
    console.log('\nSample district rules:');
    sampleDistrictRules.forEach((r, i) => {
      console.log(`${i+1}. ${r.summary?.substring(0, 100)}`);
      console.log(`   District: ${r.district}, Category: ${r.category}`);
    });

    // Test district search
    console.log('\n=== TESTING DISTRICT SEARCH ===');
    const aurangabadRules = await DistrictRule.find({ district: 'Aurangabad' }).limit(5);
    console.log(`Aurangabad rules: ${aurangabadRules.length} results`);
    if (aurangabadRules.length > 0) {
      console.log(`First rule: ${aurangabadRules[0].summary?.substring(0, 100)}`);
    }

    // Test category search
    const fsiRules = await DistrictRule.find({ category: 'FSI' }).limit(5);
    console.log(`FSI category rules: ${fsiRules.length} results`);

    // Test combined search
    const aurangabadFSI = await DistrictRule.find({ 
      district: 'Aurangabad', 
      category: 'FSI' 
    }).limit(5);
    console.log(`Aurangabad + FSI: ${aurangabadFSI.length} results`);

    await mongoose.connection.close();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

quickTest();
