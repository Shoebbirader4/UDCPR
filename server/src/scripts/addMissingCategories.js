import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistrictRule from '../models/DistrictRule.js';

dotenv.config();

const missingCategoryRules = [
  // Land Use Rules
  {
    category: 'Land Use',
    title: 'Residential Land Use Regulations',
    summary: 'Regulations for residential land use and permissible activities',
    fullText: 'Residential zones shall be primarily used for dwelling purposes. Permissible activities include residential buildings, home-based businesses (subject to conditions), educational institutions, religious buildings, and community facilities. Commercial activities are restricted except as specified in mixed-use provisions.',
    chapter: 'Chapter 3',
    section: 'Section 1',
    clause: '3.1.1',
    reference: 'Chapter 3 - Section 1 - 3.1.1',
    applicableZones: ['R1', 'R2', 'R3'],
    status: 'Active'
  },
  {
    category: 'Land Use',
    title: 'Commercial Land Use Regulations',
    summary: 'Regulations for commercial land use and permissible activities',
    fullText: 'Commercial zones shall be used for trade, business, and commercial activities. Permissible uses include shops, offices, hotels, restaurants, entertainment facilities, and service establishments. Residential use may be permitted on upper floors subject to FSI provisions.',
    chapter: 'Chapter 3',
    section: 'Section 2',
    clause: '3.2.1',
    reference: 'Chapter 3 - Section 2 - 3.2.1',
    applicableZones: ['C1', 'C2', 'Mixed'],
    status: 'Active'
  },
  {
    category: 'Land Use',
    title: 'Industrial Land Use Regulations',
    summary: 'Regulations for industrial land use and permissible activities',
    fullText: 'Industrial zones shall be used for manufacturing, processing, assembly, and related activities. Permissible uses include factories, warehouses, workshops, and ancillary facilities. Residential use is generally prohibited except for watchman quarters. Environmental clearances are mandatory.',
    chapter: 'Chapter 3',
    section: 'Section 3',
    clause: '3.3.1',
    reference: 'Chapter 3 - Section 3 - 3.3.1',
    applicableZones: ['I1', 'I2'],
    status: 'Active'
  },

  // Zoning Rules
  {
    category: 'Zoning',
    title: 'Residential Zone Classification',
    summary: 'Classification and characteristics of residential zones',
    fullText: 'Residential zones are classified as R1 (Low Density), R2 (Medium Density), and R3 (High Density). R1 zones permit maximum 2 floors, R2 zones permit up to 4 floors, and R3 zones permit high-rise development subject to FSI and other regulations.',
    chapter: 'Chapter 2',
    section: 'Section 1',
    clause: '2.1.1',
    reference: 'Chapter 2 - Section 1 - 2.1.1',
    applicableZones: ['R1', 'R2', 'R3'],
    status: 'Active'
  },
  {
    category: 'Zoning',
    title: 'Mixed Use Zone Regulations',
    summary: 'Regulations for mixed-use development zones',
    fullText: 'Mixed-use zones permit combination of residential, commercial, and institutional uses. Ground floor shall be reserved for commercial use. Upper floors may be used for residential or commercial purposes. Separate entrances for residential and commercial uses are mandatory.',
    chapter: 'Chapter 2',
    section: 'Section 4',
    clause: '2.4.1',
    reference: 'Chapter 2 - Section 4 - 2.4.1',
    applicableZones: ['Mixed'],
    status: 'Active'
  },

  // Infrastructure Rules
  {
    category: 'Infrastructure',
    title: 'Road Width Requirements',
    summary: 'Minimum road width requirements for development',
    fullText: 'Minimum road width for development: 9m for residential buildings up to 15m height, 12m for buildings 15-24m height, 18m for buildings above 24m height. Dead-end roads shall not exceed 150m length and must have turning space.',
    chapter: 'Chapter 4',
    section: 'Section 1',
    clause: '4.1.1',
    reference: 'Chapter 4 - Section 1 - 4.1.1',
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'Mixed'],
    status: 'Active'
  },
  {
    category: 'Infrastructure',
    title: 'Water Supply Requirements',
    summary: 'Water supply and storage requirements',
    fullText: 'Minimum water supply: 135 liters per capita per day for residential, 45 liters per person per shift for commercial/industrial. Underground and overhead storage tanks mandatory. Total storage capacity shall be sufficient for 24 hours consumption.',
    chapter: 'Chapter 4',
    section: 'Section 2',
    clause: '4.2.1',
    reference: 'Chapter 4 - Section 2 - 4.2.1',
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'I1', 'I2', 'Mixed'],
    status: 'Active'
  },
  {
    category: 'Infrastructure',
    title: 'Drainage and Sewerage Requirements',
    summary: 'Requirements for drainage and sewerage systems',
    fullText: 'All buildings shall be connected to public sewerage system where available. Septic tanks with soak pits permitted only where public sewerage is not available. Storm water drainage shall be separate from sewerage. Rainwater harvesting mandatory for plots above 300 sq.m.',
    chapter: 'Chapter 4',
    section: 'Section 3',
    clause: '4.3.1',
    reference: 'Chapter 4 - Section 3 - 4.3.1',
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'I1', 'I2', 'Mixed'],
    status: 'Active'
  },

  // Social Infrastructure Rules
  {
    category: 'Social Infrastructure',
    title: 'Educational Facility Requirements',
    summary: 'Requirements for schools and educational institutions',
    fullText: 'Educational institutions shall provide minimum 6 sq.m per student for primary schools, 8 sq.m per student for secondary schools. Playground area: minimum 1000 sq.m for primary, 2000 sq.m for secondary schools. Adequate parking and safe pick-up/drop-off zones mandatory.',
    chapter: 'Chapter 5',
    section: 'Section 1',
    clause: '5.1.1',
    reference: 'Chapter 5 - Section 1 - 5.1.1',
    applicableZones: ['R1', 'R2', 'R3', 'Special'],
    status: 'Active'
  },
  {
    category: 'Social Infrastructure',
    title: 'Healthcare Facility Requirements',
    summary: 'Requirements for hospitals and healthcare facilities',
    fullText: 'Hospitals shall provide minimum 10 sq.m per bed including circulation. Emergency access with minimum 6m wide approach road mandatory. Adequate parking: 1 space per 4 beds plus 1 per doctor. Waste management facilities for bio-medical waste as per regulations.',
    chapter: 'Chapter 5',
    section: 'Section 2',
    clause: '5.2.1',
    reference: 'Chapter 5 - Section 2 - 5.2.1',
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'Special'],
    status: 'Active'
  },

  // Redevelopment Rules
  {
    category: 'Redevelopment',
    title: 'Cessed Building Redevelopment',
    summary: 'Regulations for redevelopment of cessed buildings',
    fullText: 'Cessed buildings eligible for redevelopment shall provide free housing to existing tenants with minimum 225 sq.ft carpet area. Additional FSI up to 3.0 may be granted. Rehabilitation component shall be completed before sale component. Corpus fund for maintenance mandatory.',
    chapter: 'Chapter 16',
    section: 'Section 1',
    clause: '16.1.1',
    reference: 'Chapter 16 - Section 1 - 16.1.1',
    applicableZones: ['R1', 'R2', 'R3', 'Mixed'],
    status: 'Active'
  },
  {
    category: 'Redevelopment',
    title: 'Cluster Redevelopment Regulations',
    summary: 'Regulations for cluster redevelopment schemes',
    fullText: 'Cluster redevelopment permitted for minimum 4000 sq.m area with consent of 70% owners. Additional FSI up to 3.0 may be granted. Minimum 15% area to be reserved for public amenities. Existing residents to be rehabilitated on-site or nearby.',
    chapter: 'Chapter 16',
    section: 'Section 2',
    clause: '16.2.1',
    reference: 'Chapter 16 - Section 2 - 16.2.1',
    applicableZones: ['R1', 'R2', 'R3', 'Mixed'],
    status: 'Active'
  },

  // Regularization Rules
  {
    category: 'Regularization',
    title: 'Unauthorized Construction Regularization',
    summary: 'Provisions for regularization of unauthorized constructions',
    fullText: 'Unauthorized constructions may be regularized subject to payment of penalty and compliance with structural safety norms. Regularization not permitted for constructions in CRZ, forest areas, or on public land. Maximum 10% deviation in FSI may be regularized with penalty.',
    chapter: 'Chapter 17',
    section: 'Section 1',
    clause: '17.1.1',
    reference: 'Chapter 17 - Section 1 - 17.1.1',
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'Mixed'],
    status: 'Active'
  },
  {
    category: 'Regularization',
    title: 'Setback Deviation Regularization',
    summary: 'Provisions for regularization of setback deviations',
    fullText: 'Minor setback deviations up to 10% may be regularized on payment of penalty equal to 2 times the ready reckoner rate for encroached area. Structural stability certificate mandatory. Regularization subject to no objection from adjoining owners.',
    chapter: 'Chapter 17',
    section: 'Section 2',
    clause: '17.2.1',
    reference: 'Chapter 17 - Section 2 - 17.2.1',
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'Mixed'],
    status: 'Active'
  }
];

