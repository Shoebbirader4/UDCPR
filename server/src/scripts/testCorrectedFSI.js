import { calculateAll } from '../services/comprehensiveCalculatorService.js';

console.log('═══════════════════════════════════════════════════════');
console.log('     CORRECTED FSI VALUES TEST');
console.log('═══════════════════════════════════════════════════════\n');

// Test Rest of Maharashtra Residential
const test1 = calculateAll({
  district: 'Pune',
  zone: 'Residential',
  plotArea: 1000,
  roadWidth: 12,
  landUse: 'Residential',
  floors: 4,
  buildingHeight: 14,
  isTOD: false,
  hasHeritage: false
});

console.log('TEST 1: Pune Residential (Rest of Maharashtra)');
console.log('─────────────────────────────────────────────────────\n');
console.log(`Basic FSI: ${test1.fsi.basicFSI}`);
console.log(`Road Bonus: +${test1.fsi.roadBonus}`);
console.log(`Base FSI: ${test1.fsi.baseFSI}`);
console.log(`Premium FSI: ${test1.fsi.premiumFSI}`);
console.log(`Max FSI: ${test1.fsi.maxFSI}`);
console.log(`\nBuilt-up Areas:`);
console.log(`  With Basic: ${test1.fsi.builtUpBasic} sq.m`);
console.log(`  With Premium: ${test1.fsi.builtUpWithPremium} sq.m`);
console.log(`\nVerification:`);
console.log(`  ✓ Basic FSI: ${test1.fsi.basicFSI === 1.10 ? '1.10 ✓' : '❌ Wrong'}`);
console.log(`  ✓ Premium FSI: ${test1.fsi.premiumFSI === 0.40 ? '0.40 ✓' : '❌ Wrong'}`);
console.log(`  ✓ Max FSI: ${test1.fsi.maxFSI === 1.5 ? '1.5 ✓' : '❌ Wrong'}`);

// Test Commercial
const test2 = calculateAll({
  district: 'Nagpur',
  zone: 'Commercial',
  plotArea: 1000,
  roadWidth: 15,
  landUse: 'Commercial',
  floors: 6,
  buildingHeight: 21,
  isTOD: false,
  hasHeritage: false
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 2: Nagpur Commercial (Rest of Maharashtra)');
console.log('─────────────────────────────────────────────────────\n');
console.log(`Basic FSI: ${test2.fsi.basicFSI}`);
console.log(`Premium FSI: ${test2.fsi.premiumFSI}`);
console.log(`Max FSI: ${test2.fsi.maxFSI}`);
console.log(`\nVerification:`);
console.log(`  ✓ Basic FSI: ${test2.fsi.basicFSI === 1.5 ? '1.5 ✓' : '❌ Wrong'}`);
console.log(`  ✓ Premium FSI: ${test2.fsi.premiumFSI === 1.0 ? '1.0 ✓' : '❌ Wrong'}`);
console.log(`  ✓ Max FSI: ${test2.fsi.maxFSI === 2.5 ? '2.5 ✓' : '❌ Wrong'}`);

// Test Mixed
const test3 = calculateAll({
  district: 'Aurangabad',
  zone: 'Mixed',
  plotArea: 800,
  roadWidth: 12,
  landUse: 'Mixed',
  floors: 5,
  buildingHeight: 17.5,
  isTOD: false,
  hasHeritage: false
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 3: Aurangabad Mixed (Rest of Maharashtra)');
console.log('─────────────────────────────────────────────────────\n');
console.log(`Basic FSI: ${test3.fsi.basicFSI}`);
console.log(`Premium FSI: ${test3.fsi.premiumFSI}`);
console.log(`Max FSI: ${test3.fsi.maxFSI}`);
console.log(`\nVerification:`);
console.log(`  ✓ Basic FSI: ${test3.fsi.basicFSI === 1.2 ? '1.2 ✓' : '❌ Wrong'}`);
console.log(`  ✓ Premium FSI: ${test3.fsi.premiumFSI === 0.8 ? '0.8 ✓' : '❌ Wrong'}`);
console.log(`  ✓ Max FSI: ${test3.fsi.maxFSI === 2.0 ? '2.0 ✓' : '❌ Wrong'}`);

// Test Mumbai City (should remain unchanged)
const test4 = calculateAll({
  district: 'Mumbai City',
  zone: 'Residential',
  plotArea: 1000,
  roadWidth: 12,
  landUse: 'Residential',
  floors: 7,
  buildingHeight: 24,
  isTOD: false,
  hasHeritage: false
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 4: Mumbai City Residential (Should be unchanged)');
console.log('─────────────────────────────────────────────────────\n');
console.log(`Basic FSI: ${test4.fsi.basicFSI}`);
console.log(`Premium FSI: ${test4.fsi.premiumFSI}`);
console.log(`Max FSI: ${test4.fsi.maxFSI}`);
console.log(`\nVerification:`);
console.log(`  ✓ Basic FSI: ${test4.fsi.basicFSI === 1.33 ? '1.33 ✓' : '❌ Wrong'}`);
console.log(`  ✓ Premium FSI: ${test4.fsi.premiumFSI === 1.33 ? '1.33 ✓' : '❌ Wrong'}`);
console.log(`  ✓ Max FSI: ${test4.fsi.maxFSI === 3.0 ? '3.0 ✓' : '❌ Wrong'}`);

console.log('\n═══════════════════════════════════════════════════════');
console.log('SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');

const allCorrect = 
  test1.fsi.basicFSI === 1.10 && test1.fsi.premiumFSI === 0.40 && test1.fsi.maxFSI === 1.5 &&
  test2.fsi.basicFSI === 1.5 && test2.fsi.premiumFSI === 1.0 && test2.fsi.maxFSI === 2.5 &&
  test3.fsi.basicFSI === 1.2 && test3.fsi.premiumFSI === 0.8 && test3.fsi.maxFSI === 2.0 &&
  test4.fsi.basicFSI === 1.33 && test4.fsi.premiumFSI === 1.33 && test4.fsi.maxFSI === 3.0;

if (allCorrect) {
  console.log('✅ ALL FSI VALUES CORRECTED ACCORDING TO UDCPR 2020');
  console.log('\nRest of Maharashtra:');
  console.log('  ✓ Residential: 1.10 (Base) + 0.40 (Premium) = Max 1.5');
  console.log('  ✓ Commercial: 1.5 (Base) + 1.0 (Premium) = Max 2.5');
  console.log('  ✓ Mixed: 1.2 (Base) + 0.8 (Premium) = Max 2.0');
  console.log('\nMumbai City:');
  console.log('  ✓ Residential: 1.33 (Base) + 1.33 (Premium) = Max 3.0');
} else {
  console.log('❌ SOME VALUES STILL INCORRECT');
}

console.log('\n═══════════════════════════════════════════════════════\n');
