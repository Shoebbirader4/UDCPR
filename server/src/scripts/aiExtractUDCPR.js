import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in .env file');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PDF_PATH = path.join(__dirname, '../data/UDCPR Updated 30.01.25 with earlier provisions & corrections_compressed.pdf');
const OUTPUT_DIR = path.join(__dirname, '../data/extracted');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function extractPDFText() {
  console.log('📄 Reading PDF...');
  const dataBuffer = fs.readFileSync(PDF_PATH);
  const data = await pdfParse(dataBuffer);
  
  console.log(`✅ PDF loaded: ${data.numpages} pages`);
  console.log(`📝 Total text length: ${data.text.length} characters\n`);
  
  return {
    text: data.text,
    pages: data.numpages
  };
}

async function extractRulesWithAI(text, startPage = 1, endPage = null) {
  console.log('🤖 Using GPT-4 to extract rules...\n');
  
  const prompt = `You are an expert in extracting structured data from UDCPR (Unified Development Control and Promotion Regulations) 2020 for Maharashtra, India.

TASK: Extract ALL rules from the provided UDCPR text with MAXIMUM accuracy.

UDCPR STRUCTURE (14 Chapters):
- Chapter 1: Preliminary
- Chapter 2: Definitions
- Chapter 3: Development Control Rules (FSI, Setbacks, Heights, etc.)
- Chapter 4: Land Use Regulations
- Chapter 5: Building Requirements
- Chapter 6: Parking
- Chapter 7: Heritage & Conservation
- Chapter 8: TOD (Transit Oriented Development)
- Chapter 9: Accessibility
- Chapter 10: Fire Safety
- Chapter 11: Environmental Regulations
- Chapter 12: CRZ (Coastal Regulation Zone)
- Chapter 13: Procedures & Approvals
- Chapter 14: Penalties & Enforcement

EXTRACTION RULES:
1. Extract EVERY rule, clause, and sub-clause
2. Maintain exact chapter/section/clause numbering from PDF
3. Include complete rule text (no truncation)
4. Identify category (FSI, Setback, Height, Parking, etc.)
5. Note applicable zones (R1, R2, C1, C2, I1, I2, etc.)
6. Flag Mumbai-specific vs Rest of Maharashtra rules
7. Include any tables, formulas, or calculations
8. Document page numbers

OUTPUT FORMAT (JSON):
{
  "rules": [
    {
      "chapter": "3",
      "section": "2",
      "clause": "3.2.1",
      "subClause": "",
      "reference": "UDCPR-2020-3.2.1",
      "title": "Basic FSI for Residential Zones",
      "summary": "Brief 1-2 sentence summary",
      "fullText": "Complete rule text exactly as in PDF",
      "category": "FSI",
      "subcategory": "Residential",
      "applicableZones": ["R1", "R2", "R3"],
      "applicableDistricts": ["All"],
      "isMumbaiSpecific": false,
      "tables": {},
      "formulas": [],
      "pdfPage": 45,
      "notes": ""
    }
  ]
}

CATEGORIES TO USE:
FSI, Setback, Height, Parking, Heritage, TDR, Amenity, Environmental, Safety, Accessibility, CRZ, TOD, Affordable Housing, Mixed Use, Special Buildings, Land Use, Zoning, Infrastructure, Social Infrastructure, Redevelopment, Regularization, Building Requirements, Structural, Fire Safety, Procedures, Penalties, General

CRITICAL: 
- Only use chapter numbers 1-14 (no Chapter 15, 16, 17!)
- Extract EXACT text from PDF
- Include ALL rules, even minor ones
- Document page numbers accurately
- Flag any ambiguities in notes

TEXT TO EXTRACT FROM:
${text.substring(0, 15000)}

Extract as many complete rules as possible from this section. Return valid JSON only.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert UDCPR rule extraction system. Extract rules with 100% accuracy. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for accuracy
      max_tokens: 16000,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.rules || [];
    
  } catch (error) {
    console.error('❌ AI extraction error:', error.message);
    return [];
  }
}

async function processInChunks(text, chunkSize = 15000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  
  console.log(`📦 Split into ${chunks.length} chunks\n`);
  
  const allRules = [];
  
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
    
    const rules = await extractRulesWithAI(chunks[i]);
    console.log(`  ✅ Extracted ${rules.length} rules`);
    
    allRules.push(...rules);
    
    // Rate limiting
    if (i < chunks.length - 1) {
      console.log('  ⏳ Waiting 2 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return allRules;
}

async function main() {
  console.log('🚀 AI-POWERED UDCPR EXTRACTION\n');
  console.log('='.repeat(80));
  console.log(`\n📄 PDF: ${path.basename(PDF_PATH)}`);
  console.log(`🤖 AI Model: GPT-4o`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  console.log('='.repeat(80));
  
  try {
    // Extract PDF text
    const { text, pages } = await extractPDFText();
    
    // Process with AI
    console.log('\n🤖 Starting AI extraction...\n');
    const rules = await processInChunks(text);
    
    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ EXTRACTION COMPLETE!`);
    console.log(`\n📊 Results:`);
    console.log(`   Total rules extracted: ${rules.length}`);
    console.log(`   PDF pages processed: ${pages}`);
    
    // Group by chapter
    const byChapter = {};
    rules.forEach(rule => {
      const ch = rule.chapter || 'Unknown';
      byChapter[ch] = (byChapter[ch] || 0) + 1;
    });
    
    console.log(`\n📋 Rules by chapter:`);
    Object.entries(byChapter).sort((a, b) => a[0].localeCompare(b[0])).forEach(([ch, count]) => {
      console.log(`   Chapter ${ch}: ${count} rules`);
    });
    
    // Save to file
    const outputFile = path.join(OUTPUT_DIR, 'ai-extracted-rules.json');
    fs.writeFileSync(outputFile, JSON.stringify(rules, null, 2));
    console.log(`\n💾 Saved to: ${outputFile}`);
    
    // Save summary
    const summary = {
      extractionDate: new Date().toISOString(),
      pdfFile: path.basename(PDF_PATH),
      totalPages: pages,
      totalRules: rules.length,
      byChapter,
      model: 'gpt-4o'
    };
    
    const summaryFile = path.join(OUTPUT_DIR, 'extraction-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`📊 Summary: ${summaryFile}`);
    
    console.log('\n' + '='.repeat(80));
    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Review extracted rules in: ai-extracted-rules.json');
    console.log('   2. Verify accuracy against PDF');
    console.log('   3. Run validation: node validateRules.js');
    console.log('   4. Import to database: node importVerifiedRules.js');
    console.log('\n' + '='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
