import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_PATH = path.join(__dirname, '../data/UDCPR Updated 30.01.25 with earlier provisions & corrections_compressed.pdf');

/**
 * COMPREHENSIVE UDCPR PDF ANALYSIS
 * This script performs deep analysis of the entire UDCPR document
 */

async function comprehensivePDFAnalysis() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('     COMPREHENSIVE UDCPR PDF ANALYSIS');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Read PDF
    console.log('📄 Reading PDF...');
    const dataBuffer = fs.readFileSync(PDF_PATH);
    const pdfData = await pdfParse(dataBuffer);
    
    console.log(`✅ PDF loaded successfully`);
    console.log(`   Total Pages: ${pdfData.numpages}`);
    console.log(`   Text Length: ${pdfData.text.length.toLocaleString()} characters\n`);

    const text = pdfData.text;
    const analysis = {
      metadata: {
        totalPages: pdfData.numpages,
        totalCharacters: text.length,
        analysisDate: new Date().toISOString()
      },
      structure: {},
      rules: [],
      calculations: [],
      tables: [],
      definitions: [],
      procedures: []
    };

    // ============================================================
    // 1. IDENTIFY CHAPTERS
    // ============================================================
    console.log('📚 STEP 1: Identifying Chapters...\n');
    const chapters = extractChapters(text);
    analysis.structure.chapters = chapters;
    
    console.log(`   Found ${chapters.length} chapters:`);
    chapters.forEach(ch => {
      console.log(`   - Chapter ${ch.number}: ${ch.title}`);
    });

    // ============================================================
    // 2. EXTRACT ALL RULES
    // ============================================================
    console.log('\n📋 STEP 2: Extracting All Rules...\n');
    
    for (const chapter of chapters) {
      const chapterText = getChapterText(text, chapter, chapters);
      const rules = extractRulesFromChapter(chapterText, chapter);
      analysis.rules.push(...rules);
      
      console.log(`   Chapter ${chapter.number}: ${rules.length} rules extracted`);
    }
    
    console.log(`\n   Total Rules Extracted: ${analysis.rules.length}`);

    // ============================================================
    // 3. IDENTIFY CALCULATIONS & FORMULAS
    // ============================================================
    console.log('\n🔢 STEP 3: Identifying Calculations & Formulas...\n');
    analysis.calculations = extractCalculations(text);
    
    console.log(`   Found ${analysis.calculations.length} calculation formulas:`);
    analysis.calculations.slice(0, 10).forEach(calc => {
      console.log(`   - ${calc.type}: ${calc.formula.substring(0, 60)}...`);
    });

    // ============================================================
    // 4. EXTRACT TABLES
    // ============================================================
    console.log('\n📊 STEP 4: Extracting Tables...\n');
    analysis.tables = extractTables(text);
    
    console.log(`   Found ${analysis.tables.length} tables:`);
    analysis.tables.slice(0, 10).forEach(table => {
      console.log(`   - ${table.title || 'Untitled'}`);
    });

    // ============================================================
    // 5. EXTRACT DEFINITIONS
    // ============================================================
    console.log('\n📖 STEP 5: Extracting Definitions...\n');
    analysis.definitions = extractDefinitions(text);
    
    console.log(`   Found ${analysis.definitions.length} definitions:`);
    analysis.definitions.slice(0, 10).forEach(def => {
      console.log(`   - ${def.term}`);
    });

    // ============================================================
    // 6. EXTRACT PROCEDURES
    // ============================================================
    console.log('\n📝 STEP 6: Extracting Procedures...\n');
    analysis.procedures = extractProcedures(text);
    
    console.log(`   Found ${analysis.procedures.length} procedures`);

    // ============================================================
    // 7. SAVE RESULTS
    // ============================================================
    console.log('\n💾 STEP 7: Saving Analysis Results...\n');
    
    const outputDir = path.join(__dirname, '../data/extracted');
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Save complete analysis
    const analysisPath = path.join(outputDir, 'comprehensive_analysis.json');
    fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
    console.log(`   ✅ Complete analysis: ${analysisPath}`);
    
    // Save rules separately
    const rulesPath = path.join(outputDir, 'all_extracted_rules.json');
    fs.writeFileSync(rulesPath, JSON.stringify(analysis.rules, null, 2));
    console.log(`   ✅ All rules: ${rulesPath}`);
    
    // Save calculations
    const calcPath = path.join(outputDir, 'calculations.json');
    fs.writeFileSync(calcPath, JSON.stringify(analysis.calculations, null, 2));
    console.log(`   ✅ Calculations: ${calcPath}`);
    
    // Save tables
    const tablesPath = path.join(outputDir, 'tables.json');
    fs.writeFileSync(tablesPath, JSON.stringify(analysis.tables, null, 2));
    console.log(`   ✅ Tables: ${tablesPath}`);
    
    // Generate summary report
    const summaryPath = path.join(outputDir, 'analysis_summary.txt');
    const summary = generateSummaryReport(analysis);
    fs.writeFileSync(summaryPath, summary);
    console.log(`   ✅ Summary report: ${summaryPath}`);

    // ============================================================
    // FINAL SUMMARY
    // ============================================================
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ COMPREHENSIVE ANALYSIS COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📊 SUMMARY:');
    console.log(`   Chapters: ${chapters.length}`);
    console.log(`   Rules: ${analysis.rules.length}`);
    console.log(`   Calculations: ${analysis.calculations.length}`);
    console.log(`   Tables: ${analysis.tables.length}`);
    console.log(`   Definitions: ${analysis.definitions.length}`);
    console.log(`   Procedures: ${analysis.procedures.length}`);
    console.log('\n📁 Output files saved in: server/src/data/extracted/\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// ============================================================
// EXTRACTION FUNCTIONS
// ============================================================

function extractChapters(text) {
  const chapters = [];
  
  // Pattern for chapters: "CHAPTER 1", "Chapter 2", etc.
  const chapterPattern = /(?:CHAPTER|Chapter)\s+(\d+|[IVX]+)[:\s\-–—]+([^\n]{5,100})/gi;
  let match;
  
  while ((match = chapterPattern.exec(text)) !== null) {
    chapters.push({
      number: match[1],
      title: match[2].trim().replace(/\s+/g, ' '),
      startIndex: match.index,
      startPage: estimatePage(text, match.index)
    });
  }
  
  return chapters.sort((a, b) => a.startIndex - b.startIndex);
}

function getChapterText(fullText, chapter, allChapters) {
  const currentIndex = allChapters.indexOf(chapter);
  const nextChapter = allChapters[currentIndex + 1];
  
  if (nextChapter) {
    return fullText.substring(chapter.startIndex, nextChapter.startIndex);
  }
  return fullText.substring(chapter.startIndex);
}

function extractRulesFromChapter(chapterText, chapter) {
  const rules = [];
  
  // Pattern for rule clauses: "1.1", "2.3.4", etc.
  const clausePattern = /(\d+\.\d+(?:\.\d+)?(?:\.\d+)?)[:\s\-–—]+([^\n]{20,300})/g;
  let match;
  
  while ((match = clausePattern.exec(chapterText)) !== null) {
    const clauseNumber = match[1];
    const summary = match[2].trim().replace(/\s+/g, ' ');
    
    // Get extended context (next 1000 characters)
    const contextStart = match.index;
    const contextEnd = Math.min(contextStart + 1000, chapterText.length);
    const fullText = chapterText.substring(contextStart, contextEnd)
      .replace(/\s+/g, ' ')
      .trim();
    
    // Categorize the rule
    const category = categorizeRule(summary + ' ' + fullText, chapter.title);
    
    rules.push({
      chapter: `Chapter ${chapter.number}`,
      chapterTitle: chapter.title,
      clause: clauseNumber,
      reference: `UDCPR-${chapter.number}.${clauseNumber}`,
      summary: summary,
      fullText: fullText,
      category: category.primary,
      subcategory: category.secondary,
      tags: extractTags(summary + ' ' + fullText),
      hasCalculation: containsCalculation(fullText),
      hasTable: containsTableReference(fullText),
      applicableZones: extractApplicableZones(fullText)
    });
  }
  
  return rules;
}

function extractCalculations(text) {
  const calculations = [];
  
  // Patterns for formulas and calculations
  const patterns = [
    // FSI calculations
    /FSI\s*=\s*([^\n]{10,200})/gi,
    /Floor\s+Space\s+Index\s*=\s*([^\n]{10,200})/gi,
    
    // Area calculations
    /(?:Built-up|Carpet|Plot)\s+Area\s*=\s*([^\n]{10,200})/gi,
    
    // Height calculations
    /Height\s*=\s*([^\n]{10,200})/gi,
    /(?:Maximum|Minimum)\s+height\s*[:\-–—]\s*([^\n]{10,200})/gi,
    
    // Setback calculations
    /Setback\s*=\s*([^\n]{10,200})/gi,
    
    // Parking calculations
    /(?:Parking|ECS)\s+requirement\s*[:\-–—]\s*([^\n]{10,200})/gi,
    
    // General formulas with = sign
    /([A-Z][a-zA-Z\s]+)\s*=\s*([^\n]{10,150})/g
  ];
  
  patterns.forEach((pattern, index) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const formula = match[0].trim();
      
      // Skip if too generic
      if (formula.length < 15 || formula.length > 300) continue;
      
      calculations.push({
        type: determineCalculationType(formula),
        formula: formula,
        context: getContext(text, match.index, 200)
      });
    }
  });
  
  return calculations;
}

