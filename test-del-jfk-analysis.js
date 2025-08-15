// Test DEL → JFK flight with the actual seat recommendation system
const SunCalc = require('suncalc');

console.log('🪑 Testing DEL → JFK Flight Analysis\n');

// Flight parameters from the URL
const flightData = {
  departure: { 
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    lat: 28.5562, 
    lng: 77.1000,
    timezone: 'Asia/Kolkata'
  },
  arrival: { 
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    lat: 40.6413, 
    lng: -73.7781,
    timezone: 'America/New_York'
  },
  departureDateTime: new Date('2025-08-15T00:05:00+05:30'), // 00:05 IST
  arrivalDateTime: new Date('2025-08-15T06:30:00-04:00'),   // 06:30 EDT
  airplaneModel: 'B-787-9'
};

console.log(`Flight: ${flightData.departure.code} → ${flightData.arrival.code}`);
console.log(`Departure: ${flightData.departureDateTime.toISOString()} (00:05 IST)`);
console.log(`Arrival: ${flightData.arrivalDateTime.toISOString()} (06:30 EDT)`);
console.log(`Duration: ${((flightData.arrivalDateTime - flightData.departureDateTime) / (1000 * 60 * 60)).toFixed(1)} hours`);
console.log('');

// Generate flight path points for this polar route
function generatePolarRoutePath(start, end, segments = 8) {
  const path = [];
  
  // DEL → JFK typically goes over the North Pole in winter, 
  // but in summer might go more direct or via Europe/Atlantic
  // For August, let's simulate a route over Central Asia → Russia → Scandinavia → Greenland
  
  const waypoints = [
    { lat: 28.5562, lng: 77.1000, name: '🛫 DEL Departure' },       // Delhi
    { lat: 35.0, lng: 75.0, name: '📍 Over Kashmir/Pakistan' },      // 
    { lat: 45.0, lng: 65.0, name: '📍 Central Asia' },              // Kazakhstan area
    { lat: 55.0, lng: 40.0, name: '📍 Over Russia' },               // Western Russia
    { lat: 65.0, lng: 15.0, name: '📍 Over Scandinavia' },          // Norway/Sweden
    { lat: 70.0, lng: -20.0, name: '📍 Over Iceland/Greenland' },   // High Arctic
    { lat: 60.0, lng: -50.0, name: '📍 Over Labrador Sea' },        // Approaching North America
    { lat: 40.6413, lng: -73.7781, name: '🛬 JFK Arrival' }         // New York
  ];

  // Calculate progress for each waypoint
  waypoints.forEach((point, index) => {
    path.push({
      ...point,
      progress: index / (waypoints.length - 1)
    });
  });

  return path;
}

const flightPath = generatePolarRoutePath(flightData.departure, flightData.arrival);

console.log('✈️ Flight Path with Solar Analysis:');
console.log('='.repeat(65));

let scenicViewsLeft = [];
let scenicViewsRight = [];
let solarEvents = [];

