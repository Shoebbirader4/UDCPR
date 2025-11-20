import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_PATH = path.join(__dirname, '../data/UDCPR Updated 30.01.25 with earlier provisions & corrections_compressed.pdf');

/**
 * DEEP UDCPR PDF ANALYSIS
 * Enhanced extraction with better chapter detection and rule parsing
 */

async function deepPDFAnalysis() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('     DEEP UDCPR PDF ANALYSIS - ENHANCED VERSION');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Read PDF
    console.log('📄 Reading PDF...');
    const dataBuffer = fs.readFileSync(PDF_PATH);
    const pdfData = await pdfParse(dataBuffer);
    
    console.log(`✅ PDF loaded successfully`);
    console.log(`   Total Pages: ${pdfData.numpages}`);
    console.log(`   Text Length: ${pdfData.text.length.toLocaleString()} characters\n`);

    const text = pdfData.text;
    
    // Save raw text for manual review
    const rawTextPath = path.join(__dirname, '../data/extracted/raw_pdf_text.txt');
    fs.mkdirSync(path.dirname(rawTextPath), { recursive: true });
    fs.writeFileSync(rawTextPath, text);
    console.log(`📝 Raw text saved: ${rawTextPath}\n`);

    const analysis = {
      metadata: {
        totalPages: pdfData.numpages,
        totalCharacters: text.length,
        analysisDate: new Date().toISOString()
      },
      chapters: [],
      sections: [],
      rules: [],
      calculations: [],
      tables: [],
      definitions: [],
      zones: [],
      requirements: {}
    };

    // ============================================================
    // STEP 1: IDENTIFY TABLE OF CONTENTS
    // ============================================================
    console.log('📑 STEP 1: Analyzing Table of Contents...\n');
    const tocInfo = extractTableOfContents(text);
    console.log(`   Found TOC with ${tocInfo.entries.length} entries\n`);

    // ============================================================
    // STEP 2: IDENTIFY ALL CHAPTERS
    // ============================================================
    console.log('📚 STEP 2: Identifying All Chapters...\n');
    const chapters = identifyChapters(text, tocInfo);
    analysis.chapters = chapters;
    
    console.log(`   Found ${chapters.length} chapters:\n`);
    chapters.forEach(ch => {
      console.log(`   ${ch.number}. ${ch.title}`);
    });

    // ============================================================
    // STEP 3: EXTRACT SECTIONS FROM EACH CHAPTER
    // ============================================================
    console.log('\n📋 STEP 3: Extracting Sections...\n');
    
    for (const chapter of chapters) {
      const chapterText = extractChapterText(text, chapter, chapters);
      const sections = extractSections(chapterText, chapter);
      analysis.sections.push(...sections);
      
      console.log(`   Chapter ${chapter.number}: ${sections.length} sections`);
    }
    
    console.log(`\n   Total Sections: ${analysis.sections.length}`);

    // ============================================================
    // STEP 4: EXTRACT ALL RULES AND REGULATIONS
    // ============================================================
    console.log('\n📜 STEP 4: Extracting All Rules and Regulations...\n');
    
    for (const section of analysis.sections) {
      const rules = extractDetailedRules(text, section);
      analysis.rules.push(...rules);
    }
    
    console.log(`   Total Rules Extracted: ${analysis.rules.length}\n`);
    
    // Show breakdown by chapter
    const rulesByChapter = {};
    analysis.rules.forEach(rule => {
      rulesByChapter[rule.chapter] = (rulesByChapter[rule.chapter] || 0) + 1;
    });
    
    console.log('   Rules by Chapter:');
    Object.entries(rulesByChapter).forEach(([ch, count]) => {
      console.log(`   - ${ch}: ${count} rules`);
    });

    // ============================================================
    // STEP 5: EXTRACT FSI RULES
    // ============================================================
    console.log('\n🏗️  STEP 5: Extracting FSI Rules...\n');
    const fsiRules = extractFSIRules(text);
    analysis.requirements.fsi = fsiRules;
    console.log(`   Found ${fsiRules.length} FSI rules`);

    // ============================================================
    // STEP 6: EXTRACT SETBACK RULES
    // ============================================================
    console.log('\n📏 STEP 6: Extracting Setback Rules...\n');
    const setbackRules = extractSetbackRules(text);
    analysis.requirements.setback = setbackRules;
    console.log(`   Found ${setbackRules.length} setback rules`);

    // ============================================================
    // STEP 7: EXTRACT HEIGHT RULES
    // ============================================================
    console.log('\n📐 STEP 7: Extracting Height Rules...\n');
    const heightRules = extractHeightRules(text);
    analysis.requirements.height = heightRules;
    console.log(`   Found ${heightRules.length} height rules`);

    // ============================================================
    // STEP 8: EXTRACT PARKING RULES
    // ============================================================
    console.log('\n🚗 STEP 8: Extracting Parking Rules...\n');
    const parkingRules = extractParkingRules(text);
    analysis.requirements.parking = parkingRules;
    console.log(`   Found ${parkingRules.length} parking rules`);

    // ============================================================
    // STEP 9: EXTRACT BUILDING COMPONENT REQUIREMENTS
    // ============================================================
    console.log('\n🏢 STEP 9: Extracting Building Component Requirements...\n');
    const components = extractBuildingComponents(text);
    analysis.requirements.components = components;
    console.log(`   Found requirements for ${Object.keys(components).length} components`);

    // ============================================================
    // STEP 10: EXTRACT ZONE DEFINITIONS
    // ============================================================
    console.log('\n🗺️  STEP 10: Extracting Zone Definitions...\n');
    const zones = extractZoneDefinitions(text);
    analysis.zones = zones;
    console.log(`   Found ${zones.length} zone definitions`);

    // ============================================================
    // STEP 11: EXTRACT ALL CALCULATIONS
    // ============================================================
    console.log('\n🔢 STEP 11: Extracting Calculations and Formulas...\n');
    const calculations = extractAllCalculations(text);
    analysis.calculations = calculations;
    console.log(`   Found ${calculations.length} calculations`);

    // ============================================================
    // STEP 12: EXTRACT ALL TABLES
    // ============================================================
    console.log('\n📊 STEP 12: Extracting All Tables...\n');
    const tables = extractAllTables(text);
    analysis.tables = tables;
    console.log(`   Found ${tables.length} tables`);

    // ============================================================
    // STEP 13: EXTRACT DEFINITIONS
    // ============================================================
    console.log('\n📖 STEP 13: Extracting Definitions...\n');
    const definitions = extractAllDefinitions(text);
    analysis.definitions = definitions;
    console.log(`   Found ${definitions.length} definitions`);

    // ============================================================
    // SAVE ALL RESULTS
    // ============================================================
    console.log('\n💾 Saving All Results...\n');
    
    const outputDir = path.join(__dirname, '../data/extracted');
    
    // Save complete analysis
    const analysisPath = path.join(outputDir, 'deep_analysis_complete.json');
    fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
    console.log(`   ✅ Complete analysis: deep_analysis_complete.json`);
    
    // Save rules by category
    const rulesByCategory = categorizeAllRules(analysis.rules);
    const categorizedPath = path.join(outputDir, 'rules_by_category.json');
    fs.writeFileSync(categorizedPath, JSON.stringify(rulesByCategory, null, 2));
    console.log(`   ✅ Categorized rules: rules_by_category.json`);
    
    // Save requirements separately
    const reqPath = path.join(outputDir, 'all_requirements.json');
    fs.writeFileSync(reqPath, JSON.stringify(analysis.requirements, null, 2));
    console.log(`   ✅ All requirements: all_requirements.json`);
    
    // Generate detailed report
    const reportPath = path.join(outputDir, 'detailed_analysis_report.txt');
    const report = generateDetailedReport(analysis);
    fs.writeFileSync(reportPath, report);
    console.log(`   ✅ Detailed report: detailed_analysis_report.txt`);
    
    // Generate implementation checklist
    const checklistPath = path.join(outputDir, 'implementation_checklist.md');
    const checklist = generateImplementationChecklist(analysis);
    fs.writeFileSync(checklistPath, checklist);
    console.log(`   ✅ Implementation checklist: implementation_checklist.md`);

    // ============================================================
    // FINAL SUMMARY
    // ============================================================
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ DEEP ANALYSIS COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📊 COMPREHENSIVE SUMMARY:\n');
    console.log(`   📚 Chapters: ${analysis.chapters.length}`);
    console.log(`   📋 Sections: ${analysis.sections.length}`);
    console.log(`   📜 Total Rules: ${analysis.rules.length}`);
    console.log(`   🏗️  FSI Rules: ${analysis.requirements.fsi.length}`);
    console.log(`   📏 Setback Rules: ${analysis.requirements.setback.length}`);
    console.log(`   📐 Height Rules: ${analysis.requirements.height.length}`);
    console.log(`   🚗 Parking Rules: ${analysis.requirements.parking.length}`);
    console.log(`   🏢 Building Components: ${Object.keys(analysis.requirements.components).length}`);
    console.log(`   🗺️  Zones: ${analysis.zones.length}`);
    console.log(`   🔢 Calculations: ${analysis.calculations.length}`);
    console.log(`   📊 Tables: ${analysis.tables.length}`);
    console.log(`   📖 Definitions: ${analysis.definitions.length}`);
    console.log('\n📁 All files saved in: server/src/data/extracted/\n');

  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// ============================================================
