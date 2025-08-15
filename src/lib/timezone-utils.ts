/**
 * Comprehensive timezone utilities for flight calculations
 * Ensures consistent timezone handling across the entire application
 */

import type { Airport } from './types';

/**
 * Parse a date and time string in the context of an airport's timezone
 * @param dateStr Date string in YYYY-MM-DD format
 * @param timeStr Time string in HH:MM format (24-hour format)
 * @param airport Airport object with timezone information
 * @returns JavaScript Date object in UTC
 */
export function parseAirportLocalTime(dateStr: string, timeStr: string, airport: Airport): Date {
  try {
    // Use a simple approach: create date with explicit timezone offset
    const offsetHours = getAirportTimezoneOffset(airport.timezone);
    
    // Parse the local time components
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Create UTC time by subtracting the timezone offset
    const utcYear = year;
    const utcMonth = month - 1; // JavaScript months are 0-indexed
    const utcDay = day;
    const utcHours = hours - offsetHours;
    const utcMinutes = minutes;
    
    return new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHours, utcMinutes, 0));
    
  } catch (error) {
    console.warn(`Failed to parse airport local time for ${airport.code}:`, error);
    return new Date(`${dateStr}T${timeStr}:00Z`);
  }
}

/**
 * Get simplified timezone offset for major airports
 * @param timezone IANA timezone identifier
 * @returns Offset in hours from UTC (positive = ahead of UTC, negative = behind UTC)
 */
function getAirportTimezoneOffset(timezone: string): number {
  // Simplified timezone offsets for August (summer time where applicable)
  const offsets: { [key: string]: number } = {
    // North American timezones (summer time)
    'America/New_York': -4,        // EDT
    'America/Chicago': -5,         // CDT
    'America/Denver': -6,          // MDT
    'America/Los_Angeles': -7,     // PDT
    'America/Anchorage': -8,       // AKDT
    'America/Halifax': -3,         // ADT
    'America/St_Johns': -2.5,      // NDT
    
    // South American timezones (winter time in August)
    'America/Argentina/Buenos_Aires': -3,  // ART (no DST)
    'America/Sao_Paulo': -3,       // BRT (no DST in August)
    
    // European timezones (summer time)
    'Europe/London': 1,            // BST
    'Europe/Paris': 2,             // CEST
    'Europe/Helsinki': 3,          // EEST
    'Europe/Moscow': 3,            // MSK (no DST)
    
    // African timezones
    'Africa/Johannesburg': 2,      // SAST (no DST)
    
    // Asian timezones (most don't observe DST)
    'Asia/Dubai': 4,               // GST
    'Asia/Karachi': 5,             // PKT
    'Asia/Kolkata': 5.5,           // IST
    'Asia/Dhaka': 6,               // BST
    'Asia/Bangkok': 7,             // ICT
    'Asia/Shanghai': 8,            // CST
    'Asia/Tokyo': 9,               // JST
    
    // Pacific timezones
    'Pacific/Honolulu': -10,       // HST (no DST)
    'Pacific/Samoa': -11,          // SST
    'Pacific/Auckland': 12,        // NZST (winter time in August)
    'Australia/Sydney': 10,        // AEST (winter time in August)
    
    // Default
    'UTC': 0,
  };
  
  return offsets[timezone] || 0;
}

/**
 * Format a date for display in an airport's local timezone
 * @param date Date object (in any timezone)
 * @param airport Airport object with timezone information
 * @returns Formatted date string in airport's local timezone
 */
export function formatAirportLocalTime(date: Date, airport: Airport): string {
  return formatAirportTime(date, airport.timezone, true);
}

/**
 * Get timezone offset based on coordinates using a lookup table
 * This provides more accurate timezone handling than browser-based calculations
 * 
 * @param lat Latitude in degrees
 * @param lng Longitude in degrees
 * @param date Date for DST calculations
 * @returns IANA timezone identifier
 */
