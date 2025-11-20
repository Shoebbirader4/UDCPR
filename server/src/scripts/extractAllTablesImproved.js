import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * IMPROVED TABLE EXTRACTION
 * Extract ALL tables including those with letter suffixes (3A, 6B, etc.)
 */

async function extractAllTablesImproved() {
  try {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('     IMPROVED TABLE EXTRACTION');
    console.log('     Finding ALL tables including 3A, 6B, 7C, etc.');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Read raw text files
    const udcprText = fs.readFileSync(path.join(__dirname, '../data/extracted/udcpr_raw_text.txt'), 'utf8');
    const mumbaiText = fs.readFileSync(path.join(__dirname, '../data/extracted/mumbai_raw_text.txt'), 'utf8');

    console.log('📄 Loaded text files');
    console.log(`   UDCPR: ${udcprText.length.toLocaleString()} characters`);
    console.log(`   Mumbai: ${mumbaiText.length.toLocaleString()} characters\n`);

    // Extract tables with improved patterns
    console.log('🔍 Extracting UDCPR tables...\n');
    const udcprTables = extractTablesImproved(udcprText, 'UDCPR');
    
    console.log('🔍 Extracting Mumbai tables...\n');
    const mumbaiTables = extractTablesImproved(mumbaiText, 'Mumbai');

    // Save results
    const outputPath = path.join(__dirname, '../data/extracted/all_tables_complete.json');
    const result = {
      udcpr: udcprTables,
      mumbai: mumbaiTables,
      metadata: {
        extractionDate: new Date().toISOString(),
        totalTables: udcprTables.length + mumbaiTables.length
      }
    };

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ EXTRACTION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`📊 UDCPR Tables: ${udcprTables.length}`);
    console.log(`📊 Mumbai Tables: ${mumbaiTables.length}`);
    console.log(`📊 Total Tables: ${udcprTables.length + mumbaiTables.length}\n`);
    console.log(`💾 Saved to: all_tables_complete.json\n`);

    // Show some examples
    console.log('📋 Sample Tables Found:\n');
    udcprTables.slice(0, 10).forEach(table => {
      console.log(`   ${table.number}: ${table.title.substring(0, 60)}...`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

function extractTablesImproved(text, source) {
  const tables = [];
  const seen = new Set();

  // Multiple patterns to catch all table formats
  const patterns = [
    // Table No.3A, Table No. 3A, Table No.3-A
    /Table\s+No\.?\s*(\d+[A-Z]?(?:-[A-Z])?)[:\s\-–—]+([^\n]{5,200})/gi,
    // Table 3A, Table 3-A
    /Table\s+(\d+[A-Z]?(?:-[A-Z])?)[:\s\-–—]+([^\n]{5,200})/gi,
    // Table No 3A (without period)
    /Table\s+No\s+(\d+[A-Z]?(?:-[A-Z])?)[:\s\-–—]+([^\n]{5,200})/gi
  ];

  patterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    
    while ((match = regex.exec(text)) !== null) {
      const tableNum = match[1].trim();
      const title = match[2].trim().replace(/\s+/g, ' ');
      
      // Create unique key
      const key = `${tableNum}-${title.substring(0, 50)}`;
      
      // Skip if already found or title is too short
      if (seen.has(key) || title.length < 5) continue;
      
      seen.add(key);
      
      // Extract table content (next 2000 characters)
      const contentStart = match.index;
      const contentEnd = Math.min(contentStart + 2000, text.length);
      const content = text.substring(contentStart, contentEnd)
        .replace(/\s+/g, ' ')
        .trim();
      
      tables.push({
        number: tableNum,
        title: title,
        content: content,
        type: determineTableType(title, content),
        source: source
      });
    }
  });

  // Sort by table number
  return tables.sort((a, b) => {
    const aNum = parseTableNumber(a.number);
    const bNum = parseTableNumber(b.number);
    return aNum - bNum;
  });
}

function parseTableNumber(tableNum) {
  // Extract numeric part for sorting (e.g., "3A" -> 3, "6-B" -> 6)
  const match = tableNum.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function determineTableType(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  
  if (/fsi|floor space|floor area/.test(text)) return 'FSI Table';
  if (/setback|margin/.test(text)) return 'Setback Table';
  if (/height/.test(text)) return 'Height Table';
  if (/parking|ecs|car space/.test(text)) return 'Parking Table';
  if (/road|street|width/.test(text)) return 'Road/Infrastructure Table';
  if (/zone|land use/.test(text)) return 'Zoning Table';
  
  return 'General Table';
}

// Run extraction
extractAllTablesImproved();
