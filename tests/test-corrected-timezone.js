// Test the corrected timezone fix

function createDateTimeInTimezone(date, time, timezone) {
  const timezoneOffsets = {
    'America/New_York': '-04:00', // EDT in summer
    'America/Los_Angeles': '-07:00', // PDT in summer
    'Europe/London': '+01:00', // BST in summer
    'Asia/Kolkata': '+05:30', // IST (no DST)
    'Asia/Dubai': '+04:00', // GST (no DST)
  };
  
  const offset = timezoneOffsets[timezone] || '+00:00';
  const isoString = `${date}T${time}:00${offset}`;
  
  return new Date(isoString);
}

console.log('=== Corrected Timezone Test ===');

const departure = createDateTimeInTimezone('2025-08-15', '12:00', 'Asia/Kolkata');
const arrival = createDateTimeInTimezone('2025-08-15', '23:00', 'America/New_York');

console.log('DEL departure 12:00 IST:', departure.toISOString());
console.log('JFK arrival 23:00 EDT:', arrival.toISOString());

const durationHours = (arrival.getTime() - departure.getTime()) / (1000 * 60 * 60);
console.log('Flight duration:', durationHours.toFixed(1), 'hours');

const SunCalc = require('suncalc');

// Test at DEL coordinates at corrected departure time
const delhiPos = SunCalc.getPosition(departure, 28.5562, 77.1);
const delhiAzDeg = (delhiPos.azimuth * 180/Math.PI + 180) % 360;
console.log('\\nDEL at 12:00 IST (06:30 UTC):');
console.log('  Elevation:', (delhiPos.altitude * 180/Math.PI).toFixed(1), '°');
console.log('  Azimuth:', delhiAzDeg.toFixed(1), '° from North');
console.log('  Expected: High sun, southeast direction for summer');

// Test at JFK coordinates at corrected arrival time
const jfkPos = SunCalc.getPosition(arrival, 40.6413, -73.7781);
const jfkAzDeg = (jfkPos.azimuth * 180/Math.PI + 180) % 360;
console.log('\\nJFK at 23:00 EDT (03:00 UTC next day):');
console.log('  Elevation:', (jfkPos.altitude * 180/Math.PI).toFixed(1), '°');
console.log('  Azimuth:', jfkAzDeg.toFixed(1), '° from North');
console.log('  Expected: Sun below horizon (nighttime)');
