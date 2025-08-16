// Debug the timezone interpolation issue
const SunCalc = require('suncalc');

function debugTimezoneInterpolation() {
  console.log('🐛 Debugging Timezone Interpolation Issue\n');

  // Parse the URL parameters as they would be processed
  const departureDate = '2025-08-15';
  const departureTime = '09:00';  // 9 AM at JFK
  const arrivalDate = '2025-08-15';
  const arrivalTime = '15:20';    // 3:20 PM at LAX

  // Create proper timezone-aware dates
  const departureDateTime = new Date(`${departureDate}T${departureTime}:00-04:00`); // EDT
  const arrivalDateTime = new Date(`${arrivalDate}T${arrivalTime}:00-07:00`);       // PDT

  console.log('Input Times:');
  console.log(`Departure: ${departureDateTime.toISOString()} (${departureDateTime.toLocaleString()})`);
  console.log(`Arrival: ${arrivalDateTime.toISOString()} (${arrivalDateTime.toLocaleString()})`);
  console.log('');

  // Test simple UTC interpolation (what should be used for solar calculations)
  const simpleInterpolation = (progress) => {
    const startMs = departureDateTime.getTime();
    const endMs = arrivalDateTime.getTime();
    return new Date(startMs + (endMs - startMs) * progress);
  };

  // Test points along the flight path
  const testPoints = [
    { name: 'Departure (JFK)', lat: 40.6413, lng: -73.7781, progress: 0 },
    { name: '50% (Kansas)', lat: 38.5, lng: -99.0, progress: 0.5 },
    { name: 'Arrival (LAX)', lat: 33.9416, lng: -118.4085, progress: 1.0 }
  ];

  console.log('Simple UTC Interpolation (CORRECT for solar calculations):');
  testPoints.forEach(point => {
    const utcTime = simpleInterpolation(point.progress);
    const sunPos = SunCalc.getPosition(utcTime, point.lat, point.lng);
    const elevation = sunPos.altitude * (180 / Math.PI);

    console.log(`${point.name}:`);
    console.log(`  UTC Time: ${utcTime.toISOString()}`);
    console.log(`  Local Time: ${utcTime.toLocaleString('en-US', { timeZone: point.lng < -100 ? 'America/Los_Angeles' : point.lng < -87 ? 'America/Chicago' : 'America/New_York' })}`);
    console.log(`  Sun Elevation: ${elevation.toFixed(1)}°`);
    console.log('');
  });

  // Show the problem with timezone-adjusted interpolation
  console.log('Problem: Timezone-Adjusted Interpolation (INCORRECT):');
  testPoints.forEach(point => {
    const utcTime = simpleInterpolation(point.progress);
    
    // Simulate the buggy timezone adjustment
    const timezone = point.lng < -100 ? 'America/Los_Angeles' : 
                    point.lng < -87 ? 'America/Chicago' : 'America/New_York';
    const adjustedTime = new Date(utcTime.toLocaleString('en-US', { timeZone: timezone }));
    
    const sunPos = SunCalc.getPosition(adjustedTime, point.lat, point.lng);
    const elevation = sunPos.altitude * (180 / Math.PI);

    console.log(`${point.name} (with timezone adjustment):`);
    console.log(`  Adjusted Time: ${adjustedTime.toISOString()}`);
    console.log(`  Sun Elevation: ${elevation.toFixed(1)}° (WRONG!)`);
    console.log('');
  });

  console.log('SOLUTION: Use simple UTC interpolation for solar calculations!');
}

debugTimezoneInterpolation();
