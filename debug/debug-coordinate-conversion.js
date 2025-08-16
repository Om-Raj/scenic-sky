// Test different coordinate conversion approaches for SunCalc
const SunCalc = require('suncalc');

function testCoordinateConversions() {
  console.log('🔄 Testing Different Coordinate Conversion Approaches\n');
  
  // Test case: JFK at noon (should be high and south)
  const testDate = new Date('2025-08-15T16:00:00.000Z'); // 12:00 noon EDT
  const latitude = 40.6413;
  const longitude = -73.7781;
  const radius = 1.5;
  
  const sunCalc = SunCalc.getPosition(testDate, latitude, longitude);
  const elevationRad = sunCalc.altitude;
  const azimuthRad = sunCalc.azimuth;
  const elevationDeg = elevationRad * (180 / Math.PI);
  const azimuthDeg = (azimuthRad * (180 / Math.PI) + 180) % 360;
  
  console.log('Base Data:');
  console.log(`Elevation: ${elevationDeg.toFixed(1)}°`);
  console.log(`Azimuth: ${azimuthDeg.toFixed(1)}° (should be ~150° for South at noon)`);
  console.log(`Raw SunCalc azimuth: ${(azimuthRad * 180 / Math.PI).toFixed(1)}°`);
  console.log('');
  
  // Test different conversion approaches
  console.log('Coordinate Conversion Tests:');
  console.log('═'.repeat(60));
  
  // Approach 1: Current implementation
  const x1 = radius * Math.cos(elevationRad) * Math.cos(azimuthRad);
  const z1 = radius * Math.cos(elevationRad) * Math.sin(azimuthRad);
  const y1 = radius * Math.sin(elevationRad);
  
  console.log('1. Current Implementation:');
  console.log(`   x=${x1.toFixed(3)}, y=${y1.toFixed(3)}, z=${z1.toFixed(3)}`);
  console.log(`   Problem: Z=${z1.toFixed(3)} is negative for South`);
  console.log('');
  
  // Approach 2: Standard spherical coordinates (azimuth from North, clockwise)
  // In this system: x=East, y=Up, z=North
  // For South, we want positive z (but SunCalc might use different convention)
  const azimuthFromNorth = azimuthRad; // SunCalc: South = positive, North = negative
  const x2 = radius * Math.cos(elevationRad) * Math.sin(azimuthFromNorth);  // East
  const z2 = radius * Math.cos(elevationRad) * Math.cos(azimuthFromNorth);  // North
  const y2 = radius * Math.sin(elevationRad);  // Up
  
  console.log('2. Standard Spherical (x=East, z=North):');
  console.log(`   x=${x2.toFixed(3)}, y=${y2.toFixed(3)}, z=${z2.toFixed(3)}`);
  console.log(`   Note: Z=${z2.toFixed(3)} is for North direction`);
  console.log('');
  
  // Approach 3: Adjusted for SunCalc's coordinate system
  // SunCalc azimuth: 0 = North, π/2 = East, π = South, 3π/2 = West
  // But raw values might be -π to π, so need to check
  const adjustedAzimuth = azimuthRad + Math.PI; // Shift by π to correct orientation
  const x3 = radius * Math.cos(elevationRad) * Math.sin(adjustedAzimuth);
  const z3 = radius * Math.cos(elevationRad) * Math.cos(adjustedAzimuth);
  const y3 = radius * Math.sin(elevationRad);
  
  console.log('3. Adjusted Azimuth (+π shift):');
  console.log(`   x=${x3.toFixed(3)}, y=${y3.toFixed(3)}, z=${z3.toFixed(3)}`);
  console.log('');
  
  // Approach 4: Direct degree-based conversion with proper orientation
  // Convert to degrees and use standard geographic convention
  const azimuthDegFromNorth = azimuthDeg;
  const azimuthRadFromNorth = azimuthDegFromNorth * Math.PI / 180;
  
  // x = East/West (positive East), z = North/South (positive South for viewer)
  const x4 = radius * Math.cos(elevationRad) * Math.sin(azimuthRadFromNorth);
  const z4 = -radius * Math.cos(elevationRad) * Math.cos(azimuthRadFromNorth); // Negative for South
  const y4 = radius * Math.sin(elevationRad);
  
  console.log('4. Geographic Convention (positive South):');
  console.log(`   x=${x4.toFixed(3)}, y=${y4.toFixed(3)}, z=${z4.toFixed(3)}`);
  console.log(`   For azimuth ${azimuthDeg.toFixed(1)}° (South), z should be positive: ${z4 > 0 ? '✅' : '❌'}`);
  console.log('');
  
  // Approach 5: Three.js standard (Y-up, Z-forward as North)
  // In Three.js: x=East, y=Up, z=North (viewer looking down negative z)
  // For South view, we want negative z
  const x5 = radius * Math.cos(elevationRad) * Math.sin(azimuthRadFromNorth);
  const z5 = radius * Math.cos(elevationRad) * Math.cos(azimuthRadFromNorth);
  const y5 = radius * Math.sin(elevationRad);
  
  console.log('5. Three.js Convention (Z=North):');
  console.log(`   x=${x5.toFixed(3)}, y=${y5.toFixed(3)}, z=${z5.toFixed(3)}`);
  console.log(`   For azimuth ${azimuthDeg.toFixed(1)}° (South), z should be negative: ${z5 < 0 ? '✅' : '❌'}`);
  console.log('');
  
  // Test the movement pattern with corrected approach
  console.log('Testing Daily Movement with Corrected Coordinates:');
  console.log('═'.repeat(60));
  
  const times = [
    { hour: 9, label: '9 AM (East)' },
    { hour: 12, label: '12 PM (South)' },
    { hour: 15, label: '3 PM (West)' }
  ];
  
  times.forEach(time => {
    const testTime = new Date('2025-08-15T00:00:00.000Z');
    testTime.setUTCHours(time.hour + 4); // Convert EDT to UTC
    
    const pos = SunCalc.getPosition(testTime, latitude, longitude);
    const elev = pos.altitude * (180 / Math.PI);
    const azim = (pos.azimuth * (180 / Math.PI) + 180) % 360;
    const azimRad = azim * Math.PI / 180;
    
    // Use corrected approach
    const sunX = radius * Math.cos(pos.altitude) * Math.sin(azimRad);
    const sunZ = -radius * Math.cos(pos.altitude) * Math.cos(azimRad); // Negative for South
    const sunY = radius * Math.sin(pos.altitude);
    
    let expectedDirection = '';
    if (time.hour === 9) expectedDirection = 'x should be positive (East)';
    else if (time.hour === 12) expectedDirection = 'z should be positive (South)';
    else if (time.hour === 15) expectedDirection = 'x should be negative (West)';
    
    console.log(`${time.label} (Az: ${azim.toFixed(1)}°):`);
    console.log(`   Position: (${sunX.toFixed(3)}, ${sunY.toFixed(3)}, ${sunZ.toFixed(3)})`);
    console.log(`   Expected: ${expectedDirection}`);
    console.log(`   ✅ Correct: ${
      (time.hour === 9 && sunX > 0) ||
      (time.hour === 12 && sunZ > 0) ||
      (time.hour === 15 && sunX < 0) ? 'YES' : 'NO'
    }`);
    console.log('');
  });
  
  console.log('🎯 Recommended Fix:');
  console.log('Use approach #4 or #5 with proper azimuth conversion');
  console.log('Key changes needed in the component:');
  console.log('1. Convert azimuth properly for Three.js coordinate system');
  console.log('2. Ensure South appears as positive Z (or negative Z for Three.js)');
  console.log('3. Test that sun moves East→South→West as expected');
}

testCoordinateConversions();
