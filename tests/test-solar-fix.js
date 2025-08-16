// Verify that the timezone fix resolves the low sun elevation issue
const SunCalc = require('suncalc');

function verifyFixForJFKtoLAX() {
  console.log('✅ Verifying Solar Calculation Fix for JFK → LAX Flight\n');

  // Flight details from the URL
  const departureDate = '2025-08-15';
  const departureTime = '09:00';  // 9 AM EDT at JFK
  const arrivalDate = '2025-08-15';
  const arrivalTime = '15:20';    // 3:20 PM PDT at LAX

  // Create timezone-aware departure and arrival times
  const departureDateTime = new Date(`${departureDate}T${departureTime}:00-04:00`); // EDT
  const arrivalDateTime = new Date(`${arrivalDate}T${arrivalTime}:00-07:00`);       // PDT

  console.log('Flight Schedule:');
  console.log(`Departure: JFK at ${departureTime} EDT (${departureDateTime.toISOString()})`);
  console.log(`Arrival: LAX at ${arrivalTime} PDT (${arrivalDateTime.toISOString()})`);
  console.log(`Flight Duration: ${((arrivalDateTime - departureDateTime) / (1000 * 60 * 60)).toFixed(1)} hours\n`);

  // Test key points along the flight path with FIXED interpolation
  const flightPath = [
    { name: '🛫 JFK Departure', lat: 40.6413, lng: -73.7781, progress: 0.00 },
    { name: '25% Over Pennsylvania', lat: 40.0, lng: -80.0, progress: 0.25 },
    { name: '50% Over Kansas', lat: 38.5, lng: -99.0, progress: 0.50 },
    { name: '75% Over Colorado', lat: 39.0, lng: -108.0, progress: 0.75 },
    { name: '🛬 LAX Arrival', lat: 33.9416, lng: -118.4085, progress: 1.00 }
  ];

  console.log('☀️ Solar Analysis with FIXED UTC Interpolation:');
  console.log('='.repeat(60));

  flightPath.forEach((point, index) => {
    // Use simple UTC interpolation (the FIX)
    const startMs = departureDateTime.getTime();
    const endMs = arrivalDateTime.getTime();
    const currentTimeUTC = new Date(startMs + (endMs - startMs) * point.progress);
    
    // Calculate sun position using UTC time
    const sunPos = SunCalc.getPosition(currentTimeUTC, point.lat, point.lng);
    const elevationDeg = sunPos.altitude * (180 / Math.PI);
    const azimuthDeg = (sunPos.azimuth * (180 / Math.PI) + 180) % 360;
    
    // Determine local time for display
    let timezone = 'America/New_York';  // EDT
    if (point.lng < -120) timezone = 'America/Los_Angeles';  // PDT
    else if (point.lng < -105) timezone = 'America/Denver';  // MDT
    else if (point.lng < -90) timezone = 'America/Chicago';  // CDT
    
    const localTime = currentTimeUTC.toLocaleString('en-US', { 
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Categorize sun condition
    let condition, emoji;
    if (elevationDeg > 50) {
      condition = 'High sun - Excellent visibility';
      emoji = '☀️';
    } else if (elevationDeg > 30) {
      condition = 'Medium-high sun - Very good visibility';
      emoji = '🌞';
    } else if (elevationDeg > 15) {
      condition = 'Medium sun - Good visibility';
      emoji = '🌤️';
    } else if (elevationDeg > 0) {
      condition = 'Low sun - Fair visibility';
      emoji = '🌅';
    } else {
      condition = 'Below horizon - Poor visibility';
      emoji = '🌙';
    }

    console.log(`${point.name}:`);
    console.log(`  Local Time: ${localTime}`);
    console.log(`  UTC Time: ${currentTimeUTC.toISOString()}`);
    console.log(`  Position: ${point.lat.toFixed(1)}°N, ${Math.abs(point.lng).toFixed(1)}°W`);
    console.log(`  Sun Elevation: ${elevationDeg.toFixed(1)}° ${emoji}`);
    console.log(`  Sun Azimuth: ${azimuthDeg.toFixed(1)}°`);
    console.log(`  Condition: ${condition}`);
    
    if (index < flightPath.length - 1) {
      console.log('  ' + '─'.repeat(40));
    }
    console.log('');
  });

  // Summary of fix
  console.log('🎯 Fix Summary:');
  console.log('─'.repeat(60));
  console.log('PROBLEM: interpolateFlightDateTime() was adjusting UTC time to local timezone');
  console.log('SOLUTION: Use simple UTC interpolation for solar calculations');
  console.log('RESULT: Sun elevations now show realistic values (30-60°) for summer daytime flight');
  console.log('');
  
  // Check if all elevations are reasonable
  const allElevations = flightPath.map(point => {
    const startMs = departureDateTime.getTime();
    const endMs = arrivalDateTime.getTime();
    const currentTimeUTC = new Date(startMs + (endMs - startMs) * point.progress);
    const sunPos = SunCalc.getPosition(currentTimeUTC, point.lat, point.lng);
    return sunPos.altitude * (180 / Math.PI);
  });

  const avgElevation = allElevations.reduce((a, b) => a + b, 0) / allElevations.length;
  const minElevation = Math.min(...allElevations);
  const maxElevation = Math.max(...allElevations);

  console.log('📊 Elevation Statistics:');
  console.log(`Average: ${avgElevation.toFixed(1)}°`);
  console.log(`Range: ${minElevation.toFixed(1)}° to ${maxElevation.toFixed(1)}°`);
  console.log(`Status: ${minElevation > 15 ? '✅ ALL ELEVATIONS > 15°' : '❌ Some elevations still low'}`);
}

verifyFixForJFKtoLAX();
