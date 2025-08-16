// Test solar event calculations for JFK → LHR night flight
const SunCalc = require('suncalc');

function testSolarCalculations() {
  console.log('🌅 Testing Solar Event Calculations...\n');

  // JFK → LHR Night Flight (22:00 → 10:00+1)
  const departureLat = 40.6413; // JFK
  const departureLon = -73.7781;
  const arrivalLat = 51.47; // LHR  
  const arrivalLon = -0.4543;

  // Test flight times with corrected winter timezones
  const departureTime = new Date('2024-12-15T22:00:00-05:00'); // 10 PM EST (winter)
  const arrivalTime = new Date('2024-12-16T10:00:00+00:00');   // 10 AM GMT (winter)

  console.log('Flight Details:');
  console.log(`Departure: ${departureTime.toISOString()} (${departureTime.toLocaleString()})`);
  console.log(`Arrival: ${arrivalTime.toISOString()} (${arrivalTime.toLocaleString()})`);
  console.log(`Duration: ${(arrivalTime - departureTime) / (1000 * 60 * 60)} hours\n`);

  // Test sun positions at key points along the great circle route
  const testPoints = [
    { name: 'Departure (JFK)', time: departureTime, lat: departureLat, lon: departureLon },
    { name: '25% - Eastern Atlantic', time: new Date(departureTime.getTime() + 1.75 * 60 * 60 * 1000), lat: 45, lon: -50 },
    { name: '50% - Mid-Atlantic', time: new Date(departureTime.getTime() + 3.5 * 60 * 60 * 1000), lat: 48, lon: -30 },
    { name: '75% - Western Europe', time: new Date(departureTime.getTime() + 5.25 * 60 * 60 * 1000), lat: 50, lon: -10 },
    { name: 'Arrival (LHR)', time: arrivalTime, lat: arrivalLat, lon: arrivalLon }
  ];

  testPoints.forEach((point, index) => {
    const sunPos = SunCalc.getPosition(point.time, point.lat, point.lon);
    const elevation = sunPos.altitude * (180 / Math.PI);
    const azimuth = (sunPos.azimuth * (180 / Math.PI) + 180) % 360; // Convert to 0-360

    console.log(`${point.name}:`);
    console.log(`  Time: ${point.time.toISOString()} (${point.time.toLocaleString()})`);
    console.log(`  Location: ${point.lat.toFixed(1)}°, ${point.lon.toFixed(1)}°`);
    console.log(`  Sun Elevation: ${elevation.toFixed(1)}°`);
    console.log(`  Sun Azimuth: ${azimuth.toFixed(1)}°`);
    
    if (elevation > 6) {
      console.log(`  ☀️ Daylight (bright)`);
    } else if (elevation > 0) {
      console.log(`  🌅 Golden hour`);
    } else if (elevation > -6) {
      console.log(`  🌌 Blue hour (twilight)`);
    } else if (elevation > -18) {
      console.log(`  🌙 Night (civil twilight)`);
    } else {
      console.log(`  🌙 Deep night`);
    }
    
    // Check for sunrise/sunset transitions
    if (index > 0) {
      const prevPoint = testPoints[index - 1];
      const prevSunPos = SunCalc.getPosition(prevPoint.time, prevPoint.lat, prevPoint.lon);
      const prevElevation = prevSunPos.altitude * (180 / Math.PI);
      
      if (prevElevation < -0.833 && elevation > -0.833) {
        console.log(`  🌅 SUNRISE DETECTED between ${prevPoint.name} and ${point.name}!`);
      }
      if (prevElevation > -0.833 && elevation < -0.833) {
        console.log(`  🌇 SUNSET DETECTED between ${prevPoint.name} and ${point.name}!`);
      }
    }
    console.log('');
  });

  // Expected results for this night flight:
  console.log('Expected Results:');
  console.log('- Departure at JFK: Night time (sun well below horizon)');
  console.log('- Mid-Atlantic: Still night or early dawn');
  console.log('- Arrival at LHR: Morning daylight (sun above horizon)');
  console.log('- Should detect sunrise somewhere over the Atlantic');
}

testSolarCalculations();
