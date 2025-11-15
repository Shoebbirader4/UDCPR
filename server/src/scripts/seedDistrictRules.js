import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import DistrictRule from '../models/DistrictRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

async function seedDistrictRules() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing district rules
    console.log('🗑️  Clearing existing district rules...');
    await DistrictRule.deleteMany({});
    console.log('✅ Cleared\n');

    // Load sample district-specific rules
    console.log('📥 Loading district-specific UDCPR rules...');
    const sampleRules = generateSampleDistrictRules();
    
    console.log(`📝 Inserting ${sampleRules.length} district-specific rules...`);
    await DistrictRule.insertMany(sampleRules);
    console.log('✅ Rules inserted successfully!\n');

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

    console.log('📊 Rules by District:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} rules`);
    });

    console.log('\n✨ Database seeded successfully!');
    console.log(`Total rules: ${sampleRules.length}`);
    console.log(`Districts covered: ${stats.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

function generateSampleDistrictRules() {
  const districts = [
    { name: 'Mumbai City', region: 'Konkan', authority: 'MCGM' },
    { name: 'Mumbai Suburban', region: 'Konkan', authority: 'MCGM' },
    { name: 'Thane', region: 'Konkan', authority: 'TMC / MMRDA' },
    { name: 'Pune', region: 'Pune', authority: 'PMC / PMRDA' },
    { name: 'Nagpur', region: 'Nagpur', authority: 'NMC / NMRDA' },
    { name: 'Nashik', region: 'Nashik', authority: 'NMC / NMRDA' },
    { name: 'Aurangabad', region: 'Aurangabad', authority: 'AMC / AUDA' }
  ];

  const rules = [];

  districts.forEach(district => {
    // FSI Rules - District Specific
    rules.push({
      district: district.name,
      region: district.region,
      planningAuthority: district.authority,
      chapter: 'Chapter 3',
      section: 'Section 2',
      clause: '3.2.1',
      summary: `FSI for Residential Zones - ${district.name}`,
      fullText: `The permissible FSI for residential zones in ${district.name} shall be: (a) 1.0 for plots abutting roads less than 9m wide, (b) 1.2 for roads between 9m to 12m, (c) 1.5 for roads between 12m to 18m, (d) 2.0 for roads above 18m width. ${district.name === 'Mumbai City' || district.name === 'Mumbai Suburban' ? 'Additional FSI up to 3.0 may be granted through TDR in designated receiving zones.' : 'Additional FSI may be granted as per regional planning authority guidelines.'}`,
      category: 'FSI',
      applicableZones: ['R1', 'R2', 'R3'],
      applicableAreas: ['Urban'],
      municipalityType: 'Municipal Corporation',
      keywords: ['FSI', 'residential', 'road width', 'floor space index'],
      tags: [district.name, 'residential', 'FSI'],
      isDistrictSpecific: true,
      status: 'Active',
      effectiveFrom: new Date('2020-04-01')
    });

    // Setback Rules
    rules.push({
      district: district.name,
      region: district.region,
      planningAuthority: district.authority,
      chapter: 'Chapter 3',
      section: 'Section 3',
      clause: '3.3.1',
      summary: `Front Setback Requirements - ${district.name}`,
      fullText: `Front setback requirements for ${district.name}: (a) 3m minimum for plots up to 300 sq.m, (b) 4m for plots 301-500 sq.m, (c) 5m for plots 501-1000 sq.m, (d) 6m for plots above 1000 sq.m. ${district.name === 'Mumbai City' ? 'In island city, existing FSI buildings may have reduced setbacks as per existing permissions.' : 'For roads wider than 18m, front setback shall be minimum 1/3rd of road width or as specified above, whichever is higher.'}`,
      category: 'Setback',
      applicableZones: ['R1', 'R2', 'R3'],
      applicableAreas: ['Urban'],
      municipalityType: 'All',
      keywords: ['setback', 'front setback', 'residential'],
      tags: [district.name, 'setback'],
      isDistrictSpecific: true,
      status: 'Active',
      effectiveFrom: new Date('2020-04-01')
    });

    // Parking Rules
    rules.push({
      district: district.name,
      region: district.region,
      planningAuthority: district.authority,
      chapter: 'Chapter 5',
      section: 'Section 1',
      clause: '5.1.1',
      summary: `Parking Requirements - Residential - ${district.name}`,
      fullText: `Residential parking requirements for ${district.name}: (a) 1 ECS per dwelling unit up to 60 sq.m, (b) 2 ECS per dwelling unit 61-120 sq.m, (c) 3 ECS per dwelling unit above 120 sq.m. Additional 0.5 ECS per unit for visitor parking. ${district.name === 'Mumbai City' || district.name === 'Mumbai Suburban' ? 'Minimum 30% parking spaces shall be mechanized or stacked parking for plots above 2000 sq.m.' : 'Mechanized parking encouraged for plots above 5000 sq.m.'}`,
      category: 'Parking',
      applicableZones: ['R1', 'R2', 'R3'],
      applicableAreas: ['Urban'],
      municipalityType: 'All',
      keywords: ['parking', 'ECS', 'residential', 'visitor parking'],
      tags: [district.name, 'parking'],
      isDistrictSpecific: true,
      status: 'Active',
      effectiveFrom: new Date('2020-04-01')
    });

    // Height Restrictions
    rules.push({
      district: district.name,
      region: district.region,
      planningAuthority: district.authority,
      chapter: 'Chapter 3',
      section: 'Section 4',
      clause: '3.4.1',
      summary: `Building Height Restrictions - ${district.name}`,
      fullText: `Maximum building height for residential zones in ${district.name}: (a) 15m for roads up to 9m wide, (b) 24m for roads 9-12m wide, (c) 30m for roads 12-18m wide, (d) 45m for roads 18-24m wide, (e) No restriction for roads above 24m wide subject to FSI compliance and aviation clearance. ${district.name === 'Pune' || district.name === 'Nashik' ? 'Additional restrictions apply near airport funnel zones.' : ''}`,
      category: 'Height',
      applicableZones: ['R1', 'R2', 'R3'],
      applicableAreas: ['Urban'],
      municipalityType: 'All',
      keywords: ['height', 'building height', 'residential'],
      tags: [district.name, 'height'],
      isDistrictSpecific: true,
      status: 'Active',
      effectiveFrom: new Date('2020-04-01')
    });

    // Commercial FSI
    rules.push({
      district: district.name,
      region: district.region,
      planningAuthority: district.authority,
      chapter: 'Chapter 4',
      section: 'Section 1',
      clause: '4.1.1',
      summary: `FSI for Commercial Zones - ${district.name}`,
      fullText: `The permissible FSI for commercial zones in ${district.name} shall be: (a) 1.5 for roads up to 12m wide, (b) 2.0 for roads 12-18m wide, (c) 2.5 for roads above 18m width. ${district.name === 'Mumbai City' || district.name === 'Mumbai Suburban' ? 'Additional FSI may be granted through TDR up to maximum 3.0 in designated commercial hubs.' : 'Additional FSI may be granted through TDR up to maximum 2.5.'}`,
      category: 'FSI',
      applicableZones: ['C1', 'C2', 'C3'],
      applicableAreas: ['Urban'],
      municipalityType: 'All',
      keywords: ['FSI', 'commercial', 'TDR'],
      tags: [district.name, 'commercial', 'FSI'],
      isDistrictSpecific: true,
      status: 'Active',
      effectiveFrom: new Date('2020-04-01')
    });
  });

  return rules;
}

seedDistrictRules();
