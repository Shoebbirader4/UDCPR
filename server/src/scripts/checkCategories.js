import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistrictRule from '../models/DistrictRule.js';

dotenv.config();

async function checkCategories() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Get all unique categories
    const categories = await DistrictRule.distinct('category');
    console.log(`📊 Total Categories: ${categories.length}\n`);

    console.log('📋 All Categories:');
    categories.sort().forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat}`);
    });

    // Check for missing categories
    const expectedCategories = [
      'FSI',
      'Setback',
      'Height',
      'Parking',
      'Heritage',
      'TDR',
      'Amenity',
      'Environmental',
      'Safety',
      'Accessibility',
      'CRZ',
      'TOD',
      'Affordable Housing',
      'Mixed Use',
      'Special Buildings',
      'Land Use',
      'Zoning',
      'Infrastructure',
      'Social Infrastructure',
      'Redevelopment',
      'Regularization'
    ];

    console.log(`\n🎯 Expected Categories: ${expectedCategories.length}`);
    
    const missing = expectedCategories.filter(cat => !categories.includes(cat));
    if (missing.length > 0) {
      console.log(`\n❌ Missing Categories (${missing.length}):`);
      missing.forEach(cat => console.log(`   - ${cat}`));
    } else {
      console.log('\n✅ All 21 categories are present!');
    }

    // Count rules per category
    console.log('\n📊 Rules per Category:');
    for (const cat of categories.sort()) {
      const count = await DistrictRule.countDocuments({ category: cat });
      console.log(`   ${cat}: ${count} rules`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCategories();
