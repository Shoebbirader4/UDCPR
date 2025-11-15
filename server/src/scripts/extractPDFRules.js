import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function parseChapterSection(text) {
  // Extract chapters and sections from the text
  const chapters = [];
  
  // Pattern to match chapter headings (e.g., "CHAPTER 3", "Chapter 3", etc.)
  const chapterRegex = /CHAPTER\s+(\d+|[IVX]+)[:\s\-]*(.*?)(?=\n|$)/gi;
  
  let match;
  while ((match = chapterRegex.exec(text)) !== null) {
    chapters.push({
      number: match[1],
      title: match[2].trim(),
      position: match.index
    });
  }
  
  return chapters;
}

function extractRulesByPattern(text, district, region) {
  const rules = [];
  
  // Common patterns in UDCPR documents
  const patterns = [
    // FSI patterns
    {
      regex: /(?:FSI|Floor Space Index).*?(?:shall be|is|=)\s*([\d.]+)/gi,
      category: 'FSI'
    },
    // Setback patterns
    {
      regex: /(?:setback|margin).*?(?:shall be|minimum|is)\s*([\d.]+)\s*(?:m|meter|metre)/gi,
      category: 'Setback'
    },
    // Height patterns
    {
      regex: /(?:height|storey|floor).*?(?:shall not exceed|maximum|limited to)\s*([\d.]+)\s*(?:m|meter|metre)/gi,
      category: 'Height'
    },
    // Parking patterns
    {
      regex: /(?:parking|ECS).*?(?:shall be|required|minimum)\s*([\d.]+)/gi,
      category: 'Parking'
    }
  ];
  
  // Split text into sections
  const sections = text.split(/\n\n+/);
  
  sections.forEach((section, index) => {
    if (section.length < 50) return; // Skip very short sections
    
    patterns.forEach(pattern => {
      const matches = section.match(pattern.regex);
      if (matches && matches.length > 0) {
        // Extract clause number if present
        const clauseMatch = section.match(/(\d+\.[\d.]+)/);
        const clause = clauseMatch ? clauseMatch[1] : `AUTO-${index}`;
        
        rules.push({
          district,
          region,
          clause,
          category: pattern.category,
          text: section.substring(0, 500), // First 500 chars
          matches: matches.slice(0, 3) // First 3 matches
        });
      }
    });
  });
  
  return rules;
}

async function extractMumbaiRules() {
  const pdfPath = path.join(__dirname, '../../../MUMBAI ONLY UDCPR.pdf');
  
  console.log('\n🏙️  EXTRACTING MUMBAI UDCPR RULES');
  console.log('=' .repeat(50));
  
  const content = await extractPDFContent(pdfPath);
  
  // Save raw text for manual review
  const outputPath = path.join(__dirname, '../data/extracted/mumbai-raw.txt');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content.text);
  console.log(`\n💾 Raw text saved to: ${outputPath}`);
  
  // Parse chapters
  const chapters = parseChapterSection(content.text);
  console.log(`\n📚 Found ${chapters.length} chapters`);
  chapters.slice(0, 10).forEach(ch => {
    console.log(`   Chapter ${ch.number}: ${ch.title}`);
  });
  
  // Extract rules
  const rules = extractRulesByPattern(content.text, 'Mumbai City', 'Konkan');
  console.log(`\n📋 Extracted ${rules.length} potential rules`);
  
  // Save extracted rules
  const rulesPath = path.join(__dirname, '../data/extracted/mumbai-rules.json');
  fs.writeFileSync(rulesPath, JSON.stringify(rules, null, 2));
  console.log(`💾 Rules saved to: ${rulesPath}`);
  
  return { content, chapters, rules };
}

