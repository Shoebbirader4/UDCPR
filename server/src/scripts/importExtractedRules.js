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
  'Mumbai City': { authority: 'MCGM', type: 'Municipal Corporation' },
  'Mumbai Suburban': { authority: 'MCGM', type: 'Municipal Corporation' },
  'Thane': { authority: 'TMC / MMRDA', type: 'Municipal Corporation' },
  'Palghar': { authority: 'PMC / MMRDA', type: 'Mixed' },
  'Raigad': { authority: 'CIDCO / Local Bodies', type: 'Mixed' },
  'Ratnagiri': { authority: 'RMC / Local Bodies', type: 'Municipal Council' },
  'Sindhudurg': { authority: 'Local Bodies', type: 'Municipal Council' },
  'Pune': { authority: 'PMC / PMRDA', type: 'Municipal Corporation' },
  'Satara': { authority: 'SMC / Local Bodies', type: 'Municipal Council' },
  'Sangli': { authority: 'SMC / Local Bodies', type: 'Municipal Corporation' },
  'Kolhapur': { authority: 'KMC / Local Bodies', type: 'Municipal Corporation' },
  'Solapur': { authority: 'SMC / Local Bodies', type: 'Municipal Corporation' },
  'Nashik': { authority: 'NMC / NMRDA', type: 'Municipal Corporation' },
  'Dhule': { authority: 'DMC / Local Bodies', type: 'Municipal Council' },
  'Nandurbar': { authority: 'Local Bodies', type: 'Municipal Council' },
  'Jalgaon': { authority: 'JMC / Local Bodies', type: 'Municipal Corporation' },
  'Aurangabad': { authority: 'AMC / AUDA', type: 'Municipal Corporation' },
  'Jalna': { authority: 'JMC / Local Bodies', type: 'Municipal Council' },
  'Beed': { authority: 'BMC / Local Bodies', type: 'Municipal Council' },
  'Latur': { authority: 'LMC / Local Bodies', type: 'Municipal Corporation' },
  'Osmanabad': { authority: 'OMC / Local Bodies', type: 'Municipal Council' },
  'Nanded': { authority: 'NMC / Local Bodies', type: 'Municipal Corporation' },
  'Parbhani': { authority: 'PMC / Local Bodies', type: 'Municipal Council' },
  'Hingoli': { authority: 'Local Bodies', type: 'Municipal Council' },
  'Nagpur': { authority: 'NMC / NMRDA', type: 'Municipal Corporation' },
  'Wardha': { authority: 'WMC / Local Bodies', type: 'Municipal Council' },
  'Bhandara': { authority: 'BMC / Local Bodies', type: 'Municipal Council' },
  'Gondia': { authority: 'GMC / Local Bodies', type: 'Municipal Council' },
  'Chandrapur': { authority: 'CMC / Local Bodies', type: 'Municipal Corporation' },
  'Gadchiroli': { authority: 'Local Bodies', type: 'Municipal Council' },
  'Amravati': { authority: 'AMC / Local Bodies', type: 'Municipal Corporation' },
  'Akola': { authority: 'AMC / Local Bodies', type: 'Municipal Corporation' },
  'Yavatmal': { authority: 'YMC / Local Bodies', type: 'Municipal Council' },
  'Buldhana': { authority: 'BMC / Local Bodies', type: 'Municipal Council' },
  'Washim': { authority: 'WMC / Local Bodies', type: 'Municipal Council' }
};

function transformExtractedRule(extractedRule, chapterNum, sectionNum) {
  const district = extractedRule.district;
  const districtInfo = districtAuthorities[district] || { authority: 'Local Bodies', type: 'Municipal Council' };
  
  // Generate a more structured rule
  return {
    district: district,
    region: extractedRule.region,
    planningAuthority: districtInfo.authority,
    municipalityType: districtInfo.type,
    
    chapter: `Chapter ${chapterNum}`,
    section: `Section ${sectionNum}`,
    clause: extractedRule.clause,
    
    summary: `${extractedRule.category} Regulations - ${district}`,
    fullText: extractedRule.text,
    
    category: extractedRule.category,
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'I1'], // Default, should be refined
    applicableAreas: ['Urban'],
    
    keywords: [
      extractedRule.category.toLowerCase(),
      district.toLowerCase(),
      extractedRule.region.toLowerCase()
    ],
    tags: [district, extractedRule.category],
    
    isDistrictSpecific: true,
    status: 'Active',
    effectiveFrom: new Date('2020-04-01'),
    
    notes: 'Extracted from official UDCPR PDF - requires manual verification'
  };
}

async function importExtractedRules() {
  try {
    console.log('\n🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const mumbaiPath = join(__dirname, '../data/extracted/mumbai-rules.json');
    const restPath = join(__dirname, '../data/extracted/rest-maharashtra-rules.json');

    let totalImported = 0;

    // Import Mumbai rules
    if (existsSync(mumbaiPath)) {
      console.log('📥 Importing Mumbai rules...');
      const mumbaiRules = JSON.parse(readFileSync(mumbaiPath, 'utf-8'));
      
      const transformedRules = mumbaiRules.map((rule, index) => 
        transformExtractedRule(rule, 3, Math.floor(index / 5) + 1)
      );
      
      if (transformedRules.length > 0) {
        await DistrictRule.insertMany(transformedRules);
        console.log(`✅ Imported ${transformedRules.length} Mumbai rules`);
        totalImported += transformedRules.length;
      }
    } else {
      console.log('⚠️  Mumbai rules file not found. Run extraction first.');
    }

    // Import Rest of Maharashtra rules
    if (existsSync(restPath)) {
      console.log('\n📥 Importing Rest of Maharashtra rules...');
      const restRules = JSON.parse(readFileSync(restPath, 'utf-8'));
      
      const transformedRules = restRules.map((rule, index) => 
        transformExtractedRule(rule, 3, Math.floor(index / 5) + 1)
      );
      
      if (transformedRules.length > 0) {
        await DistrictRule.insertMany(transformedRules);
        console.log(`✅ Imported ${transformedRules.length} rules for other districts`);
        totalImported += transformedRules.length;
      }
    } else {
      console.log('⚠️  Rest of Maharashtra rules file not found. Run extraction first.');
    }

    // Show statistics
    const stats = await DistrictRule.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Rules by District:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} rules`);
    });

    console.log(`\n✨ Import complete!`);
    console.log(`Total rules imported: ${totalImported}`);
    console.log(`Districts covered: ${stats.length}`);
    
    console.log('\n⚠️  IMPORTANT: These rules were auto-extracted and require manual review!');
    console.log('   Please verify accuracy against official UDCPR documents.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing rules:', error);
    process.exit(1);
  }
}

importExtractedRules();
