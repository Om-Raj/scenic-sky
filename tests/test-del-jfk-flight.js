// Test DEL → JFK early morning flight solar calculations
const SunCalc = require('suncalc');

function testDELtoJFKFlight() {
  console.log('✈️ Testing DEL → JFK Early Morning Flight Solar Calculations\n');

  // Flight parameters from URL
  const departure = { lat: 28.5562, lng: 77.1000, timezone: 'Asia/Kolkata' }; // DEL
  const arrival = { lat: 40.6413, lng: -73.7781, timezone: 'America/New_York' }; // JFK
  
  // Times from URL: 00:05 departure, 06:30 arrival (same day)
  const departureTime = new Date('2025-08-15T00:05:00+05:30'); // 12:05 AM IST
  const arrivalTime = new Date('2025-08-15T06:30:00-04:00');   // 6:30 AM EDT

  console.log('Flight Details:');
  console.log(`Departure: DEL at 00:05 IST (${departureTime.toISOString()})`);
  console.log(`Arrival: JFK at 06:30 EDT (${arrivalTime.toISOString()})`);
  console.log(`Duration: ${((arrivalTime - departureTime) / (1000 * 60 * 60)).toFixed(1)} hours\n`);

  // Key points along the typical DEL → JFK flight path (over polar route)
  const flightPath = [
    { name: '🛫 DEL Departure', lat: 28.5562, lng: 77.1000, progress: 0.00 },
    { name: '20% Over Central Asia', lat: 45.0, lng: 65.0, progress: 0.20 },
    { name: '40% Over Russia', lat: 60.0, lng: 40.0, progress: 0.40 },
    { name: '60% Over Scandinavia', lat: 65.0, lng: 15.0, progress: 0.60 },
    { name: '80% Over Greenland', lat: 70.0, lng: -40.0, progress: 0.80 },
    { name: '🛬 JFK Arrival', lat: 40.6413, lng: -73.7781, progress: 1.00 }
  ];

  const flightDuration = arrivalTime - departureTime;
  
  console.log('☀️ Solar Analysis for Early Morning Polar Route:');
  console.log('='.repeat(65));

  flightPath.forEach((point, index) => {
    // Use simple UTC interpolation (the FIXED approach)
    const startMs = departureTime.getTime();
    const endMs = arrivalTime.getTime();
    const currentTimeUTC = new Date(startMs + (endMs - startMs) * point.progress);
    
    // Calculate sun position using UTC time
    const sunPos = SunCalc.getPosition(currentTimeUTC, point.lat, point.lng);
    const elevationDeg = sunPos.altitude * (180 / Math.PI);
    const azimuthDeg = (sunPos.azimuth * (180 / Math.PI) + 180) % 360;
    
    // Determine appropriate timezone for display
    let timezone = 'Asia/Kolkata';  // IST
    if (point.lng < 60) timezone = 'Asia/Yekaterinburg';  // UTC+5
    if (point.lng < 30) timezone = 'Europe/Moscow';       // UTC+3
    if (point.lng < 0) timezone = 'UTC';                  // UTC
    if (point.lng < -30) timezone = 'America/Godthab';    // Greenland
    if (point.lng < -60) timezone = 'America/New_York';   // EDT
    
    const localTime = currentTimeUTC.toLocaleString('en-US', { 
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Categorize sun condition (accounting for polar summer)
    let condition, emoji;
    if (elevationDeg > 30) {
      condition = 'High sun - Excellent visibility';
      emoji = '☀️';
    } else if (elevationDeg > 15) {
      condition = 'Medium sun - Good visibility';
      emoji = '🌤️';
    } else if (elevationDeg > 0) {
      condition = 'Low sun - Fair visibility';
      emoji = '🌅';
    } else if (elevationDeg > -6) {
      condition = 'Twilight - Poor visibility';
      emoji = '🌆';
    } else if (elevationDeg > -18) {
      condition = 'Civil twilight';
      emoji = '🌙';
    } else {
      condition = 'Night - No visibility';
      emoji = '🌙';
    }

    console.log(`${point.name}:`);
    console.log(`  Local Time: ${localTime}`);
    console.log(`  UTC Time: ${currentTimeUTC.toISOString()}`);
    console.log(`  Position: ${point.lat.toFixed(1)}°N, ${point.lng > 0 ? point.lng.toFixed(1) + '°E' : Math.abs(point.lng).toFixed(1) + '°W'}`);
    console.log(`  Sun Elevation: ${elevationDeg.toFixed(1)}° ${emoji}`);
    console.log(`  Sun Azimuth: ${azimuthDeg.toFixed(1)}°`);
    console.log(`  Condition: ${condition}`);
    
    if (index < flightPath.length - 1) {
      console.log('  ' + '─'.repeat(45));
    }
    console.log('');
  });

  // Analysis for this specific route
  console.log('🎯 Route Analysis:');
  console.log('─'.repeat(65));
  console.log('This is an early morning polar route flight:');
  console.log('- Departure at midnight from Delhi (dark)');
  console.log('- Flies through polar summer regions (potential for midnight sun)');
  console.log('- Arrives at dawn in New York (sunrise)');
  console.log('- Expected: Mix of night, twilight, and early dawn conditions');
  console.log('');
  
  // Check if calculations are reasonable for this route
  const allElevations = flightPath.map(point => {
    const startMs = departureTime.getTime();
    const endMs = arrivalTime.getTime();
    const currentTimeUTC = new Date(startMs + (endMs - startMs) * point.progress);
    const sunPos = SunCalc.getPosition(currentTimeUTC, point.lat, point.lng);
    return sunPos.altitude * (180 / Math.PI);
  });

  const minElevation = Math.min(...allElevations);
  const maxElevation = Math.max(...allElevations);
  const avgElevation = allElevations.reduce((a, b) => a + b, 0) / allElevations.length;

  console.log('📊 Elevation Statistics:');
  console.log(`Range: ${minElevation.toFixed(1)}° to ${maxElevation.toFixed(1)}°`);
  console.log(`Average: ${avgElevation.toFixed(1)}°`);
  console.log(`Status: ${maxElevation > -18 ? '✅ Some daylight/twilight periods' : '❌ Complete darkness'}`);
  console.log('');
  
  console.log('Expected for August polar route:');
  console.log('- High latitudes (60-70°N) may have extended daylight');
  console.log('- Midnight sun effects possible in Arctic regions');
  console.log('- Sun elevation should be higher than typical winter flights');
}

testDELtoJFKFlight();
