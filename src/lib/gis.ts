import { greatCircle } from '@turf/great-circle';
import { bearing } from '@turf/bearing';
import { distance } from '@turf/distance';
import { point } from '@turf/turf';
import type { Airport, PathPoint } from './types';

/**
 * Demo airport data with exact coordinates as specified
 */
export const DEMO_AIRPORTS: Airport[] = [
  { code: 'JFK', name: 'New York John F. Kennedy', lat: 40.6413, lon: -73.7781 },
  { code: 'LAX', name: 'Los Angeles Intl', lat: 33.9416, lon: -118.4085 },
  { code: 'LHR', name: 'London Heathrow', lat: 51.47, lon: -0.4543 },
  { code: 'DEL', name: 'Indira Gandhi Intl, Delhi', lat: 28.5562, lon: 77.1 },
  { code: 'DXB', name: 'Dubai Intl', lat: 25.2532, lon: 55.3657 },
];

/**
 * Generates smooth great-circle path between two airports
 * @param start Starting airport
 * @param end Destination airport
 * @param numPoints Number of intermediate points for smooth animation
 * @returns Array of path points with calculated bearings
 */
export function greatCirclePoints(
  start: Airport,
  end: Airport,
  numPoints: number = 100
): PathPoint[] {
  const startPoint = point([start.lon, start.lat]);
  const endPoint = point([end.lon, end.lat]);

  // Generate great-circle line using Turf.js
  const line = greatCircle(startPoint, endPoint);
  const coordinates = line.geometry.coordinates;

  // Sample points evenly along the path for smooth animation
  const sampledPoints: PathPoint[] = [];
  const totalSegments = coordinates.length - 1;

  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    const segmentIndex = Math.floor(ratio * totalSegments);
    const segmentRatio = ratio * totalSegments - segmentIndex;

    let currentCoord: number[];
    if (segmentIndex >= coordinates.length - 1) {
      currentCoord = coordinates[coordinates.length - 1];
    } else {
      // Linear interpolation between two adjacent points
      const coord1 = coordinates[segmentIndex];
      const coord2 = coordinates[segmentIndex + 1];
      currentCoord = [
        coord1[0] + (coord2[0] - coord1[0]) * segmentRatio,
        coord1[1] + (coord2[1] - coord1[1]) * segmentRatio,
      ];
    }

    // Calculate bearing for airplane rotation (direction of travel)
    let bearing = 0;
    if (i < numPoints) {
      const nextIndex = Math.min(segmentIndex + 1, coordinates.length - 1);
      if (nextIndex < coordinates.length) {
        const currentPoint = point(currentCoord);
        const nextPoint = point(coordinates[nextIndex]);
        bearing = getBearing(currentPoint, nextPoint);
      }
    }

    sampledPoints.push({
      lat: currentCoord[1],
      lon: currentCoord[0],
      bearing,
    });
  }

  return sampledPoints;
}

/**
 * Calculate bearing between two geographic points
 * @param from Starting point
 * @param to Ending point
 * @returns Bearing in degrees (0-360)
 */
export function getBearing(from: any, to: any): number {
  const bearingValue = bearing(from, to);
  // Convert to 0-360 range for easier rotation calculations
  return bearingValue < 0 ? bearingValue + 360 : bearingValue;
}

/**
 * Calculate great-circle distance between two airports
 * @param start Starting airport
 * @param end Destination airport
 * @returns Distance in kilometers
 */
export function getDistance(start: Airport, end: Airport): number {
  const startPoint = point([start.lon, start.lat]);
  const endPoint = point([end.lon, end.lat]);
  return distance(startPoint, endPoint);
}

/**
 * Interpolate position along path based on progress (0-1)
 * @param path Array of path points
 * @param progress Progress from 0 to 1
 * @returns Current position and bearing
 */
export function interpolateAlongPath(path: PathPoint[], progress: number): PathPoint {
  if (path.length === 0) return { lat: 0, lon: 0, bearing: 0 };
  if (progress <= 0) return path[0];
  if (progress >= 1) return path[path.length - 1];

  // Find the two points to interpolate between
  const segmentLength = 1 / (path.length - 1);
  const segmentIndex = Math.floor(progress / segmentLength);
  const segmentProgress = (progress % segmentLength) / segmentLength;

  if (segmentIndex >= path.length - 1) {
    return path[path.length - 1];
  }

  const point1 = path[segmentIndex];
  const point2 = path[segmentIndex + 1];

  // Linear interpolation between points for smooth movement
  return {
    lat: point1.lat + (point2.lat - point1.lat) * segmentProgress,
    lon: point1.lon + (point2.lon - point1.lon) * segmentProgress,
    bearing: point1.bearing + (point2.bearing! - point1.bearing!) * segmentProgress,
  };
}