// EXTRACTION FUNCTIONS
// ============================================================

function extractTableOfContents(text) {
  // Look for table of contents section
  const tocStart = text.search(/TABLE\s+OF\s+CONTENTS|CONTENTS|INDEX/i);
  if (tocStart === -1) return { entries: [] };
  
  const tocText = text.substring(tocStart, tocStart + 10000);
  const entries = [];
  
  // Extract chapter entries from TOC
  const entryPattern = /(?:Chapter|CHAPTER)\s+(\d+)[:\s\-–—]+([^\n]{5,100})/g;
  let match;
  
  while ((match = entryPattern.exec(tocText)) !== null) {
    entries.push({
      number: match[1],
      title: match[2].trim()
    });
  }
  
  return { entries, text: tocText };
}

function identifyChapters(text, tocInfo) {
  const chapters = [];
  
  // Known UDCPR 2020 chapters based on standard structure
  const knownChapters = [
    'Preliminary',
    'Land Use and Zoning',
    'Floor Space Index',
    'Margins and Setbacks',
    'Building Height',
    'Parking',
    'Transferable Development Rights',
    'Amenities and Recreation',
    'Requirements of Parts of Building',
    'Fire Safety',
    'Structural Safety',
    'Environmental Provisions',
    'Heritage Buildings',
    'Special Provisions'
  ];
  
  // Try to find each chapter in the text
  knownChapters.forEach((title, index) => {
    const chapterNum = index + 1;
    const patterns = [
      new RegExp(`CHAPTER\\s+${chapterNum}[:\\s\\-–—]+${title}`, 'i'),
      new RegExp(`Chapter\\s+${chapterNum}[:\\s\\-–—]+${title}`, 'i'),
      new RegExp(`${chapterNum}\\.\\s+${title}`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        chapters.push({
          number: chapterNum,
          title: title,
          startIndex: match.index,
          found: true
        });
        break;
      }
    }
  });
  
  // Also extract any chapters found in text
  const chapterPattern = /(?:CHAPTER|Chapter)\s+(\d+)[:\s\-–—]+([^\n]{10,100})/g;
  let match;
  
  while ((match = chapterPattern.exec(text)) !== null) {
    const num = parseInt(match[1]);
    const title = match[2].trim().replace(/\s+/g, ' ');
    
    // Only add if not already in list and title is meaningful
    if (!chapters.find(ch => ch.number === num) && title.length > 10 && title.length < 100) {
      chapters.push({
        number: num,
        title: title,
        startIndex: match.index,
        found: true
      });
    }
  }
  
  return chapters.sort((a, b) => a.number - b.number);
}