function extractTables(text) {
  const tables = [];
  
  // Look for table indicators
  const tablePattern = /Table\s+(\d+(?:\.\d+)?)[:\s\-–—]+([^\n]{5,100})/gi;
  let match;
  
  while ((match = tablePattern.exec(text)) !== null) {
    const tableNumber = match[1];
    const title = match[2].trim();
    
    // Extract table content (next 1500 characters)
    const contentStart = match.index;
    const contentEnd = Math.min(contentStart + 1500, text.length);
    const content = text.substring(contentStart, contentEnd);
    
    tables.push({
      number: tableNumber,
      title: title,
      content: content,
      type: determineTableType(title, content)
    });
  }
  
  return tables;
}

function extractDefinitions(text) {
  const definitions = [];
  
  // Look for definition patterns
  const defPattern = /"([^"]{3,50})"\s+means\s+([^\n]{20,300})/gi;
  let match;
  
  while ((match = defPattern.exec(text)) !== null) {
    definitions.push({
      term: match[1].trim(),
      definition: match[2].trim().replace(/\s+/g, ' ')
    });
  }
  
  return definitions;
}

function extractProcedures(text) {
  const procedures = [];
  
  // Look for procedural sections
  const procPattern = /(?:Procedure|Process|Application|Approval)\s+for\s+([^\n]{10,100})/gi;
  let match;
  
  while ((match = procPattern.exec(text)) !== null) {
    procedures.push({
      title: match[0].trim(),
      context: getContext(text, match.index, 500)
    });
  }
  
  return procedures;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function categorizeRule(text, chapterTitle) {
  const lower = text.toLowerCase();
  
  const categories = {
    'FSI': ['fsi', 'floor space index', 'floor area ratio', 'far'],
    'Setback': ['setback', 'marginal distance', 'margin'],
    'Height': ['height', 'storey', 'floor height'],
    'Parking': ['parking', 'ecs', 'car space'],
    'Building Requirements': ['staircase', 'lift', 'ventilation', 'lighting', 'bathroom', 'kitchen'],
    'Fire Safety': ['fire', 'firefighting', 'fire exit'],
    'Structural': ['structural', 'foundation', 'load'],
    'Environmental': ['rainwater', 'solar', 'green building', 'waste'],
    'TDR': ['tdr', 'transferable development'],
    'TOD': ['tod', 'transit oriented'],
    'Affordable Housing': ['ews', 'lig', 'affordable'],
    'Heritage': ['heritage', 'conservation'],
    'Procedures': ['procedure', 'application', 'approval']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return { primary: category, secondary: null };
    }
  }
  
  return { primary: 'General', secondary: null };
}

