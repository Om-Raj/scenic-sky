// Geospatial calculations for scenic location detection along flight paths
import { point, distance, bearing } from '@turf/turf';
import type { PathPoint } from './types';
import type { ScenicLocation, ViewableLocation } from './seat-recommendation-types';

/**
 * Distance thresholds for different scenic location types (in kilometers)
 */
const VISIBILITY_THRESHOLDS = {
  mountain: 100,
  volcano: 100,
  ocean: 50,
  city: 50,
  landmark: 50,
  natural: 50,
  cultural: 50,
} as const;

/**
 * Calculate the closest distance from a point to a flight path
 * @param location Geographic point to check
 * @param flightPath Array of path points representing the flight route
 * @returns Object with distance in km and closest path point index
 */
export function getDistanceToFlightPath(
  location: { lat: number; lon: number },
  flightPath: PathPoint[]
): { distance: number; closestPointIndex: number; progress: number } {
  const locationPoint = point([location.lon, location.lat]);
  let minDistance = Infinity;
  let closestIndex = 0;

  // Check distance to each segment of the flight path
  for (let i = 0; i < flightPath.length; i++) {
    const pathPoint = point([flightPath[i].lon, flightPath[i].lat]);
    const dist = distance(locationPoint, pathPoint);
    
    if (dist < minDistance) {
      minDistance = dist;
      closestIndex = i;
    }
  }

  // Calculate progress along route (0-1)
  const progress = flightPath.length > 1 ? closestIndex / (flightPath.length - 1) : 0;

  return {
    distance: minDistance,
    closestPointIndex: closestIndex,
    progress,
  };
}

/**
 * Determine which side of the aircraft a location appears on
 * @param aircraftPosition Current aircraft position
 * @param aircraftBearing Aircraft heading in degrees (0-360, 0 = north)
 * @param targetLocation Location to check
 * @returns 'left' or 'right' side of aircraft
 */
export function determineSideOfAircraft(
  aircraftPosition: { lat: number; lon: number },
  aircraftBearing: number,
  targetLocation: { lat: number; lon: number }
): 'left' | 'right' {
  const aircraftPoint = point([aircraftPosition.lon, aircraftPosition.lat]);
  const targetPoint = point([targetLocation.lon, targetLocation.lat]);
  
  // Calculate bearing from aircraft to target location
  const bearingToTarget = bearing(aircraftPoint, targetPoint);
  
  // Normalize bearings to 0-360 range
  const normalizedAircraftBearing = ((aircraftBearing % 360) + 360) % 360;
  const normalizedTargetBearing = ((bearingToTarget % 360) + 360) % 360;
  
  // Calculate relative bearing (-180 to 180)
  let relativeBearing = normalizedTargetBearing - normalizedAircraftBearing;
  
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
 * Find scenic locations visible from a flight path
 * @param flightPath Array of path points representing the flight route
 * @param scenicLocations Array of scenic locations to check
 * @returns Array of viewable locations with side and distance information
 */
export function findVisibleScenicLocations(
  flightPath: PathPoint[],
  scenicLocations: ScenicLocation[]
): ViewableLocation[] {
  const viewableLocations: ViewableLocation[] = [];

  for (const location of scenicLocations) {
    // Get visibility threshold for this location type
    const threshold = VISIBILITY_THRESHOLDS[location.type];
    
    // Calculate closest distance to flight path
    const { distance: distanceToPath, closestPointIndex, progress } = 
      getDistanceToFlightPath(location, flightPath);

    // Check if location is within visibility threshold
    if (distanceToPath <= threshold) {
      const closestPathPoint = flightPath[closestPointIndex];
      
      // Determine which side of aircraft the location appears on
      const side = determineSideOfAircraft(
        { lat: closestPathPoint.lat, lon: closestPathPoint.lon },
        closestPathPoint.bearing || 0,
        { lat: location.lat, lon: location.lon }
      );

      // Calculate visibility rating based on distance and popularity
      const visibility = calculateVisibilityRating(distanceToPath, threshold, location.likes);

      viewableLocations.push({
        ...location,
        distanceFromRoute: distanceToPath,
        side,
        routeProgress: progress,
        visibility,
      });
    }
  }

  // Sort by route progress for logical ordering
  return viewableLocations.sort((a, b) => a.routeProgress - b.routeProgress);
}

/**
 * Calculate visibility rating based on distance and popularity
 * @param distance Distance from flight path in km
 * @param threshold Maximum visibility distance for location type
 * @param likes Popularity score
 * @returns Visibility rating
 */
function calculateVisibilityRating(
  distance: number,
  threshold: number,
  likes: number
): 'excellent' | 'good' | 'fair' | 'poor' {
  const distanceRatio = distance / threshold;
  const popularityBonus = likes > 40000 ? 0.2 : likes > 25000 ? 0.1 : 0;
  
  const score = (1 - distanceRatio) + popularityBonus;
  
  if (score >= 0.8) return 'excellent';
  if (score >= 0.6) return 'good';
  if (score >= 0.4) return 'fair';
  return 'poor';
}

/**
 * Group viewable locations by side of aircraft
 * @param viewableLocations Array of locations with side information
 * @returns Object with 'left' and 'right' arrays of location names
 */
export function groupLocationsBySide(viewableLocations: ViewableLocation[]): {
  left: string[];
  right: string[];
} {
  const result = { left: [] as string[], right: [] as string[] };
  
  for (const location of viewableLocations) {
    result[location.side].push(location.name);
  }
  
  return result;
}

/**
 * Calculate great circle bearing between two points
 * Used for determining aircraft heading at specific points
 * @param from Starting point
 * @param to Ending point
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number }
): number {
  const fromPoint = point([from.lon, from.lat]);
  const toPoint = point([to.lon, to.lat]);
  const bearingValue = bearing(fromPoint, toPoint);
  
  // Convert to 0-360 range
  return bearingValue < 0 ? bearingValue + 360 : bearingValue;
}