async function addMissingCategories() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // Get all districts
    const districts = await DistrictRule.distinct('district');
    console.log(`📊 Found ${districts.length} districts\n`);

    let totalAdded = 0;

    for (const district of districts) {
      console.log(`\n📍 Adding rules for ${district}...`);
      
      for (const ruleTemplate of missingCategoryRules) {
        const rule = {
          ...ruleTemplate,
          district: district,
          planningAuthority: district === 'Mumbai City' || district === 'Mumbai Suburban' 
            ? 'MCGM' 
            : `${district} Municipal Corporation`
        };

        await DistrictRule.create(rule);
        totalAdded++;
      }
      
      console.log(`   ✅ Added ${missingCategoryRules.length} rules`);
    }

    console.log(`\n✅ Successfully added ${totalAdded} rules across all districts!`);
    console.log(`📊 New rules per category:`);
    console.log(`   Land Use: ${districts.length * 3} rules`);
    console.log(`   Zoning: ${districts.length * 2} rules`);
    console.log(`   Infrastructure: ${districts.length * 3} rules`);
    console.log(`   Social Infrastructure: ${districts.length * 2} rules`);
    console.log(`   Redevelopment: ${districts.length * 2} rules`);
    console.log(`   Regularization: ${districts.length * 2} rules`);

    // Verify
    const newTotal = await DistrictRule.countDocuments();
    console.log(`\n📊 Total rules in database: ${newTotal}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMissingCategories();
