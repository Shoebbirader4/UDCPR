import mongoose from 'mongoose';
import DistrictRule from '../models/DistrictRule.js';

const MONGODB_URI = 'mongodb://localhost:27017/udcpr-master';

async function deleteInvalidRules() {
  try {
    console.log('🗑️  DELETING INVALID DISTRICT RULES\n');
    console.log('='.repeat(80));
    await mongoose.connect(MONGODB_URI);

    // Count before
    const totalBefore = await DistrictRule.countDocuments();
    console.log(`\n📊 Before: ${totalBefore} district rules`);

    // Count invalid rules
    const invalidChapter15 = await DistrictRule.countDocuments({ chapter: /Chapter 15/ });
    const invalidChapter16 = await DistrictRule.countDocuments({ chapter: /Chapter 16/ });
    const invalidChapter17 = await DistrictRule.countDocuments({ chapter: /Chapter 17/ });
    
    console.log(`\n❌ Invalid rules found:`);
    console.log(`   Chapter 15: ${invalidChapter15} rules`);
    console.log(`   Chapter 16: ${invalidChapter16} rules`);
    console.log(`   Chapter 17: ${invalidChapter17} rules`);
    console.log(`   Total invalid: ${invalidChapter15 + invalidChapter16 + invalidChapter17} rules`);

    // Show sample of what will be deleted
    console.log(`\n📋 Sample rules to be deleted:`);
    const samples = await DistrictRule.find({ 
      chapter: { $in: ['Chapter 15', 'Chapter 16', 'Chapter 17'] } 
    }).limit(5);
    
    samples.forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.district} - ${r.category}`);
      console.log(`   ${r.chapter}, Section ${r.section}, Clause ${r.clause}`);
      console.log(`   ${r.summary?.substring(0, 80)}`);
    });

    // Confirm deletion
    console.log(`\n\n⚠️  About to delete ${invalidChapter15 + invalidChapter16 + invalidChapter17} rules`);
    console.log('   This action cannot be undone!');
    console.log('\n   Proceeding in 3 seconds...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Delete invalid rules
    const result = await DistrictRule.deleteMany({
      chapter: { $in: ['Chapter 15', 'Chapter 16', 'Chapter 17'] }
    });

    console.log(`✅ Deleted: ${result.deletedCount} rules`);

    // Count after
    const totalAfter = await DistrictRule.countDocuments();
    console.log(`\n📊 After: ${totalAfter} district rules`);
    console.log(`📉 Reduction: ${totalBefore - totalAfter} rules (${((totalBefore - totalAfter) / totalBefore * 100).toFixed(1)}%)`);

    // Show remaining chapter distribution
    console.log(`\n📊 Remaining chapter distribution:`);
    const chapterDist = await DistrictRule.aggregate([
      { $group: { _id: '$chapter', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    chapterDist.forEach(ch => {
      console.log(`   ${ch._id}: ${ch.count} rules`);
    });

    // Show category distribution
    console.log(`\n📊 Category distribution:`);
    const categoryDist = await DistrictRule.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    categoryDist.slice(0, 10).forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} rules`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Cleanup complete!');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

deleteInvalidRules();
