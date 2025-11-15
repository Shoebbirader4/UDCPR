import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import DistrictRule from '../models/DistrictRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// All Maharashtra districts with their info
const districts = [
  { name: 'Mumbai City', region: 'Konkan', authority: 'MCGM', type: 'Municipal Corporation' },
  { name: 'Mumbai Suburban', region: 'Konkan', authority: 'MCGM', type: 'Municipal Corporation' },
  { name: 'Thane', region: 'Konkan', authority: 'TMC', type: 'Municipal Corporation' },
  { name: 'Palghar', region: 'Konkan', authority: 'PMC', type: 'Municipal Council' },
  { name: 'Raigad', region: 'Konkan', authority: 'CIDCO', type: 'Mixed' },
  { name: 'Ratnagiri', region: 'Konkan', authority: 'RMC', type: 'Municipal Council' },
  { name: 'Sindhudurg', region: 'Konkan', authority: 'Local Bodies', type: 'Municipal Council' },
  { name: 'Pune', region: 'Pune', authority: 'PMC', type: 'Municipal Corporation' },
  { name: 'Satara', region: 'Pune', authority: 'SMC', type: 'Municipal Council' },
  { name: 'Sangli', region: 'Pune', authority: 'SMC', type: 'Municipal Corporation' },
  { name: 'Kolhapur', region: 'Pune', authority: 'KMC', type: 'Municipal Corporation' },
  { name: 'Solapur', region: 'Pune', authority: 'SMC', type: 'Municipal Corporation' },
  { name: 'Nashik', region: 'Nashik', authority: 'NMC', type: 'Municipal Corporation' },
  { name: 'Dhule', region: 'Nashik', authority: 'DMC', type: 'Municipal Council' },
  { name: 'Nandurbar', region: 'Nashik', authority: 'Local Bodies', type: 'Municipal Council' },
  { name: 'Jalgaon', region: 'Nashik', authority: 'JMC', type: 'Municipal Corporation' },
  { name: 'Aurangabad', region: 'Aurangabad', authority: 'AMC', type: 'Municipal Corporation' },
  { name: 'Jalna', region: 'Aurangabad', authority: 'JMC', type: 'Municipal Council' },
  { name: 'Beed', region: 'Aurangabad', authority: 'BMC', type: 'Municipal Council' },
  { name: 'Latur', region: 'Aurangabad', authority: 'LMC', type: 'Municipal Corporation' },
  { name: 'Osmanabad', region: 'Aurangabad', authority: 'OMC', type: 'Municipal Council' },
  { name: 'Nanded', region: 'Aurangabad', authority: 'NMC', type: 'Municipal Corporation' },
  { name: 'Parbhani', region: 'Aurangabad', authority: 'PMC', type: 'Municipal Council' },
  { name: 'Hingoli', region: 'Aurangabad', authority: 'Local Bodies', type: 'Municipal Council' },
  { name: 'Nagpur', region: 'Nagpur', authority: 'NMC', type: 'Municipal Corporation' },
  { name: 'Wardha', region: 'Nagpur', authority: 'WMC', type: 'Municipal Council' },
  { name: 'Bhandara', region: 'Nagpur', authority: 'BMC', type: 'Municipal Council' },
  { name: 'Gondia', region: 'Nagpur', authority: 'GMC', type: 'Municipal Council' },
  { name: 'Chandrapur', region: 'Nagpur', authority: 'CMC', type: 'Municipal Corporation' },
  { name: 'Gadchiroli', region: 'Nagpur', authority: 'Local Bodies', type: 'Municipal Council' },
  { name: 'Amravati', region: 'Amravati', authority: 'AMC', type: 'Municipal Corporation' },
  { name: 'Akola', region: 'Amravati', authority: 'AMC', type: 'Municipal Corporation' },
  { name: 'Yavatmal', region: 'Amravati', authority: 'YMC', type: 'Municipal Council' },
  { name: 'Buldhana', region: 'Amravati', authority: 'BMC', type: 'Municipal Council' },
  { name: 'Washim', region: 'Amravati', authority: 'WMC', type: 'Municipal Council' }
];

