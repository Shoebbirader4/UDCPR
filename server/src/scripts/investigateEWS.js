import mongoose from 'mongoose';
import DistrictRule from '../models/DistrictRule.js';

const MONGODB_URI = 'mongodb://localhost:27017/udcpr-master';

async function investigateEWS() {
  try {
    console.log('🔍 Investigating EWS rules...\n');
    await mongoose.connect(MONGODB_URI);

    // Search for EWS rules
    const ewsRules = await DistrictRule.find({ 
      $text: { $search: 'ews' } 
    }).limit(10);

    console.log(`Found ${ewsRules.length} EWS-related rules\n`);
    console.log('=' .repeat(80));

    ewsRules.forEach((rule, i) => {
      console.log(`\n${i + 1}. DISTRICT: ${rule.district}`);
      console.log(`   REFERENCE: Chapter ${rule.chapter}, Section ${rule.section}, Clause ${rule.clause}`);
      console.log(`   CATEGORY: ${rule.category}`);
      console.log(`   SUMMARY: ${rule.summary}`);
      console.log(`   FULL TEXT (first 200 chars):`);
      console.log(`   ${rule.fullText?.substring(0, 200)}...`);
      console.log(`   STATUS: ${rule.status}`);
      console.log(`   CREATED: ${rule.createdAt}`);
      console.log('-'.repeat(80));
    });

    // Check the actual data structure
    console.log('\n\n📊 ANALYZING DATA QUALITY:\n');
    
    // Check for suspicious patterns
    const allRules = await DistrictRule.find({}).limit(100);
    
    const chapterPattern = {};
    const clausePattern = {};
    
    allRules.forEach(rule => {
      chapterPattern[rule.chapter] = (chapterPattern[rule.chapter] || 0) + 1;
      if (rule.clause) {
        const clauseNum = parseFloat(rule.clause);
        if (clauseNum > 20) {
          console.log(`⚠️  Suspicious clause number: ${rule.clause} in ${rule.district}`);
        }
      }
    });

    console.log('\nChapter distribution:');
    Object.entries(chapterPattern).sort((a, b) => b[1] - a[1]).forEach(([ch, count]) => {
      console.log(`   ${ch}: ${count} rules`);
    });

    // Check for specific district
    console.log('\n\n🔍 CHECKING SPECIFIC DISTRICT (Aurangabad):');
    const aurangabadRules = await DistrictRule.find({ district: 'Aurangabad' }).limit(10);
    
    aurangabadRules.forEach((rule, i) => {
      console.log(`\n${i + 1}. ${rule.summary?.substring(0, 80)}`);
      console.log(`   Ref: Ch ${rule.chapter}, Sec ${rule.section}, Clause ${rule.clause}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Investigation complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

investigateEWS();
