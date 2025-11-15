import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import DistrictRule from '../models/DistrictRule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

// Mumbai has its own comprehensive UDCPR with more detailed regulations
// This seeds Mumbai-specific rules that are different from rest of Maharashtra

const mumbaiDistricts = [
  { name: 'Mumbai City', authority: 'MCGM', region: 'Konkan' },
  { name: 'Mumbai Suburban', authority: 'MCGM', region: 'Konkan' }
];

// Comprehensive Mumbai-specific rule templates
const mumbaiRuleTemplates = {
  'FSI': [
    {
      clause: '3.1.1',
      chapter: 'Chapter 3',
      section: 'Section 1',
      summary: 'Base FSI for Residential Zones in Mumbai',
      fullText: 'Base FSI for residential zones in Mumbai: R-North (1.0), R-Central (1.33), R-South (1.33). Island City has higher base FSI compared to suburbs. Additional FSI available through TDR, premium FSI, and fungible FSI mechanisms.',
      keywords: ['fsi', 'residential', 'base fsi', 'island city', 'mumbai']
    },
    {
      clause: '3.1.2',
      chapter: 'Chapter 3',
      section: 'Section 1',
      summary: 'Commercial FSI in Mumbai',
      fullText: 'Commercial FSI in Mumbai ranges from 2.0 to 5.0 depending on location and road width. BKC and Nariman Point have special FSI provisions. Commercial on arterial roads gets higher FSI.',
      keywords: ['commercial fsi', 'bkc', 'nariman point', 'arterial road']
    },
    {
      clause: '3.1.3',
      chapter: 'Chapter 3',
      section: 'Section 1',
      summary: 'Premium FSI in Mumbai',
      fullText: 'Premium FSI up to 1.33 available in Mumbai on payment of premium charges. Calculated based on Ready Reckoner rates. Available for residential and commercial developments.',
      keywords: ['premium fsi', 'ready reckoner', 'additional fsi']
    },
    {
      clause: '3.1.4',
      chapter: 'Chapter 3',
      section: 'Section 1',
      summary: 'Fungible FSI in Mumbai',
      fullText: 'Fungible FSI allows conversion between residential and commercial FSI. Ratio of 1:1.5 for residential to commercial conversion. Subject to payment of differential premium.',
      keywords: ['fungible fsi', 'conversion', 'residential to commercial']
    },
    {
      clause: '3.1.5',
      chapter: 'Chapter 3',
      section: 'Section 1',
      summary: 'TOD FSI in Mumbai',
      fullText: 'Transit Oriented Development zones in Mumbai get additional FSI up to 3.0 within 500m of metro stations. Requires provision of public amenities and wider roads.',
      keywords: ['tod', 'metro', 'transit oriented', 'additional fsi']
    }
  ],
  'Setback': [
    {
      clause: '3.2.1',
      chapter: 'Chapter 3',
      section: 'Section 2',
      summary: 'Front Setback Requirements Mumbai',
      fullText: 'Front setback in Mumbai: Minimum 3m for plots up to 300 sq.m, 4.5m for 300-1000 sq.m, 6m for plots above 1000 sq.m. On roads wider than 12m, setback shall be 1/3rd of road width or minimum specified, whichever is more.',
      keywords: ['front setback', 'marginal distance', 'road width']
    },
    {
      clause: '3.2.2',
      chapter: 'Chapter 3',
      section: 'Section 2',
      summary: 'Side and Rear Setbacks Mumbai',
      fullText: 'Side setbacks: 0m up to 2 floors, 1.5m for 3-4 floors, 3m for 5+ floors. Rear setback: Minimum 3m for all buildings. Additional setback required for buildings above 24m height.',
      keywords: ['side setback', 'rear setback', 'height based']
    },
    {
      clause: '3.2.3',
      chapter: 'Chapter 3',
      section: 'Section 2',
      summary: 'Setback Relaxation Mumbai',
      fullText: 'Setback relaxation permitted for plots less than 150 sq.m in congested areas. Minimum 1.5m front setback mandatory. Side setback can be reduced to 0m for buildings up to 3 floors.',
      keywords: ['setback relaxation', 'small plots', 'congested areas']
    }
  ],
  'Parking': [
    {
      clause: '7.1.1',
      chapter: 'Chapter 7',
      section: 'Section 1',
      summary: 'Residential Parking Mumbai',
      fullText: 'Residential parking in Mumbai: 1 ECS per dwelling unit up to 50 sq.m carpet area, 2 ECS for 50-100 sq.m, 3 ECS for above 100 sq.m. Mechanical parking permitted with 20% additional requirement.',
      keywords: ['residential parking', 'ecs', 'dwelling unit']
    },
    {
      clause: '7.1.2',
      chapter: 'Chapter 7',
      section: 'Section 1',
      summary: 'Commercial Parking Mumbai',
      fullText: 'Commercial parking: 1 ECS per 100 sq.m for shops, 1 ECS per 50 sq.m for restaurants, 1 ECS per 75 sq.m for offices. Malls require 1 ECS per 50 sq.m of leasable area.',
      keywords: ['commercial parking', 'mall', 'office', 'restaurant']
    },
    {
      clause: '7.1.3',
      chapter: 'Chapter 7',
      section: 'Section 1',
      summary: 'Basement Parking Mumbai',
      fullText: 'Basement parking permitted up to 2 levels below ground. Basement can extend up to property line. Mechanical ventilation mandatory. Ramp width minimum 3.6m for two-way traffic.',
      keywords: ['basement parking', 'underground', 'mechanical ventilation']
    }
  ],
  'Heritage': [
    {
      clause: '10.1.1',
      chapter: 'Chapter 10',
      section: 'Section 1',
      summary: 'Heritage Buildings Mumbai',
      fullText: 'Mumbai has over 600 heritage buildings classified as Grade I, II-A, II-B, and III. Grade I buildings (like CST, Gateway of India) require strict conservation. No structural alterations permitted without Heritage Committee approval.',
      keywords: ['heritage', 'grade i', 'conservation', 'heritage committee']
    },
    {
      clause: '10.1.2',
      chapter: 'Chapter 10',
      section: 'Section 1',
      summary: 'Heritage Precincts Mumbai',
      fullText: 'Heritage precincts in Mumbai include Fort, Kala Ghoda, Girgaum, Dadar Parsi Colony. New construction must match character, scale, and materials of precinct. Height limited to prevailing context.',
      keywords: ['heritage precinct', 'fort', 'kala ghoda', 'conservation']
    },
    {
      clause: '10.1.3',
      chapter: 'Chapter 10',
      section: 'Section 1',
      summary: 'Heritage TDR Mumbai',
      fullText: 'Heritage building owners can generate TDR equivalent to consumed FSI. TDR can be sold or used on same plot. Additional incentive FSI of 0.33 available for heritage conservation.',
      keywords: ['heritage tdr', 'conservation incentive', 'additional fsi']
    }
  ],
  'TDR': [
    {
      clause: '11.1.1',
      chapter: 'Chapter 11',
      section: 'Section 1',
      summary: 'TDR Generation Mumbai',
      fullText: 'TDR in Mumbai generated from: Land surrendered for roads/public purposes (1:1 ratio), Heritage buildings (consumed FSI), Slum rehabilitation (2.5 FSI), Cessed buildings (consumed FSI + incentive).',
      keywords: ['tdr generation', 'road widening', 'slum rehabilitation']
    },
    {
      clause: '11.1.2',
      chapter: 'Chapter 11',
      section: 'Section 1',
      summary: 'TDR Loading Zones Mumbai',
      fullText: 'TDR can be loaded in designated receiving zones across Mumbai. Island City has restricted receiving zones. Suburbs have more liberal TDR loading. Maximum FSI with TDR: 3.0 for residential, 5.0 for commercial.',
      keywords: ['tdr loading', 'receiving zone', 'maximum fsi']
    },
    {
      clause: '11.1.3',
      chapter: 'Chapter 11',
      section: 'Section 1',
      summary: 'TDR Certificate Mumbai',
      fullText: 'TDR certificates issued by MCGM after verification. Valid for 10 years. Can be traded in open market. Separate certificates for residential and commercial TDR. Registration mandatory.',
      keywords: ['tdr certificate', 'validity', 'trading']
    }
  ],
  'CRZ': [
    {
      clause: '13.1.1',
      chapter: 'Chapter 13',
      section: 'Section 1',
      summary: 'CRZ Regulations Mumbai',
      fullText: 'Mumbai coastline falls under CRZ-I, II, and III. No construction within 500m of HTL in CRZ-I (beaches, mangroves). CRZ-II (developed areas) allows reconstruction with restrictions. FSI limited to 1.33 in CRZ areas.',
      keywords: ['crz', 'coastal', 'high tide line', 'htl', 'mangroves']
    },
    {
      clause: '13.1.2',
      chapter: 'Chapter 13',
      section: 'Section 1',
      summary: 'CRZ Clearance Mumbai',
      fullText: 'All developments within 500m of HTL require CRZ clearance from Maharashtra Coastal Zone Management Authority. Environmental Impact Assessment mandatory for projects above 20,000 sq.m.',
      keywords: ['crz clearance', 'mczma', 'eia', 'environmental']
    }
  ],
  'Environmental': [
    {
      clause: '12.1.1',
      chapter: 'Chapter 12',
      section: 'Section 1',
      summary: 'Rainwater Harvesting Mumbai',
      fullText: 'Mandatory rainwater harvesting for all plots above 300 sq.m in Mumbai. Minimum 20% of plot area for recharge. Rooftop collection and storage mandatory. MCGM provides subsidy for RWH systems.',
      keywords: ['rainwater harvesting', 'rwh', 'water conservation']
    },
    {
      clause: '12.1.2',
      chapter: 'Chapter 12',
      section: 'Section 1',
      summary: 'Solar Energy Mumbai',
      fullText: 'Solar water heaters mandatory for buildings above 500 sq.m roof area. Solar PV panels encouraged with net metering facility. 20% roof area to be reserved for solar installations.',
      keywords: ['solar energy', 'solar water heater', 'solar pv', 'net metering']
    },
    {
      clause: '12.1.3',
      chapter: 'Chapter 12',
      section: 'Section 1',
      summary: 'STP Requirements Mumbai',
      fullText: 'Sewage Treatment Plant mandatory for complexes generating more than 100 KLD. Tertiary treatment required. Treated water to be reused for flushing, gardening. Connection to MCGM sewer after treatment.',
      keywords: ['stp', 'sewage treatment', 'wastewater', 'tertiary treatment']
    },
    {
      clause: '12.1.4',
      chapter: 'Chapter 12',
      section: 'Section 1',
      summary: 'Waste Management Mumbai',
      fullText: 'Solid waste segregation mandatory at source. Organic waste composting required for societies above 50 units. Dry waste to be handed to authorized recyclers. E-waste collection centers mandatory.',
      keywords: ['waste management', 'segregation', 'composting', 'recycling']
    }
  ],
  'Safety': [
    {
      clause: '8.1.1',
      chapter: 'Chapter 8',
      section: 'Section 1',
      summary: 'Fire Safety Mumbai',
      fullText: 'Fire safety as per Mumbai Fire Brigade requirements. Buildings above 15m require NOC from Fire Brigade. Sprinkler system, fire detection, fire escape staircases mandatory. Fire lift required above 24m.',
      keywords: ['fire safety', 'fire brigade', 'sprinkler', 'fire escape']
    },
    {
      clause: '8.1.2',
      chapter: 'Chapter 8',
      section: 'Section 1',
      summary: 'High-Rise Safety Mumbai',
      fullText: 'High-rise buildings (above 70m) require refuge floors every 24m, pressurized staircases, helipad on terrace, enhanced fire safety. Structural audit every 5 years mandatory.',
      keywords: ['high rise', 'refuge floor', 'helipad', 'structural audit']
    },
    {
      clause: '8.1.3',
      chapter: 'Chapter 8',
      section: 'Section 1',
      summary: 'Seismic Safety Mumbai',
      fullText: 'Mumbai is in Seismic Zone III. All buildings to be designed as per IS 1893. Ductile detailing mandatory. Structural design by licensed structural engineer. Soil investigation required for buildings above 15m.',
      keywords: ['seismic', 'earthquake', 'zone iii', 'is 1893', 'structural']
    }
  ],
  'Accessibility': [
    {
      clause: '9.1.1',
      chapter: 'Chapter 9',
      section: 'Section 1',
      summary: 'Universal Accessibility Mumbai',
      fullText: 'All public buildings in Mumbai must provide barrier-free access. Ramps with 1:12 slope, tactile paving, accessible toilets, lifts with Braille buttons mandatory. MCGM provides accessibility audit.',
      keywords: ['accessibility', 'barrier-free', 'ramp', 'universal design']
    },
    {
      clause: '9.1.2',
      chapter: 'Chapter 9',
      section: 'Section 1',
      summary: 'Accessible Parking Mumbai',
      fullText: '5% of parking spaces reserved for differently-abled persons. Wider bays (3.6m x 5m), located nearest to entrance, clearly marked. Accessible route from parking to building entrance.',
      keywords: ['accessible parking', 'disabled parking', 'reserved parking']
    }
  ],
  'TOD': [
    {
      clause: '14.1.1',
      chapter: 'Chapter 14',
      section: 'Section 1',
      summary: 'TOD Zones Mumbai Metro',
      fullText: 'TOD zones declared within 500m of all Mumbai Metro stations. Additional FSI up to 3.0 available. Requires provision of public plaza, wider footpaths, cycle tracks. Mixed-use development encouraged.',
      keywords: ['tod', 'mumbai metro', 'transit oriented', 'mixed use']
    },
    {
      clause: '14.1.2',
      chapter: 'Chapter 14',
      section: 'Section 1',
      summary: 'TOD Premium Mumbai',
      fullText: 'TOD FSI available on payment of premium at 50% of Ready Reckoner rates. Affordable housing component (20%) mandatory. Public amenities like plaza, community space required.',
      keywords: ['tod premium', 'affordable housing', 'public amenities']
    }
  ],
  'Affordable Housing': [
    {
      clause: '15.1.1',
      chapter: 'Chapter 15',
      section: 'Section 1',
      summary: 'EWS/LIG Housing Mumbai',
      fullText: 'Residential developments above 4000 sq.m must reserve 20% FSI for EWS/LIG housing. EWS: Max 30 sq.m carpet, LIG: Max 60 sq.m carpet. Separate access not permitted. Same amenities as market housing.',
      keywords: ['ews', 'lig', 'affordable housing', 'reservation']
    },
    {
      clause: '15.1.2',
      chapter: 'Chapter 15',
      section: 'Section 1',
      summary: 'SRA Schemes Mumbai',
      fullText: 'Slum Rehabilitation Authority schemes in Mumbai provide 2.5 FSI for slum rehabilitation. Free housing for slum dwellers, sale component for developer. Minimum 269 sq.ft per tenement.',
      keywords: ['sra', 'slum rehabilitation', 'free housing']
    }
  ],
  'Special Buildings': [
    {
      clause: '6.1.1',
      chapter: 'Chapter 6',
      section: 'Section 1',
      summary: 'High-Rise Buildings Mumbai',
      fullText: 'Buildings above 70m classified as high-rise in Mumbai. Special approval from High-Rise Committee required. Enhanced structural, fire safety norms. Refuge floors, helipad, pressurized staircases mandatory.',
      keywords: ['high rise', 'tall building', 'special approval']
    },
    {
      clause: '6.1.2',
      chapter: 'Chapter 6',
      section: 'Section 1',
      summary: 'Malls and Multiplexes Mumbai',
      fullText: 'Shopping malls require minimum 4000 sq.m plot. Parking: 1 ECS per 50 sq.m. Fire safety as per NBC. Multiple exits, crowd management systems, emergency lighting mandatory. MCGM special approval required.',
      keywords: ['mall', 'multiplex', 'shopping center', 'special building']
    }
  ]
};