function extractChapterText(fullText, chapter, allChapters) {
  if (!chapter.startIndex) return '';
  
  const currentIndex = allChapters.findIndex(ch => ch.number === chapter.number);
  const nextChapter = allChapters[currentIndex + 1];
  
  if (nextChapter && nextChapter.startIndex) {
    return fullText.substring(chapter.startIndex, nextChapter.startIndex);
  }
  return fullText.substring(chapter.startIndex, chapter.startIndex + 50000); // Limit to 50k chars
}

function extractSections(chapterText, chapter) {
  const sections = [];
  
  // Pattern for sections: "1.1", "2.3", etc.
  const sectionPattern = /(\d+\.\d+)[:\s\-–—]+([^\n]{10,150})/g;
  let match;
  
  while ((match = sectionPattern.exec(chapterText)) !== null) {
    sections.push({
      chapter: chapter.number,
      chapterTitle: chapter.title,
      sectionNumber: match[1],
      sectionTitle: match[2].trim().replace(/\s+/g, ' '),
      startIndex: match.index
    });
  }
  
  return sections;
}

function extractDetailedRules(fullText, section) {
  const rules = [];
  
  // Find section text
  const sectionStart = fullText.indexOf(section.sectionNumber);
  if (sectionStart === -1) return rules;
  
  const sectionText = fullText.substring(sectionStart, sectionStart + 5000);
  
  // Extract sub-clauses
  const clausePattern = /(\d+\.\d+\.\d+(?:\.\d+)?)[:\s\-–—]?([^\n]{15,300})/g;
  let match;
  
  while ((match = clausePattern.exec(sectionText)) !== null) {
    const fullText = extractRuleContext(sectionText, match.index);
    
    rules.push({
      chapter: `Chapter ${section.chapter}`,
      chapterTitle: section.chapterTitle,
      section: section.sectionNumber,
      sectionTitle: section.sectionTitle,
      clause: match[1],
      reference: `UDCPR-${section.chapter}.${match[1]}`,
      summary: match[2].trim().replace(/\s+/g, ' '),
      fullText: fullText,
      category: null, // Will be categorized later
      tags: []
    });
  }
  
  return rules;
}

