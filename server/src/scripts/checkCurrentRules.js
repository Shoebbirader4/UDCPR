import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import DistrictRule from '../models/DistrictRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

async function checkCurrentRules() {
  try {
    console.log('\n🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    const totalRules = await DistrictRule.countDocuments();
    console.log(`📊 Total rules in database: ${totalRules}\n`);

    // Check categories
    const categories = await DistrictRule.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('📋 Rules by Category:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} rules`);
    });

    // Check districts
    const districts = await DistrictRule.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log(`\n🗺️  Rules by District (${districts.length} districts):`);
    districts.forEach(dist => {
      console.log(`   ${dist._id}: ${dist.count} rules`);
    });

    // Check if Aurangabad exists
    const aurangabadRules = await DistrictRule.countDocuments({ district: 'Aurangabad' });
    console.log(`\n🔍 Aurangabad specifically: ${aurangabadRules} rules`);

    // Check if TDR category exists
    const tdrRules = await DistrictRule.countDocuments({ category: 'TDR' });
    console.log(`🔍 TDR category: ${tdrRules} rules`);

    console.log('\n💡 To add all categories, run: npm run extract-all-categories');
    console.log('   Then run: npm run import-all-categories\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCurrentRules();
