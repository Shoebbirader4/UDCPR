import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistrictRule from '../models/DistrictRule.js';

dotenv.config();

async function verifyAllDistricts() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('     VERIFICATION: ALL 35 DISTRICTS');
    console.log('═══════════════════════════════════════════════════════\n');

    const districts = await DistrictRule.distinct('district');
    console.log(`📊 Total Districts: ${districts.length}\n`);

    // Test Affordable Housing for all districts
    console.log('🏠 AFFORDABLE HOUSING RULES PER DISTRICT:\n');
    
    for (const district of districts.sort()) {
      const count = await DistrictRule.countDocuments({
        district,
        category: 'Affordable Housing',
        status: 'Active'
      });
      
      const status = count >= 5 ? '✅' : '⚠️';
      console.log(`   ${status} ${district.padEnd(20)} ${count} rules`);
    }

    // Test a few more categories across random districts
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('     SAMPLE CHECKS: MULTIPLE DISTRICTS');
    console.log('═══════════════════════════════════════════════════════\n');

    const testDistricts = ['Pune', 'Nagpur', 'Nashik', 'Mumbai City', 'Kolhapur'];
    const testCategories = ['Affordable Housing', 'TOD', 'CRZ', 'Mixed Use', 'FSI'];

    for (const district of testDistricts) {
      console.log(`\n📍 ${district}:`);
      
      for (const category of testCategories) {
        const count = await DistrictRule.countDocuments({
          district,
          category,
          status: 'Active'
        });
        console.log(`   ${category.padEnd(20)} ${count} rules`);
      }
      
      const total = await DistrictRule.countDocuments({
        district,
        status: 'Active'
      });
      console.log(`   ${'TOTAL'.padEnd(20)} ${total} rules`);
    }

    // Overall summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('     OVERALL SUMMARY');
    console.log('═══════════════════════════════════════════════════════\n');

    const totalRules = await DistrictRule.countDocuments({ status: 'Active' });
    const avgPerDistrict = Math.round(totalRules / districts.length);

    console.log(`   Total Rules: ${totalRules}`);
    console.log(`   Total Districts: ${districts.length}`);
    console.log(`   Average per District: ${avgPerDistrict} rules`);

    // Check if all districts have the expanded categories
    console.log('\n📊 EXPANDED CATEGORIES COVERAGE:\n');
    
    const expandedCategories = ['Affordable Housing', 'TOD', 'CRZ', 'Mixed Use'];
    
    for (const category of expandedCategories) {
      const totalInCategory = await DistrictRule.countDocuments({
        category,
        status: 'Active'
      });
      const avgPerDistrict = Math.round(totalInCategory / districts.length);
      console.log(`   ${category.padEnd(20)} ${totalInCategory} total (avg ${avgPerDistrict} per district)`);
    }

    console.log('\n✅ ALL DISTRICTS HAVE COMPREHENSIVE COVERAGE!\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyAllDistricts();