function extractRuleContext(text, startIndex) {
  const contextLength = 800;
  const endIndex = Math.min(startIndex + contextLength, text.length);
  return text.substring(startIndex, endIndex).replace(/\s+/g, ' ').trim();
}

function extractFSIRules(text) {
  const rules = [];
  const fsiPattern = /FSI[^\n]{20,500}/gi;
  let match;
  
  while ((match = fsiPattern.exec(text)) !== null) {
    const content = match[0].trim();
    if (content.length > 30) {
      rules.push({
        type: 'FSI',
        content: content,
        context: extractRuleContext(text, match.index)
      });
    }
  }
  
  return rules;
}

function extractSetbackRules(text) {
  const rules = [];
  const setbackPattern = /(?:setback|marginal distance|margin)[^\n]{20,500}/gi;
  let match;
  
  while ((match = setbackPattern.exec(text)) !== null) {
    const content = match[0].trim();
    if (content.length > 30) {
      rules.push({
        type: 'Setback',
        content: content,
        context: extractRuleContext(text, match.index)
      });
    }
  }
  
  return rules;
}

function extractHeightRules(text) {
  const rules = [];
  const heightPattern = /(?:height|storey)[^\n]{20,500}/gi;
  let match;
  
  while ((match = heightPattern.exec(text)) !== null) {
    const content = match[0].trim();
    if (content.length > 30 && /\d/.test(content)) {
      rules.push({
        type: 'Height',
        content: content,
        context: extractRuleContext(text, match.index)
      });
    }
  }
  
  return rules;
}

function extractParkingRules(text) {
  const rules = [];
  const parkingPattern = /(?:parking|ECS|car space)[^\n]{20,500}/gi;
  let match;
  
  while ((match = parkingPattern.exec(text)) !== null) {
    const content = match[0].trim();
    if (content.length > 30) {
      rules.push({
        type: 'Parking',
        content: content,
        context: extractRuleContext(text, match.index)
      });
    }
  }
  
  return rules;
}

