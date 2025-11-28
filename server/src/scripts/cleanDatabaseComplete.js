import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Rule from '../models/Rule.js';
import DistrictRule from '../models/DistrictRule.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Complete Database Cleanup Script
 * Options:
 * - Clean only rules (preserve users and projects)
 * - Clean everything (complete reset)
 */

async function cleanDatabase() {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║         UDCPR DATABASE CLEANUP UTILITY                        ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/udcpr-master';
    console.log(`   URI: ${mongoUri.replace(/\/\/.*:.*@/, '//***:***@')}`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully\n');

    // Get current counts
    console.log('📊 CURRENT DATABASE STATUS:');
    console.log('─'.repeat(65));
    
    const ruleCount = await Rule.countDocuments();
    const districtRuleCount = await DistrictRule.countDocuments();
    const projectCount = await Project.countDocuments();
    const userCount = await User.countDocuments();
    const totalCount = ruleCount + districtRuleCount + projectCount + userCount;

    console.log(`   General Rules:        ${ruleCount.toString().padStart(6)}`);
    console.log(`   District Rules:       ${districtRuleCount.toString().padStart(6)}`);
    console.log(`   Projects:             ${projectCount.toString().padStart(6)}`);
    console.log(`   Users:                ${userCount.toString().padStart(6)}`);
    console.log('─'.repeat(65));
    console.log(`   TOTAL DOCUMENTS:      ${totalCount.toString().padStart(6)}\n`);

    // Determine what to clean based on command line argument
    const cleanAll = process.argv.includes('--all');

    if (cleanAll) {
      console.log('🗑️  MODE: COMPLETE DATABASE RESET');
      console.log('   This will delete ALL data including users and projects!\n');
    } else {
      console.log('🗑️  MODE: RULES CLEANUP ONLY');
      console.log('   This will delete all rules but preserve users and projects\n');
    }

    console.log('⚠️  WARNING: This action cannot be undone!');
    console.log('   Starting cleanup in 3 seconds...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🧹 CLEANING DATABASE...\n');

    let deletedCount = 0;

    // Always delete rules
    console.log('   Deleting general rules...');
    const deletedRules = await Rule.deleteMany({});
    console.log(`   ✅ Deleted ${deletedRules.deletedCount} general rules`);
    deletedCount += deletedRules.deletedCount;

    console.log('   Deleting district rules...');
    const deletedDistrictRules = await DistrictRule.deleteMany({});
    console.log(`   ✅ Deleted ${deletedDistrictRules.deletedCount} district rules`);
    deletedCount += deletedDistrictRules.deletedCount;

    if (cleanAll) {
      console.log('   Deleting projects...');
      const deletedProjects = await Project.deleteMany({});
      console.log(`   ✅ Deleted ${deletedProjects.deletedCount} projects`);
      deletedCount += deletedProjects.deletedCount;

      console.log('   Deleting users...');
      const deletedUsers = await User.deleteMany({});
      console.log(`   ✅ Deleted ${deletedUsers.deletedCount} users`);
      deletedCount += deletedUsers.deletedCount;
    }

    // Verify cleanup
    console.log('\n📊 DATABASE AFTER CLEANUP:');
    console.log('─'.repeat(65));
    
    const remainingRules = await Rule.countDocuments();
    const remainingDistrictRules = await DistrictRule.countDocuments();
    const remainingProjects = await Project.countDocuments();
    const remainingUsers = await User.countDocuments();
    const remainingTotal = remainingRules + remainingDistrictRules + remainingProjects + remainingUsers;

    console.log(`   General Rules:        ${remainingRules.toString().padStart(6)}`);
    console.log(`   District Rules:       ${remainingDistrictRules.toString().padStart(6)}`);
    console.log(`   Projects:             ${remainingProjects.toString().padStart(6)} ${cleanAll ? '' : '(preserved)'}`);
    console.log(`   Users:                ${remainingUsers.toString().padStart(6)} ${cleanAll ? '' : '(preserved)'}`);
    console.log('─'.repeat(65));
    console.log(`   TOTAL DOCUMENTS:      ${remainingTotal.toString().padStart(6)}\n`);

    // Summary
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                  CLEANUP COMPLETED SUCCESSFULLY               ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    console.log('📋 SUMMARY:');
    console.log(`   Total documents deleted: ${deletedCount}`);
    console.log(`   Total documents remaining: ${remainingTotal}\n`);

    console.log('✅ WHAT\'S PRESERVED:');
    console.log('   ✓ Application code (all files intact)');
    console.log('   ✓ Database models (ready for new data)');
    console.log('   ✓ Calculator logic (accurate formulas)');
    console.log('   ✓ UI components (enhanced design)');
    console.log('   ✓ API routes (fully functional)');
    if (!cleanAll) {
      console.log(`   ✓ Users: ${remainingUsers}`);
      console.log(`   ✓ Projects: ${remainingProjects}`);
    }

    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Upload your UDCPR PDF/DOCX to server/src/data/');
    console.log('   2. Run extraction script to parse the document');
    console.log('   3. Manually verify extracted rules');
    console.log('   4. Import verified rules to database');
    console.log('   5. Test the application\n');

    console.log('💡 QUICK COMMANDS:');
    console.log('   npm run seed              - Seed with sample data');
    console.log('   npm run seed-districts    - Seed district-specific rules');
    console.log('   npm run check-rules       - Check current rules in DB\n');

    await mongoose.connection.close();
    console.log('📡 Database connection closed');
    console.log('═'.repeat(65) + '\n');

  } catch (error) {
    console.error('\n❌ ERROR OCCURRED:');
    console.error('─'.repeat(65));
    console.error(error);
    console.error('─'.repeat(65) + '\n');
    process.exit(1);
  }
}

// Run the cleanup
cleanDatabase();
