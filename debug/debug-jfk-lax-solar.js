// Debug JFK → LAX solar calculations for August 15, 2025
const SunCalc = require('suncalc');

function debugJFKtoLAXSolar() {
  console.log('🌞 Debugging JFK → LAX Solar Calculations for August 15, 2025\n');

  // Flight parameters from URL
  const departure = { lat: 40.6413, lng: -73.7781, timezone: 'America/New_York' }; // JFK
  const arrival = { lat: 33.9416, lng: -118.4085, timezone: 'America/Los_Angeles' }; // LAX
  
  // Times from URL: 09:00 departure, 15:20 arrival (same day)
  const departureTime = new Date('2025-08-15T09:00:00-04:00'); // 9 AM EDT (summer time)
  const arrivalTime = new Date('2025-08-15T15:20:00-07:00');   // 3:20 PM PDT (summer time)
  
  console.log('Flight Details:');
  console.log(`Departure: ${departureTime.toISOString()} (${departureTime.toLocaleString()})`);
  console.log(`Arrival: ${arrivalTime.toISOString()} (${arrivalTime.toLocaleString()})`);
  console.log(`Duration: ${(arrivalTime - departureTime) / (1000 * 60 * 60)} hours\n`);

  // Key points along the flight path
  const flightPath = [
    { name: 'JFK Departure', lat: 40.6413, lng: -73.7781, progress: 0 },
    { name: '25% - Over Ohio', lat: 39.5, lng: -84.5, progress: 0.25 },
    { name: '50% - Over Kansas', lat: 38.5, lng: -99.0, progress: 0.5 },
    { name: '75% - Over Colorado', lat: 39.0, lng: -108.0, progress: 0.75 },
    { name: 'LAX Arrival', lat: 33.9416, lng: -118.4085, progress: 1.0 }
  ];

  const flightDuration = arrivalTime - departureTime;
  
  console.log('Solar Analysis Along Flight Path:');
  flightPath.forEach(point => {
    // Calculate time at this point in the flight
    const timeAtPoint = new Date(departureTime.getTime() + (flightDuration * point.progress));
    
    // Get sun position at this location and time
    const sunPos = SunCalc.getPosition(timeAtPoint, point.lat, point.lng);
    const elevationDeg = sunPos.altitude * (180 / Math.PI);
    const azimuthDeg = (sunPos.azimuth * (180 / Math.PI) + 180) % 360;
    
    // Determine sun condition
    let condition;
    if (elevationDeg > 30) condition = '☀️ High sun (excellent visibility)';
    else if (elevationDeg > 15) condition = '🌤️ Medium sun (good visibility)';
    else if (elevationDeg > 0) condition = '🌅 Low sun (fair visibility)';
    else if (elevationDeg > -6) condition = '🌆 Twilight';
    else condition = '🌙 Night';
    
    console.log(`${point.name}:`);
    console.log(`  Time: ${timeAtPoint.toISOString()} (${timeAtPoint.toLocaleString()})`);
    console.log(`  Position: ${point.lat.toFixed(1)}°, ${point.lng.toFixed(1)}°`);
    console.log(`  Sun Elevation: ${elevationDeg.toFixed(1)}°`);
    console.log(`  Sun Azimuth: ${azimuthDeg.toFixed(1)}°`);
    console.log(`  Condition: ${condition}`);
    console.log('');
  });

  // Expected analysis for summer flight across USA
  console.log('Expected Results for Summer Flight:');
  console.log('- Departure at 9 AM EDT: Sun should be high in the east (~40-50° elevation)');
  console.log('- Midday over central USA: Sun should be near zenith (~60-70° elevation)');
  console.log('- Arrival at 3:20 PM PDT: Sun should be high in the west (~45-55° elevation)');
  console.log('');
  
  // Check specific issue: why is elevation consistently low?
  console.log('Potential Issues:');
  console.log('1. Timezone conversion: Are we using the right local times?');
  console.log('2. Date parsing: Is August 15, 2025 being interpreted correctly?');
  console.log('3. Coordinate system: Are lat/lng correct for SunCalc?');
  console.log('4. Summer vs Winter time: Are we using correct DST offsets?');
  
  // Test with known values
  console.log('\nReference Check - New York at Noon on August 15, 2025:');
  const noonNY = new Date('2025-08-15T12:00:00-04:00'); // Noon EDT
  const noonSun = SunCalc.getPosition(noonNY, 40.7128, -74.0060); // NYC coordinates
  const noonElevation = noonSun.altitude * (180 / Math.PI);
  console.log(`Sun elevation at NYC noon: ${noonElevation.toFixed(1)}° (should be ~65-70°)`);
}

debugJFKtoLAXSolar();
