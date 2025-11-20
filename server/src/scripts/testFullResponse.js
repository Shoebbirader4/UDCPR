import { calculateAll } from '../services/comprehensiveCalculatorService.js';

console.log('Testing Full API Response\n');

const params = {
  district: 'Pune',
  zone: 'Mixed',
  plotArea: 370,
  roadWidth: 35,
  landUse: 'Mixed',
  floors: 4,
  buildingHeight: 14,
  isTOD: false,
  hasHeritage: false
};

const result = calculateAll(params);

console.log('=== SETBACKS ===');
console.log(`Front: ${result.setbacks.front}m`);
console.log(`Rear: ${result.setbacks.rear}m`);
console.log(`Sides: ${result.setbacks.side1}m, ${result.setbacks.side2}m\n`);

console.log('=== ANCILLARY AREAS ===');
if (result.ancillary) {
  console.log(`✓ Ancillary object exists`);
  console.log(`  Staircase & Lift: ${result.ancillary.staircaseLift} sq.m`);
  console.log(`  Mumty: ${result.ancillary.mumty} sq.m`);
  console.log(`  Water Tanks: ${result.ancillary.waterTanks} sq.m`);
  console.log(`  Services: ${result.ancillary.services} sq.m`);
  console.log(`  Total Ancillary: ${result.ancillary.totalAncillary} sq.m`);
  console.log(`  Total Constructible: ${result.ancillary.totalConstructible} sq.m`);
  console.log(`  Calculations: ${result.ancillary.calculations?.length} items`);
} else {
  console.log(`✗ Ancillary object missing!`);
}

console.log('\n=== SUMMARY ===');
console.log(`Total Constructible: ${result.summary.totalConstructible} sq.m`);
console.log(`Ancillary Area: ${result.summary.ancillaryArea} sq.m`);

console.log('\n=== FSI BREAKDOWN ===');
console.log(`Basic FSI: ${result.fsi.basicFSI}`);
console.log(`Road Bonus: ${result.fsi.roadBonus}`);
console.log(`Base FSI: ${result.fsi.baseFSI}`);
console.log(`Premium FSI: ${result.fsi.premiumFSI}`);
console.log(`Built-up Basic: ${result.fsi.builtUpBasic} sq.m`);
console.log(`Built-up with Premium: ${result.fsi.builtUpWithPremium} sq.m`);
