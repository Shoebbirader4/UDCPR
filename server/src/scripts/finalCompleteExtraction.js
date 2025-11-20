import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_PATH = path.join(__dirname, '../data/UDCPR Updated 30.01.25 with earlier provisions & corrections_compressed.pdf');

/**
 * FINAL COMPLETE UDCPR EXTRACTION
 * Uses the INDEX to accurately extract all chapters and rules
 */

async function finalCompleteExtraction() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('     FINAL COMPLETE UDCPR EXTRACTION');
    console.log('     Using INDEX for Accurate Chapter Detection');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Read PDF
    console.log('📄 Reading PDF...');
    const dataBuffer = fs.readFileSync(PDF_PATH);
    const pdfData = await pdfParse(dataBuffer);
    
    console.log(`✅ PDF loaded: ${pdfData.numpages} pages, ${pdfData.text.length.toLocaleString()} characters\n`);

    const text = pdfData.text;
    
    // Find INDEX section
    const indexStart = text.indexOf('INDEX');
    const indexEnd = text.indexOf('CHAPTER - 1', indexStart);
    const indexText = text.substring(indexStart, indexEnd);
    
    console.log('📑 Extracting Chapter Structure from INDEX...\n');
    
    // Extract chapters from INDEX
    const chapters = extractChaptersFromIndex(indexText);
    
    console.log(`Found ${chapters.length} chapters:\n`);
    chapters.forEach(ch => {
      console.log(`   ${ch.number}. ${ch.title}`);
    });

    // Now extract all regulations from each chapter
    console.log('\n📋 Extracting All Regulations...\n');
    
    const allRegulations = [];
    const allRules = [];
    
    for (const chapter of chapters) {
      console.log(`\n   Processing ${chapter.title}...`);
      
      // Find chapter in main text
      const chapterPattern = new RegExp(`CHAPTER\\s*-\\s*${chapter.number}\\s+${chapter.title}`, 'i');
      const chapterMatch = text.match(chapterPattern);
      
      if (!chapterMatch) {
        console.log(`   ⚠️  Chapter ${chapter.number} not found in text`);
        continue;
      }
      
      const chapterStartIndex = chapterMatch.index;
      const nextChapterIndex = findNextChapterIndex(text, chapter.number, chapters);
      const chapterText = text.substring(chapterStartIndex, nextChapterIndex);
      
      // Extract regulations
      const regulations = extractRegulations(chapterText, chapter);
      allRegulations.push(...regulations);
      
      console.log(`   ✅ Found ${regulations.length} regulations`);
      
      // Extract detailed rules from each regulation
      for (const reg of regulations) {
        const rules = extractRulesFromRegulation(chapterText, reg, chapter);
        allRules.push(...rules);
      }
    }
    
    console.log(`\n📊 Extraction Complete:`);
    console.log(`   Total Regulations: ${allRegulations.length}`);
    console.log(`   Total Rules: ${allRules.length}`);
    
    // Categorize and enrich rules
    console.log('\n🏷️  Categorizing Rules...\n');
    const enrichedRules = allRules.map(rule => enrichRule(rule, text));
    
    // Save results
    console.log('💾 Saving Results...\n');
    const outputDir = path.join(__dirname, '../data/extracted');
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Save complete extraction
    const completeData = {
      metadata: {
        extractionDate: new Date().toISOString(),
        pdfPages: pdfData.numpages,
        totalCharacters: text.length,
        chaptersFound: chapters.length,
        regulationsExtracted: allRegulations.length,
        rulesExtracted: allRules.length
      },
      chapters: chapters,
      regulations: allRegulations,
      rules: enrichedRules
    };
    
    fs.writeFileSync(
      path.join(outputDir, 'complete_udcpr_extraction.json'),
      JSON.stringify(completeData, null, 2)
    );
    console.log('   ✅ complete_udcpr_extraction.json');
    
    // Save rules by category
    const rulesByCategory = categorizeRules(enrichedRules);
    fs.writeFileSync(
      path.join(outputDir, 'rules_by_category.json'),
      JSON.stringify(rulesByCategory, null, 2)
    );
    console.log('   ✅ rules_by_category.json');
    
    // Save rules ready for database import
    const dbReadyRules = enrichedRules.map(rule => ({
      reference: rule.reference,
      chapter: rule.chapter,
      chapterTitle: rule.chapterTitle,
      regulation: rule.regulation,
      clause: rule.clause,
      summary: rule.summary,
      fullText: rule.fullText,
      category: rule.category,
      subcategory: rule.subcategory,
      applicableZones: rule.applicableZones,
      tags: rule.tags,
      isGeneral: true,
      status: 'Active',
      source: 'UDCPR 2020 (Updated 30.01.25)'
    }));
    
    fs.writeFileSync(
      path.join(outputDir, 'database_ready_rules.json'),
      JSON.stringify(dbReadyRules, null, 2)
    );
    console.log('   ✅ database_ready_rules.json');
    
    // Generate summary report
    const summary = generateSummaryReport(completeData, rulesByCategory);
    fs.writeFileSync(
      path.join(outputDir, 'extraction_summary.md'),
      summary
    );
    console.log('   ✅ extraction_summary.md');
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ EXTRACTION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📊 FINAL SUMMARY:\n');
    console.log(`   Chapters: ${chapters.length}`);
    console.log(`   Regulations: ${allRegulations.length}`);
    console.log(`   Rules: ${allRules.length}`);
    console.log('\n📁 Files saved in: server/src/data/extracted/\n');
    console.log('Next step: Run import script to add rules to database\n');

  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