function extractTags(text) {
  const tags = [];
  const lower = text.toLowerCase();
  
  const tagKeywords = [
    'residential', 'commercial', 'industrial', 'mixed-use',
    'mumbai', 'maharashtra',
    'mandatory', 'optional', 'exemption',
    'calculation', 'formula', 'table'
  ];
  
  tagKeywords.forEach(tag => {
    if (lower.includes(tag)) tags.push(tag);
  });
  
  return tags;
}

function containsCalculation(text) {
  return /=|formula|calculate|computation/i.test(text);
}

function containsTableReference(text) {
  return /table\s+\d+|refer\s+table|as\s+per\s+table/i.test(text);
}

function extractApplicableZones(text) {
  const zones = [];
  const zonePattern = /\b([RCIM]\d+|R-\d+|C-\d+|I-\d+|M-\d+)\b/g;
  let match;
  
  while ((match = zonePattern.exec(text)) !== null) {
    if (!zones.includes(match[1])) {
      zones.push(match[1]);
    }
  }
  
  return zones.length > 0 ? zones : ['All'];
}

function determineCalculationType(formula) {
  const lower = formula.toLowerCase();
  if (lower.includes('fsi')) return 'FSI Calculation';
  if (lower.includes('height')) return 'Height Calculation';
  if (lower.includes('setback')) return 'Setback Calculation';
  if (lower.includes('parking') || lower.includes('ecs')) return 'Parking Calculation';
  if (lower.includes('area')) return 'Area Calculation';
  return 'General Calculation';
}

