import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Rule from '../models/Rule.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// PDF file paths
const MUMBAI_PDF = path.join(__dirname, '../data/MUMBAI ONLY UDCPR.pdf');
const REST_MH_PDF = path.join(__dirname, '../data/REST MAHARASHTRA UDCPR.pdf');

/**
 * Extract text from PDF
 */
async function extractPDFText(pdfPath) {
  console.log(`📄 Reading PDF: ${path.basename(pdfPath)}`);
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  console.log(`   Pages: ${data.numpages}`);
  console.log(`   Text length: ${data.text.length} characters\n`);
  return data.text;
}

/**
 * Parse UDCPR text and extract rules
 * This is a simplified parser - real implementation would be more sophisticated
 */
function parseUDCPRRules(text, source) {
  const rules = [];
  
  // Split by chapters (looking for "CHAPTER" keyword)
  const chapterPattern = /CHAPTER\s+(\d+|[IVX]+)[:\s-]+([^\n]+)/gi;
  const chapters = [];
  let match;
  
  while ((match = chapterPattern.exec(text)) !== null) {
    chapters.push({
      number: match[1],
      title: match[2].trim(),
      startIndex: match.index
    });
  }
  
  console.log(`   Found ${chapters.length} chapters in ${source}`);
  
  // For each chapter, extract rules
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const nextChapter = chapters[i + 1];
    const chapterText = nextChapter 
      ? text.substring(chapter.startIndex, nextChapter.startIndex)
      : text.substring(chapter.startIndex);
    
    // Extract clause numbers and content
    const clausePattern = /(\d+\.\d+\.?\d*)[:\s-]+([^\n]{20,200})/g;
    let clauseMatch;
    
    while ((clauseMatch = clausePattern.exec(chapterText)) !== null) {
      const clause = clauseMatch[1];
      const summary = clauseMatch[2].trim();
      
      // Extract more context (next 500 characters)
      const contextStart = clauseMatch.index;
      const contextEnd = Math.min(contextStart + 500, chapterText.length);
      const fullText = chapterText.substring(contextStart, contextEnd)
        .replace(/\s+/g, ' ')
        .trim();
      
      rules.push({
        chapter: `Chapter ${chapter.number}`,
        chapterTitle: chapter.title,
        clause: clause,
        summary: summary,
        fullText: fullText,
        source: source
      });
    }
  }
  
  return rules;
}

/**
 * Categorize rule based on content
 */
