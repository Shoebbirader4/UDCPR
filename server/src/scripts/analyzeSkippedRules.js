import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ANALYZE SKIPPED RULES
 * Examine the 1,360 rules that were skipped during import
 * to determine if they contain valuable data
 */

async function analyzeSkippedRules() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('     ANALYZING SKIPPED RULES');
    console.log('     Finding out what we missed in those 1,360 entries');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Load extracted data
    const extractionPath = path.join(__dirname, '../data/extracted/complete_extraction.json');
    const extraction = JSON.parse(fs.readFileSync(extractionPath, 'utf8'));
    
    console.log(`📂 Loaded extraction data:`);
    console.log(`   UDCPR rules: ${extraction.udcpr.rules.length}`);
    console.log(`   Mumbai rules: ${extraction.mumbai.rules.length}\n`);

    const analysis = {
      udcpr: {
        total: extraction.udcpr.rules.length,
        empty: 0,
        tooShort: 0,
        tableOfContents: 0,
        pageNumbers: 0,
        validButSkipped: 0,
        examples: {
          empty: [],
          tooShort: [],
          tableOfContents: [],
          pageNumbers: [],
          validButSkipped: []
        }
      },
      mumbai: {
        total: extraction.mumbai.rules.length,
        empty: 0,
        tooShort: 0,
        tableOfContents: 0,
        pageNumbers: 0,
        validButSkipped: 0,
        examples: {
          empty: [],
          tooShort: [],
          tableOfContents: [],
          pageNumbers: [],
          validButSkipped: []
        }
      }
    };

    // ============================================================
    // ANALYZE UDCPR RULES
    // ============================================================
    console.log('🔍 ANALYZING UDCPR RULES...\n');
    
    for (const rule of extraction.udcpr.rules) {
      const summary = rule.summary || '';
      const fullText = rule.fullText || '';
      const combined = summary + ' ' + fullText;

      // Check why it might have been skipped
      if (!summary || summary.trim().length === 0) {
        analysis.udcpr.empty++;
        if (analysis.udcpr.examples.empty.length < 5) {
          analysis.udcpr.examples.empty.push({
            clause: rule.clause,
            summary: summary,
            fullText: fullText.substring(0, 100)
          });
        }
      } else if (summary.length < 10) {
        analysis.udcpr.tooShort++;
        if (analysis.udcpr.examples.tooShort.length < 5) {
          analysis.udcpr.examples.tooShort.push({
            clause: rule.clause,
            summary: summary,
            fullText: fullText.substring(0, 100)
          });
        }
      } else if (isTableOfContents(combined)) {
        analysis.udcpr.tableOfContents++;
        if (analysis.udcpr.examples.tableOfContents.length < 5) {
          analysis.udcpr.examples.tableOfContents.push({
            clause: rule.clause,
            summary: summary,
            fullText: fullText.substring(0, 100)
          });
        }
      } else if (isPageNumber(combined)) {
        analysis.udcpr.pageNumbers++;
        if (analysis.udcpr.examples.pageNumbers.length < 5) {
          analysis.udcpr.examples.pageNumbers.push({
            clause: rule.clause,
            summary: summary,
            fullText: fullText.substring(0, 100)
          });
        }
      } else if (summary.length >= 10 && !isTableOfContents(combined) && !isPageNumber(combined)) {
        // This looks valid but might have been skipped
        analysis.udcpr.validButSkipped++;
        if (analysis.udcpr.examples.validButSkipped.length < 10) {
          analysis.udcpr.examples.validButSkipped.push({
            clause: rule.clause,
            regulation: rule.regulation,
            summary: summary.substring(0, 150),
            fullText: fullText.substring(0, 200),
            category: rule.category
          });
        }
      }
    }

    console.log('   UDCPR Analysis:');
    console.log(`   - Empty summaries: ${analysis.udcpr.empty}`);
    console.log(`   - Too short (< 10 chars): ${analysis.udcpr.tooShort}`);
    console.log(`   - Table of contents: ${analysis.udcpr.tableOfContents}`);
    console.log(`   - Page numbers: ${analysis.udcpr.pageNumbers}`);
    console.log(`   - Valid but skipped: ${analysis.udcpr.validButSkipped}\n`);

    // ============================================================
    // ANALYZE MUMBAI RULES
    // ============================================================
    console.log('🔍 ANALYZING MUMBAI RULES...\n');
    
    for (const rule of extraction.mumbai.rules) {
      const summary = rule.summary || '';
      const fullText = rule.fullText || '';
      const combined = summary + ' ' + fullText;

      if (!summary || summary.trim().length === 0) {
        analysis.mumbai.empty++;
        if (analysis.mumbai.examples.empty.length < 5) {
          analysis.mumbai.examples.empty.push({
            clause: rule.clause,
            summary: summary,
            fullText: fullText.substring(0, 100)
          });
        }
      } else if (summary.length < 10) {
        analysis.mumbai.tooShort++;
        if (analysis.mumbai.examples.tooShort.length < 5) {
          analysis.mumbai.examples.tooShort.push({
            clause: rule.clause,
            summary: summary,
            fullText: fullText.substring(0, 100)
          });
        }
      } else if (isTableOfContents(combined)) {
        analysis.mumbai.tableOfContents++;
        if (analysis.mumbai.examples.tableOfContents.length < 5) {
          analysis.mumbai.examples.tableOfContents.push({
            clause: rule.clause,
            summary: summary,
            fullText: fullText.substring(0, 100)
          });
        }
      } else if (isPageNumber(combined)) {
        analysis.mumbai.pageNumbers++;
        if (analysis.mumbai.examples.pageNumbers.length < 5) {
          analysis.mumbai.examples.pageNumbers.push({
            clause: rule.clause,
            summary: summary,
            fullText: fullText.substring(0, 100)
          });
        }
      } else if (summary.length >= 10 && !isTableOfContents(combined) && !isPageNumber(combined)) {
        analysis.mumbai.validButSkipped++;
        if (analysis.mumbai.examples.validButSkipped.length < 10) {
          analysis.mumbai.examples.validButSkipped.push({
            clause: rule.clause,
            regulation: rule.regulation,
            summary: summary.substring(0, 150),
            fullText: fullText.substring(0, 200),
            category: rule.category
          });
        }
      }
    }

    console.log('   Mumbai Analysis:');
    console.log(`   - Empty summaries: ${analysis.mumbai.empty}`);
    console.log(`   - Too short (< 10 chars): ${analysis.mumbai.tooShort}`);
    console.log(`   - Table of contents: ${analysis.mumbai.tableOfContents}`);
    console.log(`   - Page numbers: ${analysis.mumbai.pageNumbers}`);
    console.log(`   - Valid but skipped: ${analysis.mumbai.validButSkipped}\n`);

    // ============================================================
    // SAVE ANALYSIS
    // ============================================================
    const outputPath = path.join(__dirname, '../data/extracted/skipped_rules_analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
    console.log(`💾 Saved analysis: ${outputPath}\n`);

    // ============================================================
    // SHOW EXAMPLES
    // ============================================================
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📋 EXAMPLES OF SKIPPED CONTENT');
    console.log('═══════════════════════════════════════════════════════════════\n');

    if (analysis.udcpr.examples.validButSkipped.length > 0) {
      console.log('🔴 VALID UDCPR RULES THAT WERE SKIPPED:\n');
      analysis.udcpr.examples.validButSkipped.forEach((ex, i) => {
        console.log(`${i + 1}. Clause: ${ex.clause} | Regulation: ${ex.regulation}`);
        console.log(`   Category: ${ex.category}`);
        console.log(`   Summary: ${ex.summary}`);
        console.log(`   Full Text: ${ex.fullText}...\n`);
      });
    }

    if (analysis.mumbai.examples.validButSkipped.length > 0) {
      console.log('🔴 VALID MUMBAI RULES THAT WERE SKIPPED:\n');
      analysis.mumbai.examples.validButSkipped.forEach((ex, i) => {
        console.log(`${i + 1}. Clause: ${ex.clause} | Regulation: ${ex.regulation}`);
        console.log(`   Category: ${ex.category}`);
        console.log(`   Summary: ${ex.summary}`);
        console.log(`   Full Text: ${ex.fullText}...\n`);
      });
    }

    if (analysis.udcpr.examples.tableOfContents.length > 0) {
      console.log('📑 TABLE OF CONTENTS ENTRIES (Sample):\n');
      analysis.udcpr.examples.tableOfContents.slice(0, 3).forEach((ex, i) => {
        console.log(`${i + 1}. Clause: ${ex.clause}`);
        console.log(`   Summary: ${ex.summary}`);
        console.log(`   Full Text: ${ex.fullText}...\n`);
      });
    }

    // ============================================================
    // SUMMARY & RECOMMENDATIONS
    // ============================================================
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY & RECOMMENDATIONS');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const totalSkipped = analysis.udcpr.empty + analysis.udcpr.tooShort + 
                         analysis.udcpr.tableOfContents + analysis.udcpr.pageNumbers;
    const totalValid = analysis.udcpr.validButSkipped + analysis.mumbai.validButSkipped;

    console.log(`Total Analyzed: ${analysis.udcpr.total + analysis.mumbai.total}`);
    console.log(`Legitimately Skipped: ${totalSkipped} (empty, TOC, page numbers)`);
    console.log(`Valid but Skipped: ${totalValid}\n`);

    if (totalValid > 0) {
      console.log('⚠️  RECOMMENDATION:');
      console.log(`   ${totalValid} rules appear to be valid but were skipped.`);
      console.log('   These might be important rules that need to be imported.\n');
      console.log('   Reasons they might have been skipped:');
      console.log('   - Duplicate reference numbers');
      console.log('   - Validation errors (invalid zones, categories)');
      console.log('   - Database constraints\n');
      console.log('   Next steps:');
      console.log('   1. Review examples above');
      console.log('   2. Check if these are truly important');
      console.log('   3. Fix validation issues if needed');
      console.log('   4. Re-import with fixes\n');
    } else {
      console.log('✅ GOOD NEWS:');
      console.log('   All skipped entries appear to be legitimately non-rule content');
      console.log('   (empty entries, table of contents, page numbers, etc.)');
      console.log('   No action needed!\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function isTableOfContents(text) {
  // Check for table of contents patterns
  if (/^\d+\.\d+\.\d+\s+[A-Z][^\n]{10,50}\s+\d+$/.test(text)) return true;
  if (text.includes('Page No.') || text.includes('Particulars')) return true;
  if (text.match(/\d+\s+\d+\s+\d+\s+\d+/)) return true; // Multiple numbers in sequence
  if (/^\d+\s+\d+\s+\d+/.test(text)) return true; // Starts with multiple numbers
  
  return false;
}

function isPageNumber(text) {
  // Check if it's just a page number or page reference
  if (/^Page\s+\d+$/i.test(text.trim())) return true;
  if (/^\d+$/.test(text.trim()) && text.trim().length < 4) return true;
  
  return false;
}

// Run analysis
analyzeSkippedRules();
