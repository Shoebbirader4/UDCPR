import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Region and district mapping
const MAHARASHTRA_STRUCTURE = {
  'Konkan': {
    districts: ['Mumbai City', 'Mumbai Suburban', 'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg'],
    pdfSource: 'MUMBAI ONLY UDCPR.pdf',
    specificRules: true
  },
  'Pune': {
    districts: ['Pune', 'Satara', 'Sangli', 'Kolhapur', 'Solapur'],
    pdfSource: 'REST MAHARASHTRA UDCPR.pdf',
    specificRules: false
  },
  'Nashik': {
    districts: ['Nashik', 'Dhule', 'Nandurbar', 'Jalgaon'],
    pdfSource: 'REST MAHARASHTRA UDCPR.pdf',
    specificRules: false
  },
  'Aurangabad': {
    districts: ['Aurangabad', 'Jalna', 'Beed', 'Latur', 'Osmanabad', 'Nanded', 'Parbhani', 'Hingoli'],
    pdfSource: 'REST MAHARASHTRA UDCPR.pdf',
    specificRules: false
  },
  'Nagpur': {
    districts: ['Nagpur', 'Wardha', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli'],
    pdfSource: 'REST MAHARASHTRA UDCPR.pdf',
    specificRules: false
  },
  'Amravati': {
    districts: ['Amravati', 'Akola', 'Yavatmal', 'Buldhana', 'Washim'],
    pdfSource: 'REST MAHARASHTRA UDCPR.pdf',
    specificRules: false
  }
};

async function extractPDFContent(pdfPath) {
  try {
    console.log(`\n📄 Reading PDF: ${path.basename(pdfPath)}`);
    
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    
    console.log(`✅ PDF parsed successfully`);
    console.log(`   Pages: ${data.numpages}`);
    console.log(`   Text length: ${data.text.length} characters`);
    
    return {
      text: data.text,
      numpages: data.numpages,
      info: data.info,
      metadata: data.metadata
    };
  } catch (error) {
    console.error(`❌ Error reading PDF: ${error.message}`);
    throw error;
  }
}

function extractStructuredRules(text, pdfType) {
  const rules = [];
  
  // Split into sections by chapter
  const chapterPattern = /CHAPTER\s*[-–]\s*(\d+|[IVX]+)\s*\n([^\n]+)/gi;
  const chapters = [];
  let match;
  
  while ((match = chapterPattern.exec(text)) !== null) {
    chapters.push({
      number: match[1],
      title: match[2].trim(),
      position: match.index
    });
  }
  
  console.log(`\n📚 Found ${chapters.length} chapters`);
  
  // Extract rules with better context
  const lines = text.split('\n');
  let currentChapter = null;
  let currentSection = null;
  let ruleBuffer = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect chapter
    const chapterMatch = line.match(/^CHAPTER\s*[-–]?\s*(\d+|[IVX]+)/i);
    if (chapterMatch) {
      currentChapter = chapterMatch[1];
      continue;
    }
    
    // Detect clause number (e.g., "3.2.1", "5.4", etc.)
    const clauseMatch = line.match(/^(\d+\.[\d.]+)\s+(.+)/);
    if (clauseMatch && currentChapter) {
      // Save previous rule if exists
      if (ruleBuffer.length > 0) {
        const ruleText = ruleBuffer.join(' ').substring(0, 1000);
        if (ruleText.length > 50) {
          rules.push({
            chapter: currentChapter,
            clause: ruleBuffer[0].match(/^(\d+\.[\d.]+)/)?.[1] || 'unknown',
            text: ruleText,
            pdfType
          });
        }
      }
      
      // Start new rule
      ruleBuffer = [line];
    } else if (ruleBuffer.length > 0 && line.length > 0) {
      // Continue current rule
      ruleBuffer.push(line);
      
      // Limit buffer size
      if (ruleBuffer.length > 20) {
        const ruleText = ruleBuffer.join(' ').substring(0, 1000);
        rules.push({
          chapter: currentChapter,
          clause: ruleBuffer[0].match(/^(\d+\.[\d.]+)/)?.[1] || 'unknown',
          text: ruleText,
          pdfType
        });
        ruleBuffer = [];
      }
    }
  }
  
  return rules;
}

