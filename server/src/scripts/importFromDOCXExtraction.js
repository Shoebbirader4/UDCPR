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
 * IMPORT ALL EXTRACTED DOCX DATA TO DATABASE
 * Imports every rule, table, formula with proper categorization
 * All app components will use this real data
 */

async function importFromDOCXExtraction() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('     IMPORTING DOCX EXTRACTION TO DATABASE');
    console.log('     Real Data for Calculator, AI, District Rules & All Components');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/udcpr-master';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Load extracted data
    console.log('📂 Loading extracted data...');
    const extractionPath = path.join(__dirname, '../data/extracted/complete_extraction.json');
    const extraction = JSON.parse(fs.readFileSync(extractionPath, 'utf8'));
    
    console.log(`   ✅ Loaded UDCPR: ${extraction.udcpr.rules.length} rules`);
    console.log(`   ✅ Loaded Mumbai: ${extraction.mumbai.rules.length} rules\n`);

    let importedGeneral = 0;
    let importedDistrict = 0;
    let skipped = 0;

    // ============================================================
    // IMPORT UDCPR RULES (General Maharashtra Rules)
    // ============================================================
    console.log('📥 IMPORTING UDCPR RULES (Maharashtra State)...\n');
    
    for (let i = 0; i < extraction.udcpr.rules.length; i++) {
      const rule = extraction.udcpr.rules[i];
      
      // Import EVERYTHING - absolutely no filtering
      // User wants every single detail from DOCX
      
      // Only skip if both summary and fullText are completely empty
      if ((!rule.summary || rule.summary.trim().length === 0) && 
          (!rule.fullText || rule.fullText.trim().length === 0)) {
        skipped++;
        continue;
      }

      try {
        // Create absolutely unique reference using index
        const uniqueRef = rule.reference || `UDCPR-${rule.chapter}.${rule.clause}`;
        const finalRef = `${uniqueRef}-${i}`; // Add index to make it unique
        
        const ruleDoc = new Rule({
          reference: finalRef,
          chapter: rule.chapter ? `Chapter ${rule.chapter}` : 'General',
          section: rule.regulation || rule.clause || '1.0',
          chapterTitle: rule.chapterTitle || 'General Provisions',
          clause: rule.clause || 'N/A',
          title: rule.regulationTitle || rule.summary?.substring(0, 100),
          summary: cleanText(rule.summary || rule.fullText?.substring(0, 200) || 'No summary'),
          fullText: cleanText(rule.fullText || rule.summary || 'No content'),
          category: rule.category || 'General',
          subcategory: determineSubcategory(rule),
          applicableZones: extractApplicableZones(rule.fullText || ''),
          tags: extractTags(rule),
          isGeneral: true,
          status: 'Active'
        });

        await ruleDoc.save();
        importedGeneral++;

        if (importedGeneral % 500 === 0) {
          console.log(`   Imported ${importedGeneral} UDCPR rules...`);
        }
      } catch (error) {
        console.error(`   ⚠️  Error at index ${i}:`, error.message);
        skipped++;
      }
    }

    console.log(`\n   ✅ Imported ${importedGeneral} UDCPR rules`);
    console.log(`   ⏭️  Skipped ${skipped} invalid/duplicate rules\n`);

    // ============================================================
    // IMPORT MUMBAI-DCPR RULES (Mumbai Specific)
    // ============================================================
    console.log('📥 IMPORTING MUMBAI-DCPR RULES...\n');
    
    skipped = 0;
    for (let i = 0; i < extraction.mumbai.rules.length; i++) {
      const rule = extraction.mumbai.rules[i];
      
      // Import EVERYTHING - absolutely no filtering
      // User wants every single detail from DOCX
      
      // Only skip if both summary and fullText are completely empty
      if ((!rule.summary || rule.summary.trim().length === 0) && 
          (!rule.fullText || rule.fullText.trim().length === 0)) {
        skipped++;
        continue;
      }

      try {
        // Create absolutely unique reference using index
        const uniqueRef = rule.reference || `Mumbai-${rule.regulation}.${rule.clause}`;
        const finalRef = `${uniqueRef}-${i}`; // Add index to make it unique
        
        const districtRuleDoc = new DistrictRule({
          district: 'Mumbai',
          reference: finalRef,
          chapter: rule.chapter ? `Chapter ${rule.chapter}` : 'General',
          section: rule.regulation || rule.clause || '1.0',
          clause: rule.clause || 'N/A',
          summary: cleanText(rule.summary || rule.fullText?.substring(0, 200) || 'No summary'),
          fullText: cleanText(rule.fullText || rule.summary || 'No content'),
          category: rule.category || 'General',
          subCategory: determineSubcategory(rule),
          applicableZones: extractApplicableZones(rule.fullText || ''),
          tags: extractTags(rule),
          status: 'Active',
          officialReference: 'Mumbai-DCPR',
          isDistrictSpecific: true
        });

        await districtRuleDoc.save();
        importedDistrict++;

        if (importedDistrict % 50 === 0) {
          console.log(`   Imported ${importedDistrict} Mumbai rules...`);
        }
      } catch (error) {
        console.error(`   ⚠️  Error at Mumbai index ${i}:`, error.message);
        skipped++;
      }
    }

    console.log(`\n   ✅ Imported ${importedDistrict} Mumbai-DCPR rules`);
    console.log(`   ⏭️  Skipped ${skipped} invalid/duplicate rules\n`);

    // ============================================================
    // VERIFY IMPORT
    // ============================================================
    console.log('🔍 VERIFYING IMPORT...\n');
    
    const totalGeneral = await Rule.countDocuments();
    const totalDistrict = await DistrictRule.countDocuments();
    
    console.log(`   General Rules in DB: ${totalGeneral}`);
    console.log(`   District Rules in DB: ${totalDistrict}`);
    console.log(`   Total Rules: ${totalGeneral + totalDistrict}\n`);

    // Show breakdown by category
    const categories = await Rule.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('   Rules by Category:');
    categories.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count}`);
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ IMPORT COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📊 SUMMARY:');
    console.log(`   UDCPR Rules Imported: ${importedGeneral}`);
    console.log(`   Mumbai Rules Imported: ${importedDistrict}`);
    console.log(`   Total in Database: ${totalGeneral + totalDistrict}\n`);
    console.log('🎯 All app components now have access to real UDCPR data!');
    console.log('   - Calculator: Real FSI, setback, height, parking rules');
    console.log('   - AI Assistant: Complete rule database');
    console.log('   - District Rules: Mumbai-specific regulations');
    console.log('   - Compliance Check: Actual UDCPR requirements\n');

    await mongoose.connection.close();
    console.log('📡 Database connection closed\n');

  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function isTableOfContents(rule) {
  const text = rule.summary + ' ' + rule.fullText;
  
  // Check for table of contents patterns
  if (/^\d+\.\d+\.\d+\s+[A-Z][^\n]{10,50}\s+\d+$/.test(text)) return true;
  if (text.includes('Page No.') || text.includes('Particulars')) return true;
  if (text.match(/\d+\s+\d+\s+\d+\s+\d+/)) return true; // Multiple numbers in sequence
  
  return false;
}

function cleanText(text) {
  if (!text) return '';
  
  return text
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/\n+/g, ' ') // Newlines to space
    .trim()
    .substring(0, 5000); // Limit length
}

function determineSubcategory(rule) {
  if (rule.category !== 'Building Requirements') return null;
  
  const text = (rule.summary + ' ' + rule.fullText).toLowerCase();
  
  if (/staircase|stair/.test(text)) return 'Staircases';
  if (/lift|elevator/.test(text)) return 'Lifts';
  if (/ventilation/.test(text)) return 'Ventilation';
  if (/light|lighting/.test(text)) return 'Lighting';
  if (/bathroom|toilet/.test(text)) return 'Bathrooms';
  if (/kitchen/.test(text)) return 'Kitchens';
  if (/balcony/.test(text)) return 'Balconies';
  if (/basement/.test(text)) return 'Basements';
  if (/roof|terrace/.test(text)) return 'Roofs';
  if (/wall/.test(text)) return 'Walls';
  if (/door|window/.test(text)) return 'Doors & Windows';
  
  return null;
}

function extractApplicableZones(text) {
  if (!text) return ['All'];
  
  const zones = [];
  const zonePattern = /\b([RCIM]\d+|R-\d+|C-\d+|I-\d+|M-\d+)\b/g;
  let match;
  
  while ((match = zonePattern.exec(text)) !== null) {
    if (!zones.includes(match[1])) {
      zones.push(match[1]);
    }
  }
  
  return zones.length > 0 ? zones : ['All'];
}

function extractTags(rule) {
  const tags = [];
  const text = (rule.summary + ' ' + rule.fullText).toLowerCase();
  
  const tagKeywords = [
    'residential', 'commercial', 'industrial', 'mixed-use',
    'mandatory', 'optional', 'exemption', 'relaxation',
    'calculation', 'formula', 'table', 'premium',
    'mumbai', 'maharashtra', 'pune', 'nagpur'
  ];
  
  tagKeywords.forEach(tag => {
    if (text.includes(tag)) tags.push(tag);
  });
  
  // Add source tag
  tags.push(rule.source.toLowerCase());
  
  return tags;
}

// Run import
importFromDOCXExtraction();
