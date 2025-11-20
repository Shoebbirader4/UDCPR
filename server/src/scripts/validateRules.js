import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_CHAPTERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
const VALID_CATEGORIES = [
  'FSI', 'Setback', 'Height', 'Parking', 'Heritage', 'TDR', 'Amenity',
  'Environmental', 'Safety', 'Accessibility', 'CRZ', 'TOD',
  'Affordable Housing', 'Mixed Use', 'Special Buildings', 'Land Use',
  'Zoning', 'Infrastructure', 'Social Infrastructure', 'Redevelopment',
  'Regularization', 'Building Requirements', 'Structural', 'Fire Safety',
  'Procedures', 'Penalties', 'General'
];

function validateRules(filePath) {
  console.log(`\n🔍 Validating: ${filePath}\n`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const rules = Array.isArray(data) ? data : [data];
    
    let errors = 0;
    let warnings = 0;
    
    rules.forEach((rule, index) => {
      console.log(`Rule ${index + 1}: ${rule.reference || 'NO REFERENCE'}`);
      
      // Required fields
      if (!rule.chapter) {
        console.log(`  ❌ ERROR: Missing chapter`);
        errors++;
      } else if (!VALID_CHAPTERS.includes(rule.chapter)) {
        console.log(`  ❌ ERROR: Invalid chapter "${rule.chapter}" (must be 1-14)`);
        errors++;
      }
      
      if (!rule.section) {
        console.log(`  ❌ ERROR: Missing section`);
        errors++;
      }
      
      if (!rule.clause) {
        console.log(`  ❌ ERROR: Missing clause`);
        errors++;
      }
      
      if (!rule.summary) {
        console.log(`  ❌ ERROR: Missing summary`);
        errors++;
      }
      
      if (!rule.fullText) {
        console.log(`  ❌ ERROR: Missing fullText`);
        errors++;
      }
      
      if (!rule.category) {
        console.log(`  ⚠️  WARNING: Missing category`);
        warnings++;
      } else if (!VALID_CATEGORIES.includes(rule.category)) {
        console.log(`  ⚠️  WARNING: Unknown category "${rule.category}"`);
        warnings++;
      }
      
      if (!rule.pdfPage) {
        console.log(`  ⚠️  WARNING: Missing PDF page number`);
        warnings++;
      }
      
      if (!rule.verified) {
        console.log(`  ⚠️  WARNING: Not marked as verified`);
        warnings++;
      }
      
      if (errors === 0 && warnings === 0) {
        console.log(`  ✅ Valid`);
      }
      
      console.log('');
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total rules: ${rules.length}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Warnings: ${warnings}`);
    
    if (errors === 0) {
      console.log(`\n✅ Validation passed! Ready to import.`);
      return true;
    } else {
      console.log(`\n❌ Validation failed. Fix errors before importing.`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error reading file: ${error.message}`);
    return false;
  }
}

// Run validation
const filePath = process.argv[2];
if (!filePath) {
  console.log('Usage: node validateRules.js <path-to-json-file>');
  process.exit(1);
}

validateRules(filePath);
