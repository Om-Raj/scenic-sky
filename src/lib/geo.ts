// Simple geographic utilities for the route page

export interface LatLon {
  lat: number;
  lon: number;
}

/**
 * Linear interpolation between two geographic points
 * This is a simplified version - for production use great circle interpolation
 */
export function interpolateLatLon(start: LatLon, end: LatLon, progress: number): LatLon {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lon: start.lon + (end.lon - start.lon) * progress,
  };
}

/**
 * Sample points along a great circle route
 * This is a simplified linear sampling - for production use proper great circle calculations
 */
export function sampleGreatCircle(start: LatLon, end: LatLon, numPoints: number = 100): LatLon[] {
  const points: LatLon[] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const progress = i / numPoints;
    points.push(interpolateLatLon(start, end, progress));
  }
  
  return points;
}

/**
 * Calculate the distance between two points using the haversine formula
 */
export function calculateDistance(start: LatLon, end: LatLon): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(end.lat - start.lat);
  const dLon = toRadians(end.lon - start.lon);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(start.lat)) * Math.cos(toRadians(end.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate bearing between two points
 */
export function calculateBearing(start: LatLon, end: LatLon): number {
  const dLon = toRadians(end.lon - start.lon);
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360; // Normalize to 0-360
}
