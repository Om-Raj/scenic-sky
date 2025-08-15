const SunCalc = require('suncalc');

// Test at JFK around noon local time (UTC-4 in summer)
const testDate = new Date('2025-08-15T16:00:00Z'); // 12:00 PM EDT (UTC-4)
const testLat = 40.6413; // JFK latitude
const testLng = -73.7781; // JFK longitude

console.log('=== SunCalc Test ===');
console.log('Date:', testDate.toISOString());
console.log('Location: JFK (', testLat, ',', testLng, ')');
console.log();

const pos = SunCalc.getPosition(testDate, testLat, testLng);
console.log('Raw SunCalc output:');
console.log('  altitude (elevation):', pos.altitude, 'rad =', (pos.altitude * 180/Math.PI).toFixed(1), 'deg');
console.log('  azimuth:', pos.azimuth, 'rad =', (pos.azimuth * 180/Math.PI).toFixed(1), 'deg');
console.log();

console.log('Current conversion in code:');
const azDeg = (pos.azimuth * 180/Math.PI + 180) % 360;
console.log('  azDeg = (azimuth * 180/PI + 180) % 360 =', azDeg.toFixed(1));
console.log();

console.log('Expected behavior:');
console.log('  - At noon, sun should be roughly south in Northern Hemisphere');
console.log('  - South = 180° in standard compass (North=0°, East=90°, South=180°, West=270°)');
console.log('  - SunCalc azimuth is measured from SOUTH, ranging from -π to +π');
console.log('  - Negative azimuth = east of south, Positive azimuth = west of south');

// Test a few more times
console.log('\n=== Additional Tests ===');
const times = [
  { hour: 6, label: 'sunrise' },
  { hour: 12, label: 'noon' },  
  { hour: 18, label: 'sunset' }
];

times.forEach(({hour, label}) => {
  const testTime = new Date('2025-08-15T' + hour.toString().padStart(2, '0') + ':00:00-04:00');
  const p = SunCalc.getPosition(testTime, testLat, testLng);
  const converted = (p.azimuth * 180/Math.PI + 180) % 360;
  console.log(`${label} (${hour}:00 EDT): azimuth=${(p.azimuth * 180/Math.PI).toFixed(1)}° → converted=${converted.toFixed(1)}°`);
});