function extractChaptersFromIndex(indexText) {
  const chapters = [];
  const lines = indexText.split('\n');
  
  for (const line of lines) {
    const match = line.match(/CHAPTER\s*-\s*(\d+)\s+(.+)/i);
    if (match) {
      chapters.push({
        number: parseInt(match[1]),
        title: match[2].trim()
      });
    }
  }
  
  return chapters;
}

function findNextChapterIndex(text, currentChapterNum, allChapters) {
  const nextChapter = allChapters.find(ch => ch.number === currentChapterNum + 1);
  if (!nextChapter) return text.length;
  
  const pattern = new RegExp(`CHAPTER\\s*-\\s*${nextChapter.number}\\s+${nextChapter.title}`, 'i');
  const match = text.match(pattern);
  
  return match ? match.index : text.length;
}

function extractRegulations(chapterText, chapter) {
  const regulations = [];
  
  // Pattern for regulation numbers: 1.0, 1.1, 2.2, etc.
  const regPattern = /(\d+\.\d+)(?:\s*\*{0,3}\s*#?\s*)([^\n]{10,200})/g;
  let match;
  
  while ((match = regPattern.exec(chapterText)) !== null) {
    const regNum = match[1];
    const title = match[2].trim().replace(/\s+/g, ' ');
    
    // Skip if title is too short or looks like a page number
    if (title.length < 10 || /^\d+$/.test(title)) continue;
    
    regulations.push({
      chapter: chapter.number,
      chapterTitle: chapter.title,
      regulationNumber: regNum,
      title: title,
      startIndex: match.index
    });
  }
  
  return regulations;
}

function extractRulesFromRegulation(chapterText, regulation, chapter) {
  const rules = [];
  
  // Find regulation text
  const regStart = chapterText.indexOf(regulation.regulationNumber);
  if (regStart === -1) return rules;
  
  // Get text for this regulation (next 5000 chars)
  const regText = chapterText.substring(regStart, regStart + 5000);
  
  // Extract sub-clauses
  const clausePattern = /(\d+\.\d+\.\d+(?:\.\d+)?(?:\.\d+)?)\s+([^\n]{15,400})/g;
  let match;
  
  while ((match = clausePattern.exec(regText)) !== null) {
    const clause = match[1];
    const summary = match[2].trim().replace(/\s+/g, ' ');
    
    // Get extended context
    const contextStart = match.index;
    const contextEnd = Math.min(contextStart + 1000, regText.length);
    const fullText = regText.substring(contextStart, contextEnd)
      .replace(/\s+/g, ' ')
      .trim();
    
    rules.push({
      chapter: `Chapter ${chapter.number}`,
      chapterTitle: chapter.title,
      regulation: regulation.regulationNumber,
      regulationTitle: regulation.title,
      clause: clause,
      reference: `UDCPR-${chapter.number}.${clause}`,
      summary: summary,
      fullText: fullText
    });
  }
  
  // If no sub-clauses found, treat the regulation itself as a rule
  if (rules.length === 0) {
    const summary = regulation.title;
    const contextStart = regStart;
    const contextEnd = Math.min(contextStart + 1000, chapterText.length);
    const fullText = chapterText.substring(contextStart, contextEnd)
      .replace(/\s+/g, ' ')
      .trim();
    
    rules.push({
      chapter: `Chapter ${chapter.number}`,
      chapterTitle: chapter.title,
      regulation: regulation.regulationNumber,
      regulationTitle: regulation.title,
      clause: regulation.regulationNumber,
      reference: `UDCPR-${chapter.number}.${regulation.regulationNumber}`,
      summary: summary,
      fullText: fullText
    });
  }
  
  return rules;
}

function enrichRule(rule, fullPdfText) {
  const category = determineCategory(rule);
  const subcategory = determineSubcategory(rule, category);
  const zones = extractZones(rule.fullText);
  const tags = extractTags(rule);
  
  return {
    ...rule,
    category: category,
    subcategory: subcategory,
    applicableZones: zones,
    tags: tags,
    hasCalculation: /=|formula|calculate/i.test(rule.fullText),
    hasTable: /table\s+\d+|refer.*table/i.test(rule.fullText)
  };
}

function determineCategory(rule) {
  const text = (rule.summary + ' ' + rule.fullText + ' ' + rule.regulationTitle).toLowerCase();
  
  if (/fsi|floor space index|floor area/.test(text)) return 'FSI';
  if (/setback|margin|marginal distance/.test(text)) return 'Setback';
  if (/height|storey|floor.*height/.test(text)) return 'Height';
  if (/parking|ecs|car space|vehicle/.test(text)) return 'Parking';
  if (/staircase|lift|elevator|ventilation|lighting|bathroom|toilet|kitchen|balcony/.test(text)) return 'Building Requirements';
  if (/fire|firefighting|fire.*safety/.test(text)) return 'Fire Safety';
  if (/structural|foundation|load|earthquake/.test(text)) return 'Structural';
  if (/environment|rainwater|solar|green.*building|waste/.test(text)) return 'Environmental';
  if (/tdr|transferable.*development/.test(text)) return 'TDR';
  if (/tod|transit.*oriented/.test(text)) return 'TOD';
  if (/ews|lig|affordable|economically.*weaker/.test(text)) return 'Affordable Housing';
  if (/heritage|conservation/.test(text)) return 'Heritage';
  if (/amenity|recreation|open.*space/.test(text)) return 'Amenity';
  if (/procedure|application|permission|approval/.test(text)) return 'Procedures';
  if (/penalty|fine|violation/.test(text)) return 'Penalties';
  
  return 'General';
}

function determineSubcategory(rule, category) {
  if (category !== 'Building Requirements') return null;
  
  const text = rule.fullText.toLowerCase();
  
  if (/staircase|stair/.test(text)) return 'Staircases';
  if (/lift|elevator/.test(text)) return 'Lifts';
  if (/ventilation|ventilator/.test(text)) return 'Ventilation';
  if (/light|lighting|illumination/.test(text)) return 'Lighting';
  if (/bathroom|toilet|wc|water.*closet/.test(text)) return 'Bathrooms';
  if (/kitchen/.test(text)) return 'Kitchens';
  if (/balcony/.test(text)) return 'Balconies';
  if (/basement/.test(text)) return 'Basements';
  if (/roof|terrace|parapet/.test(text)) return 'Roofs';
  if (/wall/.test(text)) return 'Walls';
  if (/door|window/.test(text)) return 'Doors & Windows';
  
  return null;
}

function extractZones(text) {
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

function extractTags(rule) {
  const tags = [];
  const text = (rule.summary + ' ' + rule.fullText).toLowerCase();
  
  const tagKeywords = [
    'residential', 'commercial', 'industrial', 'mixed-use',
    'mandatory', 'optional', 'exemption', 'relaxation',
    'calculation', 'formula', 'table', 'premium'
  ];
  
  tagKeywords.forEach(tag => {
    if (text.includes(tag)) tags.push(tag);
  });
  
  return tags;
}

function categorizeRules(rules) {
  const categorized = {};
  
  rules.forEach(rule => {
    if (!categorized[rule.category]) {
      categorized[rule.category] = [];
    }
    categorized[rule.category].push(rule);
  });
  
  return categorized;
}

function generateSummaryReport(data, rulesByCategory) {
  let report = '# UDCPR Complete Extraction Summary\n\n';
  report += `**Extraction Date:** ${new Date(data.metadata.extractionDate).toLocaleString()}\n\n`;
  report += `**PDF:** UDCPR 2020 (Updated 30.01.25)\n`;
  report += `**Pages:** ${data.metadata.pdfPages}\n\n`;
  
  report += '## Extraction Statistics\n\n';
  report += `- **Chapters:** ${data.metadata.chaptersFound}\n`;
  report += `- **Regulations:** ${data.metadata.regulationsExtracted}\n`;
  report += `- **Rules:** ${data.metadata.rulesExtracted}\n\n`;
  
  report += '## Chapters\n\n';
  data.chapters.forEach(ch => {
    report += `${ch.number}. ${ch.title}\n`;
  });
  
  report += '\n## Rules by Category\n\n';
  Object.entries(rulesByCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([category, rules]) => {
      report += `- **${category}:** ${rules.length} rules\n`;
    });
  
  report += '\n## Next Steps\n\n';
  report += '1. Review extracted rules in `database_ready_rules.json`\n';
  report += '2. Run import script to add rules to MongoDB\n';
  report += '3. Test calculator with new rules\n';
  report += '4. Verify rule accuracy against PDF\n';
  
  return report;
}

// Run extraction
finalCompleteExtraction();
