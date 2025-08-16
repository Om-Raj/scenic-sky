// Test the SkyDomeVisualization fix
const SunCalc = require('suncalc');

function testSkyDomeVisualizationFix() {
  console.log('🌌 Testing SkyDomeVisualization Solar Time Fix\n');

  // Test the same flight: JFK to LAX at midpoint (Kansas)
  const testDate = new Date('2025-08-15T17:40:00.000Z'); // 12:40 PM CDT over Kansas
  const latitude = 38.5;
  const longitude = -99.0;

  console.log('Test Parameters:');
  console.log(`Date: ${testDate.toISOString()}`);
  console.log(`Local Time: ${testDate.toLocaleString('en-US', { timeZone: 'America/Chicago' })}`);
  console.log(`Position: ${latitude}°N, ${Math.abs(longitude)}°W (Kansas)\n`);

  // Test WITHOUT solar time adjustment (FIXED version)
  console.log('✅ FIXED VERSION (without solar time adjustment):');
  const fixedSunPos = SunCalc.getPosition(testDate, latitude, longitude);
  const fixedElevation = fixedSunPos.altitude * (180 / Math.PI);
  const fixedAzimuth = (fixedSunPos.azimuth * (180 / Math.PI) + 180) % 360;

  console.log(`Sun Elevation: ${fixedElevation.toFixed(1)}°`);
  console.log(`Sun Azimuth: ${fixedAzimuth.toFixed(1)}°`);
  console.log(`Status: ${fixedElevation > 0 ? '☀️ Above horizon' : '🌙 Below horizon'}`);
  console.log('');

  // Test WITH solar time adjustment (BUGGY version)
  console.log('❌ BUGGY VERSION (with solar time adjustment):');
  const solarOffsetMinutes = longitude * 4; // -99 * 4 = -396 minutes = -6.6 hours
  const solarAdjustedTime = new Date(testDate.getTime() + (solarOffsetMinutes * 60 * 1000));
  
  const buggySunPos = SunCalc.getPosition(solarAdjustedTime, latitude, longitude);
  const buggyElevation = buggySunPos.altitude * (180 / Math.PI);
  const buggyAzimuth = (buggySunPos.azimuth * (180 / Math.PI) + 180) % 360;

  console.log(`Solar offset: ${solarOffsetMinutes} minutes (${(solarOffsetMinutes/60).toFixed(1)} hours)`);
  console.log(`Adjusted time: ${solarAdjustedTime.toISOString()}`);
  console.log(`Sun Elevation: ${buggyElevation.toFixed(1)}°`);
  console.log(`Sun Azimuth: ${buggyAzimuth.toFixed(1)}°`);
  console.log(`Status: ${buggyElevation > 0 ? '☀️ Above horizon' : '🌙 Below horizon'}`);
  console.log('');

  // Show the difference
  console.log('📊 Comparison:');
  console.log(`Elevation difference: ${(fixedElevation - buggyElevation).toFixed(1)}°`);
  console.log(`Time shift: ${Math.abs(solarOffsetMinutes/60).toFixed(1)} hours earlier`);
  console.log('');

  console.log('🔧 Fix Applied:');
  console.log('- Changed useSolarTime from true to false in getSunPosition()');
  console.log('- Removed solar time adjustment that was shifting time by longitude');
  console.log('- Now uses UTC time directly for consistent solar calculations');
  console.log('- SkyDomeVisualization should now show sun above horizon during daytime flight');
}

testSkyDomeVisualizationFix();
