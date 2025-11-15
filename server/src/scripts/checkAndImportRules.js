import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import DistrictRule from '../models/DistrictRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// District to Planning Authority mapping
const districtAuthorities = {
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

function transformExtractedRule(extractedRule, index) {
  const district = extractedRule.district;
  const districtInfo = districtAuthorities[district] || { 
    authority: 'Local Bodies', 
    type: 'Municipal Council',
    region: extractedRule.region || 'Maharashtra'
  };
  
  // Determine chapter and section from category
  let chapter = 'Chapter 3';
  let section = 'Section 1';
  
  switch(extractedRule.category) {
    case 'FSI':
      chapter = 'Chapter 3';
      section = 'Section 1';
      break;
    case 'Setback':
      chapter = 'Chapter 3';
      section = 'Section 2';
      break;
    case 'Parking':
      chapter = 'Chapter 7';
      section = 'Section 1';
      break;
    case 'Height':
      chapter = 'Chapter 3';
      section = 'Section 3';
      break;
    default:
      chapter = 'Chapter 3';
      section = `Section ${Math.floor(index / 100) + 1}`;
  }
  
  return {
    district: district,
    region: districtInfo.region,
    planningAuthority: districtInfo.authority,
    municipalityType: districtInfo.type,
    
    chapter: chapter,
    section: section,
    clause: extractedRule.clause || `${index + 1}`,
    
    summary: `${extractedRule.category} - ${district} - Clause ${extractedRule.clause || index + 1}`,
    fullText: extractedRule.text || extractedRule.matches?.join(' ') || 'Rule text',
    
    category: extractedRule.category,
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'I1', 'I2', 'Mixed'],
    applicableAreas: ['Urban', 'Rural'],
    
    keywords: [
      extractedRule.category?.toLowerCase() || '',
      district.toLowerCase(),
      districtInfo.region.toLowerCase(),
      ...(extractedRule.matches || []).map(m => m.toLowerCase())
    ].filter(Boolean),
    
    tags: [district, extractedRule.category, districtInfo.region].filter(Boolean),
    
    isDistrictSpecific: true,
    status: 'Active',
    effectiveFrom: new Date('2020-04-01'),
    
    notes: 'Extracted from official UDCPR PDF'
  };
}

async function checkAndImportRules() {
  try {
    console.log('\n🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check current database status
    const currentCount = await DistrictRule.countDocuments();
    console.log(`📊 Current rules in database: ${currentCount}`);

    if (currentCount > 100) {
      console.log('\n✅ Database already has rules. Skipping import.');
      console.log('   To re-import, first clear the database with: npm run clear-district-rules');
      
      // Show stats
      const stats = await DistrictRule.aggregate([
        {
          $group: {
            _id: '$district',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      console.log('\n📊 Rules by District:');
      stats.slice(0, 10).forEach(stat => {
        console.log(`   ${stat._id}: ${stat.count} rules`);
      });
      if (stats.length > 10) {
        console.log(`   ... and ${stats.length - 10} more districts`);
      }
      
      process.exit(0);
      return;
    }

    console.log('\n🗑️  Clearing existing rules...');
    await DistrictRule.deleteMany({});
    console.log('✅ Cleared\n');

    const mumbaiPath = join(__dirname, '../data/extracted/mumbai-rules.json');
    const restPath = join(__dirname, '../data/extracted/rest-maharashtra-rules.json');

    let totalImported = 0;

    // Import Mumbai rules
    if (existsSync(mumbaiPath)) {
      console.log('📥 Importing Mumbai rules...');
      const mumbaiRules = JSON.parse(readFileSync(mumbaiPath, 'utf-8'));
      console.log(`   Found ${mumbaiRules.length} Mumbai rules in file`);
      
      const transformedRules = mumbaiRules.map((rule, index) => 
        transformExtractedRule(rule, index)
      );
      
      if (transformedRules.length > 0) {
        await DistrictRule.insertMany(transformedRules);
        console.log(`✅ Imported ${transformedRules.length} Mumbai rules`);
        totalImported += transformedRules.length;
      }
    } else {
      console.log('⚠️  Mumbai rules file not found at:', mumbaiPath);
    }

    // Import Rest of Maharashtra rules
    if (existsSync(restPath)) {
      console.log('\n📥 Importing Rest of Maharashtra rules...');
      const restRules = JSON.parse(readFileSync(restPath, 'utf-8'));
      console.log(`   Found ${restRules.length} rules in file`);
      
      const transformedRules = restRules.map((rule, index) => 
        transformExtractedRule(rule, index + 1000) // Offset index to avoid conflicts
      );
      
      if (transformedRules.length > 0) {
        // Import in batches to avoid memory issues
        const batchSize = 100;
        for (let i = 0; i < transformedRules.length; i += batchSize) {
          const batch = transformedRules.slice(i, i + batchSize);
          await DistrictRule.insertMany(batch);
          console.log(`   Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transformedRules.length / batchSize)}`);
        }
        console.log(`✅ Imported ${transformedRules.length} rules for other districts`);
        totalImported += transformedRules.length;
      }
    } else {
      console.log('⚠️  Rest of Maharashtra rules file not found at:', restPath);
    }

    // Show final statistics
    const stats = await DistrictRule.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const categoryStats = await DistrictRule.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Final Statistics:');
    console.log(`   Total rules imported: ${totalImported}`);
    console.log(`   Districts covered: ${stats.length}`);
    
    console.log('\n📊 Top Districts by Rule Count:');
    stats.slice(0, 10).forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} rules`);
    });

    console.log('\n📊 Rules by Category:');
    categoryStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} rules`);
    });
    
    console.log('\n✨ Import complete!');
    console.log('\n💡 You can now search and browse all rules in the District Rules page.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAndImportRules();