function determineTableType(title, content) {
  const lower = (title + ' ' + content).toLowerCase();
  if (lower.includes('fsi')) return 'FSI Table';
  if (lower.includes('parking')) return 'Parking Table';
  if (lower.includes('setback')) return 'Setback Table';
  if (lower.includes('height')) return 'Height Table';
  return 'General Table';
}

function getContext(text, index, length) {
  const start = Math.max(0, index - length / 2);
  const end = Math.min(text.length, index + length / 2);
  return text.substring(start, end).replace(/\s+/g, ' ').trim();
}

function estimatePage(text, index) {
  const charsPerPage = 2000; // Rough estimate
  return Math.floor(index / charsPerPage) + 1;
}

function generateSummaryReport(analysis) {
  let report = '═══════════════════════════════════════════════════════════════\n';
  report += '     UDCPR COMPREHENSIVE ANALYSIS SUMMARY\n';
  report += '═══════════════════════════════════════════════════════════════\n\n';
  
  report += `Analysis Date: ${new Date(analysis.metadata.analysisDate).toLocaleString()}\n`;
  report += `Total Pages: ${analysis.metadata.totalPages}\n`;
  report += `Total Characters: ${analysis.metadata.totalCharacters.toLocaleString()}\n\n`;
  
  report += '─────────────────────────────────────────────────────────────────\n';
  report += 'CHAPTERS\n';
  report += '─────────────────────────────────────────────────────────────────\n';
  analysis.structure.chapters.forEach(ch => {
    report += `Chapter ${ch.number}: ${ch.title}\n`;
  });
  
  report += '\n─────────────────────────────────────────────────────────────────\n';
  report += 'RULES BY CATEGORY\n';
  report += '─────────────────────────────────────────────────────────────────\n';
  const categoryCount = {};
  analysis.rules.forEach(rule => {
    categoryCount[rule.category] = (categoryCount[rule.category] || 0) + 1;
  });
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      report += `${cat}: ${count} rules\n`;
    });
  
  report += '\n─────────────────────────────────────────────────────────────────\n';
  report += 'CALCULATIONS\n';
  report += '─────────────────────────────────────────────────────────────────\n';
  const calcTypes = {};
  analysis.calculations.forEach(calc => {
    calcTypes[calc.type] = (calcTypes[calc.type] || 0) + 1;
  });
  Object.entries(calcTypes).forEach(([type, count]) => {
    report += `${type}: ${count}\n`;
  });
  
  report += '\n─────────────────────────────────────────────────────────────────\n';
  report += `TOTAL EXTRACTED: ${analysis.rules.length} rules\n`;
  report += '─────────────────────────────────────────────────────────────────\n';
  
  return report;
}

// Run the analysis
comprehensivePDFAnalysis();
