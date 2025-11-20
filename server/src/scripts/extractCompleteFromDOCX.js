import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// DOCX file paths
const UDCPR_DOCX = path.join(__dirname, '../data/UDCPR Updated 30.01.25 with earlier provisions & corrections_compressed.docx');
const MUMBAI_DOCX = path.join(__dirname, '../data/MUBAI-DCPR.docx');

/**
 * COMPLETE DOCX EXTRACTION SYSTEM
 * Extracts EVERYTHING from both UDCPR and Mumbai-DCPR documents
 * - Every single rule and regulation
 * - All tables with proper structure
 * - All formulas and calculations
 * - All definitions
 * - All zone specifications
 * - All building requirements
 * - Everything needed for calculator, AI, and all app components
 */

async function extractCompleteFromDOCX() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('     COMPLETE DOCX EXTRACTION SYSTEM');
    console.log('     Extracting ALL Rules, Tables, Formulas & Data');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const extraction = {
      metadata: {
        extractionDate: new Date().toISOString(),
        sources: ['UDCPR 2020', 'Mumbai-DCPR']
      },
      udcpr: {
        chapters: [],
        regulations: [],
        rules: [],
        tables: [],
        formulas: [],
        definitions: [],
        zones: []
      },
      mumbai: {
        chapters: [],
        regulations: [],
        rules: [],
        tables: [],
        formulas: [],
        definitions: [],
        zones: []
      }
    };

    // ============================================================
    // EXTRACT UDCPR (Maharashtra State)
    // ============================================================
    console.log('📄 EXTRACTING UDCPR (Maharashtra State)...\n');
    console.log('   Reading DOCX file...');
    
    const udcprBuffer = fs.readFileSync(UDCPR_DOCX);
    const udcprResult = await mammoth.extractRawText({ buffer: udcprBuffer });
    const udcprText = udcprResult.value;
    
    console.log(`   ✅ Extracted ${udcprText.length.toLocaleString()} characters\n`);
    
    // Save raw text
    const udcprTextPath = path.join(__dirname, '../data/extracted/udcpr_raw_text.txt');
    fs.writeFileSync(udcprTextPath, udcprText);
    console.log(`   💾 Saved raw text: udcpr_raw_text.txt\n`);

    // Extract structured content from UDCPR
    console.log('   🔍 Analyzing structure...');
    extraction.udcpr = await extractStructuredContent(udcprText, 'UDCPR');
    
    console.log(`   ✅ Found ${extraction.udcpr.chapters.length} chapters`);
    console.log(`   ✅ Found ${extraction.udcpr.regulations.length} regulations`);
    console.log(`   ✅ Found ${extraction.udcpr.rules.length} rules`);
    console.log(`   ✅ Found ${extraction.udcpr.tables.length} tables`);
    console.log(`   ✅ Found ${extraction.udcpr.formulas.length} formulas`);
    console.log(`   ✅ Found ${extraction.udcpr.definitions.length} definitions\n`);

    // ============================================================
    // EXTRACT MUMBAI-DCPR
    // ============================================================
    console.log('📄 EXTRACTING MUMBAI-DCPR...\n');
    console.log('   Reading DOCX file...');
    
    const mumbaiBuffer = fs.readFileSync(MUMBAI_DOCX);
    const mumbaiResult = await mammoth.extractRawText({ buffer: mumbaiBuffer });
    const mumbaiText = mumbaiResult.value;
    
    console.log(`   ✅ Extracted ${mumbaiText.length.toLocaleString()} characters\n`);
    
    // Save raw text
    const mumbaiTextPath = path.join(__dirname, '../data/extracted/mumbai_raw_text.txt');
    fs.writeFileSync(mumbaiTextPath, mumbaiText);
    console.log(`   💾 Saved raw text: mumbai_raw_text.txt\n`);

    // Extract structured content from Mumbai
    console.log('   🔍 Analyzing structure...');
    extraction.mumbai = await extractStructuredContent(mumbaiText, 'Mumbai-DCPR');
    
    console.log(`   ✅ Found ${extraction.mumbai.chapters.length} chapters`);
    console.log(`   ✅ Found ${extraction.mumbai.regulations.length} regulations`);
    console.log(`   ✅ Found ${extraction.mumbai.rules.length} rules`);
    console.log(`   ✅ Found ${extraction.mumbai.tables.length} tables`);
    console.log(`   ✅ Found ${extraction.mumbai.formulas.length} formulas`);
    console.log(`   ✅ Found ${extraction.mumbai.definitions.length} definitions\n`);

    // ============================================================
    // SAVE ALL EXTRACTED DATA
    // ============================================================
    console.log('💾 SAVING EXTRACTED DATA...\n');
    
    const outputDir = path.join(__dirname, '../data/extracted');
    fs.mkdirSync(outputDir, { recursive: true });

    // Save complete extraction
    const completePath = path.join(outputDir, 'complete_extraction.json');
    fs.writeFileSync(completePath, JSON.stringify(extraction, null, 2));
    console.log('   ✅ complete_extraction.json');

    // Save UDCPR rules separately
    const udcprRulesPath = path.join(outputDir, 'udcpr_all_rules.json');
    fs.writeFileSync(udcprRulesPath, JSON.stringify(extraction.udcpr.rules, null, 2));
    console.log('   ✅ udcpr_all_rules.json');

    // Save Mumbai rules separately
    const mumbaiRulesPath = path.join(outputDir, 'mumbai_all_rules.json');
    fs.writeFileSync(mumbaiRulesPath, JSON.stringify(extraction.mumbai.rules, null, 2));
    console.log('   ✅ mumbai_all_rules.json');

    // Save all tables
    const tablesPath = path.join(outputDir, 'all_tables.json');
    fs.writeFileSync(tablesPath, JSON.stringify({
      udcpr: extraction.udcpr.tables,
      mumbai: extraction.mumbai.tables
    }, null, 2));
    console.log('   ✅ all_tables.json');

    // Save all formulas
    const formulasPath = path.join(outputDir, 'all_formulas.json');
    fs.writeFileSync(formulasPath, JSON.stringify({
      udcpr: extraction.udcpr.formulas,
      mumbai: extraction.mumbai.formulas
    }, null, 2));
    console.log('   ✅ all_formulas.json');

    // ============================================================
    // GENERATE SUMMARY REPORT
    // ============================================================
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ EXTRACTION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log('📊 UDCPR (Maharashtra State):');
    console.log(`   Chapters: ${extraction.udcpr.chapters.length}`);
    console.log(`   Regulations: ${extraction.udcpr.regulations.length}`);
    console.log(`   Rules: ${extraction.udcpr.rules.length}`);
    console.log(`   Tables: ${extraction.udcpr.tables.length}`);
    console.log(`   Formulas: ${extraction.udcpr.formulas.length}`);
    console.log(`   Definitions: ${extraction.udcpr.definitions.length}\n`);
    
    console.log('📊 Mumbai-DCPR:');
    console.log(`   Chapters: ${extraction.mumbai.chapters.length}`);
    console.log(`   Regulations: ${extraction.mumbai.regulations.length}`);
    console.log(`   Rules: ${extraction.mumbai.rules.length}`);
    console.log(`   Tables: ${extraction.mumbai.tables.length}`);
    console.log(`   Formulas: ${extraction.mumbai.formulas.length}`);
    console.log(`   Definitions: ${extraction.mumbai.definitions.length}\n`);
    
    console.log('📁 Files saved in: server/src/data/extracted/\n');
    console.log('Next step: Review extracted data and run import script\n');

  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Extract structured content from document text
 */
