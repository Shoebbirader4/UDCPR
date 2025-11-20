import { calculateAll } from '../services/comprehensiveCalculatorService.js';

console.log('═══════════════════════════════════════════════════════');
console.log('     CALCULATOR ISSUE VERIFICATION');
console.log('═══════════════════════════════════════════════════════\n');

// Issue 1: Mumbai City base FSI
console.log('ISSUE 1: Mumbai City Base FSI');
console.log('─────────────────────────────────────────────────────\n');
const issue1 = calculateAll({
  district: 'Mumbai City',
  zone: 'Residential',
  plotArea: 500,
  roadWidth: 9, // Less than 12m to avoid road bonus
  landUse: 'Residential',
  floors: 3,
  buildingHeight: 10.5,
  isTOD: false,
  hasHeritage: false
});

console.log('Expected: Base FSI = 1.33 for Mumbai City Residential');
console.log(`Actual: Base FSI = ${issue1.fsi.baseFSI}`);
console.log(`Status: ${issue1.fsi.baseFSI === 1.33 ? '✓ CORRECT' : '✗ WRONG - Should be 1.33'}\n`);

// Issue 2: Setback calculation making plots unbuildable
console.log('ISSUE 2: Setback Calculation (Unbuildable Plot)');
console.log('─────────────────────────────────────────────────────\n');
const issue2 = calculateAll({
  district: 'Mumbai City',
  zone: 'Residential',
  plotArea: 400, // 20m x 20m plot
  roadWidth: 35, // Wide road
  landUse: 'Residential',
  floors: 5,
  buildingHeight: 17.5,
  isTOD: false,
  hasHeritage: false
});

const totalSetbacks = issue2.setbacks.front + issue2.setbacks.rear;
const assumedPlotDepth = 20; // Assuming 20m x 20m = 400 sq.m
const buildableDepth = assumedPlotDepth - totalSetbacks;

console.log(`Plot Area: 400 sq.m (assumed 20m x 20m)`);
console.log(`Road Width: 35m`);
console.log(`Front Setback: ${issue2.setbacks.front}m`);
console.log(`Rear Setback: ${issue2.setbacks.rear}m`);
console.log(`Total Front+Rear: ${totalSetbacks}m`);
console.log(`Buildable Depth: ${buildableDepth}m`);
console.log(`Status: ${buildableDepth > 0 ? '✓ BUILDABLE' : '✗ UNBUILDABLE'}`);
if (buildableDepth < 5) {
  console.log(`⚠️  WARNING: Only ${buildableDepth}m buildable depth - practically unbuildable!`);
}
console.log('');

// Issue 3: FSI Breakdown (Basic vs Premium)
console.log('ISSUE 3: FSI Breakdown (Basic vs Premium)');
console.log('─────────────────────────────────────────────────────\n');
const issue3 = calculateAll({
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

console.log('Expected: Breakdown showing Basic FSI and Premium FSI separately');
console.log(`Base FSI: ${issue3.fsi.baseFSI}`);
console.log(`Premium FSI Available: ${issue3.fsi.premiumFSI}`);
console.log(`Total Permissible: ${issue3.fsi.totalPermissibleFSI}`);
console.log('');
console.log('What user should see:');
console.log('  - Basic FSI: 1.33 (free)');
console.log('  - Premium FSI: 1.33 (purchasable)');
console.log('  - Total with Premium: 2.66');
console.log('  - Built-up with Basic only: 1330 sq.m');
console.log('  - Built-up with Premium: 2660 sq.m');
console.log('');
console.log(`Status: ${issue3.fsi.premiumFSI > 0 ? '✓ Premium FSI shown' : '✗ Premium FSI not clearly shown'}\n`);

// Issue 4: TDR Calculations
console.log('ISSUE 4: TDR Calculations');
console.log('─────────────────────────────────────────────────────\n');
const issue4 = calculateAll({
  district: 'Pune',
  zone: 'Residential',
  plotArea: 1500,
  roadWidth: 12,
  landUse: 'Residential',
  floors: 6,
  buildingHeight: 21,
  isTOD: false,
  hasHeritage: false
});

console.log(`Plot Area: 1500 sq.m (>1000, eligible for TDR)`);
console.log(`Base FSI: ${issue4.fsi.baseFSI}`);
console.log(`Max FSI: ${issue4.fsi.maxFSI}`);
console.log(`TDR FSI Available: ${issue4.fsi.tdrFSI}`);
console.log('');
console.log('What user should see:');
console.log('  - Current FSI: 1.2');
console.log('  - TDR FSI Available: 0.8');
console.log('  - Built-up with TDR: 3000 sq.m (1500 × 2.0)');
console.log('  - Additional area from TDR: 1200 sq.m');
console.log('');
console.log(`Status: ${issue4.fsi.tdrFSI > 0 ? '✓ TDR shown' : '✗ TDR not shown'}\n`);

// Issue 5: Ancillary Area Calculations
console.log('ISSUE 5: Ancillary Area Provisions');
console.log('─────────────────────────────────────────────────────\n');
const issue5 = calculateAll({
  district: 'Mumbai City',
  zone: 'Residential',
  plotArea: 800,
  roadWidth: 12,
  landUse: 'Residential',
  floors: 6,
  buildingHeight: 21,
  isTOD: false,
  hasHeritage: false,
  dwellingUnits: 16,
  carpetAreaPerUnit: 70
});

const totalBuiltUp = issue5.builtUp.totalBuiltUp;
const ancillaryAllowance = totalBuiltUp * 0.10; // 10% for staircase, lift, etc.

console.log(`Total Built-up Area: ${totalBuiltUp} sq.m`);
console.log('');
console.log('What user should see:');
console.log(`  - Permissible Built-up: ${totalBuiltUp} sq.m`);
console.log(`  - Ancillary Areas (10%): ${ancillaryAllowance.toFixed(0)} sq.m`);
console.log('    • Staircase, lift, lobby');
console.log('    • Mumty, water tanks');
console.log('    • Meter rooms, ducts');
console.log(`  - Total Constructible: ${(totalBuiltUp + ancillaryAllowance).toFixed(0)} sq.m`);
console.log('');
console.log('Status: ✗ Ancillary areas not shown in current calculator\n');

// Summary
console.log('═══════════════════════════════════════════════════════');
console.log('     ISSUES SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');

console.log('1. Mumbai City Base FSI:');
console.log(`   ${issue1.fsi.baseFSI === 1.33 ? '✓ CORRECT (1.33)' : '✗ WRONG'}\n`);

console.log('2. Setback Calculations:');
console.log(`   ${buildableDepth > 5 ? '✓ REASONABLE' : '✗ PROBLEMATIC - Creates unbuildable plots'}\n`);

console.log('3. FSI Breakdown:');
console.log(`   ${issue3.fsi.premiumFSI > 0 ? '⚠️  PARTIAL - Premium FSI exists but breakdown not clear' : '✗ MISSING'}\n`);

console.log('4. TDR Calculations:');
console.log(`   ${issue4.fsi.tdrFSI > 0 ? '⚠️  PARTIAL - TDR shown but not detailed' : '✗ MISSING'}\n`);

console.log('5. Ancillary Areas:');
console.log('   ✗ MISSING - Not calculated\n');

console.log('═══════════════════════════════════════════════════════\n');
