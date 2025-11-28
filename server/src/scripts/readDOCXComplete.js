import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readDOCXFile(filePath, fileName) {
  try {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`READING: ${fileName}`);
    console.log('═'.repeat(80));
    
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.messages.length > 0 
      ? `⚠️ Warnings: ${result.messages.map(m => m.message).join(', ')}\n\n${result.value}`
      : result.value;
    
    const lines = text.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    
    console.log(`\n📊 FILE STATISTICS:`);
    console.log(`   Total lines: ${lines.length}`);
    console.log(`   Non-empty lines: ${nonEmptyLines.length}`);
    console.log(`   Total characters: ${text.length}`);
    console.log(`   File size: ${(fs.statSync(filePath).size / 1024).toFixed(2)} KB`);
    
    console.log(`\n📄 FULL CONTENT:\n`);
    console.log('─'.repeat(80));
    console.log(text);
    console.log('─'.repeat(80));
    
    return {
      fileName,
      text,
      lines: lines.length,
      nonEmptyLines: nonEmptyLines.length,
      characters: text.length
    };
    
  } catch (error) {
    console.error(`❌ Error reading ${fileName}:`, error.message);
    return null;
  }
}

async function readAllDOCX() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    COMPLETE DOCX FILE READER                                  ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  
  const dataDir = path.join(__dirname, '../data');
  
  const files = [
    {
      path: path.join(dataDir, 'UDCPR Updated 30.01.25 with earlier provisions & corrections_compressed.docx'),
      name: 'UDCPR (General Maharashtra)'
    },
    {
      path: path.join(dataDir, 'MUBAI-DCPR.docx'),
      name: 'Mumbai-DCPR (Mumbai Specific)'
    }
  ];
  
  const results = [];
  
  for (const file of files) {
    if (fs.existsSync(file.path)) {
      const result = await readDOCXFile(file.path, file.name);
      if (result) {
        results.push(result);
      }
    } else {
      console.log(`\n⚠️ File not found: ${file.name}`);
    }
  }
  
  console.log('\n\n╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                           READING COMPLETE                                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');
  
  console.log('\n📊 SUMMARY OF ALL FILES:\n');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.fileName}`);
    console.log(`   Lines: ${result.lines} | Non-empty: ${result.nonEmptyLines} | Characters: ${result.characters}`);
  });
  
  console.log('\n✅ All files read successfully!');
  console.log('   You can now proceed with Python extraction.\n');
}

readAllDOCX();