async function extractStructuredContent(text, source) {
  const content = {
    chapters: [],
    regulations: [],
    rules: [],
    tables: [],
    formulas: [],
    definitions: [],
    zones: []
  };

  // Extract chapters
  content.chapters = extractChapters(text);
  console.log(`      - Extracted ${content.chapters.length} chapters`);

  // Extract regulations
  content.regulations = extractRegulations(text, content.chapters);
  console.log(`      - Extracted ${content.regulations.length} regulations`);

  // Extract detailed rules
  content.rules = extractDetailedRules(text, content.regulations, source);
  console.log(`      - Extracted ${content.rules.length} detailed rules`);

  // Extract tables
  content.tables = extractTables(text);
  console.log(`      - Extracted ${content.tables.length} tables`);

  // Extract formulas
  content.formulas = extractFormulas(text);
  console.log(`      - Extracted ${content.formulas.length} formulas`);

  // Extract definitions
  content.definitions = extractDefinitions(text);
  console.log(`      - Extracted ${content.definitions.length} definitions`);

  // Extract zones
  content.zones = extractZones(text);
  console.log(`      - Extracted ${content.zones.length} zone definitions`);

  return content;
}

function extractChapters(text) {
  const chapters = [];
  const chapterPattern = /CHAPTER\s*[-–—]\s*(\d+)\s+([^\n]{10,200})/gi;
  let match;

  while ((match = chapterPattern.exec(text)) !== null) {
    const chapterNum = parseInt(match[1]);
    const title = match[2].trim().replace(/\s+/g, ' ');
    
    // Avoid duplicates
    if (!chapters.find(ch => ch.number === chapterNum && ch.title === title)) {
      chapters.push({
        number: chapterNum,
        title: title,
        startIndex: match.index
      });
    }
  }

  return chapters.sort((a, b) => a.number - b.number);
}

