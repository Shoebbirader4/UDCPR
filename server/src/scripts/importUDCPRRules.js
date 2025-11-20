import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Rule from '../models/Rule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function importUDCPRRules() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Read the UDCPR rules JSON file
    const rulesPath = path.join(__dirname, '../data/udcprRules.json');
    const rulesData = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

    console.log(`📋 Found ${rulesData.length} rules in udcprRules.json\n`);

    // Clear existing general rules
    await Rule.deleteMany({ isGeneral: true });
    console.log('🗑️  Cleared existing general rules\n');

    let imported = 0;
    let skipped = 0;

    for (const ruleData of rulesData) {
      try {
        // Create reference if not exists
        const reference = ruleData.reference || `UDCPR-2020-${ruleData.clause}`;
        
        // Map category
        const validCategories = [
          'FSI', 'Setback', 'Height', 'Parking', 'Heritage', 'TDR', 'Amenity',
          'Environmental', 'Safety', 'Accessibility', 'CRZ', 'TOD',
          'Affordable Housing', 'Mixed Use', 'Special Buildings', 'Land Use',
          'Zoning', 'Infrastructure', 'Social Infrastructure', 'Redevelopment',
          'Regularization', 'General'
        ];
        
        const category = validCategories.includes(ruleData.category) 
          ? ruleData.category 
          : 'General';

        // Create rule object
        const rule = {
          chapter: ruleData.chapter,
          section: ruleData.section,
          clause: ruleData.clause,
          reference: reference,
          title: ruleData.title || ruleData.summary,
          summary: ruleData.summary,
          fullText: ruleData.fullText,
          category: category,
          applicableZones: ruleData.applicableZones || ['All'],
          isGeneral: true,
          tags: ruleData.keywords || [],
          status: 'Active'
        };

        await Rule.create(rule);
        console.log(`✅ Imported: ${reference} - ${rule.summary.substring(0, 50)}...`);
        imported++;
      } catch (error) {
        console.log(`⚠️  Skipped: ${ruleData.clause} - ${error.message}`);
        skipped++;
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   Imported: ${imported} rules`);
    console.log(`   Skipped: ${skipped} rules`);

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

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importUDCPRRules();
