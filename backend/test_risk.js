const { calculateRiskScore } = require('./riskScoring');

const testCases = [
  {
    name: 'Low Risk Scenario (Dry winter day in plain/foothill)',
    inputs: { temperature: 20, humidity: 30, precipitation: 5, soilMoisture: 15, elevation: 350 },
    expectedBand: 'LOW'
  },
  {
    name: 'Moderate Risk Scenario (Moderate rain in mid-altitude)',
    inputs: { temperature: 22, humidity: 65, precipitation: 55, soilMoisture: 45, elevation: 1100 },
    expectedBand: 'MODERATE'
  },
  {
    name: 'High Risk Scenario (Stitch example: East Khasi Hills / Mawsynram)',
    inputs: { temperature: 28.5, humidity: 82, precipitation: 120, soilMoisture: 85, elevation: 1650 },
    expectedBand: 'HIGH'
  },
  {
    name: 'Severe Risk Scenario (Monsoon downpour in high ridge pass)',
    inputs: { temperature: 13, humidity: 95, precipitation: 190, soilMoisture: 95, elevation: 2600 },
    expectedBand: 'SEVERE'
  }
];

console.log('=== NER-LEWS RISK SCORING VALIDATION TEST ===\n');

let allPassed = true;
testCases.forEach((tc, idx) => {
  const result = calculateRiskScore(tc.inputs);
  const passed = result.band === tc.expectedBand;
  console.log(`Test #${idx + 1}: ${tc.name}`);
  console.log(`Inputs:`, JSON.stringify(tc.inputs));
  console.log(`Result: Score=${result.score}, Band=${result.band} (${result.bandLabel})`);
  console.log(`Advisory: "${result.advisoryText}"`);
  console.log(`Formula: ${result.formulaSummary}`);
  console.log(`Status: ${passed ? '✅ PASSED' : '❌ FAILED'}\n`);
  if (!passed) allPassed = false;
});

if (allPassed) {
  console.log('🎉 ALL RISK SCORING TESTS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