function extractRegulations(text, chapters) {
  const regulations = [];
  const regPattern = /(\d+\.\d+)\s+([^\n]{15,300})/g;
  let match;

  while ((match = regPattern.exec(text)) !== null) {
    const regNum = match[1];
    const title = match[2].trim().replace(/\s+/g, ' ');
    
    // Skip if looks like a page number or too generic
    if (title.length < 15 || /^\d+$/.test(title)) continue;
    
    // Find which chapter this belongs to
    const chapter = findChapterForIndex(chapters, match.index);
    
    regulations.push({
      number: regNum,
      title: title,
      chapter: chapter ? chapter.number : null,
      chapterTitle: chapter ? chapter.title : null,
      startIndex: match.index
    });
  }

  return regulations;
}

function extractDetailedRules(text, regulations, source) {
  const rules = [];
  
  for (const reg of regulations) {
    // Get text for this regulation (next 3000 chars)
    const regText = text.substring(reg.startIndex, reg.startIndex + 3000);
    
    // Extract sub-clauses
    const clausePattern = /(\d+\.\d+\.\d+(?:\.\d+)?(?:\.\d+)?)\s+([^\n]{20,500})/g;
    let match;
    
    while ((match = clausePattern.exec(regText)) !== null) {
      const clause = match[1];
      const summary = match[2].trim().replace(/\s+/g, ' ');
      
      // Get extended context
      const contextStart = match.index;
      const contextEnd = Math.min(contextStart + 1500, regText.length);
      const fullText = regText.substring(contextStart, contextEnd)
        .replace(/\s+/g, ' ')
        .trim();
      
      rules.push({
        source: source,
        chapter: reg.chapter,
        chapterTitle: reg.chapterTitle,
        regulation: reg.number,
        regulationTitle: reg.title,
        clause: clause,
        reference: `${source}-${reg.chapter}.${clause}`,
        summary: summary,
        fullText: fullText,
        category: categorizeRule(summary + ' ' + fullText),
        hasTable: /table\s+\d+|refer.*table/i.test(fullText),
        hasFormula: /=|formula|calculate/i.test(fullText)
      });
    }
    
    // If no sub-clauses, treat regulation itself as a rule
    if (!rules.find(r => r.regulation === reg.number)) {
      const contextEnd = Math.min(reg.startIndex + 1500, text.length);
      const fullText = text.substring(reg.startIndex, contextEnd)
        .replace(/\s+/g, ' ')
        .trim();
      
      rules.push({
        source: source,
        chapter: reg.chapter,
        chapterTitle: reg.chapterTitle,
        regulation: reg.number,
        regulationTitle: reg.title,
        clause: reg.number,
        reference: `${source}-${reg.chapter}.${reg.number}`,
        summary: reg.title,
        fullText: fullText,
        category: categorizeRule(reg.title + ' ' + fullText),
        hasTable: /table\s+\d+|refer.*table/i.test(fullText),
        hasFormula: /=|formula|calculate/i.test(fullText)
      });
    }
  }
  
  return rules;
}