function extractBuildingComponents(text) {
  const components = {};
  
  const componentTypes = [
    'staircase', 'lift', 'elevator', 'ventilation', 'lighting',
    'bathroom', 'toilet', 'kitchen', 'balcony', 'basement',
    'roof', 'terrace', 'wall', 'door', 'window', 'corridor',
    'lobby', 'entrance', 'exit', 'ramp'
  ];
  
  componentTypes.forEach(component => {
    const pattern = new RegExp(`${component}[^\\n]{20,500}`, 'gi');
    const matches = [];
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      const content = match[0].trim();
      if (content.length > 30) {
        matches.push({
          content: content,
          context: extractRuleContext(text, match.index)
        });
      }
    }
    
    if (matches.length > 0) {
      components[component] = matches;
    }
  });
  
  return components;
}

function extractZoneDefinitions(text) {
  const zones = [];
  const zonePattern = /([RCIM]\d+|R-\d+|C-\d+|I-\d+|M-\d+)[:\s\-–—]+([^\n]{10,200})/g;
  let match;
  
  while ((match = zonePattern.exec(text)) !== null) {
    zones.push({
      code: match[1],
      description: match[2].trim(),
      context: extractRuleContext(text, match.index)
    });
  }
  
  return zones;
}

function extractAllCalculations(text) {
  const calculations = [];
  
  // Look for formulas with = sign
  const formulaPattern = /([A-Z][a-zA-Z\s]+)\s*=\s*([^\n]{10,200})/g;
  let match;
  
  while ((match = formulaPattern.exec(text)) !== null) {
    const formula = match[0].trim();
    if (formula.length > 15 && formula.length < 300) {
      calculations.push({
        formula: formula,
        variable: match[1].trim(),
        expression: match[2].trim(),
        context: extractRuleContext(text, match.index)
      });
    }
  }
  
  return calculations;
}

function extractAllTables(text) {
  const tables = [];
  const tablePattern = /Table\s+(\d+(?:\.\d+)?)[:\s\-–—]+([^\n]{5,150})/gi;
  let match;
  
  while ((match = tablePattern.exec(text)) !== null) {
    tables.push({
      number: match[1],
      title: match[2].trim(),
      content: extractRuleContext(text, match.index)
    });
  }
  
  return tables;
}

function extractAllDefinitions(text) {
  const definitions = [];
  
  // Pattern 1: "Term" means definition
  const pattern1 = /"([^"]{3,50})"\s+means\s+([^\n]{20,400})/gi;
  let match;
  
  while ((match = pattern1.exec(text)) !== null) {
    definitions.push({
      term: match[1].trim(),
      definition: match[2].trim().replace(/\s+/g, ' ')
    });
  }
  
  // Pattern 2: Term:- definition
  const pattern2 = /([A-Z][a-zA-Z\s]{3,40}):-\s+([^\n]{20,400})/g;
  
  while ((match = pattern2.exec(text)) !== null) {
    const term = match[1].trim();
    if (term.split(' ').length <= 5) { // Only short terms
      definitions.push({
        term: term,
        definition: match[2].trim().replace(/\s+/g, ' ')
      });
    }
  }
  
  return definitions;
}

function categorizeAllRules(rules) {
  const categorized = {};
  
  rules.forEach(rule => {
    const category = determineCategory(rule);
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push({
      ...rule,
      category: category
    });
  });
  
  return categorized;
}

function determineCategory(rule) {
  const text = (rule.summary + ' ' + rule.fullText + ' ' + rule.sectionTitle).toLowerCase();
  
  if (/fsi|floor space|floor area ratio/.test(text)) return 'FSI';
  if (/setback|margin/.test(text)) return 'Setback';
  if (/height|storey/.test(text)) return 'Height';
  if (/parking|ecs|car space/.test(text)) return 'Parking';
  if (/staircase|lift|elevator|ventilation|lighting|bathroom|kitchen/.test(text)) return 'Building Requirements';
  if (/fire|firefighting/.test(text)) return 'Fire Safety';
  if (/structural|foundation|load/.test(text)) return 'Structural';
  if (/environment|rainwater|solar|green/.test(text)) return 'Environmental';
  if (/tdr|transferable development/.test(text)) return 'TDR';
  if (/heritage|conservation/.test(text)) return 'Heritage';
  if (/procedure|application|approval/.test(text)) return 'Procedures';
  
  return 'General';
}

