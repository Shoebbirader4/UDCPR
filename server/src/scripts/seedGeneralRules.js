import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Rule from '../models/Rule.js';

dotenv.config();

const generalRules = [
  {
    chapter: 'Chapter 3',
    section: 'Section 1',
    clause: '3.1.1',
    reference: 'UDCPR-2020-3.1.1',
    title: 'Base FSI for Residential Zones',
    summary: 'Base Floor Space Index for residential development',
    fullText: 'The base FSI for residential zones shall be 1.0 for plots in municipal corporation areas and 0.8 for plots in municipal council areas. Additional FSI may be granted on payment of premium as per regulations.',
    category: 'FSI',
    applicableZones: ['R1', 'R2', 'R3'],
    isGeneral: true,
    tags: ['FSI', 'residential', 'base', 'floor space index']
  },
  {
    chapter: 'Chapter 3',
    section: 'Section 1',
    clause: '3.1.2',
    reference: 'UDCPR-2020-3.1.2',
    title: 'Premium FSI',
    summary: 'Additional FSI on payment of premium',
    fullText: 'Additional FSI beyond base FSI may be granted on payment of premium at rates specified in the regulations. Maximum permissible FSI including premium shall not exceed 2.0 for residential zones in most areas.',
    category: 'FSI',
    applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2'],
    isGeneral: true,
    tags: ['FSI', 'premium', 'additional', 'payment']
  },
  {
    chapter: 'Chapter 5',
    section: 'Section 1',
    clause: '5.1.1',
    reference: 'UDCPR-2020-5.1.1',
    title: 'Front Setback Requirements',
    summary: 'Minimum front setback from plot boundary',
    fullText: 'Minimum front setback shall be 3m for plots up to 300 sq.m, 4.5m for plots 300-1000 sq.m, and 6m for plots above 1000 sq.m. Front setback may be increased based on road width as per regulations.',
    category: 'Setback',
    applicableZones: ['All'],
    isGeneral: true,
    tags: ['setback', 'front', 'marginal distance', 'plot boundary']
  },
  {
    chapter: 'Chapter 5',
    section: 'Section 1',
    clause: '5.1.2',
    reference: 'UDCPR-2020-5.1.2',
    title: 'Side and Rear Setbacks',
    summary: 'Minimum side and rear setback requirements',
    fullText: 'Side setbacks shall be minimum 1.5m for buildings up to 2 floors, 3m for buildings 3-7 floors, and 4.5m for buildings above 7 floors. Rear setback shall be minimum 3m for all buildings.',
    category: 'Setback',
    applicableZones: ['All'],
    isGeneral: true,
    tags: ['setback', 'side', 'rear', 'marginal distance']
  },
  {
    chapter: 'Chapter 6',
    section: 'Section 1',
    clause: '6.1.1',
    reference: 'UDCPR-2020-6.1.1',
    title: 'Building Height Restrictions',
    summary: 'Maximum permissible building height',
    fullText: 'Maximum building height shall be determined based on road width, zone classification, and FSI. Generally, height shall not exceed 15m (4 floors) for residential zones unless higher FSI is approved.',
    category: 'Height',
    applicableZones: ['R1', 'R2', 'R3'],
    isGeneral: true,
    tags: ['height', 'floors', 'building height', 'restriction']
  },
  {
    chapter: 'Chapter 8',
    section: 'Section 1',
    clause: '8.1.1',
    reference: 'UDCPR-2020-8.1.1',
    title: 'Residential Parking Requirements',
    summary: 'Parking spaces required for residential buildings',
    fullText: 'Residential buildings shall provide parking as follows: 1 ECS per dwelling unit for carpet area up to 50 sq.m, 2 ECS per unit for 50-100 sq.m, and 3 ECS per unit for above 100 sq.m. One ECS equals 25 sq.m.',
    category: 'Parking',
    applicableZones: ['R1', 'R2', 'R3'],
    isGeneral: true,
    tags: ['parking', 'residential', 'ECS', 'dwelling unit']
  },
  {
    chapter: 'Chapter 8',
    section: 'Section 2',
    clause: '8.2.1',
    reference: 'UDCPR-2020-8.2.1',
    title: 'Commercial Parking Requirements',
    summary: 'Parking spaces required for commercial buildings',
    fullText: 'Commercial buildings shall provide 1 ECS per 75 sq.m of built-up area for offices, 1 ECS per 50 sq.m for retail/malls, and 1 ECS per 50 sq.m for restaurants. Visitor parking shall be additional 10% of total requirement.',
    category: 'Parking',
    applicableZones: ['C1', 'C2', 'Mixed'],
    isGeneral: true,
    tags: ['parking', 'commercial', 'office', 'retail', 'ECS']
  },
  {
    chapter: 'Chapter 10',
    section: 'Section 1',
    clause: '10.1.1',
    reference: 'UDCPR-2020-10.1.1',
    title: 'Amenity Space Requirements',
    summary: 'Mandatory amenity spaces in residential projects',
    fullText: 'Residential projects above 4000 sq.m shall provide minimum 10% of plot area as amenity space including playground, community hall, and landscaped areas. Projects above 10000 sq.m shall provide additional facilities as per regulations.',
    category: 'Amenity',
    applicableZones: ['R1', 'R2', 'R3'],
    isGeneral: true,
    tags: ['amenity', 'open space', 'playground', 'community']
  },
  {
    chapter: 'Chapter 11',
    section: 'Section 1',
    clause: '11.1.1',
    reference: 'UDCPR-2020-11.1.1',
    title: 'TDR Generation',
    summary: 'Transferable Development Rights generation',
    fullText: 'TDR may be generated from land surrendered for public purposes, heritage conservation, or slum rehabilitation. TDR can be utilized to achieve additional FSI beyond base FSI subject to maximum permissible limits and payment of premium.',
    category: 'TDR',
    applicableZones: ['All'],
    isGeneral: true,
    tags: ['TDR', 'transferable development rights', 'FSI', 'premium']
  },
  {
    chapter: 'Chapter 12',
    section: 'Section 1',
    clause: '12.1.1',
    reference: 'UDCPR-2020-12.1.1',
    title: 'Environmental Clearance',
    summary: 'Environmental clearance requirements',
    fullText: 'Projects above 20000 sq.m built-up area require environmental clearance from State Environment Impact Assessment Authority. Projects in ecologically sensitive areas require clearance regardless of size.',
    category: 'Environmental',
    applicableZones: ['All'],
    isGeneral: true,
    tags: ['environment', 'clearance', 'EIA', 'ecology']
  },
  {
    chapter: 'Chapter 13',
    section: 'Section 1',
    clause: '13.1.1',
    reference: 'UDCPR-2020-13.1.1',
    title: 'Fire Safety Requirements',
    summary: 'Fire safety and firefighting provisions',
    fullText: 'Buildings above 15m height shall provide firefighting equipment, fire exits, and emergency evacuation plans as per National Building Code. Fire NOC from Fire Department is mandatory before occupation.',
    category: 'Safety',
    applicableZones: ['All'],
    isGeneral: true,
    tags: ['fire', 'safety', 'firefighting', 'emergency']
  },
  {
    chapter: 'Chapter 14',
    section: 'Section 1',
    clause: '14.1.1',
    reference: 'UDCPR-2020-14.1.1',
    title: 'Accessibility for Disabled',
    summary: 'Barrier-free access requirements',
    fullText: 'All buildings shall provide barrier-free access including ramps, accessible toilets, and lifts as per National Building Code. Residential buildings above 4 floors must have lifts with minimum one accessible lift.',
    category: 'Accessibility',
    applicableZones: ['All'],
    isGeneral: true,
    tags: ['accessibility', 'disabled', 'ramp', 'barrier-free']
  },
  {
    chapter: 'Chapter 15',
    section: 'Section 1',
    clause: '15.1.1',
    reference: 'UDCPR-2020-15.1.1',
    title: 'EWS/LIG Housing Reservation',
    summary: 'Economically Weaker Section housing requirements',
    fullText: 'Residential developments above 4000 sq.m shall reserve minimum 20% of FSI for EWS/LIG housing with carpet area not exceeding 30 sq.m for EWS and 60 sq.m for LIG. Additional FSI incentives may be provided.',
    category: 'Affordable Housing',
    applicableZones: ['R1', 'R2', 'R3', 'Mixed'],
    isGeneral: true,
    tags: ['EWS', 'LIG', 'affordable', 'housing', 'reservation']
  },
  {
    chapter: 'Chapter 16',
    section: 'Section 1',
    clause: '16.1.1',
    reference: 'UDCPR-2020-16.1.1',
    title: 'Mixed Use Development',
    summary: 'Regulations for mixed-use buildings',
    fullText: 'Mixed-use developments combining residential and commercial uses are permitted on plots above 1000 sq.m. Commercial component shall not exceed 40% of total FSI and shall be located on lower floors with separate access.',
    category: 'Mixed Use',
    applicableZones: ['Mixed'],
    isGeneral: true,
    tags: ['mixed use', 'commercial', 'residential', 'combined']
  },
  {
    chapter: 'Chapter 17',
    section: 'Section 1',
    clause: '17.1.1',
    reference: 'UDCPR-2020-17.1.1',
    title: 'Heritage Building Conservation',
    summary: 'Regulations for heritage buildings',
    fullText: 'Heritage buildings shall be conserved as per Heritage Regulations. Alterations require approval from Heritage Committee. Additional FSI up to 0.33 may be granted for heritage conservation through TDR mechanism.',
    category: 'Heritage',
    applicableZones: ['All'],
    isGeneral: true,
    tags: ['heritage', 'conservation', 'TDR', 'historic']
  }
];

async function seedGeneralRules() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    console.log('📋 Seeding General UDCPR Rules...\n');

    // Clear existing general rules
    await Rule.deleteMany({ isGeneral: true });
    console.log('🗑️  Cleared existing general rules\n');

    // Insert new rules
    for (const rule of generalRules) {
      await Rule.create(rule);
      console.log(`✅ Added: ${rule.reference} - ${rule.title}`);
    }

    console.log(`\n✅ Successfully seeded ${generalRules.length} general UDCPR rules!`);

    // Verify
    const count = await Rule.countDocuments({ isGeneral: true });
    console.log(`📊 Total general rules in database: ${count}\n`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedGeneralRules();