function extractTables(text) {
  const tables = [];
  const tablePattern = /Table\s+(\d+(?:[.-]\d+)?)[:\s-]*([^\n]{5,200})/gi;
  let match;

  while ((match = tablePattern.exec(text)) !== null) {
    const tableNum = match[1];
    const title = match[2].trim();
    
    // Extract table content (next 2000 chars)
    const contentStart = match.index;
    const contentEnd = Math.min(contentStart + 2000, text.length);
    const content = text.substring(contentStart, contentEnd);
    
    tables.push({
      number: tableNum,
      title: title,
      content: content,
      type: determineTableType(title, content)
    });
  }

  return tables;
}

function extractFormulas(text) {
  const formulas = [];
  
  // Pattern for formulas with = sign
  const formulaPattern = /([A-Z][a-zA-Z\s]+)\s*=\s*([^\n]{10,300})/g;
  let match;

  while ((match = formulaPattern.exec(text)) !== null) {
    const formula = match[0].trim();
    
    // Skip if too short or too long
    if (formula.length < 15 || formula.length > 400) continue;
    
    formulas.push({
      formula: formula,
      variable: match[1].trim(),
      expression: match[2].trim(),
      type: determineFormulaType(formula),
      context: getContext(text, match.index, 300)
    });
  }

  return formulas;
}

function extractDefinitions(text) {
  const definitions = [];
  
  // Pattern: "Term" means definition
  const defPattern = /"([^"]{3,80})"\s+means\s+([^\n]{20,500})/gi;
  let match;

  while ((match = defPattern.exec(text)) !== null) {
    definitions.push({
      term: match[1].trim(),
      definition: match[2].trim().replace(/\s+/g, ' ')
    });
  }

  return definitions;
}

function extractZones(text) {
  const zones = [];
  const zonePattern = /([RCIM]\d+|R-\d+|C-\d+|I-\d+|M-\d+)[:\s-]+([^\n]{10,300})/g;
  let match;

  const seen = new Set();
  while ((match = zonePattern.exec(text)) !== null) {
    const code = match[1];
    if (!seen.has(code)) {
      seen.add(code);
      zones.push({
        code: code,
        description: match[2].trim(),
        context: getContext(text, match.index, 500)
      });
    }
  }

  return zones;
}

// Helper functions
function findChapterForIndex(chapters, index) {
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (index >= chapters[i].startIndex) {
      return chapters[i];
    }
  }
  return null;
}

function categorizeRule(text) {
  const lower = text.toLowerCase();
  
  if (/fsi|floor space index|floor area/.test(lower)) return 'FSI';
  if (/setback|margin|marginal distance/.test(lower)) return 'Setback';
  if (/height|storey|floor.*height/.test(lower)) return 'Height';
  if (/parking|ecs|car space/.test(lower)) return 'Parking';
  if (/staircase|lift|elevator|ventilation|lighting|bathroom|kitchen/.test(lower)) return 'Building Requirements';
  if (/fire|firefighting/.test(lower)) return 'Fire Safety';
  if (/structural|foundation|load/.test(lower)) return 'Structural';
  if (/environment|rainwater|solar|green/.test(lower)) return 'Environmental';
  if (/tdr|transferable.*development/.test(lower)) return 'TDR';
  if (/tod|transit.*oriented/.test(lower)) return 'TOD';
  if (/heritage|conservation/.test(lower)) return 'Heritage';
  if (/affordable|ews|lig/.test(lower)) return 'Affordable Housing';
  
  return 'General';
}

function determineTableType(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  
  if (/fsi/.test(text)) return 'FSI Table';
  if (/setback|margin/.test(text)) return 'Setback Table';
  if (/height/.test(text)) return 'Height Table';
  if (/parking|ecs/.test(text)) return 'Parking Table';
  
  return 'General Table';
}

function determineFormulaType(formula) {
  const lower = formula.toLowerCase();
  
  if (/fsi/.test(lower)) return 'FSI Calculation';
  if (/height/.test(lower)) return 'Height Calculation';
  if (/setback/.test(lower)) return 'Setback Calculation';
  if (/parking|ecs/.test(lower)) return 'Parking Calculation';
  if (/area/.test(lower)) return 'Area Calculation';
  
  return 'General Calculation';
}

function getContext(text, index, length) {
  const start = Math.max(0, index - length / 2);
  const end = Math.min(text.length, index + length / 2);
  return text.substring(start, end).replace(/\s+/g, ' ').trim();
}

// Run extraction
extractCompleteFromDOCX();
