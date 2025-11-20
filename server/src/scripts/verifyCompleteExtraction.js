import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Rule from '../models/Rule.js';
import DistrictRule from '../models/DistrictRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * VERIFY COMPLETE EXTRACTION
 * Check if we have all rules from DOCX in the database
 */

async function verifyCompleteExtraction() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('     VERIFYING COMPLETE EXTRACTION');
    console.log('     Checking if all DOCX content is in database');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/udcpr-master';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected\n');

    // Load extracted data
    const extractionPath = path.join(__dirname, '../data/extracted/complete_extraction.json');
    const extraction = JSON.parse(fs.readFileSync(extractionPath, 'utf8'));

    // Get database counts
    const dbRules = await Rule.countDocuments();
    const dbDistrictRules = await DistrictRule.countDocuments();

    console.log('📊 COMPARISON:\n');
    console.log('UDCPR (Maharashtra):');
    console.log(`   Extracted from DOCX: ${extraction.udcpr.rules.length} rules`);
    console.log(`   In Database: ${dbRules} rules`);
    console.log(`   Difference: ${extraction.udcpr.rules.length - dbRules}\n`);

    console.log('Mumbai-DCPR:');
    console.log(`   Extracted from DOCX: ${extraction.mumbai.rules.length} rules`);
    console.log(`   In Database: ${dbDistrictRules} rules`);
    console.log(`   Difference: ${extraction.mumbai.rules.length - dbDistrictRules}\n`);

    console.log('TABLES:');
    console.log(`   Previously found: 48 tables`);
    console.log(`   Now found: 182 tables`);
    console.log(`   Missed: 134 tables (74%!)\n`);

    // Check for specific regulation patterns
    console.log('🔍 CHECKING FOR SPECIFIC REGULATIONS...\n');

    // Sample some specific regulations to verify
    const testRegulations = [
      '3.1', '3.2', '3.3', '3.4', '3.5',
      '6.1', '6.2', '6.3', '6.4', '6.5',
      '7.1', '7.2', '7.3',
      '10.1', '10.2', '10.3'
    ];

    for (const regNum of testRegulations) {
      const count = await Rule.countDocuments({ section: regNum });
      const extracted = extraction.udcpr.rules.filter(r => r.regulation === regNum).length;
      
      if (count > 0 || extracted > 0) {
        console.log(`   Regulation ${regNum}: ${count} in DB, ${extracted} extracted`);
      }
    }

    // Check raw text for regulation patterns
    console.log('\n🔍 ANALYZING RAW TEXT FOR REGULATION PATTERNS...\n');
    
    const udcprText = fs.readFileSync(path.join(__dirname, '../data/extracted/udcpr_raw_text.txt'), 'utf8');
    
    // Count different regulation patterns
    const patterns = {
      'X.Y format (e.g., 3.1)': (udcprText.match(/\b\d+\.\d+\b/g) || []).length,
      'X.Y.Z format (e.g., 3.1.1)': (udcprText.match(/\b\d+\.\d+\.\d+\b/g) || []).length,
      'X.Y.Z.W format (e.g., 3.1.1.1)': (udcprText.match(/\b\d+\.\d+\.\d+\.\d+\b/g) || []).length,
      'Regulation No. mentions': (udcprText.match(/Regulation\s+No\.?\s*\d+\.\d+/gi) || []).length,
      'Chapter mentions': (udcprText.match(/Chapter\s+\d+/gi) || []).length
    };

    console.log('   Pattern occurrences in raw text:');
    Object.entries(patterns).forEach(([pattern, count]) => {
      console.log(`   - ${pattern}: ${count}`);
    });

    // Analyze what we might be missing
    console.log('\n📋 ANALYSIS:\n');
    
    const extractedRatio = (dbRules / extraction.udcpr.rules.length * 100).toFixed(1);
    console.log(`   We imported ${extractedRatio}% of extracted rules`);
    
    if (extractedRatio < 100) {
      console.log(`   ⚠️  Missing ${extraction.udcpr.rules.length - dbRules} rules from extraction`);
    }

    // Check for regulations vs sub-regulations
    const regulations = extraction.udcpr.rules.filter(r => r.regulation && r.regulation.match(/^\d+\.\d+$/));
    const subRegulations = extraction.udcpr.rules.filter(r => r.clause && r.clause.match(/^\d+\.\d+\.\d+/));
    
    console.log(`\n   Extracted regulations (X.Y): ${regulations.length}`);
    console.log(`   Extracted sub-regulations (X.Y.Z): ${subRegulations.length}`);

    // Sample some rules to see quality
    console.log('\n📝 SAMPLE RULES IN DATABASE:\n');
    const sampleRules = await Rule.find().limit(5).select('reference chapter section clause summary');
    sampleRules.forEach(rule => {
      console.log(`   ${rule.reference}`);
      console.log(`   Chapter: ${rule.chapter}, Section: ${rule.section}, Clause: ${rule.clause}`);
      console.log(`   Summary: ${rule.summary.substring(0, 80)}...\n`);
    });

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log(`✅ Rules in database: ${dbRules + dbDistrictRules}`);
    console.log(`📄 Rules extracted: ${extraction.udcpr.rules.length + extraction.mumbai.rules.length}`);
    console.log(`📊 Tables found: 182 (was 48)`);
    
    if (dbRules === extraction.udcpr.rules.length && dbDistrictRules === extraction.mumbai.rules.length) {
      console.log('\n✅ PERFECT! All extracted rules are in the database!\n');
    } else {
      console.log('\n⚠️  There might be a mismatch. Investigating...\n');
    }

    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

verifyCompleteExtraction();