function categorizeRule(rule) {
  const text = (rule.summary + ' ' + rule.fullText + ' ' + rule.chapterTitle).toLowerCase();
  
  // Category mapping based on keywords
  const categories = {
    'FSI': ['fsi', 'floor space index', 'floor area ratio', 'far', 'built-up area'],
    'Setback': ['setback', 'marginal distance', 'margin', 'open space around building'],
    'Height': ['height', 'storey', 'floor', 'elevation'],
    'Parking': ['parking', 'ecs', 'car space', 'vehicle', 'garage'],
    'Building Requirements': ['staircase', 'lift', 'elevator', 'ventilation', 'lighting', 'bathroom', 'toilet', 'kitchen', 'balcony', 'door', 'window', 'wall', 'roof'],
    'Fire Safety': ['fire', 'firefighting', 'fire exit', 'fire extinguisher', 'sprinkler', 'smoke'],
    'Structural': ['structural', 'foundation', 'load', 'earthquake', 'seismic', 'strength'],
    'Environmental': ['environment', 'rainwater', 'solar', 'green building', 'waste', 'sewage', 'drainage'],
    'Safety': ['safety', 'emergency', 'evacuation', 'security'],
    'Accessibility': ['accessibility', 'disabled', 'ramp', 'barrier-free', 'universal access'],
    'Heritage': ['heritage', 'conservation', 'historic', 'monument'],
    'TDR': ['tdr', 'transferable development', 'development rights'],
    'TOD': ['tod', 'transit oriented', 'metro', 'railway station'],
    'Affordable Housing': ['ews', 'lig', 'affordable', 'economically weaker', 'low income'],
    'Amenity': ['amenity', 'recreation', 'playground', 'community hall', 'open space'],
    'Redevelopment': ['redevelopment', 'cessed', 'cluster', 'rehabilitation'],
    'Procedures': ['procedure', 'application', 'approval', 'permission', 'sanction'],
    'Penalties': ['penalty', 'fine', 'violation', 'contravention', 'enforcement']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'General';
}

/**
 * Determine subcategory for Building Requirements
 */
function getSubcategory(rule) {
  const text = (rule.summary + ' ' + rule.fullText).toLowerCase();
  
  const subcategories = {
    'Staircases': ['staircase', 'stair', 'step', 'riser', 'tread'],
    'Lifts': ['lift', 'elevator'],
    'Ventilation': ['ventilation', 'ventilator', 'air'],
    'Lighting': ['light', 'lighting', 'illumination', 'window'],
    'Bathrooms': ['bathroom', 'toilet', 'wc', 'water closet', 'lavatory'],
    'Kitchens': ['kitchen', 'cooking'],
    'Balconies': ['balcony', 'balconies'],
    'Basements': ['basement', 'cellar'],
    'Roofs': ['roof', 'terrace', 'parapet'],
    'Walls': ['wall', 'partition'],
    'Doors & Windows': ['door', 'window', 'opening']
  };
  
  for (const [subcategory, keywords] of Object.entries(subcategories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return subcategory;
    }
  }
  
  return null;
}

/**
 * Main extraction function
 */
async function extractCompleteUDCPR() {
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('     COMPLETE UDCPR EXTRACTION');
    console.log('═══════════════════════════════════════════════════════\n');

    // Extract from both PDFs
    console.log('📚 Extracting from Mumbai UDCPR...\n');
    const mumbaiText = await extractPDFText(MUMBAI_PDF);
    const mumbaiRules = parseUDCPRRules(mumbaiText, 'Mumbai');
    
    console.log('📚 Extracting from Rest Maharashtra UDCPR...\n');
    const restMHText = await extractPDFText(REST_MH_PDF);
    const restMHRules = parseUDCPRRules(restMHText, 'Rest Maharashtra');
    
    const allRules = [...mumbaiRules, ...restMHRules];
    
    console.log(`\n📊 Extraction Summary:`);
    console.log(`   Mumbai rules: ${mumbaiRules.length}`);
    console.log(`   Rest Maharashtra rules: ${restMHRules.length}`);
    console.log(`   Total extracted: ${allRules.length}\n`);
    
    // Save to JSON file for review
    const outputPath = path.join(__dirname, '../data/extracted/complete_udcpr_rules.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    
    // Process and categorize rules
    const processedRules = allRules.map((rule, index) => ({
      ...rule,
      reference: `UDCPR-2020-${rule.clause}`,
      category: categorizeRule(rule),
      subcategory: getSubcategory(rule),
      applicableZones: ['All'],
      isGeneral: true,
      tags: [rule.source.toLowerCase(), rule.chapterTitle.toLowerCase()],
      status: 'Active'
    }));
    
    fs.writeFileSync(outputPath, JSON.stringify(processedRules, null, 2));
    console.log(`✅ Saved extracted rules to: ${outputPath}\n`);
    
    // Show category breakdown
    const categoryCount = {};
    processedRules.forEach(rule => {
      categoryCount[rule.category] = (categoryCount[rule.category] || 0) + 1;
    });
    
    console.log('📋 Rules by Category:');
    Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} rules`);
      });
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ EXTRACTION COMPLETE');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('Next steps:');
    console.log('1. Review extracted rules in: server/src/data/extracted/complete_udcpr_rules.json');
    console.log('2. Run import script to add to database');
    console.log('3. Manually refine categories and subcategories as needed\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

extractCompleteUDCPR();
