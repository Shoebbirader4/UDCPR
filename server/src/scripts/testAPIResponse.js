import { calculateAll } from '../services/comprehensiveCalculatorService.js';

console.log('Testing API Response Structure\n');

const params = {
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
};

const result = calculateAll(params);

console.log('Checking required fields:\n');

// Check FSI fields
console.log('FSI Fields:');
console.log(`  ✓ basicFSI: ${result.fsi.basicFSI !== undefined ? '✓' : '✗'} (${result.fsi.basicFSI})`);
console.log(`  ✓ baseFSI: ${result.fsi.baseFSI !== undefined ? '✓' : '✗'} (${result.fsi.baseFSI})`);
console.log(`  ✓ roadBonus: ${result.fsi.roadBonus !== undefined ? '✓' : '✗'} (${result.fsi.roadBonus})`);
console.log(`  ✓ premiumFSI: ${result.fsi.premiumFSI !== undefined ? '✓' : '✗'} (${result.fsi.premiumFSI})`);
console.log(`  ✓ tdrFSI: ${result.fsi.tdrFSI !== undefined ? '✓' : '✗'} (${result.fsi.tdrFSI})`);
console.log(`  ✓ builtUpBasic: ${result.fsi.builtUpBasic !== undefined ? '✓' : '✗'} (${result.fsi.builtUpBasic})`);
console.log(`  ✓ builtUpWithPremium: ${result.fsi.builtUpWithPremium !== undefined ? '✓' : '✗'} (${result.fsi.builtUpWithPremium})`);
console.log(`  ✓ builtUpWithTDR: ${result.fsi.builtUpWithTDR !== undefined ? '✓' : '✗'} (${result.fsi.builtUpWithTDR})`);
console.log('');

// Check Ancillary fields
console.log('Ancillary Fields:');
console.log(`  ✓ ancillary exists: ${result.ancillary !== undefined ? '✓' : '✗'}`);
if (result.ancillary) {
  console.log(`  ✓ staircaseLift: ${result.ancillary.staircaseLift !== undefined ? '✓' : '✗'} (${result.ancillary.staircaseLift})`);
  console.log(`  ✓ mumty: ${result.ancillary.mumty !== undefined ? '✓' : '✗'} (${result.ancillary.mumty})`);
  console.log(`  ✓ waterTanks: ${result.ancillary.waterTanks !== undefined ? '✓' : '✗'} (${result.ancillary.waterTanks})`);
  console.log(`  ✓ services: ${result.ancillary.services !== undefined ? '✓' : '✗'} (${result.ancillary.services})`);
  console.log(`  ✓ totalAncillary: ${result.ancillary.totalAncillary !== undefined ? '✓' : '✗'} (${result.ancillary.totalAncillary})`);
  console.log(`  ✓ totalConstructible: ${result.ancillary.totalConstructible !== undefined ? '✓' : '✗'} (${result.ancillary.totalConstructible})`);
  console.log(`  ✓ calculations: ${result.ancillary.calculations !== undefined ? '✓' : '✗'} (${result.ancillary.calculations?.length} items)`);
  console.log(`  ✓ notes: ${result.ancillary.notes !== undefined ? '✓' : '✗'} (${result.ancillary.notes?.length} items)`);
}
console.log('');

// Check Summary fields
console.log('Summary Fields:');
console.log(`  ✓ totalConstructible: ${result.summary.totalConstructible !== undefined ? '✓' : '✗'} (${result.summary.totalConstructible})`);
console.log(`  ✓ ancillaryArea: ${result.summary.ancillaryArea !== undefined ? '✓' : '✗'} (${result.summary.ancillaryArea})`);
console.log('');

// Full JSON structure
console.log('Full Response Structure:');
console.log(JSON.stringify(result, null, 2));
