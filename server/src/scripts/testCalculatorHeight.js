import { calculateHeight } from '../services/comprehensiveCalculatorService.js';

console.log('🧪 Testing Height Calculation\n');

// Test case: 6 floors in Rest of Maharashtra Residential
const test1 = {
  district: 'Pune',
  zone: 'Residential',
  plotArea: 500,
  roadWidth: 12,
  floors: 6,
  buildingHeight: 0
};

console.log('Test 1: 6 floors in Pune Residential');
console.log('Input:', test1);
const result1 = calculateHeight(test1);
console.log('Result:', result1);
console.log('');

// Test case: 6 floors in Mumbai
const test2 = {
  district: 'Mumbai City',
  zone: 'Residential',
  plotArea: 500,
  roadWidth: 12,
  floors: 6,
  buildingHeight: 0
};

console.log('Test 2: 6 floors in Mumbai City Residential');
console.log('Input:', test2);
const result2 = calculateHeight(test2);
console.log('Result:', result2);
console.log('');

// Test case: No floors specified
const test3 = {
  district: 'Pune',
  zone: 'Residential',
  plotArea: 500,
  roadWidth: 12,
  floors: 0,
  buildingHeight: 0
};

console.log('Test 3: No floors specified');
console.log('Input:', test3);
const result3 = calculateHeight(test3);
console.log('Result:', result3);
