import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Comprehensive category patterns for UDCPR 2020
const CATEGORY_PATTERNS = {
  'FSI': [
    /floor\s+space\s+index/gi,
    /\bfsi\b/gi,
    /floor\s+area\s+ratio/gi,
    /\bfar\b/gi,
    /permissible\s+fsi/gi,
    /additional\s+fsi/gi,
    /premium\s+fsi/gi
  ],
  'Setback': [
    /setback/gi,
    /marginal\s+distance/gi,
    /front\s+margin/gi,
    /rear\s+margin/gi,
    /side\s+margin/gi,
    /building\s+line/gi
  ],
  'Parking': [
    /parking/gi,
    /\becs\b/gi,
    /equivalent\s+car\s+space/gi,
    /vehicle\s+parking/gi,
    /parking\s+space/gi,
    /basement\s+parking/gi,
    /mechanical\s+parking/gi
  ],
  'Height': [
    /building\s+height/gi,
    /maximum\s+height/gi,
    /height\s+restriction/gi,
    /storey\s+height/gi,
    /floor\s+height/gi
  ],
  'Heritage': [
    /heritage/gi,
    /conservation/gi,
    /grade\s+i/gi,
    /grade\s+ii/gi,
    /heritage\s+building/gi,
    /heritage\s+precinct/gi,
    /listed\s+building/gi,
    /protected\s+monument/gi,
    /archaeological/gi
  ],
  'TDR': [
    /\btdr\b/gi,
    /transferable\s+development\s+rights/gi,
    /transfer\s+of\s+development/gi,
    /development\s+rights/gi,
    /tdr\s+certificate/gi,
    /fungible\s+fsi/gi
  ],
  'Amenity': [
    /amenity/gi,
    /recreational\s+space/gi,
    /open\s+space/gi,
    /playground/gi,
    /community\s+hall/gi,
    /common\s+amenity/gi,
    /public\s+amenity/gi,
    /social\s+infrastructure/gi
  ],
  'Environmental': [
    /environment/gi,
    /green\s+building/gi,
    /sustainable/gi,
    /energy\s+conservation/gi,
    /solar/gi,
    /rainwater\s+harvesting/gi,
    /waste\s+management/gi,
    /sewage\s+treatment/gi,
    /\bstp\b/gi,
    /water\s+conservation/gi,
    /tree\s+protection/gi,
    /landscaping/gi
  ],
  'Safety': [
    /fire\s+safety/gi,
    /fire\s+protection/gi,
    /emergency\s+exit/gi,
    /fire\s+escape/gi,
    /fire\s+fighting/gi,
    /structural\s+safety/gi,
    /earthquake/gi,
    /seismic/gi,
    /disaster\s+management/gi,
    /evacuation/gi
  ],
  'Accessibility': [
    /accessibility/gi,
    /barrier\s+free/gi,
    /universal\s+design/gi,
    /disabled\s+friendly/gi,
    /ramp/gi,
    /wheelchair/gi,
    /differently\s+abled/gi,
    /handicapped/gi,
    /accessible\s+route/gi,
    /lift\s+for\s+disabled/gi
  ],
  'CRZ': [
    /\bcrz\b/gi,
    /coastal\s+regulation/gi,
    /coastal\s+zone/gi,
    /high\s+tide\s+line/gi,
    /\bhtl\b/gi,
    /no\s+development\s+zone/gi
  ],
  'TOD': [
    /\btod\b/gi,
    /transit\s+oriented/gi,
    /transit\s+development/gi,
    /metro\s+influence/gi,
    /influence\s+zone/gi
  ],
  'Affordable Housing': [
    /affordable\s+housing/gi,
    /\beWs\b/gi,
    /economically\s+weaker/gi,
    /\blIG\b/gi,
    /low\s+income\s+group/gi,
    /reservation\s+for\s+housing/gi,
    /slum\s+rehabilitation/gi,
    /\bsra\b/gi
  ],
  'Mixed Use': [
    /mixed\s+use/gi,
    /mixed\s+development/gi,
    /residential\s+cum\s+commercial/gi,
    /composite\s+use/gi
  ],
  'Special Buildings': [
    /special\s+building/gi,
    /high\s+rise/gi,
    /mall/gi,
    /multiplex/gi,
    /hospital/gi,
    /educational\s+institution/gi,
    /assembly\s+building/gi,
    /institutional\s+building/gi
  ]
};

// District mapping
const DISTRICTS = {
  'Mumbai': ['Mumbai City', 'Mumbai Suburban'],
  'Rest': [
    'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg',
    'Pune', 'Satara', 'Sangli', 'Kolhapur', 'Solapur',
    'Nashik', 'Dhule', 'Nandurbar', 'Jalgaon',
    'Aurangabad', 'Jalna', 'Beed', 'Latur', 'Osmanabad', 'Nanded', 'Parbhani', 'Hingoli',
    'Nagpur', 'Wardha', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli',
    'Amravati', 'Akola', 'Yavatmal', 'Buldhana', 'Washim'
  ]
};

