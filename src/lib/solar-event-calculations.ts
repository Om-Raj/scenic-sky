// Solar calculations for sunrise/sunset visibility during flights
import * as SunCalc from 'suncalc';
import type { PathPoint } from './types';
import type { SolarEvent } from './seat-recommendation-types';
import { determineSideOfAircraft } from './scenic-location-calculations';
import { interpolateDateTime, calculateFlightSolarPosition } from './solar-calculations';
import { formatFlightTime } from './timezone-utils';

/**
 * Cruising altitude for visibility calculations (typical commercial flight)
 */
const CRUISING_ALTITUDE_METERS = 11000; // ~36,000 feet

/**
 * Calculate horizon distance at cruising altitude
 * @param altitudeMeters Aircraft altitude in meters
 * @returns Horizon distance in kilometers
 */
function calculateHorizonDistance(altitudeMeters: number): number {
  const earthRadiusKm = 6371;
  const altitudeKm = altitudeMeters / 1000;
  
  // Use geometric horizon formula: d = √(2 * R * h + h²)
  // where R is Earth radius and h is altitude
  return Math.sqrt(2 * earthRadiusKm * altitudeKm + altitudeKm * altitudeKm);
}

/**
 * Determine if the sun is visible from aircraft at given position and time
 * Uses timezone-aware calculations based on aircraft position
 * 
 * @param lat Aircraft latitude
 * @param lon Aircraft longitude
 * @param date Date and time (should be timezone-aware)
 * @param altitudeMeters Aircraft altitude in meters
 * @returns Object with visibility info and sun position
 */
function isSunVisible(
  lat: number,
  lon: number,
  date: Date,
  altitudeMeters: number = CRUISING_ALTITUDE_METERS
): {
  visible: boolean;
  elevation: number;
  azimuth: number;
  type: 'daylight' | 'twilight' | 'night';
} {
  const sunPosition = SunCalc.getPosition(date, lat, lon);
  const elevationDegrees = sunPosition.altitude * (180 / Math.PI);
  
  // At cruising altitude, the geometric horizon is lowered
  const horizonDepressionDegrees = Math.acos(
    6371 / (6371 + altitudeMeters / 1000)
  ) * (180 / Math.PI);
  
  const adjustedHorizon = -horizonDepressionDegrees;
  
  let type: 'daylight' | 'twilight' | 'night';
  let visible: boolean;
  
  if (elevationDegrees > 6) {
    type = 'daylight';
    visible = true;
  } else if (elevationDegrees > adjustedHorizon) {
    type = 'twilight';
    visible = true;
  } else {
    type = 'night';
    visible = false;
  }
  
  return {
    visible,
    elevation: elevationDegrees,
    azimuth: sunPosition.azimuth * (180 / Math.PI),
    type,
  };
}

/**
 * Find sunrise and sunset events along a flight path with position-based timezone handling
 * @param flightPath Array of path points
 * @param startTime Flight departure time
 * @param endTime Flight arrival time
 * @param samplingIntervalMinutes How often to sample along the route
 * @returns Array of solar events with timing and visibility information
 */