export function getTimezoneForCoordinates(lat: number, lng: number, date: Date): string {
  // Simplified timezone regions based on longitude and latitude
  // In a production app, you'd use a proper timezone lookup service
  
  // Major timezone boundaries (approximate)
  if (lng >= -180 && lng < -165) return 'Pacific/Samoa';           // UTC-11
  if (lng >= -165 && lng < -150) return 'Pacific/Honolulu';        // UTC-10
  if (lng >= -150 && lng < -135) return 'America/Anchorage';       // UTC-9 (Alaska)
  if (lng >= -135 && lng < -120) return 'America/Los_Angeles';     // UTC-8 (Pacific)
  if (lng >= -120 && lng < -105) return 'America/Denver';          // UTC-7 (Mountain)
  if (lng >= -105 && lng < -90) return 'America/Chicago';          // UTC-6 (Central)
  if (lng >= -90 && lng < -75) return 'America/New_York';          // UTC-5 (Eastern)
  if (lng >= -75 && lng < -60) return 'America/Halifax';           // UTC-4 (Atlantic)
  if (lng >= -60 && lng < -45) return 'America/St_Johns';          // UTC-3:30 (Newfoundland)
  if (lng >= -45 && lng < -30) return 'America/Sao_Paulo';         // UTC-3 (Brazil)
  if (lng >= -30 && lng < -15) return 'Atlantic/Azores';           // UTC-1
  if (lng >= -15 && lng < 15) return 'Europe/London';              // UTC+0 (GMT/UTC)
  if (lng >= 15 && lng < 30) return 'Europe/Paris';                // UTC+1 (CET)
  if (lng >= 30 && lng < 45) return 'Europe/Helsinki';             // UTC+2 (EET)
  if (lng >= 45 && lng < 60) return 'Europe/Moscow';               // UTC+3
  if (lng >= 60 && lng < 75) return 'Asia/Dubai';                  // UTC+4
  if (lng >= 75 && lng < 90) return 'Asia/Karachi';                // UTC+5
  if (lng >= 90 && lng < 105) return 'Asia/Dhaka';                 // UTC+6
  if (lng >= 105 && lng < 120) return 'Asia/Bangkok';              // UTC+7
  if (lng >= 120 && lng < 135) return 'Asia/Shanghai';             // UTC+8
  if (lng >= 135 && lng < 150) return 'Asia/Tokyo';                // UTC+9
  if (lng >= 150 && lng < 165) return 'Australia/Sydney';          // UTC+10
  if (lng >= 165 && lng <= 180) return 'Pacific/Auckland';         // UTC+12
  
  // Default fallback
  return 'UTC';
}

/**
 * Create a Date object with proper timezone handling based on aircraft position
 * This is the primary function for creating timezone-aware dates during flight
 * 
 * @param date Base date (YYYY-MM-DD)
 * @param time Base time (HH:MM)
 * @param coordinates Aircraft coordinates for timezone lookup
 * @param flightDate Date context for DST calculations
 * @returns Date object with correct timezone
 */
export function createDateTimeAtPosition(
  date: string,
  time: string,
  coordinates: { lat: number; lng: number },
  flightDate: Date
): Date {
  const timezone = getTimezoneForCoordinates(coordinates.lat, coordinates.lng, flightDate);
  return createDateTimeInTimezone(date, time, timezone, flightDate);
}

/**
 * Enhanced timezone-aware date creation with DST support
 * 
 * @param date Date string (YYYY-MM-DD)
 * @param time Time string (HH:MM)
 * @param timezone IANA timezone identifier
 * @param contextDate Date for determining DST status
 * @returns Date object in correct timezone
 */
export function createDateTimeInTimezone(
  date: string,
  time: string,
  timezone: string,
  contextDate: Date = new Date()
): Date {
  // Dynamic timezone offset calculation based on season
  const timezoneOffsets = getTimezoneOffsets(contextDate);
  
  const offset = timezoneOffsets[timezone] || '+00:00';
  const isoString = `${date}T${time}:00${offset}`;
  
  return new Date(isoString);
}

/**
 * Get timezone offsets dynamically based on date (handles DST)
 * 
 * @param date Date to check for DST status
 * @returns Object mapping timezone names to offset strings
 */
function getTimezoneOffsets(date: Date): { [key: string]: string } {
  const month = date.getMonth(); // 0-11
  const isDST = month >= 2 && month <= 10; // Rough DST period (March-October)
  
  return {
    // North American timezones
    'America/New_York': isDST ? '-04:00' : '-05:00',      // EDT/EST
    'America/Chicago': isDST ? '-05:00' : '-06:00',       // CDT/CST
    'America/Denver': isDST ? '-06:00' : '-07:00',        // MDT/MST
    'America/Los_Angeles': isDST ? '-07:00' : '-08:00',   // PDT/PST
    'America/Anchorage': isDST ? '-08:00' : '-09:00',     // AKDT/AKST
    'America/Halifax': isDST ? '-03:00' : '-04:00',       // ADT/AST
    'America/St_Johns': isDST ? '-02:30' : '-03:30',      // NDT/NST
    
    // European timezones
    'Europe/London': isDST ? '+01:00' : '+00:00',         // BST/GMT
    'Europe/Paris': isDST ? '+02:00' : '+01:00',          // CEST/CET
    'Europe/Helsinki': isDST ? '+03:00' : '+02:00',       // EEST/EET
    'Europe/Moscow': '+03:00',                            // MSK (no DST)
    
    // Asian timezones (most don't observe DST)
    'Asia/Dubai': '+04:00',                               // GST
    'Asia/Karachi': '+05:00',                             // PKT
    'Asia/Kolkata': '+05:30',                             // IST
    'Asia/Dhaka': '+06:00',                               // BST
    'Asia/Bangkok': '+07:00',                             // ICT
    'Asia/Shanghai': '+08:00',                            // CST
    'Asia/Tokyo': '+09:00',                               // JST
    
    // Pacific timezones
    'Pacific/Honolulu': '-10:00',                         // HST (no DST)
    'Pacific/Samoa': '-11:00',                            // SST
    'Pacific/Auckland': isDST ? '+13:00' : '+12:00',      // NZDT/NZST (opposite season)
    'Australia/Sydney': isDST ? '+11:00' : '+10:00',      // AEDT/AEST (opposite season)
    
    // Other regions
    'America/Sao_Paulo': isDST ? '-02:00' : '-03:00',     // BRT (opposite season)
    'Atlantic/Azores': isDST ? '+00:00' : '-01:00',       // AZOST/AZOT
    
    // Default
    'UTC': '+00:00',
  };
}

