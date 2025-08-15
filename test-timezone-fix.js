// Test the timezone fix

function createDateTimeInTimezone(date, time, timezone) {
  const isoString = `${date}T${time}:00`;
  const tempDate = new Date(isoString);
  
  const timezoneOffsets = {
    'America/New_York': -4, // EDT in summer
    'America/Los_Angeles': -7, // PDT in summer  
    'Europe/London': 1, // BST in summer
    'Asia/Kolkata': 5.5, // IST (no DST)
    'Asia/Dubai': 4, // GST (no DST)
  };
  
  const offsetHours = timezoneOffsets[timezone] || 0;
  const offsetMs = offsetHours * 60 * 60 * 1000;
  
  return new Date(tempDate.getTime() - offsetMs);
}

console.log('=== Timezone Fix Test ===');

// Test DEL to JFK flight
const departure = createDateTimeInTimezone('2025-08-15', '12:00', 'Asia/Kolkata');
const arrival = createDateTimeInTimezone('2025-08-15', '23:00', 'America/New_York');

console.log('DEL departure 12:00 IST:', departure.toISOString());
console.log('JFK arrival 23:00 EDT:', arrival.toISOString());

// Calculate duration
const durationHours = (arrival.getTime() - departure.getTime()) / (1000 * 60 * 60);
console.log('Flight duration:', durationHours.toFixed(1), 'hours');

// Test midpoint
function interpolateDateTime(start, end, progress) {
  const startMs = start.getTime();
  const endMs = end.getTime();
  const currentMs = startMs + (endMs - startMs) * progress;
  return new Date(currentMs);
}

const midpoint = interpolateDateTime(departure, arrival, 0.5);
console.log('Midpoint time:', midpoint.toISOString());

console.log('\n=== Solar Calculation Test ===');
const SunCalc = require('suncalc');

// Test at DEL coordinates at corrected departure time
const delhiPos = SunCalc.getPosition(departure, 28.5562, 77.1);
const delhiAzDeg = (delhiPos.azimuth * 180/Math.PI + 180) % 360;
console.log('DEL at 12:00 IST:');
console.log('  Elevation:', (delhiPos.altitude * 180/Math.PI).toFixed(1), '°');
console.log('  Azimuth:', delhiAzDeg.toFixed(1), '° from North');

// Test at JFK coordinates at corrected arrival time  
const jfkPos = SunCalc.getPosition(arrival, 40.6413, -73.7781);
const jfkAzDeg = (jfkPos.azimuth * 180/Math.PI + 180) % 360;
console.log('JFK at 23:00 EDT:');
console.log('  Elevation:', (jfkPos.altitude * 180/Math.PI).toFixed(1), '°');
console.log('  Azimuth:', jfkAzDeg.toFixed(1), '° from North');