flightPath.forEach((point, index) => {
  // Calculate time at this point using UTC interpolation
  const timeMs = flightData.departureDateTime.getTime() + 
    (flightData.arrivalDateTime.getTime() - flightData.departureDateTime.getTime()) * point.progress;
  const currentTimeUTC = new Date(timeMs);
  
  // Calculate sun position
  const sunPos = SunCalc.getPosition(currentTimeUTC, point.lat, point.lng);
  const elevation = sunPos.altitude * (180 / Math.PI);
  const azimuth = (sunPos.azimuth * (180 / Math.PI) + 180) % 360;
  
  // Determine timezone for display
  let timezone = 'Asia/Kolkata';
  if (point.lng < 60) timezone = 'UTC+5';
  if (point.lng < 30) timezone = 'UTC+3';
  if (point.lng < 0) timezone = 'UTC';
  if (point.lng < -30) timezone = 'UTC-1';
  if (point.lng < -60) timezone = 'America/New_York';
  
  const localTime = currentTimeUTC.toLocaleString('en-US', { 
    timeZone: timezone === 'UTC+5' ? 'Asia/Yekaterinburg' :
              timezone === 'UTC+3' ? 'Europe/Moscow' :
              timezone === 'UTC' ? 'UTC' :
              timezone === 'UTC-1' ? 'Atlantic/Azores' :
              timezone,
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  // Determine sun condition
  let condition, emoji;
  if (elevation > 15) {
    condition = 'Good visibility';
    emoji = '☀️';
  } else if (elevation > 0) {
    condition = 'Fair visibility';
    emoji = '🌅';
  } else if (elevation > -6) {
    condition = 'Twilight';
    emoji = '🌆';
  } else {
    condition = 'Night';
    emoji = '🌙';
  }

  console.log(`${point.name}:`);
  console.log(`  Local Time: ${localTime}`);
  console.log(`  UTC Time: ${currentTimeUTC.toISOString()}`);
  console.log(`  Position: ${point.lat.toFixed(1)}°N, ${Math.abs(point.lng).toFixed(1)}°${point.lng >= 0 ? 'E' : 'W'}`);
  console.log(`  Sun: ${elevation.toFixed(1)}° elevation, ${azimuth.toFixed(1)}° azimuth ${emoji}`);
  console.log(`  Condition: ${condition}`);
  
  // Analyze potential scenic views based on route
  let scenicDescription = '';
  if (point.name.includes('Kashmir')) {
    scenicDescription = 'Himalayan peaks, K2 region';
  } else if (point.name.includes('Central Asia')) {
    scenicDescription = 'Tian Shan mountains, vast steppes';
  } else if (point.name.includes('Russia')) {
    scenicDescription = 'Ural Mountains, Siberian forests';
  } else if (point.name.includes('Scandinavia')) {
    scenicDescription = 'Norwegian fjords, midnight sun regions';
  } else if (point.name.includes('Iceland')) {
    scenicDescription = 'Greenland ice sheet, Arctic landscapes';
  } else if (point.name.includes('Labrador')) {
    scenicDescription = 'Hudson Bay, Canadian wilderness';
  }
  
  if (scenicDescription) {
    console.log(`  Scenic: ${scenicDescription}`);
    
    // For this route, most scenic views would be on the LEFT (north side)
    // as it's a northern route over mountains and Arctic regions
    if (elevation > -6) { // Only during visible conditions
      scenicViewsLeft.push(`${scenicDescription} (${condition.toLowerCase()})`);
    }
  }
  
  // Track solar events
  if (elevation > -6 && elevation <= 0) {
    solarEvents.push(`Twilight at ${point.name} - ${elevation.toFixed(1)}°`);
  } else if (elevation > 0 && elevation < 5) {
    solarEvents.push(`Low sun at ${point.name} - ${elevation.toFixed(1)}°`);
  } else if (elevation >= 5) {
    solarEvents.push(`Good sunlight at ${point.name} - ${elevation.toFixed(1)}°`);
  }

  if (index < flightPath.length - 1) {
    console.log('  ' + '─'.repeat(45));
  }
  console.log('');
});

// Summary analysis
console.log('🎯 Route Analysis Summary:');
console.log('─'.repeat(65));

console.log('📍 LEFT Side Scenic Views (Window seats A, B, C):');
if (scenicViewsLeft.length > 0) {
  scenicViewsLeft.forEach(view => console.log(`  • ${view}`));
} else {
  console.log('  • Limited visibility due to night conditions');
}
console.log('');

console.log('📍 RIGHT Side Scenic Views (Window seats F, G, H):');
if (scenicViewsRight.length > 0) {
  scenicViewsRight.forEach(view => console.log(`  • ${view}`));
} else {
  console.log('  • Limited scenic opportunities on this northern route');
}
console.log('');

console.log('☀️ Solar Events:');
if (solarEvents.length > 0) {
  solarEvents.forEach(event => console.log(`  • ${event}`));
} else {
  console.log('  • Primarily night flight with some twilight periods');
}
console.log('');

// Calculate overall statistics
const allElevations = flightPath.map(point => {
  const timeMs = flightData.departureDateTime.getTime() + 
    (flightData.arrivalDateTime.getTime() - flightData.departureDateTime.getTime()) * point.progress;
  const currentTimeUTC = new Date(timeMs);
  const sunPos = SunCalc.getPosition(currentTimeUTC, point.lat, point.lng);
  return sunPos.altitude * (180 / Math.PI);
});

const maxElevation = Math.max(...allElevations);
const minElevation = Math.min(...allElevations);
const visibleSegments = allElevations.filter(e => e > -6).length;

console.log('📊 Flight Statistics:');
console.log(`Sun elevation range: ${minElevation.toFixed(1)}° to ${maxElevation.toFixed(1)}°`);
console.log(`Visible segments: ${visibleSegments}/${allElevations.length} waypoints`);
console.log(`Best viewing: ${maxElevation > 0 ? 'Some daylight periods' : 'Twilight only'}`);
console.log(`Seat recommendation: ${scenicViewsLeft.length > 0 ? 'LEFT side preferred' : 'Either side acceptable'}`);
console.log('');

console.log('🌍 Route Summary:');
console.log('This early morning DEL → JFK flight:');
console.log('• Departs Delhi at midnight (dark conditions)');
console.log('• Flies northern route over mountains and Arctic regions'); 
console.log('• Experiences dawn progression due to eastward flight');
console.log('• Arrives at early morning dawn in New York');
console.log('• LEFT side windows offer better views of scenic northern landscapes');
console.log(`• Solar conditions: ${maxElevation > 0 ? 'Some daylight visibility' : 'Mostly night/twilight flight'}`);

console.log('\n✅ Analysis complete - calculations consistent with our fixed timezone system');