async function extractRestMaharashtraRules() {
  const pdfPath = path.join(__dirname, '../../../REST MAHARASHTRA UDCPR.pdf');
  
  console.log('\n🏛️  EXTRACTING REST OF MAHARASHTRA UDCPR RULES');
  console.log('=' .repeat(50));
  
  const content = await extractPDFContent(pdfPath);
  
  // Save raw text
  const outputPath = path.join(__dirname, '../data/extracted/rest-maharashtra-raw.txt');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content.text);
  console.log(`\n💾 Raw text saved to: ${outputPath}`);
  
  // Parse chapters
  const chapters = parseChapterSection(content.text);
  console.log(`\n📚 Found ${chapters.length} chapters`);
  chapters.slice(0, 10).forEach(ch => {
    console.log(`   Chapter ${ch.number}: ${ch.title}`);
  });
  
  // Extract rules for different regions
  const regions = [
    { name: 'Pune', districts: ['Pune', 'Satara', 'Sangli', 'Kolhapur', 'Solapur'] },
    { name: 'Nashik', districts: ['Nashik', 'Dhule', 'Nandurbar', 'Jalgaon'] },
    { name: 'Aurangabad', districts: ['Aurangabad', 'Jalna', 'Beed', 'Latur', 'Osmanabad', 'Nanded', 'Parbhani', 'Hingoli'] },
    { name: 'Nagpur', districts: ['Nagpur', 'Wardha', 'Bhandara', 'Gondia', 'Chandrapur', 'Gadchiroli'] },
    { name: 'Amravati', districts: ['Amravati', 'Akola', 'Yavatmal', 'Buldhana', 'Washim'] }
  ];
  
  const allRules = [];
  
  regions.forEach(region => {
    region.districts.forEach(district => {
      const rules = extractRulesByPattern(content.text, district, region.name);
      allRules.push(...rules);
    });
  });
  
  console.log(`\n📋 Extracted ${allRules.length} potential rules for all districts`);
  
  // Save extracted rules
  const rulesPath = path.join(__dirname, '../data/extracted/rest-maharashtra-rules.json');
  fs.writeFileSync(rulesPath, JSON.stringify(allRules, null, 2));
  console.log(`💾 Rules saved to: ${rulesPath}`);
  
  return { content, chapters, rules: allRules };
}

async function main() {
  try {
    console.log('\n🚀 UDCPR PDF EXTRACTION TOOL');
    console.log('=' .repeat(50));
    console.log('This tool extracts rules from official UDCPR PDFs');
    console.log('=' .repeat(50));
    
    // Extract Mumbai rules
    const mumbaiData = await extractMumbaiRules();
    
    // Extract Rest of Maharashtra rules
    const restData = await extractRestMaharashtraRules();
    
    console.log('\n\n✨ EXTRACTION COMPLETE!');
    console.log('=' .repeat(50));
    console.log(`\n📊 Summary:`);
    console.log(`   Mumbai PDF: ${mumbaiData.content.numpages} pages`);
    console.log(`   Mumbai Rules: ${mumbaiData.rules.length} extracted`);
    console.log(`   Rest Maharashtra PDF: ${restData.content.numpages} pages`);
    console.log(`   Rest Maharashtra Rules: ${restData.rules.length} extracted`);
    console.log(`\n📁 Output files:`);
    console.log(`   server/src/data/extracted/mumbai-raw.txt`);
    console.log(`   server/src/data/extracted/mumbai-rules.json`);
    console.log(`   server/src/data/extracted/rest-maharashtra-raw.txt`);
    console.log(`   server/src/data/extracted/rest-maharashtra-rules.json`);
    
    console.log('\n\n📝 NEXT STEPS:');
    console.log('1. Review extracted text files for accuracy');
    console.log('2. Manually refine rules in JSON files');
    console.log('3. Run: npm run import-extracted-rules');
    console.log('4. Verify in database');
    
    console.log('\n⚠️  NOTE: Automated extraction is approximate.');
    console.log('   Manual review and refinement is REQUIRED for accuracy.');
    
  } catch (error) {
    console.error('\n❌ Extraction failed:', error);
    process.exit(1);
  }
}

main();
