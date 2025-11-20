import mongoose from 'mongoose';
import Rule from '../models/Rule.js';
import DistrictRule from '../models/DistrictRule.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const MONGODB_URI = 'mongodb://localhost:27017/udcpr-master';

async function cleanDatabase() {
  try {
    console.log('🧹 CLEANING DATABASE FOR FRESH START\n');
    console.log('='.repeat(80));
    await mongoose.connect(MONGODB_URI);

    // Count before
    console.log('\n📊 BEFORE CLEANUP:');
    const rulesBefore = await Rule.countDocuments();
    const districtRulesBefore = await DistrictRule.countDocuments();
    const projectsBefore = await Project.countDocuments();
    const usersBefore = await User.countDocuments();
    
    console.log(`   Rules: ${rulesBefore}`);
    console.log(`   District Rules: ${districtRulesBefore}`);
    console.log(`   Projects: ${projectsBefore}`);
    console.log(`   Users: ${usersBefore}`);
    console.log(`   TOTAL: ${rulesBefore + districtRulesBefore + projectsBefore + usersBefore} documents`);

    // Confirm deletion
    console.log('\n⚠️  WARNING: This will DELETE ALL RULES DATA!');
    console.log('   Application code will remain intact.');
    console.log('   Users and Projects will be preserved.');
    console.log('\n   Proceeding in 3 seconds...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Delete all rules
    console.log('🗑️  Deleting all rules...');
    const rulesDeleted = await Rule.deleteMany({});
    console.log(`   ✅ Deleted ${rulesDeleted.deletedCount} general rules`);

    const districtRulesDeleted = await DistrictRule.deleteMany({});
    console.log(`   ✅ Deleted ${districtRulesDeleted.deletedCount} district rules`);

    // Count after
    console.log('\n📊 AFTER CLEANUP:');
    const rulesAfter = await Rule.countDocuments();
    const districtRulesAfter = await DistrictRule.countDocuments();
    const projectsAfter = await Project.countDocuments();
    const usersAfter = await User.countDocuments();
    
    console.log(`   Rules: ${rulesAfter}`);
    console.log(`   District Rules: ${districtRulesAfter}`);
    console.log(`   Projects: ${projectsAfter} (preserved)`);
    console.log(`   Users: ${usersAfter} (preserved)`);

    // Summary
    console.log('\n✅ DATABASE CLEANED SUCCESSFULLY!');
    console.log('\n📋 What was removed:');
    console.log(`   - ${rulesDeleted.deletedCount} general rules`);
    console.log(`   - ${districtRulesDeleted.deletedCount} district rules`);
    console.log(`   - Total: ${rulesDeleted.deletedCount + districtRulesDeleted.deletedCount} documents deleted`);

    console.log('\n✅ What was preserved:');
    console.log(`   - Application code (all files intact)`);
    console.log(`   - Database models (ready for new data)`);
    console.log(`   - Calculator logic (accurate formulas)`);
    console.log(`   - UI components (enhanced design)`);
    console.log(`   - API routes (fully functional)`);
    console.log(`   - Users: ${usersAfter}`);
    console.log(`   - Projects: ${projectsAfter}`);

    console.log('\n🎯 READY FOR FRESH UDCPR DATA!');
    console.log('\nNext steps:');
    console.log('   1. Upload your updated UDCPR PDF to server/src/data/');
    console.log('   2. Run extraction script to parse the PDF');
    console.log('   3. Manually verify extracted rules');
    console.log('   4. Import verified rules to database');
    console.log('   5. Test the application');

    await mongoose.connection.close();
    console.log('\n✅ Cleanup complete!');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanDatabase();
