import * as SunCalc from 'suncalc';
import { 
  createDateTimeInTimezone as createTimezoneAwareDateTime,
  interpolateFlightDateTime,
  getSolarTimeAtLongitude 
} from './timezone-utils';

/**
 * Solar position data for 3D sun rendering
 */
export interface SolarPosition {
  elevation: number; // Solar elevation in radians (-π/2 to π/2)
  azimuth: number;   // Solar azimuth in radians (0 to 2π, 0 = north)
  altitude: number;  // Same as elevation, in degrees for convenience
  azimuthDeg: number; // Azimuth in degrees
}

/**
 * Create a Date object with proper timezone handling
 * @deprecated Use timezone-utils functions for better timezone support
 * @param date Date string (YYYY-MM-DD)
 * @param time Time string (HH:MM)
 * @param timezone IANA timezone identifier (e.g., 'America/New_York')
 * @returns Date object in correct timezone
 */
export function createDateTimeInTimezone(
  date: string,
  time: string,
  timezone: string
): Date {
  return createTimezoneAwareDateTime(date, time, timezone);
}

/**
 * Solar position data for 3D sun rendering
 */
export interface SolarPosition {
  elevation: number; // Solar elevation in radians (-π/2 to π/2)
  azimuth: number;   // Solar azimuth in radians (0 to 2π, 0 = north)
  altitude: number;  // Same as elevation, in degrees for convenience
  azimuthDeg: number; // Azimuth in degrees
}

/**
 * Calculate solar position for aircraft at specific coordinates and time
 * Uses instantaneous position-based timezone calculations for accuracy
 * 
 * @param lat Latitude in degrees (-90 to 90)
 * @param lng Longitude in degrees (-180 to 180)  
 * @param date Date and time for calculation (should be in appropriate timezone)
 * @param useLocalSolarTime Whether to use solar time instead of civil time
 * @returns Solar position with elevation and azimuth angles
 */
export function calculateSolarPosition(
  lat: number, 
  lng: number, 
  date: Date,
  useLocalSolarTime: boolean = false
): SolarPosition {
  // Optionally use solar time for more accurate sun position
  const calculationTime = useLocalSolarTime 
    ? getSolarTimeAtLongitude(date, lng)
    : date;
  
  // Use SunCalc library for precise astronomical calculations
  const position = SunCalc.getPosition(calculationTime, lat, lng);
  
  return {
    elevation: position.altitude, // Solar elevation angle in radians
    azimuth: position.azimuth + Math.PI, // Adjust azimuth to 0-2π range (0 = north)
    altitude: position.altitude * (180 / Math.PI), // Convert to degrees
    azimuthDeg: (position.azimuth + Math.PI) * (180 / Math.PI), // Convert to degrees
  };
}

/**
 * Calculate solar position for aircraft during flight with position-aware timezone
 * This is the recommended function for flight-based solar calculations
 * 
 * @param aircraftPosition Current aircraft coordinates
 * @param flightStartTime Flight departure time
 * @param flightEndTime Flight arrival time
 * @param progress Flight progress (0-1)
 * @param useLocalSolarTime Whether to use solar time for calculations
 * @returns Solar position data
 */
export function calculateFlightSolarPosition(
  aircraftPosition: { lat: number; lng: number },
  flightStartTime: Date,
  flightEndTime: Date,
  progress: number,
  useLocalSolarTime: boolean = true
): SolarPosition {
  // Get the current time adjusted for aircraft position timezone
  const currentTime = interpolateFlightDateTime(
    flightStartTime,
    flightEndTime,
    progress,
    aircraftPosition
  );
  
  return calculateSolarPosition(
    aircraftPosition.lat,
    aircraftPosition.lng,
    currentTime,
    useLocalSolarTime
  );
}

/**
 * Convert solar angles to 3D position for sun rendering
 * Maps elevation/azimuth to x,y,z coordinates in a unit sphere
 * 
 * @param elevation Solar elevation in radians
 * @param azimuth Solar azimuth in radians
 * @param radius Distance from origin (default: 1 for unit sphere)
 * @returns 3D position vector
 */
export function solarAnglesTo3DPosition(
  elevation: number,
  azimuth: number,
  radius: number = 1
): { x: number; y: number; z: number } {
  // Convert spherical coordinates to Cartesian
  // Elevation: angle from horizon (0) to zenith (π/2)
  // Azimuth: angle from north (0) clockwise
  
  const x = radius * Math.cos(elevation) * Math.sin(azimuth);
  const y = radius * Math.sin(elevation); // Height above horizon
  const z = radius * Math.cos(elevation) * Math.cos(azimuth);
  
  return { x, y, z };
}

/**
 * Calculate sun ray direction from sun position to target location
 * Used for rendering the light ray from sun to aircraft
 * 
 * @param sunPosition 3D position of sun
 * @param targetPosition 3D position of target (aircraft)
 * @returns Normalized direction vector
 */
export function calculateSunRayDirection(
  sunPosition: { x: number; y: number; z: number },
  targetPosition: { x: number; y: number; z: number }
): { x: number; y: number; z: number } {
  // Calculate direction vector from sun to target
  const dx = targetPosition.x - sunPosition.x;
  const dy = targetPosition.y - sunPosition.y;
  const dz = targetPosition.z - sunPosition.z;
  
  // Normalize the vector
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  return {
    x: dx / length,
    y: dy / length,
    z: dz / length,
  };
}

/**
 * Get time progression factor for smooth animations with timezone awareness
 * 
 * @param startTime Flight start time
 * @param endTime Flight end time
 * @param progress Current progress (0-1)
 * @param aircraftPosition Optional aircraft position for timezone-aware interpolation
 * @returns Interpolated date/time
 */
export function interpolateDateTime(
  startTime: Date,
  endTime: Date,
  progress: number,
  aircraftPosition?: { lat: number; lng: number }
): Date {
  if (aircraftPosition) {
    // Use timezone-aware interpolation for flight calculations
    return interpolateFlightDateTime(startTime, endTime, progress, aircraftPosition);
  }
  
  // Fallback to simple linear interpolation
  const startMs = startTime.getTime();
  const endMs = endTime.getTime();
  const currentMs = startMs + (endMs - startMs) * progress;
  
  return new Date(currentMs);
}