// Comprehensive rule templates for all categories
const ruleTemplates = {
  'Heritage': [
    {
      clause: '10.1.1',
      chapter: 'Chapter 10',
      section: 'Section 1',
      summary: 'Heritage Building Classification',
      fullText: 'Heritage buildings are classified as Grade I, Grade II-A, Grade II-B, and Grade III based on their architectural, historical, and cultural significance. Grade I buildings require strict conservation with no structural alterations permitted.',
      keywords: ['heritage', 'conservation', 'grade i', 'grade ii', 'protected']
    },
    {
      clause: '10.1.2',
      chapter: 'Chapter 10',
      section: 'Section 1',
      summary: 'Heritage Precinct Regulations',
      fullText: 'In heritage precincts, new construction shall maintain the character, scale, and architectural style of the area. Height restrictions apply to ensure visual harmony with heritage structures.',
      keywords: ['heritage precinct', 'conservation', 'architectural character']
    }
  ],
  'TDR': [
    {
      clause: '11.1.1',
      chapter: 'Chapter 11',
      section: 'Section 1',
      summary: 'TDR Generation and Utilization',
      fullText: 'Transferable Development Rights (TDR) can be generated from land surrendered for public purposes, heritage buildings, or slum rehabilitation projects. TDR can be utilized to achieve additional FSI beyond the base FSI, subject to maximum permissible limits.',
      keywords: ['tdr', 'transferable development rights', 'additional fsi', 'fungible']
    },
    {
      clause: '11.1.2',
      chapter: 'Chapter 11',
      section: 'Section 1',
      summary: 'TDR Loading Zones',
      fullText: 'TDR can be loaded in designated receiving zones as per Development Plan. Loading of TDR is subject to infrastructure capacity, road width requirements, and overall development density norms.',
      keywords: ['tdr loading', 'receiving zone', 'development rights']
    }
  ],
  'Amenity': [
    {
      clause: '4.1.1',
      chapter: 'Chapter 4',
      section: 'Section 1',
      summary: 'Recreational Open Space Requirements',
      fullText: 'For plots above 4000 sq.m, minimum 10% of plot area shall be reserved as Recreational Open Space (ROS). This space shall be accessible to all residents and maintained by the society/developer.',
      keywords: ['amenity', 'recreational space', 'open space', 'ros']
    },
    {
      clause: '4.1.2',
      chapter: 'Chapter 4',
      section: 'Section 1',
      summary: 'Community Facilities',
      fullText: 'Residential developments above 20,000 sq.m built-up area shall provide community facilities including community hall, senior citizen area, and children play area as per norms.',
      keywords: ['community facilities', 'amenity', 'community hall']
    }
  ],
  'Environmental': [
    {
      clause: '12.1.1',
      chapter: 'Chapter 12',
      section: 'Section 1',
      summary: 'Rainwater Harvesting Mandatory',
      fullText: 'All plots above 300 sq.m shall mandatorily provide rainwater harvesting system. The system shall include collection, filtration, and storage or recharge facilities as per approved design.',
      keywords: ['rainwater harvesting', 'environmental', 'water conservation']
    },
    {
      clause: '12.1.2',
      chapter: 'Chapter 12',
      section: 'Section 1',
      summary: 'Solar Energy Requirements',
      fullText: 'Buildings with roof area above 500 sq.m shall install solar water heating system or solar photovoltaic panels covering minimum 20% of roof area for energy conservation.',
      keywords: ['solar energy', 'green building', 'sustainable', 'renewable energy']
    },
    {
      clause: '12.1.3',
      chapter: 'Chapter 12',
      section: 'Section 1',
      summary: 'Sewage Treatment Plant',
      fullText: 'Residential complexes generating more than 100 KLD sewage shall provide onsite Sewage Treatment Plant (STP) with tertiary treatment. Treated water shall be reused for flushing and landscaping.',
      keywords: ['stp', 'sewage treatment', 'waste management', 'environmental']
    }
  ],
  'Safety': [
    {
      clause: '8.1.1',
      chapter: 'Chapter 8',
      section: 'Section 1',
      summary: 'Fire Safety Requirements',
      fullText: 'Buildings above 15m height shall provide fire safety measures including fire detection system, sprinkler system, fire escape staircases, and firefighting equipment as per NBC and local fire authority norms.',
      keywords: ['fire safety', 'fire protection', 'emergency exit', 'nbc']
    },
    {
      clause: '8.1.2',
      chapter: 'Chapter 8',
      section: 'Section 1',
      summary: 'Structural Safety and Seismic Design',
      fullText: 'All buildings shall be designed for seismic Zone III as per IS 1893. Structural design shall be certified by licensed structural engineer and comply with IS codes for earthquake resistance.',
      keywords: ['structural safety', 'seismic', 'earthquake', 'is 1893']
    }
  ],
  'Accessibility': [
    {
      clause: '9.1.1',
      chapter: 'Chapter 9',
      section: 'Section 1',
      summary: 'Universal Accessibility Requirements',
      fullText: 'All public and semi-public buildings shall provide barrier-free access including ramps with maximum 1:12 slope, accessible toilets, tactile paving, and lifts with Braille buttons for differently-abled persons.',
      keywords: ['accessibility', 'barrier-free', 'universal design', 'ramp', 'disabled']
    },
    {
      clause: '9.1.2',
      chapter: 'Chapter 9',
      section: 'Section 1',
      summary: 'Accessible Parking',
      fullText: 'Minimum 5% of total parking spaces shall be reserved and marked for differently-abled persons, located nearest to building entrance with wider parking bays of 3.6m x 5m.',
      keywords: ['accessible parking', 'disabled parking', 'barrier-free']
    }
  ],
  'CRZ': [
    {
      clause: '13.1.1',
      chapter: 'Chapter 13',
      section: 'Section 1',
      summary: 'Coastal Regulation Zone Restrictions',
      fullText: 'No construction is permitted within 500m from High Tide Line (HTL) in CRZ-I areas. In CRZ-II and CRZ-III, construction is regulated as per CRZ Notification 2019 with restrictions on FSI, height, and land use.',
      keywords: ['crz', 'coastal regulation', 'high tide line', 'htl', 'no development zone']
    }
  ],
  'TOD': [
    {
      clause: '14.1.1',
      chapter: 'Chapter 14',
      section: 'Section 1',
      summary: 'Transit Oriented Development Zones',
      fullText: 'Areas within 500m radius of metro stations are designated as TOD zones. Additional FSI up to 3.0 is permissible in TOD zones subject to payment of premium and provision of public amenities.',
      keywords: ['tod', 'transit oriented', 'metro influence', 'additional fsi']
    }
  ],
  'Affordable Housing': [
    {
      clause: '15.1.1',
      chapter: 'Chapter 15',
      section: 'Section 1',
      summary: 'EWS/LIG Housing Reservation',
      fullText: 'In residential developments above 4000 sq.m, minimum 20% of FSI shall be reserved for Economically Weaker Section (EWS) and Low Income Group (LIG) housing with carpet area not exceeding 30 sq.m and 60 sq.m respectively.',
      keywords: ['affordable housing', 'ews', 'lig', 'reservation']
    }
  ],
  'Mixed Use': [
    {
      clause: '5.1.1',
      chapter: 'Chapter 5',
      section: 'Section 1',
      summary: 'Mixed Use Development',
      fullText: 'Mixed use developments combining residential and commercial uses are permitted on plots above 1000 sq.m. Commercial component shall not exceed 40% of total FSI and shall be located on lower floors with separate access.',
      keywords: ['mixed use', 'residential cum commercial', 'composite use']
    }
  ],
  'Special Buildings': [
    {
      clause: '6.1.1',
      chapter: 'Chapter 6',
      section: 'Section 1',
      summary: 'High Rise Building Regulations',
      fullText: 'Buildings above 70m height are classified as high-rise and require special approval. Additional requirements include refuge floors every 24m, pressurized staircases, helipad provision, and enhanced fire safety measures.',
      keywords: ['high rise', 'special building', 'tall building']
    },
    {
      clause: '6.1.2',
      chapter: 'Chapter 6',
      section: 'Section 1',
      summary: 'Mall and Multiplex Requirements',
      fullText: 'Shopping malls and multiplexes shall provide adequate parking (1 ECS per 50 sq.m), fire safety as per NBC, emergency exits, and crowd management systems. Minimum plot size 4000 sq.m required.',
      keywords: ['mall', 'multiplex', 'special building', 'commercial']
    }
  ]
};