async function extractPDFContent(pdfPath) {
  try {
    console.log(`\n📄 Reading PDF: ${path.basename(pdfPath)}`);
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    
    console.log(`✅ PDF parsed successfully`);
    console.log(`   Pages: ${data.numpages}`);
    console.log(`   Text length: ${data.text.length} characters`);
    
    return data.text;
  } catch (error) {
    console.error(`❌ Error reading PDF: ${error.message}`);
    throw error;
  }
}

function extractRulesByCategory(text, districts, region) {
  const rules = [];
  const lines = text.split('\n');
  
  console.log(`\n🔍 Extracting rules for ${districts.length} districts...`);
  
  // Process text in chunks for better context
  const chunkSize = 500; // characters
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.substring(i, i + chunkSize * 2); // Overlap for context
    
    // Check each category
    for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
      for (const pattern of patterns) {
        const matches = chunk.match(pattern);
        if (matches && matches.length > 0) {
          // Extract surrounding context
          const startPos = Math.max(0, i - 200);
          const endPos = Math.min(text.length, i + chunkSize + 200);
          const context = text.substring(startPos, endPos);
          
          // Try to find clause number
          const clauseMatch = context.match(/(\d+\.?\d*\.?\d*)\s*[:\-\.]?\s*[A-Z]/);
          const clause = clauseMatch ? clauseMatch[1] : `${category}-${rules.length + 1}`;
          
          // Add rule for each district
          districts.forEach(district => {
            rules.push({
              district: district,
              region: region,
              clause: clause,
              category: category,
              text: context.trim(),
              matches: matches.slice(0, 3) // First 3 matches
            });
          });
          
          break; // Move to next category after finding match
        }
      }
    }
  }
  
  // Remove duplicates based on text similarity
  const uniqueRules = [];
  const seen = new Set();
  
  for (const rule of rules) {
    const key = `${rule.district}-${rule.category}-${rule.text.substring(0, 100)}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRules.push(rule);
    }
  }
  
  return uniqueRules;
}

async function extractAllCategories() {
  try {
    console.log('\n🚀 Starting comprehensive UDCPR extraction...');
    console.log(`📊 Categories to extract: ${Object.keys(CATEGORY_PATTERNS).length}`);
    
    const outputDir = path.join(__dirname, '../data/extracted');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    let allRules = [];
    
    // Extract Mumbai rules
    const mumbaiPdfPath = path.join(__dirname, '../data/pdfs/MUMBAI ONLY UDCPR.pdf');
    if (fs.existsSync(mumbaiPdfPath)) {
      console.log('\n📥 Processing Mumbai UDCPR...');
      const mumbaiText = await extractPDFContent(mumbaiPdfPath);
      const mumbaiRules = extractRulesByCategory(mumbaiText, DISTRICTS.Mumbai, 'Konkan');
      
      console.log(`✅ Extracted ${mumbaiRules.length} rules for Mumbai`);
      
      // Save Mumbai rules
      fs.writeFileSync(
        path.join(outputDir, 'mumbai-all-categories.json'),
        JSON.stringify(mumbaiRules, null, 2)
      );
      
      allRules = allRules.concat(mumbaiRules);
    } else {
      console.log('⚠️  Mumbai PDF not found');
    }
    
    // Extract Rest of Maharashtra rules
    const restPdfPath = path.join(__dirname, '../data/pdfs/REST MAHARASHTRA UDCPR.pdf');
    if (fs.existsSync(restPdfPath)) {
      console.log('\n📥 Processing Rest of Maharashtra UDCPR...');
      const restText = await extractPDFContent(restPdfPath);
      const restRules = extractRulesByCategory(restText, DISTRICTS.Rest, 'Maharashtra');
      
      console.log(`✅ Extracted ${restRules.length} rules for other districts`);
      
      // Save rest of Maharashtra rules
      fs.writeFileSync(
        path.join(outputDir, 'rest-maharashtra-all-categories.json'),
        JSON.stringify(restRules, null, 2)
      );
      
      allRules = allRules.concat(restRules);
    } else {
      console.log('⚠️  Rest of Maharashtra PDF not found');
    }
    
    // Save combined rules
    fs.writeFileSync(
      path.join(outputDir, 'all-categories-combined.json'),
      JSON.stringify(allRules, null, 2)
    );
    
    // Generate statistics
    const stats = {
      totalRules: allRules.length,
      byCategory: {},
      byDistrict: {},
      categories: Object.keys(CATEGORY_PATTERNS)
    };
    
    allRules.forEach(rule => {
      stats.byCategory[rule.category] = (stats.byCategory[rule.category] || 0) + 1;
      stats.byDistrict[rule.district] = (stats.byDistrict[rule.district] || 0) + 1;
    });
    
    console.log('\n📊 Extraction Statistics:');
    console.log(`   Total rules: ${stats.totalRules}`);
    console.log(`\n   By Category:`);
    Object.entries(stats.byCategory)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`      ${cat}: ${count} rules`);
      });
    
    // Save statistics
    fs.writeFileSync(
      path.join(outputDir, 'extraction-stats.json'),
      JSON.stringify(stats, null, 2)
    );
    
    console.log('\n✨ Extraction complete!');
    console.log(`📁 Files saved in: ${outputDir}`);
    console.log('\n💡 Next step: Run "npm run import-all-categories" to import to database');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run extraction
extractAllCategories();
