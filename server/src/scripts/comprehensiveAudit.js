import mongoose from 'mongoose';
import Rule from '../models/Rule.js';
import DistrictRule from '../models/DistrictRule.js';

const MONGODB_URI = 'mongodb://localhost:27017/udcpr-master';

async function comprehensiveAudit() {
  try {
    console.log('🔍 COMPREHENSIVE SYSTEM AUDIT\n');
    console.log('='.repeat(80));
    await mongoose.connect(MONGODB_URI);

    // 1. Check General Rules
    console.log('\n📋 GENERAL RULES AUDIT:');
    const totalRules = await Rule.countDocuments();
    console.log(`Total: ${totalRules} rules`);

    // Check for suspicious patterns
    const rulesWithChapter15 = await Rule.find({ chapter: /15/ }).countDocuments();
    console.log(`Rules with Chapter 15: ${rulesWithChapter15}`);

    const rulesWithHighClause = await Rule.find({ clause: { $regex: /^[2-9]\d+/ } }).limit(10);
    console.log(`Rules with suspicious clause numbers: ${rulesWithHighClause.length}`);
    rulesWithHighClause.forEach(r => {
      console.log(`  - ${r.reference}: ${r.clause} - ${r.summary?.substring(0, 60)}`);
    });

    // Check categories
    const categories = await Rule.distinct('category');
    console.log(`\nCategories: ${categories.length}`);
    console.log(categories.join(', '));

    // 2. Check District Rules
    console.log('\n\n🗺️  DISTRICT RULES AUDIT:');
    const totalDistrictRules = await DistrictRule.countDocuments();
    console.log(`Total: ${totalDistrictRules} rules`);

    const districtRulesChapter15 = await DistrictRule.find({ chapter: /15/ }).countDocuments();
    console.log(`Rules with Chapter 15: ${districtRulesChapter15} ⚠️`);

    const districtRulesHighClause = await DistrictRule.find({ 
      clause: { $regex: /^[2-9]\d+/ } 
    }).limit(10);
    console.log(`Rules with suspicious clause numbers: ${districtRulesHighClause.length}`);
    districtRulesHighClause.forEach(r => {
      console.log(`  - ${r.district}: Ch ${r.chapter}, Clause ${r.clause}`);
    });

    // Check chapter distribution
    console.log('\n📊 Chapter Distribution (District Rules):');
    const chapterDist = await DistrictRule.aggregate([
      { $group: { _id: '$chapter', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    chapterDist.forEach(ch => {
      const warning = ch._id.includes('15') ? ' ⚠️ INVALID' : '';
      console.log(`  ${ch._id}: ${ch.count} rules${warning}`);
    });

    // 3. Check for empty or null fields
    console.log('\n\n🔍 DATA QUALITY CHECKS:');
    
    const rulesNoSummary = await Rule.find({ $or: [{ summary: null }, { summary: '' }] }).countDocuments();
    console.log(`Rules without summary: ${rulesNoSummary}`);

    const rulesNoFullText = await Rule.find({ $or: [{ fullText: null }, { fullText: '' }] }).countDocuments();
    console.log(`Rules without fullText: ${rulesNoFullText}`);

    const districtRulesNoSummary = await DistrictRule.find({ $or: [{ summary: null }, { summary: '' }] }).countDocuments();
    console.log(`District rules without summary: ${districtRulesNoSummary}`);

    // 4. Sample some rules for manual inspection
    console.log('\n\n📝 SAMPLE RULES FOR INSPECTION:');
    console.log('\nGeneral Rules (FSI):');
    const fsiRules = await Rule.find({ category: 'FSI' }).limit(3);
    fsiRules.forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.reference || r.clause}`);
      console.log(`   Chapter: ${r.chapter}, Section: ${r.section}`);
      console.log(`   Summary: ${r.summary?.substring(0, 100)}`);
    });

    console.log('\n\nDistrict Rules (FSI):');
    const districtFSI = await DistrictRule.find({ category: 'FSI' }).limit(3);
    districtFSI.forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.district}`);
      console.log(`   Chapter: ${r.chapter}, Section: ${r.section}, Clause: ${r.clause}`);
      console.log(`   Summary: ${r.summary?.substring(0, 100)}`);
    });

    // 5. Check for duplicate content
    console.log('\n\n🔄 CHECKING FOR DUPLICATES:');
    const duplicateSummaries = await DistrictRule.aggregate([
      { $group: { _id: '$summary', count: { $sum: 1 }, districts: { $push: '$district' } } },
      { $match: { count: { $gt: 5 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    console.log('Most duplicated summaries:');
    duplicateSummaries.forEach(dup => {
      console.log(`  "${dup._id?.substring(0, 60)}..." appears in ${dup.count} districts`);
    });

    await mongoose.connection.close();
    console.log('\n\n✅ Audit complete');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

comprehensiveAudit();
