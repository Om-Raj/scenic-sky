// Test coordinate system mapping
const DEG2RAD = Math.PI / 180;

function testCoordinateMapping(azDeg, elevDeg, label) {
  const azRad = azDeg * DEG2RAD;
  const elevRad = elevDeg * DEG2RAD;
  const radius = 1.5;
  
  // Current mapping in the code
  const x = radius * Math.cos(elevRad) * Math.sin(azRad); // East-West
  const z = -radius * Math.cos(elevRad) * Math.cos(azRad); // North-South (negative Z = North)
  const y = radius * Math.sin(elevRad); // Up-Down
  
  console.log(`${label} (az=${azDeg}°, el=${elevDeg}°): x=${x.toFixed(2)}, y=${y.toFixed(2)}, z=${z.toFixed(2)}`);
  
  // Expected positions:
  // North (0°): should be at (0, y, -radius) - negative Z
  // East (90°): should be at (+radius, y, 0) - positive X
  // South (180°): should be at (0, y, +radius) - positive Z  
  // West (270°): should be at (-radius, y, 0) - negative X
}

console.log('=== Coordinate System Test (elevation = 45°) ===');
testCoordinateMapping(0, 45, 'North');
testCoordinateMapping(90, 45, 'East');
testCoordinateMapping(180, 45, 'South');
testCoordinateMapping(270, 45, 'West');

console.log('\n=== Expected vs Actual ===');
console.log('Expected North (0°): x=0, z=-radius (negative Z)');
console.log('Expected East (90°): x=+radius, z=0 (positive X)');
console.log('Expected South (180°): x=0, z=+radius (positive Z)');  
console.log('Expected West (270°): x=-radius, z=0 (negative X)');
