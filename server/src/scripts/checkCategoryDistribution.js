import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistrictRule from '../models/DistrictRule.js';

dotenv.config();

async function checkCategoryDistribution() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    const district = 'Aurangabad';
    
    // Get all categories for Aurangabad
    const categories = await DistrictRule.distinct('category', { district });
    
    console.log(`📊 ${district} - Rules per Category:\n`);
    
    for (const category of categories.sort()) {
      const count = await DistrictRule.countDocuments({ district, category });
      console.log(`   ${category}: ${count} rule${count !== 1 ? 's' : ''}`);
    }

    console.log('\n📋 Sample: FSI rules for Aurangabad:');
    const fsiRules = await DistrictRule.find({ district, category: 'FSI' }).limit(5);
    fsiRules.forEach((rule, i) => {
      console.log(`   ${i + 1}. ${rule.summary || rule.title || 'No title'}`);
    });

    console.log('\n📋 Sample: Parking rules for Aurangabad:');
    const parkingRules = await DistrictRule.find({ district, category: 'Parking' }).limit(5);
    parkingRules.forEach((rule, i) => {
      console.log(`   ${i + 1}. ${rule.summary || rule.title || 'No title'}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCategoryDistribution();
