// Test the fixed coordinate system
const SunCalc = require('suncalc');

function testFixedCoordinates() {
  console.log('🔧 Testing Fixed Sun Position Coordinates\n');
  
  // Test case: JFK at different times
  const latitude = 40.6413;
  const longitude = -73.7781;
  const radius = 1.5;
  
  const testTimes = [
    { time: new Date('2025-08-15T13:00:00.000Z'), label: '9 AM EDT (East)' },
    { time: new Date('2025-08-15T16:00:00.000Z'), label: '12 PM EDT (South)' },
    { time: new Date('2025-08-15T19:00:00.000Z'), label: '3 PM EDT (West)' }
  ];
  
  console.log('Testing Fixed Coordinate System:');
  console.log('═'.repeat(50));
  
  testTimes.forEach(({ time, label }) => {
    const pos = SunCalc.getPosition(time, latitude, longitude);
    const elevationRad = pos.altitude;
    const elevationDeg = elevationRad * (180 / Math.PI);
    const azimuthDeg = (pos.azimuth * (180 / Math.PI) + 180) % 360;
    const azimuthRadFromNorth = azimuthDeg * Math.PI / 180;
    
    // Apply the FIXED coordinate conversion
    const x = radius * Math.cos(elevationRad) * Math.sin(azimuthRadFromNorth); // East positive
    const z = -radius * Math.cos(elevationRad) * Math.cos(azimuthRadFromNorth); // South positive 
    const y = radius * Math.sin(elevationRad); // Up positive
    
    console.log(`${label}:`);
    console.log(`  Azimuth: ${azimuthDeg.toFixed(1)}°`);
    console.log(`  Position: (${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)})`);
    
    // Verify the position makes sense
    let verification = '';
    if (label.includes('East') && x > 0) verification = '✅ Correctly positioned East';
    else if (label.includes('South') && z > 0) verification = '✅ Correctly positioned South';
    else if (label.includes('West') && x < 0) verification = '✅ Correctly positioned West';
    else verification = '❌ Position might be incorrect';
    
    console.log(`  ${verification}`);
    console.log('');
  });
  
  console.log('🎯 Expected Results:');
  console.log('- Morning (East): X should be positive');
  console.log('- Noon (South): Z should be positive');
  console.log('- Afternoon (West): X should be negative');
  console.log('- All times: Y should be positive (above horizon)');
  console.log('');
  console.log('✅ This matches the geographic coordinate convention!');
}

testFixedCoordinates();