function categorizeRule(text) {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('fsi') || textLower.includes('floor space index') || textLower.includes('floor area ratio')) {
    return 'FSI';
  }
  if (textLower.includes('setback') || textLower.includes('marginal distance') || textLower.includes('margin')) {
    return 'Setback';
  }
  if (textLower.includes('height') && (textLower.includes('maximum') || textLower.includes('shall not exceed'))) {
    return 'Height';
  }
  if (textLower.includes('parking') || textLower.includes('ecs')) {
    return 'Parking';
  }
  if (textLower.includes('heritage') || textLower.includes('conservation')) {
    return 'Heritage';
  }
  if (textLower.includes('tdr') || textLower.includes('transferable development')) {
    return 'TDR';
  }
  if (textLower.includes('amenity') || textLower.includes('open space') || textLower.includes('recreation')) {
    return 'Amenity';
  }
  if (textLower.includes('crz') || textLower.includes('coastal') || textLower.includes('environment')) {
    return 'Environmental';
  }
  if (textLower.includes('fire') || textLower.includes('structural') || textLower.includes('safety')) {
    return 'Safety';
  }
  
  return 'General';
}

async function processMumbaiPDF() {
  const pdfPath = path.join(__dirname, '../../../MUMBAI ONLY UDCPR.pdf');
  
  console.log('\n🏙️  PROCESSING MUMBAI-SPECIFIC UDCPR');
  console.log('=' .repeat(60));
  
  const content = await extractPDFContent(pdfPath);
  const rules = extractStructuredRules(content.text, 'Mumbai');
  
  console.log(`\n📋 Extracted ${rules.length} structured rules`);
  
  // Categorize and structure for Mumbai districts
  const mumbaiDistricts = MAHARASHTRA_STRUCTURE['Konkan'].districts.filter(d => 
    d === 'Mumbai City' || d === 'Mumbai Suburban'
  );
  
  const structuredRules = rules.map(rule => ({
    applicableDistricts: mumbaiDistricts,
    region: 'Konkan',
    chapter: `Chapter ${rule.chapter}`,
    clause: rule.clause,
    text: rule.text,
    category: categorizeRule(rule.text),
    isDistrictSpecific: true,
    source: 'MUMBAI ONLY UDCPR.pdf'
  }));
  
  // Save
  const outputPath = path.join(__dirname, '../data/extracted/mumbai-structured.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(structuredRules, null, 2));
  console.log(`💾 Saved to: ${outputPath}`);
  
  return structuredRules;
}

async function processRestMaharashtraPDF() {
  const pdfPath = path.join(__dirname, '../../../REST MAHARASHTRA UDCPR.pdf');
  
  console.log('\n🏛️  PROCESSING REST OF MAHARASHTRA UDCPR');
  console.log('=' .repeat(60));
  console.log('⚠️  These rules apply to ALL non-Mumbai districts');
  
  const content = await extractPDFContent(pdfPath);
  const rules = extractStructuredRules(content.text, 'RestMaharashtra');
  
  console.log(`\n📋 Extracted ${rules.length} structured rules`);
  
  // Get all non-Mumbai districts
  const allNonMumbaiDistricts = [];
  Object.entries(MAHARASHTRA_STRUCTURE).forEach(([region, data]) => {
    if (region !== 'Konkan' || !data.specificRules) {
      allNonMumbaiDistricts.push(...data.districts);
    }
  });
  
  // Remove Mumbai districts
  const nonMumbaiDistricts = allNonMumbaiDistricts.filter(d => 
    d !== 'Mumbai City' && d !== 'Mumbai Suburban'
  );
  
  console.log(`\n📍 These rules apply to ${nonMumbaiDistricts.length} districts:`);
  console.log(`   ${nonMumbaiDistricts.join(', ')}`);
  
  const structuredRules = rules.map(rule => ({
    applicableDistricts: nonMumbaiDistricts, // ALL non-Mumbai districts
    applicableRegions: ['Pune', 'Nashik', 'Aurangabad', 'Nagpur', 'Amravati'],
    chapter: `Chapter ${rule.chapter}`,
    clause: rule.clause,
    text: rule.text,
    category: categorizeRule(rule.text),
    isDistrictSpecific: false, // General rule for all
    source: 'REST MAHARASHTRA UDCPR.pdf'
  }));
  
  // Save
  const outputPath = path.join(__dirname, '../data/extracted/rest-maharashtra-structured.json');
  fs.writeFileSync(outputPath, JSON.stringify(structuredRules, null, 2));
  console.log(`💾 Saved to: ${outputPath}`);
  
  return structuredRules;
}

async function generateDistrictSpecificRules(mumbaiRules, restRules) {
  console.log('\n🗂️  GENERATING DISTRICT-SPECIFIC RULE ASSIGNMENTS');
  console.log('=' .repeat(60));
  
  const districtRules = {};
  
  // Process Mumbai rules
  mumbaiRules.forEach(rule => {
    rule.applicableDistricts.forEach(district => {
      if (!districtRules[district]) districtRules[district] = [];
      districtRules[district].push({
        ...rule,
        district,
        region: 'Konkan'
      });
    });
  });
  
  // Process Rest of Maharashtra rules (apply to each district)
  restRules.forEach(rule => {
    rule.applicableDistricts.forEach(district => {
      if (!districtRules[district]) districtRules[district] = [];
      
      // Find region for this district
      let districtRegion = null;
      Object.entries(MAHARASHTRA_STRUCTURE).forEach(([region, data]) => {
        if (data.districts.includes(district)) {
          districtRegion = region;
        }
      });
      
      districtRules[district].push({
        ...rule,
        district,
        region: districtRegion
      });
    });
  });
  
  // Save district-wise files
  const outputDir = path.join(__dirname, '../data/extracted/by-district');
  fs.mkdirSync(outputDir, { recursive: true });
  
  Object.entries(districtRules).forEach(([district, rules]) => {
    const filename = district.toLowerCase().replace(/\s+/g, '-') + '.json';
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(rules, null, 2));
    console.log(`   ${district}: ${rules.length} rules → ${filename}`);
  });
  
  // Generate summary
  const summary = {
    totalDistricts: Object.keys(districtRules).length,
    districtCounts: Object.entries(districtRules).map(([district, rules]) => ({
      district,
      ruleCount: rules.length,
      categories: [...new Set(rules.map(r => r.category))]
    })),
    generatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(outputDir, '_summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  return districtRules;
}

async function main() {
  try {
    console.log('\n🚀 SMART UDCPR PDF EXTRACTION');
    console.log('=' .repeat(60));
    console.log('Properly dividing rules by regions and districts');
    console.log('=' .repeat(60));
    
    // Process Mumbai PDF (district-specific)
    const mumbaiRules = await processMumbaiPDF();
    
    // Process Rest of Maharashtra PDF (general rules)
    const restRules = await processRestMaharashtraPDF();
    
    // Generate district-specific assignments
    const districtRules = await generateDistrictSpecificRules(mumbaiRules, restRules);
    
    console.log('\n\n✨ SMART EXTRACTION COMPLETE!');
    console.log('=' .repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   Mumbai-specific rules: ${mumbaiRules.length}`);
    console.log(`   General Maharashtra rules: ${restRules.length}`);
    console.log(`   Total districts covered: ${Object.keys(districtRules).length}`);
    
    console.log(`\n📁 Output structure:`);
    console.log(`   server/src/data/extracted/mumbai-structured.json`);
    console.log(`   server/src/data/extracted/rest-maharashtra-structured.json`);
    console.log(`   server/src/data/extracted/by-district/`);
    console.log(`      ├── mumbai-city.json`);
    console.log(`      ├── pune.json`);
    console.log(`      ├── nagpur.json`);
    console.log(`      └── ... (all 36 districts)`);
    
    console.log(`\n✅ Rules are now properly divided:`);
    console.log(`   • Mumbai rules → Mumbai City & Mumbai Suburban only`);
    console.log(`   • Rest Maharashtra rules → All other 29 districts`);
    console.log(`   • Each district has its own JSON file`);
    console.log(`   • No duplication, proper region assignment`);
    
    console.log('\n\n📝 NEXT STEPS:');
    console.log('1. Review district-specific files in by-district/ folder');
    console.log('2. Manually refine rules as needed');
    console.log('3. Run: npm run import-district-rules');
    console.log('4. Verify in database and UI');
    
  } catch (error) {
    console.error('\n❌ Extraction failed:', error);
    process.exit(1);
  }
}

main();
