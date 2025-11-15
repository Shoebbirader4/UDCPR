import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistrictRule from '../models/DistrictRule.js';

dotenv.config();

async function checkSpecificFilter() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Check Aurangabad + Affordable Housing
    const aurangabadAffordable = await DistrictRule.find({
      district: 'Aurangabad',
      category: 'Affordable Housing'
    });

    console.log(`📊 Aurangabad + Affordable Housing: ${aurangabadAffordable.length} rules`);
    
    if (aurangabadAffordable.length > 0) {
      console.log('\n📋 Rules found:');
      aurangabadAffordable.forEach((rule, index) => {
        console.log(`\n${index + 1}. ${rule.title}`);
        console.log(`   Category: ${rule.category}`);
        console.log(`   District: ${rule.district}`);
        console.log(`   Reference: ${rule.reference}`);
      });
    }

    // Check all Affordable Housing rules
    const allAffordable = await DistrictRule.find({
      category: 'Affordable Housing'
    });
    console.log(`\n📊 Total Affordable Housing rules: ${allAffordable.length}`);

    // Check all Aurangabad rules
    const allAurangabad = await DistrictRule.find({
      district: 'Aurangabad'
    });
    console.log(`📊 Total Aurangabad rules: ${allAurangabad.length}`);

    // Show categories in Aurangabad
    const aurangabadCategories = await DistrictRule.distinct('category', { district: 'Aurangabad' });
    console.log(`\n📋 Categories in Aurangabad (${aurangabadCategories.length}):`);
    aurangabadCategories.sort().forEach(cat => console.log(`   - ${cat}`));

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkSpecificFilter();
