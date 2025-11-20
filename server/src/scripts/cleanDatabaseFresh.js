import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Rule from '../models/Rule.js';
import DistrictRule from '../models/DistrictRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Clean database - Remove all rules to prepare for fresh DOCX import
 */

async function cleanDatabase() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('     DATABASE CLEANUP - PREPARING FOR DOCX IMPORT');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/udcpr-master';
    console.log(`   URI: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Get current counts
    const ruleCount = await Rule.countDocuments();
    const districtRuleCount = await DistrictRule.countDocuments();

    console.log('📊 Current Database Status:');
    console.log(`   General Rules: ${ruleCount}`);
    console.log(`   District Rules: ${districtRuleCount}`);
    console.log(`   Total: ${ruleCount + districtRuleCount}\n`);

    // Confirm deletion
    console.log('🗑️  Deleting all rules...\n');

    // Delete all general rules
    const deletedRules = await Rule.deleteMany({});
    console.log(`   ✅ Deleted ${deletedRules.deletedCount} general rules`);

    // Delete all district rules
    const deletedDistrictRules = await DistrictRule.deleteMany({});
    console.log(`   ✅ Deleted ${deletedDistrictRules.deletedCount} district rules\n`);

    // Verify cleanup
    const remainingRules = await Rule.countDocuments();
    const remainingDistrictRules = await DistrictRule.countDocuments();

    console.log('📊 Database After Cleanup:');
    console.log(`   General Rules: ${remainingRules}`);
    console.log(`   District Rules: ${remainingDistrictRules}`);
    console.log(`   Total: ${remainingRules + remainingDistrictRules}\n`);

    if (remainingRules === 0 && remainingDistrictRules === 0) {
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('✅ DATABASE CLEANED SUCCESSFULLY');
      console.log('═══════════════════════════════════════════════════════════════\n');
      console.log('📁 Database is now empty and ready for DOCX import\n');
      console.log('Next steps:');
      console.log('1. Upload UDCPR DOCX file to server/src/data/');
      console.log('2. Upload Mumbai-DCPR DOCX file to server/src/data/');
      console.log('3. Run extraction script for DOCX files\n');
    } else {
      console.log('⚠️  Warning: Some rules remain in database');
    }

    await mongoose.connection.close();
    console.log('📡 Database connection closed\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanDatabase();
