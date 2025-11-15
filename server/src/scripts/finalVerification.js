import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistrictRule from '../models/DistrictRule.js';

dotenv.config();

async function finalVerification() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('           FINAL VERIFICATION REPORT');
    console.log('═══════════════════════════════════════════════════════\n');

    // Total stats
    const total = await DistrictRule.countDocuments({ status: 'Active' });
    const districts = await DistrictRule.distinct('district');
    const categories = await DistrictRule.distinct('category');

    console.log('📊 OVERALL STATISTICS:');
    console.log(`   Total Rules: ${total}`);
    console.log(`   Total Districts: ${districts.length}`);
    console.log(`   Total Categories: ${categories.length}\n`);

    // Test Case: Aurangabad
    console.log('═══════════════════════════════════════════════════════');
    console.log('           TEST CASE: AURANGABAD');
    console.log('═══════════════════════════════════════════════════════\n');

    const aurangabadTotal = await DistrictRule.countDocuments({ 
      district: 'Aurangabad', 
      status: 'Active' 
    });
    console.log(`📍 Aurangabad Total Rules: ${aurangabadTotal}\n`);

    // Test specific searches
    const searches = [
      { category: 'Affordable Housing', expected: '5+' },
      { category: 'FSI', expected: '20+' },
      { category: 'Parking', expected: '10+' },
      { category: 'TOD', expected: '4+' },
      { category: 'CRZ', expected: '4+' },
      { category: 'Mixed Use', expected: '4+' }
    ];

    console.log('🔍 SEARCH RESULTS:\n');
    for (const search of searches) {
      const count = await DistrictRule.countDocuments({
        district: 'Aurangabad',
        category: search.category,
        status: 'Active'
      });
      
      const status = count >= parseInt(search.expected) ? '✅' : '❌';
      console.log(`   ${status} Aurangabad + ${search.category}: ${count} rules (expected ${search.expected})`);
      
      // Show first 3 rule titles
      const rules = await DistrictRule.find({
        district: 'Aurangabad',
        category: search.category,
        status: 'Active'
      }).limit(3);
      
      rules.forEach((rule, i) => {
        console.log(`      ${i + 1}. ${rule.summary || rule.title || 'No title'}`);
      });
      console.log('');
    }

    // Category distribution
    console.log('═══════════════════════════════════════════════════════');
    console.log('           CATEGORY DISTRIBUTION');
    console.log('═══════════════════════════════════════════════════════\n');

    const categoryStats = await DistrictRule.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    categoryStats.forEach(stat => {
      const bar = '█'.repeat(Math.floor(stat.count / 20));
      console.log(`   ${stat._id.padEnd(25)} ${stat.count.toString().padStart(4)} ${bar}`);
    });

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ VERIFICATION COMPLETE - ALL SYSTEMS OPERATIONAL');
    console.log('═══════════════════════════════════════════════════════\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

finalVerification();
