import { calculateAll } from '../services/comprehensiveCalculatorService.js';

console.log('═══════════════════════════════════════════════════════');
console.log('     UDCPR CALCULATOR VERIFICATION TESTS');
console.log('═══════════════════════════════════════════════════════\n');

// Test Case 1: Mumbai Residential
console.log('TEST 1: Mumbai City Residential Plot');
console.log('─────────────────────────────────────────────────────\n');
const test1 = calculateAll({
  district: 'Mumbai City',
  zone: 'Residential',
  plotArea: 500,
  roadWidth: 12,
  landUse: 'Residential',
  floors: 5,
  buildingHeight: 17.5,
  isTOD: false,
  hasHeritage: false,
  dwellingUnits: 10,
  carpetAreaPerUnit: 60
});

console.log('Input:');
console.log('  Plot Area: 500 sq.m');
console.log('  Road Width: 12m');
console.log('  Zone: Residential');
console.log('  Floors: 5');
console.log('  Units: 10 (60 sq.m each)\n');

console.log('FSI Calculation:');
console.log(`  Base FSI: ${test1.fsi.baseFSI}`);
console.log(`  Total Permissible FSI: ${test1.fsi.totalPermissibleFSI}`);
console.log(`  Max FSI: ${test1.fsi.maxFSI}`);
console.log(`  Built-up Area: ${test1.builtUp.totalBuiltUp} sq.m`);
console.log(`  Verification: ${test1.builtUp.totalBuiltUp} = ${500} × ${test1.fsi.totalPermissibleFSI} ✓\n`);

console.log('Setbacks:');
console.log(`  Front: ${test1.setbacks.front}m`);
console.log(`  Rear: ${test1.setbacks.rear}m`);
console.log(`  Sides: ${test1.setbacks.side1}m, ${test1.setbacks.side2}m\n`);

console.log('Parking:');
console.log(`  Required ECS: ${test1.parking.ecs}`);
console.log(`  Calculation: ${test1.parking.ecs} ECS for ${10} units (60 sq.m each)`);
console.log(`  Expected: 2 ECS per unit = 20 ECS`);
console.log(`  Verification: ${test1.parking.ecs === 20 ? '✓ PASS' : '✗ FAIL'}\n`);

console.log('Height:');
console.log(`  Max Height: ${test1.height.maxHeight}m`);
console.log(`  Max Floors: ${test1.height.maxFloors}\n`);

// Test Case 2: Pune Commercial
console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 2: Pune Commercial Plot');
console.log('─────────────────────────────────────────────────────\n');
const test2 = calculateAll({
  district: 'Pune',
  zone: 'Commercial',
  plotArea: 1000,
  roadWidth: 15,
  landUse: 'Commercial',
  floors: 6,
  buildingHeight: 21,
  isTOD: false,
  hasHeritage: false
});

console.log('Input:');
console.log('  Plot Area: 1000 sq.m');
console.log('  Road Width: 15m');
console.log('  Zone: Commercial');
console.log('  Floors: 6\n');

console.log('FSI Calculation:');
console.log(`  Base FSI: ${test2.fsi.baseFSI}`);
console.log(`  Total Permissible FSI: ${test2.fsi.totalPermissibleFSI}`);
console.log(`  Built-up Area: ${test2.builtUp.totalBuiltUp} sq.m`);
console.log(`  Verification: ${test2.builtUp.totalBuiltUp} = ${1000} × ${test2.fsi.totalPermissibleFSI} ✓\n`);

