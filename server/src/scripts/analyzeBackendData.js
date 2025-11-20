import { calculateAll } from '../services/comprehensiveCalculatorService.js';

console.log('═══════════════════════════════════════════════════════');
console.log('     BACKEND DATA ANALYSIS');
console.log('═══════════════════════════════════════════════════════\n');

const result = calculateAll({
  district: 'Mumbai City',
  zone: 'Residential',
  plotArea: 1000,
  roadWidth: 12,
  landUse: 'Residential',
  floors: 7,
  buildingHeight: 24,
  isTOD: false,
  hasHeritage: false,
  dwellingUnits: 20,
  carpetAreaPerUnit: 75
});

console.log('AVAILABLE DATA STRUCTURE:\n');

console.log('1. FSI Object:');
Object.keys(result.fsi).forEach(key => {
  console.log(`   - ${key}: ${typeof result.fsi[key]} ${Array.isArray(result.fsi[key]) ? `(${result.fsi[key].length} items)` : ''}`);
});

console.log('\n2. Setbacks Object:');
Object.keys(result.setbacks).forEach(key => {
  console.log(`   - ${key}: ${typeof result.setbacks[key]} ${Array.isArray(result.setbacks[key]) ? `(${result.setbacks[key].length} items)` : ''}`);
});

console.log('\n3. Height Object:');
Object.keys(result.height).forEach(key => {
  console.log(`   - ${key}: ${typeof result.height[key]} ${Array.isArray(result.height[key]) ? `(${result.height[key].length} items)` : ''}`);
});

console.log('\n4. Built-up Object:');
Object.keys(result.builtUp).forEach(key => {
  console.log(`   - ${key}: ${typeof result.builtUp[key]} ${Array.isArray(result.builtUp[key]) ? `(${result.builtUp[key].length} items)` : ''}`);
});

console.log('\n5. Parking Object:');
Object.keys(result.parking).forEach(key => {
  console.log(`   - ${key}: ${typeof result.parking[key]} ${Array.isArray(result.parking[key]) ? `(${result.parking[key].length} items)` : ''}`);
});

console.log('\n6. Ancillary Object:');
Object.keys(result.ancillary).forEach(key => {
  console.log(`   - ${key}: ${typeof result.ancillary[key]} ${Array.isArray(result.ancillary[key]) ? `(${result.ancillary[key].length} items)` : ''}`);
});

console.log('\n7. Summary Object:');
Object.keys(result.summary).forEach(key => {
  console.log(`   - ${key}: ${typeof result.summary[key]}`);
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('DETAILED VALUES:\n');

console.log('FSI Details:');
console.log(`  basicFSI: ${result.fsi.basicFSI}`);
console.log(`  roadBonus: ${result.fsi.roadBonus}`);
console.log(`  baseFSI: ${result.fsi.baseFSI}`);
console.log(`  premiumFSI: ${result.fsi.premiumFSI}`);
console.log(`  tdrFSI: ${result.fsi.tdrFSI}`);
console.log(`  todFSI: ${result.fsi.todFSI}`);
console.log(`  totalPermissibleFSI: ${result.fsi.totalPermissibleFSI}`);
console.log(`  maxFSI: ${result.fsi.maxFSI}`);
console.log(`  builtUpBasic: ${result.fsi.builtUpBasic}`);
console.log(`  builtUpWithPremium: ${result.fsi.builtUpWithPremium}`);
console.log(`  builtUpWithTDR: ${result.fsi.builtUpWithTDR}`);
console.log(`  calculations: ${result.fsi.calculations.length} items`);
console.log(`  notes: ${result.fsi.notes.length} items`);

console.log('\nHeight Details:');
console.log(`  maxHeight: ${result.height.maxHeight}m`);
console.log(`  maxFloors: ${result.height.maxFloors}`);
console.log(`  floorHeight: ${result.height.floorHeight}m`);
console.log(`  notes: ${result.height.notes.length} items`);

console.log('\nBuilt-up Details:');
console.log(`  totalBuiltUp: ${result.builtUp.totalBuiltUp} sq.m`);
console.log(`  perFloor: ${result.builtUp.perFloor} sq.m`);
console.log(`  coverage: ${result.builtUp.coverage}%`);
console.log(`  notes: ${result.builtUp.notes.length} items`);

console.log('\n═══════════════════════════════════════════════════════');
console.log('WHAT FRONTEND SHOULD DISPLAY:\n');

console.log('✅ Currently Displayed:');
console.log('  - Summary cards (5)');
console.log('  - FSI breakdown card');
console.log('  - Setbacks card');
console.log('  - Parking card');
console.log('  - Height & Built-up card');
console.log('  - FSI comparison table (if premium/TDR)');
console.log('  - Ancillary areas card');

console.log('\n⚠️  Missing/Could Be Enhanced:');
console.log('  - Floor height (3.5m standard)');
console.log('  - Coverage percentage visualization');
console.log('  - Per floor area breakdown');
console.log('  - Detailed height notes');
console.log('  - Visual FSI chart/graph');
console.log('  - Setback diagram/visualization');
console.log('  - Cost estimation (optional)');
console.log('  - Export to PDF (optional)');

console.log('\n═══════════════════════════════════════════════════════\n');
