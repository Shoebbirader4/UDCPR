import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Rule from '../models/Rule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function importExtractedUDCPR() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Read extracted rules
    const rulesPath = path.join(__dirname, '../data/extracted/complete_udcpr_rules.json');
    const extractedRules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

    console.log(`📋 Found ${extractedRules.length} extracted rules\n`);

    // Clear existing general rules
    const existingCount = await Rule.countDocuments({ isGeneral: true });
    console.log(`🗑️  Clearing ${existingCount} existing general rules...`);
    await Rule.deleteMany({ isGeneral: true });
    console.log('✅ Cleared\n');

    console.log('📥 Importing rules...\n');

    let imported = 0;
    let skipped = 0;
    const batchSize = 100;

    for (let i = 0; i < extractedRules.length; i += batchSize) {
      const batch = extractedRules.slice(i, i + batchSize);
      
      for (const ruleData of batch) {
        try {
          const rule = {
            chapter: ruleData.chapter,
            section: ruleData.section || 'Section 1',
            clause: ruleData.clause,
            reference: ruleData.reference,
            title: ruleData.chapterTitle,
            summary: ruleData.summary,
            fullText: ruleData.fullText,
            category: ruleData.category,
            subcategory: ruleData.subcategory,
            applicableZones: ruleData.applicableZones,
            isGeneral: true,
            tags: ruleData.tags,
            status: 'Active'
          };

          await Rule.create(rule);
          imported++;
          
          if (imported % 100 === 0) {
            console.log(`   Imported ${imported} rules...`);
          }
        } catch (error) {
          skipped++;
        }
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   Imported: ${imported} rules`);
    console.log(`   Skipped: ${skipped} rules (duplicates or errors)`);

    // Verify
    const count = await Rule.countDocuments({ isGeneral: true });
    console.log(`\n📊 Total general rules in database: ${count}`);

    // Show breakdown by category
    const categories = await Rule.aggregate([
      { $match: { isGeneral: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📋 Rules by Category:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} rules`);
    });

    // Show breakdown by source
    const sources = await Rule.aggregate([
      { $match: { isGeneral: true } },
      { $unwind: '$tags' },
      { $match: { tags: { $in: ['mumbai', 'rest maharashtra'] } } },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ]);

    console.log('\n📍 Rules by Source:');
    sources.forEach(src => {
      console.log(`   ${src._id}: ${src.count} rules`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importExtractedUDCPR();