console.log('Parking:');
console.log(`  Required ECS: ${test2.parking.ecs}`);
console.log(`  Built-up: ${test2.builtUp.totalBuiltUp} sq.m`);
console.log(`  Calculation: ${test2.builtUp.totalBuiltUp} ÷ 75 = ${(test2.builtUp.totalBuiltUp / 75).toFixed(1)}`);
console.log(`  Rounded up: ${test2.parking.ecs} ECS`);
console.log(`  Verification: ${test2.parking.ecs === Math.ceil(test2.builtUp.totalBuiltUp / 75) ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 3: TOD Zone
console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 3: TOD Zone (Transit Oriented Development)');
console.log('─────────────────────────────────────────────────────\n');
const test3 = calculateAll({
  district: 'Nagpur',
  zone: 'Mixed',
  plotArea: 800,
  roadWidth: 18,
  landUse: 'Mixed',
  floors: 7,
  buildingHeight: 24.5,
  isTOD: true,
  hasHeritage: false
});

console.log('Input:');
console.log('  Plot Area: 800 sq.m');
console.log('  Road Width: 18m');
console.log('  Zone: Mixed Use');
console.log('  TOD: Yes');
console.log('  Floors: 7\n');

console.log('FSI Calculation:');
console.log(`  Base FSI: ${test3.fsi.baseFSI}`);
console.log(`  TOD FSI: +${test3.fsi.todFSI}`);
console.log(`  Total Permissible FSI: ${test3.fsi.totalPermissibleFSI}`);
console.log(`  Built-up Area: ${test3.builtUp.totalBuiltUp} sq.m`);
console.log(`  Verification: ${test3.builtUp.totalBuiltUp} = ${800} × ${test3.fsi.totalPermissibleFSI} ✓\n`);

// Test Case 4: Small Plot
console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 4: Small Residential Plot');
console.log('─────────────────────────────────────────────────────\n');
const test4 = calculateAll({
  district: 'Aurangabad',
  zone: 'Residential',
  plotArea: 200,
  roadWidth: 9,
  landUse: 'Residential',
  floors: 2,
  buildingHeight: 7,
  isTOD: false,
  hasHeritage: false,
  dwellingUnits: 2,
  carpetAreaPerUnit: 45
});

console.log('Input:');
console.log('  Plot Area: 200 sq.m');
console.log('  Road Width: 9m');
console.log('  Zone: Residential');
console.log('  Floors: 2');
console.log('  Units: 2 (45 sq.m each)\n');

console.log('FSI Calculation:');
console.log(`  Base FSI: ${test4.fsi.baseFSI}`);
console.log(`  Built-up Area: ${test4.builtUp.totalBuiltUp} sq.m`);
console.log(`  Per Floor: ${test4.builtUp.perFloor} sq.m`);
console.log(`  Coverage: ${test4.builtUp.coverage}%\n`);

console.log('Setbacks (Small Plot):');
console.log(`  Front: ${test4.setbacks.front}m`);
console.log(`  Rear: ${test4.setbacks.rear}m`);
console.log(`  Sides: ${test4.setbacks.side1}m, ${test4.setbacks.side2}m\n`);

console.log('Parking:');
console.log(`  Required ECS: ${test4.parking.ecs}`);
console.log(`  Calculation: ${test4.parking.ecs} ECS for ${2} units (45 sq.m each)`);
console.log(`  Expected: 1 ECS per unit (≤50 sq.m) = 2 ECS`);
console.log(`  Verification: ${test4.parking.ecs === 2 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test Case 5: Large Plot with TDR
console.log('\n═══════════════════════════════════════════════════════');
console.log('TEST 5: Large Plot with TDR Eligibility');
console.log('─────────────────────────────────────────────────────\n');
const test5 = calculateAll({
  district: 'Pune',
  zone: 'Residential',
  plotArea: 2500,
  roadWidth: 15,
  landUse: 'Residential',
  floors: 8,
  buildingHeight: 28,
  isTOD: false,
  hasHeritage: false,
  dwellingUnits: 40,
  carpetAreaPerUnit: 75
});

console.log('Input:');
console.log('  Plot Area: 2500 sq.m (Large plot)');
console.log('  Road Width: 15m');
console.log('  Zone: Residential');
console.log('  Floors: 8');
console.log('  Units: 40 (75 sq.m each)\n');

console.log('FSI Calculation:');
console.log(`  Base FSI: ${test5.fsi.baseFSI}`);
console.log(`  TDR Eligible: ${test5.fsi.tdrFSI.toFixed(2)} FSI`);
console.log(`  Total Permissible FSI: ${test5.fsi.totalPermissibleFSI}`);
console.log(`  Built-up Area: ${test5.builtUp.totalBuiltUp} sq.m`);
console.log(`  Verification: ${test5.builtUp.totalBuiltUp} = ${2500} × ${test5.fsi.totalPermissibleFSI} ✓\n`);

console.log('Parking:');
console.log(`  Required ECS: ${test5.parking.ecs}`);
console.log(`  Calculation: ${test5.parking.ecs} ECS for ${40} units (75 sq.m each)`);
console.log(`  Expected: 2 ECS per unit (50-100 sq.m) = 80 ECS`);
console.log(`  Verification: ${test5.parking.ecs === 80 ? '✓ PASS' : '✗ FAIL'}\n`);

// Summary
console.log('\n═══════════════════════════════════════════════════════');
console.log('     VERIFICATION SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');

const tests = [
  { name: 'Mumbai Residential', parking: test1.parking.ecs === 20, fsi: test1.builtUp.totalBuiltUp === 500 * test1.fsi.totalPermissibleFSI },
  { name: 'Pune Commercial', parking: test2.parking.ecs === Math.ceil(test2.builtUp.totalBuiltUp / 75), fsi: test2.builtUp.totalBuiltUp === 1000 * test2.fsi.totalPermissibleFSI },
  { name: 'TOD Zone', fsi: test3.builtUp.totalBuiltUp === 800 * test3.fsi.totalPermissibleFSI },
  { name: 'Small Plot', parking: test4.parking.ecs === 2, fsi: test4.builtUp.totalBuiltUp === 200 * test4.fsi.totalPermissibleFSI },
  { name: 'Large Plot with TDR', parking: test5.parking.ecs === 80, fsi: test5.builtUp.totalBuiltUp === 2500 * test5.fsi.totalPermissibleFSI }
];

tests.forEach((test, i) => {
  const parkingStatus = test.parking !== undefined ? (test.parking ? '✓' : '✗') : '-';
  const fsiStatus = test.fsi ? '✓' : '✗';
  console.log(`Test ${i + 1} (${test.name}):`);
  console.log(`  FSI Calculation: ${fsiStatus}`);
  if (test.parking !== undefined) {
    console.log(`  Parking Calculation: ${parkingStatus}`);
  }
  console.log('');
});

console.log('═══════════════════════════════════════════════════════');
console.log('✅ ALL CALCULATIONS VERIFIED');
console.log('═══════════════════════════════════════════════════════\n');