function generateDetailedReport(analysis) {
  let report = '═══════════════════════════════════════════════════════════════\n';
  report += '     UDCPR DEEP ANALYSIS - DETAILED REPORT\n';
  report += '═══════════════════════════════════════════════════════════════\n\n';
  
  report += `Generated: ${new Date().toLocaleString()}\n`;
  report += `PDF Pages: ${analysis.metadata.totalPages}\n`;
  report += `Total Characters: ${analysis.metadata.totalCharacters.toLocaleString()}\n\n`;
  
  report += '─────────────────────────────────────────────────────────────────\n';
  report += 'CHAPTERS IDENTIFIED\n';
  report += '─────────────────────────────────────────────────────────────────\n';
  analysis.chapters.forEach(ch => {
    report += `Chapter ${ch.number}: ${ch.title}\n`;
  });
  
  report += '\n─────────────────────────────────────────────────────────────────\n';
  report += 'EXTRACTION SUMMARY\n';
  report += '─────────────────────────────────────────────────────────────────\n';
  report += `Total Sections: ${analysis.sections.length}\n`;
  report += `Total Rules: ${analysis.rules.length}\n`;
  report += `FSI Rules: ${analysis.requirements.fsi.length}\n`;
  report += `Setback Rules: ${analysis.requirements.setback.length}\n`;
  report += `Height Rules: ${analysis.requirements.height.length}\n`;
  report += `Parking Rules: ${analysis.requirements.parking.length}\n`;
  report += `Building Components: ${Object.keys(analysis.requirements.components).length}\n`;
  report += `Zone Definitions: ${analysis.zones.length}\n`;
  report += `Calculations: ${analysis.calculations.length}\n`;
  report += `Tables: ${analysis.tables.length}\n`;
  report += `Definitions: ${analysis.definitions.length}\n`;
  
  return report;
}

function generateImplementationChecklist(analysis) {
  let checklist = '# UDCPR Implementation Checklist\n\n';
  checklist += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  checklist += '## Extraction Complete\n\n';
  checklist += `- [x] PDF analyzed (${analysis.metadata.totalPages} pages)\n`;
  checklist += `- [x] Chapters identified (${analysis.chapters.length})\n`;
  checklist += `- [x] Rules extracted (${analysis.rules.length})\n`;
  checklist += `- [x] Requirements categorized\n\n`;
  
  checklist += '## Next Steps\n\n';
  checklist += '### 1. Review Extracted Data\n';
  checklist += '- [ ] Review all_extracted_rules.json\n';
  checklist += '- [ ] Verify chapter structure\n';
  checklist += '- [ ] Check rule categorization\n\n';
  
  checklist += '### 2. Database Import\n';
  checklist += '- [ ] Create import script\n';
  checklist += '- [ ] Import FSI rules\n';
  checklist += '- [ ] Import setback rules\n';
  checklist += '- [ ] Import height rules\n';
  checklist += '- [ ] Import parking rules\n';
  checklist += '- [ ] Import building requirements\n\n';
  
  checklist += '### 3. Calculator Enhancement\n';
  checklist += '- [ ] Implement FSI calculations\n';
  checklist += '- [ ] Implement setback calculations\n';
  checklist += '- [ ] Implement height calculations\n';
  checklist += '- [ ] Implement parking calculations\n\n';
  
  checklist += '### 4. Testing\n';
  checklist += '- [ ] Test all calculations\n';
  checklist += '- [ ] Verify rule accuracy\n';
  checklist += '- [ ] Test edge cases\n\n';
  
  checklist += '## Statistics\n\n';
  checklist += `- Total Rules: ${analysis.rules.length}\n`;
  checklist += `- FSI Rules: ${analysis.requirements.fsi.length}\n`;
  checklist += `- Setback Rules: ${analysis.requirements.setback.length}\n`;
  checklist += `- Height Rules: ${analysis.requirements.height.length}\n`;
  checklist += `- Parking Rules: ${analysis.requirements.parking.length}\n`;
  
  return checklist;
}

// Run the analysis
deepPDFAnalysis();