export function findSolarEventsAlongPath(
  flightPath: PathPoint[],
  startTime: Date,
  endTime: Date,
  samplingIntervalMinutes: number = 8  // Increased sampling frequency for better accuracy
): SolarEvent[] {
  const events: SolarEvent[] = [];
  const flightDurationMs = endTime.getTime() - startTime.getTime();
  const samplingIntervalMs = samplingIntervalMinutes * 60 * 1000;
  const samples = Math.ceil(flightDurationMs / samplingIntervalMs);
  
  let previousSunElevation = -90;
  let previousProgress = -1;
  
  for (let i = 0; i <= samples; i++) {
    const progress = i / samples;
    
    // Interpolate position along flight path
    const pathIndex = Math.floor(progress * (flightPath.length - 1));
    const pathPoint = flightPath[Math.min(pathIndex, flightPath.length - 1)];
    
    if (!pathPoint) continue;
    
    // Use simple UTC interpolation for accurate solar calculations
    const currentTime = interpolateDateTime(startTime, endTime, progress);
    
    const sunInfo = isSunVisible(pathPoint.lat, pathPoint.lon, currentTime);
    const currentElevation = sunInfo.elevation;
    
    // Detect sunrise (sun crosses horizon from below to above)
    // Use -0.833° which is the official sunrise/sunset angle accounting for atmospheric refraction
    if (previousSunElevation < -0.833 && currentElevation > -0.833 && i > 0) {
      const side = determineSunSide(pathPoint, sunInfo.azimuth);
      const visibility = calculateSolarVisibility(currentElevation, sunInfo.type);
      
      events.push({
        type: 'sunrise',
        time: currentTime,
        progress,
        side,
        elevation: currentElevation,
        visibility,
      });
    }
    
    // Detect sunset (sun crosses horizon from above to below)
    if (previousSunElevation > -0.833 && currentElevation < -0.833 && i > 0) {
      const side = determineSunSide(pathPoint, sunInfo.azimuth);
      const visibility = calculateSolarVisibility(previousSunElevation, 'twilight');
      
      events.push({
        type: 'sunset',
        time: currentTime,
        progress,
        side,
        elevation: previousSunElevation,
        visibility,
      });
    }
    
    // Detect golden hour (sun elevation between 0-6 degrees, but only record once per transition)
    if (currentElevation > 0 && currentElevation <= 6 && previousSunElevation <= 0 && i > 0) {
      const side = determineSunSide(pathPoint, sunInfo.azimuth);
      const visibility = calculateSolarVisibility(currentElevation, sunInfo.type);
      
      events.push({
        type: 'golden-hour',
        time: currentTime,
        progress,
        side,
        elevation: currentElevation,
        visibility,
      });
    }
    
    // Detect blue hour (sun elevation between -6 and 0 degrees)
    if (currentElevation > -6 && currentElevation <= 0 && previousSunElevation <= -6 && i > 0) {
      const side = determineSunSide(pathPoint, sunInfo.azimuth);
      const visibility = calculateSolarVisibility(currentElevation, sunInfo.type);
      
      events.push({
        type: 'blue-hour',
        time: currentTime,
        progress,
        side,
        elevation: currentElevation,
        visibility,
      });
    }
    
    previousSunElevation = currentElevation;
    previousProgress = progress;
  }
  
  return events.sort((a, b) => a.progress - b.progress);
}

/**
 * Determine which side of the aircraft the sun appears on
 * @param aircraftPosition Current aircraft position
 * @param sunAzimuthDegrees Sun azimuth in degrees (0 = north, 90 = east)
 * @returns 'left' or 'right' side of aircraft
 */
function determineSunSide(
  aircraftPosition: PathPoint,
  sunAzimuthDegrees: number
): 'left' | 'right' {
  const aircraftBearing = aircraftPosition.bearing || 0;
  
  // Calculate relative bearing of sun to aircraft heading
  let relativeBearing = sunAzimuthDegrees - aircraftBearing;
  
  // Normalize to -180 to 180 range
  if (relativeBearing > 180) {
    relativeBearing -= 360;
  } else if (relativeBearing < -180) {
    relativeBearing += 360;
  }
  
  // Positive relative bearing = right side, negative = left side
  return relativeBearing > 0 ? 'right' : 'left';
}

/**
 * Calculate visibility rating for solar events
 * @param elevation Sun elevation in degrees
 * @param type Daylight type
 * @returns Visibility rating
 */
function calculateSolarVisibility(
  elevation: number,
  type: 'daylight' | 'twilight' | 'night'
): 'excellent' | 'good' | 'fair' | 'poor' {
  if (type === 'night') return 'poor';
  
  if (elevation > 15) return 'excellent';
  if (elevation > 6) return 'good';
  if (elevation > 0) return 'fair';
  return 'poor';
}

/**
 * Group solar events by side of aircraft
 * @param solarEvents Array of solar events
 * @returns Object with 'left' and 'right' arrays of event descriptions
 */
export function groupSolarEventsBySide(solarEvents: SolarEvent[]): {
  left: string[];
  right: string[];
} {
  const result = { left: [] as string[], right: [] as string[] };
  
  for (const event of solarEvents) {
    const description = formatSolarEventDescription(event);
    result[event.side].push(description);
  }
  
  return result;
}

/**
 * Format solar event for display with consistent timezone handling
 * @param event Solar event object
 * @returns Formatted description string
 */
function formatSolarEventDescription(event: SolarEvent): string {
  // Use the new timezone-aware formatting function
  const timeStr = formatFlightTime(event.time, true);
  
  const eventType = event.type.charAt(0).toUpperCase() + event.type.slice(1).replace('-', ' ');
  const progressPercent = Math.round(event.progress * 100);
  
  return `${eventType} ${timeStr} • ${progressPercent}% through flight`;
}

/**
 * Calculate time until next solar event
 * @param currentTime Current time
 * @param solarEvents Array of solar events
 * @returns Next event or null if none found
 */
export function getNextSolarEvent(
  currentTime: Date,
  solarEvents: SolarEvent[]
): SolarEvent | null {
  const futureEvents = solarEvents.filter(event => event.time > currentTime);
  return futureEvents.length > 0 ? futureEvents[0] : null;
}
