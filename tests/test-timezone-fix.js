// Test the fixed timezone parsing for CPT→EZE flight

function testCPTtoEZETimezone() {
  console.log('🔧 Testing CPT→EZE Timezone Parsing Fix\n');
  
  // URL parameters from the user's request
  const departureDate = '2025-08-15';
  const departureTime = '18:30';  // 18:30 local time in CPT
  const arrivalDate = '2025-08-15';
  const arrivalTime = '23:00';    // 23:00 local time in EZE
  
  console.log('Input from URL:');
  console.log(`Departure: ${departureDate} ${departureTime} at CPT (UTC+2)`);
  console.log(`Arrival: ${arrivalDate} ${arrivalTime} at EZE (UTC-3)`);
  console.log('');
  
  // Cape Town is UTC+2, Buenos Aires is UTC-3
  function parseTimeInTimezone(date, time, utcOffset) {
    // Create UTC time by subtracting the timezone offset
    const [hours, minutes] = time.split(':').map(Number);
    const localDate = new Date(`${date}T${time}:00`);
    const utcDate = new Date(localDate.getTime() - (utcOffset * 60 * 60 * 1000));
    return utcDate;
  }
  
  function formatTimeInTimezone(date, utcOffset, location) {
    const localDate = new Date(date.getTime() + (utcOffset * 60 * 60 * 1000));
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const offsetStr = utcOffset >= 0 ? `+${utcOffset}` : `${utcOffset}`;
    return `${formatter.format(localDate)} GMT${offsetStr}`;
  }
  
  // Parse the times correctly
  const departureUTC = parseTimeInTimezone(departureDate, departureTime, 2);  // CPT UTC+2
  const arrivalUTC = parseTimeInTimezone(arrivalDate, arrivalTime, -3);       // EZE UTC-3
  
  console.log('Parsed UTC Times:');
  console.log(`Departure UTC: ${departureUTC.toISOString()}`);
  console.log(`Arrival UTC: ${arrivalUTC.toISOString()}`);
  console.log('');
  
  // Format back to local times for display (what should appear in navbar)
  const departureLocal = formatTimeInTimezone(departureUTC, 2, 'CPT');
  const arrivalLocal = formatTimeInTimezone(arrivalUTC, -3, 'EZE');
  
  console.log('Formatted Local Times (what should appear in navbar):');
  console.log(`Departure: ${departureLocal}`);
  console.log(`Arrival: ${arrivalLocal}`);
  console.log('');
  
  console.log('Expected vs Current:');
  console.log('Expected - Dep: Aug 15, 6:30 PM GMT+2');
  console.log(`Actual   - Dep: ${departureLocal}`);
  console.log('Expected - Arr: Aug 15, 11:00 PM GMT-3'); 
  console.log(`Actual   - Arr: ${arrivalLocal}`);
  console.log('');
  
  // Verify the times are correct
  const isDepCorrect = departureLocal.includes('6:30 PM');
  const isArrCorrect = arrivalLocal.includes('11:00 PM');
  
  console.log(`✅ Departure time correct: ${isDepCorrect ? 'YES' : 'NO'}`);
  console.log(`✅ Arrival time correct: ${isArrCorrect ? 'YES' : 'NO'}`);
  
  // Calculate flight duration
  const durationMs = arrivalUTC.getTime() - departureUTC.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  console.log(`Flight duration: ${durationHours.toFixed(1)} hours`);
  console.log(`Duration reasonable: ${durationHours > 8 && durationHours < 15 ? 'YES' : 'NO'}`);
}

testCPTtoEZETimezone();
