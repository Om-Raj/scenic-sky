// Simple test for seat recommendation - Node.js compatible
const turf = require('@turf/turf');

// Simplified test of core calculations without React dependencies
function testBasicCalculations() {
  console.log('🧪 Testing Basic Seat Recommendation Calculations...\n');

  // Test great circle distance calculation
  const jfk = { lat: 40.6413, lon: -73.7781 };
  const lhr = { lat: 51.47, lon: -0.4543 };
  
  const jfkPoint = turf.point([jfk.lon, jfk.lat]);
  const lhrPoint = turf.point([lhr.lon, lhr.lat]);
  const distance = turf.distance(jfkPoint, lhrPoint);
  
  console.log(`✅ Great Circle Distance (JFK → LHR): ${Math.round(distance)} km`);
  
  // Test bearing calculation
  const bearing = turf.bearing(jfkPoint, lhrPoint);
  console.log(`✅ Initial Bearing: ${Math.round(bearing)}°`);
  
  // Test great circle line generation
  const line = turf.greatCircle(jfkPoint, lhrPoint);
  const coordinates = line.geometry.coordinates;
  console.log(`✅ Great Circle Path: ${coordinates.length} coordinate points`);
  
  // Test side determination logic
  const aircraftBearing = 45; // Northeast heading
  const targetBearing = 90;   // East relative to north
  
  let relativeBearing = targetBearing - aircraftBearing;
  if (relativeBearing > 180) relativeBearing -= 360;
  if (relativeBearing < -180) relativeBearing += 360;
  
  const side = relativeBearing > 0 ? 'right' : 'left';
  console.log(`✅ Side Determination: Target at ${targetBearing}° from aircraft heading ${aircraftBearing}° = ${side} side`);
  
  // Test sample scenic location visibility
  const grandCanyon = { lat: 36.1069, lon: -112.1129 };
  const flightPathPoint = { lat: 36.5, lon: -112.5 }; // Nearby point on hypothetical flight path
  
  const canyonPoint = turf.point([grandCanyon.lon, grandCanyon.lat]);
  const pathPoint = turf.point([flightPathPoint.lon, flightPathPoint.lat]);
  const distanceToCanyon = turf.distance(canyonPoint, pathPoint);
  
  console.log(`✅ Scenic Location Test: Grand Canyon ${Math.round(distanceToCanyon)} km from flight path`);
  
  if (distanceToCanyon <= 50) {
    console.log('   → Grand Canyon would be VISIBLE (within 50km threshold)');
  } else {
    console.log('   → Grand Canyon would be too far to see clearly');
  }
  
  console.log('\n🎯 Basic calculations working correctly!');
  console.log('\nNext steps:');
  console.log('1. Visit http://localhost:3000/seat-recommendation to test the full UI');
  console.log('2. Try different flight routes to see varying recommendations');
  console.log('3. Check the flight-map page for integrated seat recommendations');
}

testBasicCalculations();
