import { distance, point } from '@turf/turf';
import type { ScenicLocation } from './seat-recommendation-types';
import type { PathPoint } from './types';

/**
 * Default detection radius thresholds for different scenic location types (in kilometers)
 * Used only as a fallback when a location does not specify visibilityRadius (> 0)
 */
const DETECTION_THRESHOLDS = {
  mountain: 100,
  volcano: 100,
  ocean: 50,
  city: 50,
  landmark: 50,
  natural: 50,
  cultural: 50,
} as const;

/**
 * Modal trigger threshold - distance from aircraft to scenic location to show modal (in kilometers)
 * Smaller threshold ensures modal appears before reaching the marker
 */
const MODAL_TRIGGER_THRESHOLD = 2;

/**
 * Enhanced scenic location interface with detection metadata
 */
export interface ScenicLocationWithDetection extends ScenicLocation {
  distanceFromPath: number;
  nearestPathIndex: number;
  detectionProgress: number; // 0-1 position along route where it's closest
}

/**
 * Find scenic locations that are within detection range of the flight path
 * @param flightPath Array of path points representing the flight route
 * @param scenicLocations Array of all scenic locations to check
 * @returns Array of scenic locations within detection range with metadata
 */
export function findScenicLocationsNearPath(
  flightPath: PathPoint[],
  scenicLocations: ScenicLocation[]
): ScenicLocationWithDetection[] {
  const nearbyLocations: ScenicLocationWithDetection[] = [];

  for (const location of scenicLocations) {
    const locationPoint = point([location.lon, location.lat]);
    let minDistance = Infinity;
    let nearestPathIndex = 0;

    // Find the closest point on the flight path to this scenic location
    for (let i = 0; i < flightPath.length; i++) {
      const pathPoint = point([flightPath[i].lon, flightPath[i].lat]);
      const dist = distance(locationPoint, pathPoint);
      
      if (dist < minDistance) {
        minDistance = dist;
        nearestPathIndex = i;
      }
    }

    // Prefer location's own visibilityRadius; fall back to type-based default
    const fallback = DETECTION_THRESHOLDS[location.type] || 50;
    const threshold = location.visibilityRadius && location.visibilityRadius > 0
      ? location.visibilityRadius
      : fallback;
    
    // Check if location is within detection range
    if (minDistance <= threshold) {
      // Calculate progress along route (0-1)
      const detectionProgress = flightPath.length > 1 ? nearestPathIndex / (flightPath.length - 1) : 0;
      
      nearbyLocations.push({
        ...location,
        distanceFromPath: minDistance,
        nearestPathIndex,
        detectionProgress,
      });
    }
  }

  // Sort by detection progress (order along the route)
  return nearbyLocations.sort((a, b) => a.detectionProgress - b.detectionProgress);
}

/**
 * Check if aircraft is within modal trigger range of a specific scenic location
 * Uses smaller 2km threshold to trigger modal before reaching the marker
 * @param aircraftPosition Current aircraft position
 * @param scenicLocation Scenic location to check
 * @returns true if within modal trigger range
 */
export function isAircraftNearScenicLocationForModal(
  aircraftPosition: { lat: number; lon: number },
  scenicLocation: ScenicLocation
): boolean {
  const aircraftPoint = point([aircraftPosition.lon, aircraftPosition.lat]);
  const locationPoint = point([scenicLocation.lon, scenicLocation.lat]);
  const dist = distance(aircraftPoint, locationPoint);
  
  return dist <= MODAL_TRIGGER_THRESHOLD;
}

/**
 * Check if aircraft is within detection range of a specific scenic location
 * Uses larger thresholds for finding scenic locations near the flight path
 * @param aircraftPosition Current aircraft position
 * @param scenicLocation Scenic location to check
 * @returns true if within detection range
 */
export function isAircraftNearScenicLocation(
  aircraftPosition: { lat: number; lon: number },
  scenicLocation: ScenicLocation
): boolean {
  const aircraftPoint = point([aircraftPosition.lon, aircraftPosition.lat]);
  const locationPoint = point([scenicLocation.lon, scenicLocation.lat]);
  const dist = distance(aircraftPoint, locationPoint);
  // Prefer per-location visibility radius; fall back to type default
  const fallback = DETECTION_THRESHOLDS[scenicLocation.type] || 50;
  const threshold = scenicLocation.visibilityRadius && scenicLocation.visibilityRadius > 0
    ? scenicLocation.visibilityRadius
    : fallback;
  return dist <= threshold;
}

/**
 * Calculate distance between aircraft and scenic location
 * @param aircraftPosition Current aircraft position
 * @param scenicLocation Scenic location to check
 * @returns Distance in kilometers
 */
export function getDistanceToScenicLocation(
  aircraftPosition: { lat: number; lon: number },
  scenicLocation: ScenicLocation
): number {
  const aircraftPoint = point([aircraftPosition.lon, aircraftPosition.lat]);
  const locationPoint = point([scenicLocation.lon, scenicLocation.lat]);
  return distance(aircraftPoint, locationPoint);
}

/**
 * Get scenic locations that should trigger based on current progress and remaining unvisited locations
 * @param currentProgress Current flight progress (0-1)
 * @param nearbyLocations Array of scenic locations near the path
 * @param visitedIds Set of already visited location IDs
 * @param triggerRange Progress range to look ahead for triggering (default 0.01 = 1%)
 * @param earlyTriggerOffset How much earlier to trigger before the actual location (default 0.02 = 2%)
 * @returns Array of locations that should trigger now
 */
export function getLocationsToTrigger(
  currentProgress: number,
  nearbyLocations: ScenicLocationWithDetection[],
  visitedIds: Set<string>,
  triggerRange: number = 0.01,
  earlyTriggerOffset: number = 0.02
): ScenicLocationWithDetection[] {
  return nearbyLocations.filter(location => {
    // Skip if already visited
    if (visitedIds.has(location.name)) {
      return false;
    }
    
    // Trigger earlier than the actual detection point to allow for stopping before destination
    const adjustedDetectionPoint = Math.max(0, location.detectionProgress - earlyTriggerOffset);
    
    // Check if we've reached or passed the adjusted detection point
    const progressDiff = currentProgress - adjustedDetectionPoint;
    return progressDiff >= 0 && progressDiff <= triggerRange;
  });
}
