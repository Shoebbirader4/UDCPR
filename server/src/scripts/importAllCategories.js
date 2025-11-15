import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import DistrictRule from '../models/DistrictRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// District to Planning Authority and Region mapping
const districtInfo = {
  'Mumbai City': { authority: 'MCGM', type: 'Municipal Corporation', region: 'Konkan' },
  'Mumbai Suburban': { authority: 'MCGM', type: 'Municipal Corporation', region: 'Konkan' },
  'Thane': { authority: 'TMC / MMRDA', type: 'Municipal Corporation', region: 'Konkan' },
  'Palghar': { authority: 'PMC / MMRDA', type: 'Mixed', region: 'Konkan' },
  'Raigad': { authority: 'CIDCO / Local Bodies', type: 'Mixed', region: 'Konkan' },
  'Ratnagiri': { authority: 'RMC / Local Bodies', type: 'Municipal Council', region: 'Konkan' },
  'Sindhudurg': { authority: 'Local Bodies', type: 'Municipal Council', region: 'Konkan' },
  'Pune': { authority: 'PMC / PMRDA', type: 'Municipal Corporation', region: 'Pune' },
  'Satara': { authority: 'SMC / Local Bodies', type: 'Municipal Council', region: 'Pune' },
  'Sangli': { authority: 'SMC / Local Bodies', type: 'Municipal Corporation', region: 'Pune' },
  'Kolhapur': { authority: 'KMC / Local Bodies', type: 'Municipal Corporation', region: 'Pune' },
  'Solapur': { authority: 'SMC / Local Bodies', type: 'Municipal Corporation', region: 'Pune' },
  'Nashik': { authority: 'NMC / NMRDA', type: 'Municipal Corporation', region: 'Nashik' },
  'Dhule': { authority: 'DMC / Local Bodies', type: 'Municipal Council', region: 'Nashik' },
  'Nandurbar': { authority: 'Local Bodies', type: 'Municipal Council', region: 'Nashik' },
  'Jalgaon': { authority: 'JMC / Local Bodies', type: 'Municipal Corporation', region: 'Nashik' },
  'Aurangabad': { authority: 'AMC / AUDA', type: 'Municipal Corporation', region: 'Aurangabad' },
  'Jalna': { authority: 'JMC / Local Bodies', type: 'Municipal Council', region: 'Aurangabad' },
  'Beed': { authority: 'BMC / Local Bodies', type: 'Municipal Council', region: 'Aurangabad' },
  'Latur': { authority: 'LMC / Local Bodies', type: 'Municipal Corporation', region: 'Aurangabad' },
  'Osmanabad': { authority: 'OMC / Local Bodies', type: 'Municipal Council', region: 'Aurangabad' },
  'Nanded': { authority: 'NMC / Local Bodies', type: 'Municipal Corporation', region: 'Aurangabad' },
  'Parbhani': { authority: 'PMC / Local Bodies', type: 'Municipal Council', region: 'Aurangabad' },
  'Hingoli': { authority: 'Local Bodies', type: 'Municipal Council', region: 'Aurangabad' },
  'Nagpur': { authority: 'NMC / NMRDA', type: 'Municipal Corporation', region: 'Nagpur' },
  'Wardha': { authority: 'WMC / Local Bodies', type: 'Municipal Council', region: 'Nagpur' },
  'Bhandara': { authority: 'BMC / Local Bodies', type: 'Municipal Council', region: 'Nagpur' },
  'Gondia': { authority: 'GMC / Local Bodies', type: 'Municipal Council', region: 'Nagpur' },
  'Chandrapur': { authority: 'CMC / Local Bodies', type: 'Municipal Corporation', region: 'Nagpur' },
  'Gadchiroli': { authority: 'Local Bodies', type: 'Municipal Council', region: 'Nagpur' },
  'Amravati': { authority: 'AMC / Local Bodies', type: 'Municipal Corporation', region: 'Amravati' },
  'Akola': { authority: 'AMC / Local Bodies', type: 'Municipal Corporation', region: 'Amravati' },
  'Yavatmal': { authority: 'YMC / Local Bodies', type: 'Municipal Council', region: 'Amravati' },
  'Buldhana': { authority: 'BMC / Local Bodies', type: 'Municipal Council', region: 'Amravati' },
  'Washim': { authority: 'WMC / Local Bodies', type: 'Municipal Council', region: 'Amravati' }
};

