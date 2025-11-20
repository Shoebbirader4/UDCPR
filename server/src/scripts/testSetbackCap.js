import { calculateAll } from '../services/comprehensiveCalculatorService.js';

console.log('Testing Setback Cap\n');

// Test with 35m road (should cap at 6m)
const test1 = calculateAll({
  district: 'Pune',
  zone: 'Mixed',
  plotArea: 370,
  roadWidth: 35,
  landUse: 'Mixed',
  floors: 4,
  buildingHeight: 14,
  isTOD: false,
  hasHeritage: false
});

console.log('Test 1: 35m Road Width');
console.log(`Road Width: 35m`);
console.log(`Front Setback: ${test1.setbacks.front}m`);
console.log(`Expected: 6m (capped)`);
console.log(`Status: ${test1.setbacks.front <= 6 ? '✓ PASS' : '✗ FAIL - Not capped!'}\n`);

// Test with 12m road (should be normal)
const test2 = calculateAll({
  district: 'Pune',
  zone: 'Mixed',
  plotArea: 370,
  roadWidth: 12,
  landUse: 'Mixed',
  floors: 4,
  buildingHeight: 14,
  isTOD: false,
  hasHeritage: false
});

console.log('Test 2: 12m Road Width');
console.log(`Road Width: 12m`);
console.log(`Front Setback: ${test2.setbacks.front}m`);
console.log(`Expected: 3.6m (12 * 0.3)`);
console.log(`Status: ${test2.setbacks.front === 3.6 ? '✓ PASS' : '✗ FAIL'}\n`);

// Check the notes
console.log('Setback Notes:');
test1.setbacks.notes.forEach(note => console.log(`  - ${note}`));
