// Test sun positioning in 3D coordinates to debug sphere visualization
const SunCalc = require('suncalc');

function testSunPositioning() {
  console.log('🌍 Testing Sun 3D Positioning Logic\n');
  
  // Test case: JFK at noon on a clear day (should be high and south)
  const testDate = new Date('2025-08-15T16:00:00.000Z'); // 12:00 noon EDT
  const latitude = 40.6413;  // JFK
  const longitude = -73.7781;
  
  console.log('Test Parameters:');
  console.log(`Date: ${testDate.toISOString()} (12:00 noon EDT)`);
  console.log(`Location: JFK (${latitude}°N, ${longitude}°W)`);
  console.log('');
  
  // Get raw SunCalc data
  const sunCalc = SunCalc.getPosition(testDate, latitude, longitude);
  const elevationDeg = sunCalc.altitude * (180 / Math.PI);
  const azimuthDeg = (sunCalc.azimuth * (180 / Math.PI) + 180) % 360;
  
  console.log('Raw SunCalc Output:');
  console.log(`Elevation: ${elevationDeg.toFixed(1)}° (${elevationDeg > 0 ? 'above horizon' : 'below horizon'})`);
  console.log(`Azimuth: ${azimuthDeg.toFixed(1)}° (0°=North, 90°=East, 180°=South, 270°=West)`);
  console.log('');
  
  // Expected: At noon in Northern Hemisphere, sun should be:
  // - High elevation (40-70° depending on season)
  // - South-facing azimuth (around 180°)
  
  // Convert to 3D coordinates using the same logic as the component
  const radius = 1.5;
  const elevationRad = sunCalc.altitude;
  const azimuthRad = sunCalc.azimuth;
  
  // Component's coordinate conversion
  const x = radius * Math.cos(elevationRad) * Math.cos(azimuthRad);
  const z = radius * Math.cos(elevationRad) * Math.sin(azimuthRad);
  const y = radius * Math.sin(elevationRad);
  
  console.log('3D Coordinates (Component Logic):');
  console.log(`X: ${x.toFixed(3)} (East/West axis)`);
  console.log(`Y: ${y.toFixed(3)} (Up/Down axis - should be positive for above horizon)`);
  console.log(`Z: ${z.toFixed(3)} (North/South axis)`);
  console.log('');
  
  // Verify the coordinate system makes sense
  console.log('Coordinate System Analysis:');
  console.log(`Y=${y.toFixed(3)} should be positive (sun above horizon): ${y > 0 ? '✅' : '❌'}`);
  
  // Check azimuth interpretation
  if (azimuthDeg > 135 && azimuthDeg < 225) {
    console.log(`Azimuth ${azimuthDeg.toFixed(1)}° indicates South: ✅`);
    console.log(`Z=${z.toFixed(3)} should be positive for South: ${z > 0 ? '✅' : '❌'}`);
  } else {
    console.log(`Azimuth ${azimuthDeg.toFixed(1)}° is not South: ⚠️`);
  }
  
  // Distance from center (should be close to radius)
  const distance = Math.sqrt(x*x + y*y + z*z);
  console.log(`Distance from center: ${distance.toFixed(3)} (should be ~${radius}): ${Math.abs(distance - radius) < 0.01 ? '✅' : '❌'}`);
  console.log('');
  
  // Test different times to see movement pattern
  console.log('Sun Movement Throughout Day:');
  console.log('═'.repeat(50));
  
  const times = [
    { hour: 6, label: '6 AM (Sunrise)' },
    { hour: 9, label: '9 AM (Morning)' },
    { hour: 12, label: '12 PM (Noon)' },
    { hour: 15, label: '3 PM (Afternoon)' },
    { hour: 18, label: '6 PM (Sunset)' }
  ];
  
  times.forEach(time => {
    const testTime = new Date('2025-08-15T00:00:00.000Z');
    testTime.setUTCHours(time.hour + 4); // Convert EDT to UTC
    
    const pos = SunCalc.getPosition(testTime, latitude, longitude);
    const elev = pos.altitude * (180 / Math.PI);
    const azim = (pos.azimuth * (180 / Math.PI) + 180) % 360;
    
    // Convert to 3D
    const sunX = radius * Math.cos(pos.altitude) * Math.cos(pos.azimuth);
    const sunZ = radius * Math.cos(pos.altitude) * Math.sin(pos.azimuth);
    const sunY = radius * Math.sin(pos.altitude);
    
    let direction = '';
    if (azim < 45 || azim > 315) direction = 'N';
    else if (azim < 135) direction = 'E';
    else if (azim < 225) direction = 'S';
    else direction = 'W';
    
    console.log(`${time.label}:`);
    console.log(`  Elevation: ${elev.toFixed(1)}°, Azimuth: ${azim.toFixed(1)}° (${direction})`);
    console.log(`  3D Position: (${sunX.toFixed(2)}, ${sunY.toFixed(2)}, ${sunZ.toFixed(2)})`);
    console.log('');
  });
  
  console.log('🎯 Diagnosis:');
  console.log('─'.repeat(50));
  
  // Common issues in 3D sun positioning:
  console.log('Potential Issues to Check:');
  console.log('1. Coordinate System Handedness (Right vs Left handed)');
  console.log('2. Azimuth Reference Direction (North vs South vs East)');
  console.log('3. Camera Orientation (Up vector, look direction)');
  console.log('4. Map Bearing Rotation (could cause apparent sun movement)');
  console.log('5. Scene Group Rotation (0.2 radian tilt might affect perception)');
  console.log('');
  
  console.log('Expected Behavior:');
  console.log('- At noon, sun should be high (positive Y) and south (positive Z)');
  console.log('- As time progresses, sun should move from east (positive X) to west (negative X)');
  console.log('- Sun elevation should peak at solar noon and decrease toward sunrise/sunset');
  console.log('- When map rotates, sun should stay fixed relative to ground, not relative to screen');
}

testSunPositioning();
