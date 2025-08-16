const SunCalc = require('suncalc');

// Test with DEL to JFK flight data 
// DEL coordinates: 28.5562, 77.1000
// JFK coordinates: 40.6413, -73.7781

// Let's test at DEL at departure time and JFK at arrival time
console.log('=== DEL to JFK Flight Test ===');

// Test at DEL (Delhi) at noon local time
const delhiDate = new Date('2025-08-15T12:00:00+05:30'); // IST timezone
const delhiLat = 28.5562;
const delhiLng = 77.1000;

console.log('\n--- Delhi at noon local time ---');
console.log('Date:', delhiDate.toISOString());
console.log('Location: DEL (', delhiLat, ',', delhiLng, ')');

const delhiPos = SunCalc.getPosition(delhiDate, delhiLat, delhiLng);
const delhiAzDeg = (delhiPos.azimuth * 180/Math.PI + 180) % 360;
console.log('Sun elevation:', (delhiPos.altitude * 180/Math.PI).toFixed(1), 'degrees');
console.log('Sun azimuth:', delhiAzDeg.toFixed(1), 'degrees from North');

// At Delhi in summer at noon, sun should be roughly north of south (it's close to Tropic of Cancer)

// Test at JFK evening arrival
const jfkDate = new Date('2025-08-15T23:00:00-04:00'); // EDT timezone  
const jfkLat = 40.6413;
const jfkLng = -73.7781;

console.log('\n--- JFK at 11 PM local time ---');
console.log('Date:', jfkDate.toISOString());
console.log('Location: JFK (', jfkLat, ',', jfkLng, ')');

const jfkPos = SunCalc.getPosition(jfkDate, jfkLat, jfkLng);
const jfkAzDeg = (jfkPos.azimuth * 180/Math.PI + 180) % 360;
console.log('Sun elevation:', (jfkPos.altitude * 180/Math.PI).toFixed(1), 'degrees');
console.log('Sun azimuth:', jfkAzDeg.toFixed(1), 'degrees from North');

// At JFK at 11 PM, sun should be well below horizon (negative elevation)

console.log('\n=== Analysis ===');
console.log('Delhi noon: Sun high in sky, should be roughly south');
console.log('JFK 11 PM: Sun below horizon, should not be visible');
console.log('If sun appears on wrong side, check if coordinates/time are being passed correctly');