async function seedMumbaiComprehensive() {
  try {
    console.log('\n🏙️  Seeding comprehensive Mumbai-specific rules...');
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    // First, remove existing Mumbai rules to avoid duplicates
    console.log('🗑️  Removing existing Mumbai rules...');
    const deleted = await DistrictRule.deleteMany({ 
      district: { $in: ['Mumbai City', 'Mumbai Suburban'] }
    });
    console.log(`✅ Removed ${deleted.deletedCount} existing Mumbai rules\n`);

    let newRules = [];
    let addedCount = 0;

    // Generate comprehensive rules for Mumbai
    for (const [category, templates] of Object.entries(mumbaiRuleTemplates)) {
      console.log(`   Processing ${category} for Mumbai...`);
      
      for (const district of mumbaiDistricts) {
        for (const template of templates) {
          newRules.push({
            district: district.name,
            region: district.region,
            planningAuthority: district.authority,
            municipalityType: 'Municipal Corporation',
            
            chapter: template.chapter,
            section: template.section,
            clause: template.clause,
            
            summary: `${template.summary}`,
            fullText: template.fullText,
            
            category: category,
            applicableZones: ['R1', 'R2', 'R3', 'C1', 'C2', 'I1', 'I2', 'Mixed', 'Special'],
            applicableAreas: ['Urban'],
            
            keywords: [...template.keywords, district.name.toLowerCase(), 'mumbai', 'mcgm'],
            tags: [district.name, category, 'Mumbai', 'MCGM'],
            
            isDistrictSpecific: true,
            status: 'Active',
            effectiveFrom: new Date('2020-04-01'),
            
            notes: 'Mumbai-specific UDCPR 2020 regulation - Comprehensive coverage'
          });
          addedCount++;
        }
      }
      
      console.log(`   ✅ Added ${templates.length * mumbaiDistricts.length} ${category} rules for Mumbai`);
    }

    // Import in batches
    console.log(`\n📥 Importing ${newRules.length} Mumbai-specific rules...`);
    const batchSize = 100;
    for (let i = 0; i < newRules.length; i += batchSize) {
      const batch = newRules.slice(i, i + batchSize);
      await DistrictRule.insertMany(batch);
      console.log(`   Imported ${Math.min(i + batchSize, newRules.length)}/${newRules.length}`);
    }

    // Final statistics
    const mumbaiCityCount = await DistrictRule.countDocuments({ district: 'Mumbai City' });
    const mumbaiSuburbanCount = await DistrictRule.countDocuments({ district: 'Mumbai Suburban' });
    const totalCount = await DistrictRule.countDocuments();

    console.log('\n📊 Mumbai Statistics:');
    console.log(`   Mumbai City: ${mumbaiCityCount} rules`);
    console.log(`   Mumbai Suburban: ${mumbaiSuburbanCount} rules`);
    console.log(`   Total in database: ${totalCount} rules`);

    const categories = await DistrictRule.aggregate([
      { $match: { district: { $in: ['Mumbai City', 'Mumbai Suburban'] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📋 Mumbai Rules by Category:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} rules`);
    });

    console.log('\n✨ Mumbai comprehensive seeding complete!');
    console.log('\n💡 Mumbai now has detailed regulations covering:');
    console.log('   ✅ FSI (Base, Premium, Fungible, TOD)');
    console.log('   ✅ Setbacks (Front, Side, Rear, Relaxations)');
    console.log('   ✅ Parking (Residential, Commercial, Basement)');
    console.log('   ✅ Heritage (Buildings, Precincts, TDR)');
    console.log('   ✅ TDR (Generation, Loading, Certificates)');
    console.log('   ✅ CRZ (Coastal regulations)');
    console.log('   ✅ Environmental (RWH, Solar, STP, Waste)');
    console.log('   ✅ Safety (Fire, High-rise, Seismic)');
    console.log('   ✅ Accessibility (Universal design)');
    console.log('   ✅ TOD (Metro influence zones)');
    console.log('   ✅ Affordable Housing (EWS/LIG, SRA)');
    console.log('   ✅ Special Buildings (High-rise, Malls)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

seedMumbaiComprehensive();