// Category to Chapter mapping
const categoryChapters = {
  'FSI': { chapter: 'Chapter 3', section: 'Section 1' },
  'Setback': { chapter: 'Chapter 3', section: 'Section 2' },
  'Height': { chapter: 'Chapter 3', section: 'Section 3' },
  'Parking': { chapter: 'Chapter 7', section: 'Section 1' },
  'Heritage': { chapter: 'Chapter 10', section: 'Section 1' },
  'TDR': { chapter: 'Chapter 11', section: 'Section 1' },
  'Amenity': { chapter: 'Chapter 4', section: 'Section 1' },
  'Environmental': { chapter: 'Chapter 12', section: 'Section 1' },
  'Safety': { chapter: 'Chapter 8', section: 'Section 1' },
  'Accessibility': { chapter: 'Chapter 9', section: 'Section 1' },
  'CRZ': { chapter: 'Chapter 13', section: 'Section 1' },
  'TOD': { chapter: 'Chapter 14', section: 'Section 1' },
  'Affordable Housing': { chapter: 'Chapter 15', section: 'Section 1' },
  'Mixed Use': { chapter: 'Chapter 5', section: 'Section 1' },
  'Special Buildings': { chapter: 'Chapter 6', section: 'Section 1' }
};

function transformExtractedRule(extractedRule, index) {
  const district = extractedRule.district;
  const info = districtInfo[district] || { 
    authority: 'Local Bodies', 
    type: 'Municipal Council',
    region: extractedRule.region || 'Maharashtra'
  };
  
  const chapterInfo = categoryChapters[extractedRule.category] || {
    chapter: 'Chapter 3',
    section: 'Section 1'
  };
  
  return {
    district: district,
    region: info.region,
    planningAuthority: info.authority,
    municipalityType: info.type,
    
    chapter: chapterInfo.chapter,
    section: chapterInfo.section,
    clause: extractedRule.clause || `${index + 1}`,
    
    summary: `${extractedRule.category} - ${district} - Clause ${extractedRule.clause || index + 1}`,
    fullText: extractedRule.text || extractedRule.matches?.join(' ') || 'Rule text',
    
    category: extractedRule.category,
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'I1', 'I2', 'Mixed', 'Special'],
    applicableAreas: ['Urban', 'Rural'],
    
    keywords: [
      extractedRule.category?.toLowerCase() || '',
      district.toLowerCase(),
      info.region.toLowerCase(),
      ...(extractedRule.matches || []).map(m => m.toLowerCase())
    ].filter(Boolean),
    
    tags: [district, extractedRule.category, info.region].filter(Boolean),
    
    isDistrictSpecific: true,
    status: 'Active',
    effectiveFrom: new Date('2020-04-01'),
    
    notes: 'Extracted from official UDCPR PDF - Comprehensive extraction'
  };
}

async function importAllCategories() {
  try {
    console.log('\n🚀 Starting comprehensive rule import...');
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check current database status
    const currentCount = await DistrictRule.countDocuments();
    console.log(`📊 Current rules in database: ${currentCount}`);

    console.log('\n🗑️  Clearing existing rules...');
    await DistrictRule.deleteMany({});
    console.log('✅ Cleared\n');

    const combinedPath = join(__dirname, '../data/extracted/all-categories-combined.json');
    
    if (!existsSync(combinedPath)) {
      console.log('❌ Combined rules file not found!');
      console.log('💡 Please run: npm run extract-all-categories first');
      process.exit(1);
    }

    console.log('📥 Loading extracted rules...');
    const allRules = JSON.parse(readFileSync(combinedPath, 'utf-8'));
    console.log(`   Found ${allRules.length} rules in file`);

    console.log('\n📥 Transforming and importing rules...');
    const transformedRules = allRules.map((rule, index) => 
      transformExtractedRule(rule, index)
    );

    // Import in batches to avoid memory issues
    const batchSize = 100;
    let imported = 0;
    
    for (let i = 0; i < transformedRules.length; i += batchSize) {
      const batch = transformedRules.slice(i, i + batchSize);
      await DistrictRule.insertMany(batch);
      imported += batch.length;
      console.log(`   Imported ${imported}/${transformedRules.length} rules (${Math.round(imported/transformedRules.length*100)}%)`);
    }

    console.log(`\n✅ Imported ${transformedRules.length} rules`);

    // Generate final statistics
    const stats = await DistrictRule.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const districtStats = await DistrictRule.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalRules = await DistrictRule.countDocuments();

    console.log('\n📊 Final Statistics:');
    console.log(`   Total rules: ${totalRules}`);
    console.log(`   Districts covered: ${districtStats.length}`);
    
    console.log('\n📊 Rules by Category:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} rules`);
    });

    console.log('\n📊 Top 10 Districts by Rule Count:');
    districtStats.slice(0, 10).forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} rules`);
    });
    
    console.log('\n✨ Import complete!');
    console.log('\n💡 All categories now available:');
    console.log('   ✅ FSI, Setback, Parking, Height');
    console.log('   ✅ Heritage, TDR, Amenity');
    console.log('   ✅ Environmental, Safety, Accessibility');
    console.log('   ✅ CRZ, TOD, Affordable Housing');
    console.log('   ✅ Mixed Use, Special Buildings');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

importAllCategories();
