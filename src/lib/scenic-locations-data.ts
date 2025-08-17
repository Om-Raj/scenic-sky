// Predefined dataset of scenic locations worldwide
import type { ScenicLocation } from './seat-recommendation-types';
import { SCENIC_LOCATIONS } from '@/lib/constants/scenic-locations';


/**
 * Remove duplicate scenic locations by normalized name + coords.
 * Keeps the first occurrence (preserves original list ordering where possible).
 */
function dedupeLocations(arr: ScenicLocation[]): ScenicLocation[] {
  const seen = new Map<string, ScenicLocation>();
  for (const loc of arr) {
    // use normalized name + rounded coords as a stable key
    const key = `${loc.name.trim().toLowerCase()}|${loc.lat.toFixed(6)}|${loc.lon.toFixed(6)}`;
    if (!seen.has(key)) seen.set(key, loc);
  }
  return Array.from(seen.values());
}

/**
 * Get scenic locations filtered by type and popularity
 * @param minLikes Minimum number of likes to include
 * @param types Array of location types to include
 * @returns Filtered array of scenic locations
 */
export function getFilteredScenicLocations(
  minLikes: number = 0,
  types: ScenicLocation['type'][] = ['mountain', 'volcano', 'ocean', 'city', 'landmark', 'natural', 'cultural']
): ScenicLocation[] {
  return SCENIC_LOCATIONS.filter(
    location => location.likes >= minLikes && types.includes(location.type)
  );
}

/**
 * Get top scenic locations by popularity
 * @param count Number of locations to return
 * @param types Array of location types to include
 * @returns Top scenic locations sorted by likes
 */
export function getTopScenicLocations(
  count: number = 20,
  types: ScenicLocation['type'][] = ['mountain', 'volcano', 'ocean', 'city', 'landmark', 'natural', 'cultural']
): ScenicLocation[] {
  return SCENIC_LOCATIONS
    .filter(location => types.includes(location.type))
    .sort((a, b) => b.likes - a.likes)
    .slice(0, count);
}
