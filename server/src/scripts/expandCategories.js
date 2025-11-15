import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistrictRule from '../models/DistrictRule.js';

dotenv.config();

// Additional rules for categories that have too few rules
const additionalRules = {
  'Affordable Housing': [
    {
      title: 'EWS Housing FSI Incentive',
      summary: 'Additional FSI for EWS housing provision',
      fullText: 'Developers providing EWS housing shall be eligible for additional FSI up to 20% of permissible FSI. EWS units must have minimum carpet area of 25 sq.m and maximum 30 sq.m. Units must be provided on same plot or within 1 km radius.',
      chapter: 'Chapter 15',
      section: 'Section 1',
      clause: '15.1.2',
      reference: 'Chapter 15 - Section 1 - 15.1.2',
      applicableZones: ['R1', 'R2', 'R3', 'Mixed']
    },
    {
      title: 'LIG Housing Standards',
      summary: 'Standards and specifications for LIG housing',
      fullText: 'LIG housing units shall have carpet area between 30-60 sq.m. Minimum room height 2.75m. Basic amenities including water supply, sanitation, and electricity mandatory. Common facilities like playground and community hall required for projects above 50 units.',
      chapter: 'Chapter 15',
      section: 'Section 1',
      clause: '15.1.3',
      reference: 'Chapter 15 - Section 1 - 15.1.3',
      applicableZones: ['R1', 'R2', 'R3', 'Mixed']
    },
    {
      title: 'Affordable Housing Parking Relaxation',
      summary: 'Reduced parking requirements for affordable housing',
      fullText: 'EWS/LIG housing projects eligible for 50% reduction in parking requirements. Minimum 1 parking space per 4 dwelling units for EWS, 1 per 3 units for LIG. Stacked parking and mechanical parking permitted.',
      chapter: 'Chapter 15',
      section: 'Section 2',
      clause: '15.2.1',
      reference: 'Chapter 15 - Section 2 - 15.2.1',
      applicableZones: ['R1', 'R2', 'R3', 'Mixed']
    },
    {
      title: 'Affordable Housing Amenities',
      summary: 'Mandatory amenities for affordable housing projects',
      fullText: 'Projects with more than 100 EWS/LIG units must provide: community hall (min 100 sq.m), playground (min 500 sq.m), primary health center, and crèche facility. Rainwater harvesting and solar water heating mandatory.',
      chapter: 'Chapter 15',
      section: 'Section 3',
      clause: '15.3.1',
      reference: 'Chapter 15 - Section 3 - 15.3.1',
      applicableZones: ['R1', 'R2', 'R3', 'Mixed']
    }
  ],
  'TOD': [
    {
      title: 'TOD Zone FSI Bonus',
      summary: 'Additional FSI for Transit Oriented Development zones',
      fullText: 'Properties within 500m of metro/railway stations eligible for additional FSI up to 1.0 over base FSI. Mixed-use development mandatory with minimum 20% commercial on ground floor. Pedestrian connectivity to station required.',
      chapter: 'Chapter 13',
      section: 'Section 1',
      clause: '13.1.2',
      reference: 'Chapter 13 - Section 1 - 13.1.2',
      applicableZones: ['TOD', 'Mixed']
    },
    {
      title: 'TOD Parking Reduction',
      summary: 'Reduced parking requirements in TOD zones',
      fullText: 'TOD zones eligible for 40% reduction in parking requirements. Bicycle parking mandatory: 1 space per 100 sq.m built-up area. Shared parking arrangements permitted. Car-free zones may be designated within 200m of station.',
      chapter: 'Chapter 13',
      section: 'Section 2',
      clause: '13.2.1',
      reference: 'Chapter 13 - Section 2 - 13.2.1',
      applicableZones: ['TOD', 'Mixed']
    },
    {
      title: 'TOD Pedestrian Infrastructure',
      summary: 'Mandatory pedestrian facilities in TOD zones',
      fullText: 'TOD developments must provide: minimum 3m wide pedestrian pathways, covered walkways, street furniture, adequate lighting, and barrier-free access. Direct pedestrian connection to transit station mandatory within 300m.',
      chapter: 'Chapter 13',
      section: 'Section 3',
      clause: '13.3.1',
      reference: 'Chapter 13 - Section 3 - 13.3.1',
      applicableZones: ['TOD', 'Mixed']
    }
  ],
  'CRZ': [
    {
      title: 'CRZ-I Restrictions',
      summary: 'Development restrictions in CRZ-I areas',
      fullText: 'CRZ-I (ecologically sensitive areas) - No new construction permitted except for public facilities. Existing structures may be repaired but not expanded. Minimum 100m buffer from High Tide Line. Only eco-tourism and conservation activities allowed.',
      chapter: 'Chapter 12',
      section: 'Section 1',
      clause: '12.1.2',
      reference: 'Chapter 12 - Section 1 - 12.1.2',
      applicableZones: ['CRZ']
    },
    {
      title: 'CRZ-II Development Norms',
      summary: 'Development regulations for CRZ-II areas',
      fullText: 'CRZ-II (developed areas) - Reconstruction of existing authorized structures permitted. FSI as per prevailing town planning scheme. Height restriction: maximum 9m or existing height, whichever is less. No new construction within 50m of HTL.',
      chapter: 'Chapter 12',
      section: 'Section 2',
      clause: '12.2.1',
      reference: 'Chapter 12 - Section 2 - 12.2.1',
      applicableZones: ['CRZ']
    },
    {
      title: 'CRZ-III Building Regulations',
      summary: 'Building regulations for CRZ-III areas',
      fullText: 'CRZ-III (relatively undisturbed areas) - No development zone of 200m from HTL for all areas. FSI maximum 0.5 for residential, 1.0 for commercial. Maximum height 9m. Minimum 60% plot area to be kept as open space with native vegetation.',
      chapter: 'Chapter 12',
      section: 'Section 3',
      clause: '12.3.1',
      reference: 'Chapter 12 - Section 3 - 12.3.1',
      applicableZones: ['CRZ']
    }
  ],
  'Mixed Use': [
    {
      title: 'Mixed Use FSI Distribution',
      summary: 'FSI allocation between residential and commercial uses',
      fullText: 'In mixed-use developments, minimum 30% and maximum 70% of total FSI shall be used for commercial purposes. Residential FSI shall be on upper floors. Separate vertical circulation for residential and commercial mandatory for buildings above 15m height.',
      chapter: 'Chapter 14',
      section: 'Section 1',
      clause: '14.1.2',
      reference: 'Chapter 14 - Section 1 - 14.1.2',
      applicableZones: ['Mixed']
    },
    {
      title: 'Mixed Use Parking Requirements',
      summary: 'Combined parking norms for mixed-use developments',
      fullText: 'Mixed-use parking: 1 ECS per 100 sq.m commercial + 1 ECS per dwelling unit for residential. Shared parking permitted with 20% reduction if operational hours differ. Visitor parking: additional 10% of total requirement.',
      chapter: 'Chapter 14',
      section: 'Section 2',
      clause: '14.2.1',
      reference: 'Chapter 14 - Section 2 - 14.2.1',
      applicableZones: ['Mixed']
    },
    {
      title: 'Mixed Use Amenity Requirements',
      summary: 'Mandatory amenities for mixed-use projects',
      fullText: 'Mixed-use projects above 5000 sq.m must provide: common recreation area (min 10% of plot), landscaped open spaces, waste management facility, and rainwater harvesting. Commercial areas must have separate service access and loading bays.',
      chapter: 'Chapter 14',
      section: 'Section 3',
      clause: '14.3.1',
      reference: 'Chapter 14 - Section 3 - 14.3.1',
      applicableZones: ['Mixed']
    }
  ]
};

async function expandCategories() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    const districts = await DistrictRule.distinct('district');
    console.log(`📊 Found ${districts.length} districts\n`);

    let totalAdded = 0;

    for (const [category, rules] of Object.entries(additionalRules)) {
      console.log(`\n📂 Adding rules for category: ${category}`);
      
      for (const district of districts) {
        for (const ruleTemplate of rules) {
          const rule = {
            ...ruleTemplate,
            category: category,
            district: district,
            planningAuthority: district === 'Mumbai City' || district === 'Mumbai Suburban' 
              ? 'MCGM' 
              : `${district} Municipal Corporation`,
            status: 'Active'
          };

          await DistrictRule.create(rule);
          totalAdded++;
        }
      }
      
      console.log(`   ✅ Added ${rules.length * districts.length} rules`);
    }

    console.log(`\n✅ Successfully added ${totalAdded} rules!`);
    
    // Verify new counts
    console.log('\n📊 Updated category counts:');
    for (const category of Object.keys(additionalRules)) {
      const count = await DistrictRule.countDocuments({ category });
      console.log(`   ${category}: ${count} rules`);
    }

    const newTotal = await DistrictRule.countDocuments();
    console.log(`\n📊 Total rules in database: ${newTotal}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

expandCategories();