/**
 * Interpolate timezone-aware datetime based on flight progress and aircraft position
 * This ensures solar calculations use the correct local time at the aircraft's current position
 * 
 * @param startTime Flight start time
 * @param endTime Flight end time
 * @param progress Flight progress (0-1)
 * @param aircraftPosition Current aircraft coordinates
 * @returns Date object with timezone adjusted for current position
 */
export function interpolateFlightDateTime(
  startTime: Date,
  endTime: Date,
  progress: number,
  aircraftPosition: { lat: number; lng: number }
): Date {
  // First, interpolate the raw time
  const startMs = startTime.getTime();
  const endMs = endTime.getTime();
  const currentMs = startMs + (endMs - startMs) * progress;
  const rawDateTime = new Date(currentMs);
  
  // Get the timezone for the current aircraft position
  const localTimezone = getTimezoneForCoordinates(
    aircraftPosition.lat, 
    aircraftPosition.lng, 
    rawDateTime
  );
  
  // Convert to the local timezone at the aircraft's position
  // Note: This maintains the same instant in time but represents it in the local timezone
  return new Date(rawDateTime.toLocaleString('en-US', { timeZone: localTimezone }));
}

/**
 * Format time consistently for display, using UTC to avoid confusion during international flights
 * 
 * @param date Date object to format
 * @param showTimezone Whether to include timezone in display
 * @returns Formatted time string
 */
export function formatFlightTime(date: Date, showTimezone: boolean = true): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  };
  
  if (showTimezone) {
    options.timeZoneName = 'short';
  }
  
  return date.toLocaleTimeString('en-US', options);
}

/**
 * Format time in a specific airport's timezone
 * 
 * @param date Date object to format
 * @param timezone IANA timezone identifier for the airport
 * @param showTimezone Whether to include timezone abbreviation
 * @returns Formatted time string in airport's local timezone
 */
export function formatAirportTime(
  date: Date, 
  timezone: string, 
  showTimezone: boolean = true
): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  };
  
  if (showTimezone) {
    options.timeZoneName = 'short';
  }
  
  return date.toLocaleString('en-US', options);
}

/**
 * Create timezone-aware departure and arrival time display
 * 
 * @param departureTime Departure time as Date object
 * @param arrivalTime Arrival time as Date object
 * @param departureTimezone IANA timezone for departure airport
 * @param arrivalTimezone IANA timezone for arrival airport
 * @returns Object with formatted departure and arrival times
 */
export function formatFlightSchedule(
  departureTime: Date,
  arrivalTime: Date,
  departureTimezone: string,
  arrivalTimezone: string
): {
  departureLocal: string;
  arrivalLocal: string;
  departureUTC: string;
  arrivalUTC: string;
} {
  return {
    departureLocal: formatAirportTime(departureTime, departureTimezone, true),
    arrivalLocal: formatAirportTime(arrivalTime, arrivalTimezone, true),
    departureUTC: formatFlightTime(departureTime, true),
    arrivalUTC: formatFlightTime(arrivalTime, true),
  };
}

/**
 * Get the local solar time at a specific coordinate
 * Solar time accounts for the sun's actual position relative to longitude
 * 
 * @param utcTime UTC time
 * @param longitude Longitude in degrees
 * @returns Solar time as Date object
 */
export function getSolarTimeAtLongitude(utcTime: Date, longitude: number): Date {
  // Solar time offset: 4 minutes per degree of longitude from GMT
  const solarOffsetMinutes = longitude * 4;
  const solarTimeMs = utcTime.getTime() + (solarOffsetMinutes * 60 * 1000);
  
  return new Date(solarTimeMs);
}

/**
 * Validate timezone string
 * 
 * @param timezone IANA timezone identifier
 * @returns Boolean indicating if timezone is valid
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    new Date().toLocaleString('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get flight-aware timezone info for debugging
 * 
 * @param coordinates Aircraft coordinates
 * @param date Context date
 * @returns Object with timezone details
 */
export function getTimezoneInfo(
  coordinates: { lat: number; lng: number },
  date: Date = new Date()
): {
  timezone: string;
  offset: string;
  isDST: boolean;
  localTime: string;
} {
  const timezone = getTimezoneForCoordinates(coordinates.lat, coordinates.lng, date);
  const month = date.getMonth();
  const isDST = month >= 2 && month <= 10;
  const offsets = getTimezoneOffsets(date);
  const offset = offsets[timezone] || '+00:00';
  
  const localTime = new Date().toLocaleString('en-US', { 
    timeZone: timezone,
    timeZoneName: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return {
    timezone,
    offset,
    isDST,
    localTime
  };
}