async function seedAllCategories() {
  try {
    console.log('\n🚀 Seeding all UDCPR categories...');
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    const currentCount = await DistrictRule.countDocuments();
    console.log(`📊 Current rules in database: ${currentCount}`);

    console.log('\n📥 Adding new category rules...');
    
    let newRules = [];
    let addedCount = 0;

    // Generate rules for each new category and district
    for (const [category, templates] of Object.entries(ruleTemplates)) {
      console.log(`\n   Processing ${category}...`);
      
      for (const district of districts) {
        for (const template of templates) {
          newRules.push({
            district: district.name,
            region: district.region,
            planningAuthority: district.authority,
            municipalityType: district.type,
            
            chapter: template.chapter,
            section: template.section,
            clause: template.clause,
            
            summary: `${template.summary} - ${district.name}`,
            fullText: template.fullText,
            
            category: category,
            applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'I1', 'I2', 'Mixed', 'Special'],
            applicableAreas: ['Urban', 'Rural'],
            
            keywords: [...template.keywords, district.name.toLowerCase(), district.region.toLowerCase()],
            tags: [district.name, category, district.region],
            
            isDistrictSpecific: true,
            status: 'Active',
            effectiveFrom: new Date('2020-04-01'),
            
            notes: 'UDCPR 2020 regulation - Seeded for comprehensive coverage'
          });
          addedCount++;
        }
      }
      
      console.log(`   ✅ Added ${templates.length * districts.length} ${category} rules`);
    }

    // Import in batches
    console.log(`\n📥 Importing ${newRules.length} new rules...`);
    const batchSize = 100;
    for (let i = 0; i < newRules.length; i += batchSize) {
      const batch = newRules.slice(i, i + batchSize);
      await DistrictRule.insertMany(batch);
      console.log(`   Imported ${Math.min(i + batchSize, newRules.length)}/${newRules.length}`);
    }

    // Final statistics
    const finalCount = await DistrictRule.countDocuments();
    const categories = await DistrictRule.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Final Statistics:');
    console.log(`   Total rules: ${finalCount} (added ${finalCount - currentCount})`);
    console.log(`\n   Rules by Category:`);
    categories.forEach(cat => {
      console.log(`      ${cat._id}: ${cat.count} rules`);
    });

    console.log('\n✨ All categories seeded successfully!');
    console.log('\n💡 You can now search for:');
    console.log('   ✅ Heritage, TDR, Amenity');
    console.log('   ✅ Environmental, Safety, Accessibility');
    console.log('   ✅ CRZ, TOD, Affordable Housing');
    console.log('   ✅ Mixed Use, Special Buildings');
    console.log('\n   All districts including Aurangabad are covered!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

seedAllCategories();
