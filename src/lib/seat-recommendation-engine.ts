// Main seat recommendation engine that orchestrates scenic location and solar event analysis
import type { 
  SeatRecommendationInput, 
  SeatRecommendationResult, 
  SideView 
} from './seat-recommendation-types';
import type { Airport, PathPoint } from './types';
import { DEMO_AIRPORTS, greatCirclePoints, getDistance } from './gis';
import { createDateTimeInTimezone } from './solar-calculations';
import { SCENIC_LOCATIONS } from './scenic-locations-data';
import { 
  findVisibleScenicLocations, 
  groupLocationsBySide 
} from './scenic-location-calculations';
import { 
  findSolarEventsAlongPath, 
  groupSolarEventsBySide 
} from './solar-event-calculations';

/**
 * Main function to generate seat recommendations based on flight parameters
 * @param input Flight details including airports, dates, and times
 * @returns Complete seat recommendation with scenic views and solar events
 */
export async function generateSeatRecommendation(
  input: SeatRecommendationInput
): Promise<SeatRecommendationResult> {
  // Validate and parse input data
  const { departureAirport, arrivalAirport, startDateTime, endDateTime } = 
    parseFlightInput(input);
  
  // Generate great circle flight path with sufficient points for accuracy
  const flightPath = greatCirclePoints(departureAirport, arrivalAirport, 200);
  
  // Calculate basic flight metrics
  const routeDistance = getDistance(departureAirport, arrivalAirport);
  const flightDuration = calculateFlightDuration(startDateTime, endDateTime);
  
  // Find scenic locations visible along the flight path
  const detailedScenicLocations = findVisibleScenicLocations(
    flightPath, 
    SCENIC_LOCATIONS
  );
  
  // Group scenic locations by aircraft side
  const scenicViews = groupLocationsBySide(detailedScenicLocations);
  
  // Find solar events (sunrise, sunset, golden hour, blue hour) along the path
  const detailedSolarEvents = findSolarEventsAlongPath(
    flightPath,
    startDateTime,
    endDateTime,
    8 // Sample every 8 minutes for better accuracy
  );
  
  // Group solar events by aircraft side
  const solarEvents = groupSolarEventsBySide(detailedSolarEvents);
  
  return {
    scenicViews,
    solarEvents,
    detailedScenicLocations,
    detailedSolarEvents,
    routeDistance,
    flightDuration,
  };
}

/**
 * Parse and validate flight input data
 * @param input Raw flight input data
 * @returns Validated airports and datetime objects
 */
function parseFlightInput(input: SeatRecommendationInput): {
  departureAirport: Airport;
  arrivalAirport: Airport;
  startDateTime: Date;
  endDateTime: Date;
} {
  // Find airports in demo data
  const departureAirport = DEMO_AIRPORTS.find(
    airport => airport.code === input.departureAirportCode
  );
  const arrivalAirport = DEMO_AIRPORTS.find(
    airport => airport.code === input.arrivalAirportCode
  );
  
  if (!departureAirport) {
    throw new Error(`Departure airport ${input.departureAirportCode} not found`);
  }
  if (!arrivalAirport) {
    throw new Error(`Arrival airport ${input.arrivalAirportCode} not found`);
  }
  if (departureAirport.code === arrivalAirport.code) {
    throw new Error('Departure and arrival airports cannot be the same');
  }
  
  // Create datetime objects with proper timezone handling
  const startDateTime = createDateTimeInTimezone(
    input.departureDate,
    input.departureTime,
    departureAirport.timezone
  );
  
  const endDateTime = createDateTimeInTimezone(
    input.arrivalDate,
    input.arrivalTime,
    arrivalAirport.timezone
  );
  
  // Validate flight timing
  if (endDateTime <= startDateTime) {
    throw new Error('Arrival time must be after departure time');
  }
  
  return {
    departureAirport,
    arrivalAirport,
    startDateTime,
    endDateTime,
  };
}

/**
 * Calculate flight duration in hours
 * @param startTime Departure datetime
 * @param endTime Arrival datetime
 * @returns Flight duration in hours
 */
function calculateFlightDuration(startTime: Date, endTime: Date): number {
  const durationMs = endTime.getTime() - startTime.getTime();
  return durationMs / (1000 * 60 * 60); // Convert to hours
}

/**
 * Get scenic location recommendations with priority scoring
 * @param result Seat recommendation result
 * @param side Aircraft side ('left' or 'right')
 * @returns Prioritized list of scenic locations for the specified side
 */
export function getPrioritizedScenicViews(
  result: SeatRecommendationResult,
  side: 'left' | 'right'
): Array<{
  name: string;
  type: string;
  likes: number;
  visibility: string;
  distanceFromRoute: number;
  description?: string;
}> {
  return result.detailedScenicLocations
    .filter(location => location.side === side)
    .map(location => ({
      name: location.name,
      type: location.type,
      likes: location.likes,
      visibility: location.visibility || 'fair',
      distanceFromRoute: Math.round(location.distanceFromRoute),
      description: location.description,
    }))
    .sort((a, b) => {
      // Sort by visibility quality, then by popularity
      const visibilityOrder = { excellent: 4, good: 3, fair: 2, poor: 1 };
      const aScore = visibilityOrder[a.visibility as keyof typeof visibilityOrder] * 1000 + a.likes;
      const bScore = visibilityOrder[b.visibility as keyof typeof visibilityOrder] * 1000 + b.likes;
      return bScore - aScore;
    });
}

/**
 * Get solar event recommendations with timing information
 * @param result Seat recommendation result
 * @param side Aircraft side ('left' or 'right')
 * @returns Formatted solar events for the specified side
 */
export function getFormattedSolarEvents(
  result: SeatRecommendationResult,
  side: 'left' | 'right'
): Array<{
  type: string;
  time: string;
  elevation: number;
  visibility: string;
  progress: number;
}> {
  return result.detailedSolarEvents
    .filter(event => event.side === side)
    .map(event => ({
      type: event.type.charAt(0).toUpperCase() + event.type.slice(1).replace('-', ' '),
      time: event.time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short',
      }),
      elevation: Math.round(event.elevation * 10) / 10,
      visibility: event.visibility,
      progress: Math.round(event.progress * 100),
    }))
    .sort((a, b) => a.progress - b.progress);
}

/**
 * Generate summary recommendation for seat selection
 * @param result Complete seat recommendation result
 * @returns Recommendation summary with best side and reasoning
 */
export function generateRecommendationSummary(
  result: SeatRecommendationResult
): {
  recommendedSide: 'left' | 'right';
  reasoning: string[];
  leftScore: number;
  rightScore: number;
} {
  const leftScenicCount = result.detailedScenicLocations.filter(l => l.side === 'left').length;
  const rightScenicCount = result.detailedScenicLocations.filter(l => l.side === 'right').length;
  
  const leftSolarCount = result.detailedSolarEvents.filter(e => e.side === 'left').length;
  const rightSolarCount = result.detailedSolarEvents.filter(e => e.side === 'right').length;
  
  // Calculate quality scores for scenic locations
  const leftScenicScore = result.detailedScenicLocations
    .filter(l => l.side === 'left')
    .reduce((sum, l) => {
      const visibilityScore = l.visibility === 'excellent' ? 4 : 
                            l.visibility === 'good' ? 3 : 
                            l.visibility === 'fair' ? 2 : 1;
      return sum + visibilityScore + (l.likes / 10000);
    }, 0);
  
  const rightScenicScore = result.detailedScenicLocations
    .filter(l => l.side === 'right')
    .reduce((sum, l) => {
      const visibilityScore = l.visibility === 'excellent' ? 4 : 
                            l.visibility === 'good' ? 3 : 
                            l.visibility === 'fair' ? 2 : 1;
      return sum + visibilityScore + (l.likes / 10000);
    }, 0);
  
  const leftScore = leftScenicScore + leftSolarCount * 2;
  const rightScore = rightScenicScore + rightSolarCount * 2;
  
  const recommendedSide = leftScore >= rightScore ? 'left' : 'right';
  
  const reasoning: string[] = [];
  
  if (leftScenicCount > rightScenicCount) {
    reasoning.push(`More scenic locations on left side (${leftScenicCount} vs ${rightScenicCount})`);
  } else if (rightScenicCount > leftScenicCount) {
    reasoning.push(`More scenic locations on right side (${rightScenicCount} vs ${leftScenicCount})`);
  }
  
  if (leftSolarCount > rightSolarCount) {
    reasoning.push(`More solar events on left side (${leftSolarCount} vs ${rightSolarCount})`);
  } else if (rightSolarCount > leftSolarCount) {
    reasoning.push(`More solar events on right side (${rightSolarCount} vs ${leftSolarCount})`);
  }
  
  // Highlight top scenic locations
  const topLocations = result.detailedScenicLocations
    .filter(l => l.side === recommendedSide && l.visibility === 'excellent')
    .slice(0, 2);
  
  if (topLocations.length > 0) {
    reasoning.push(`Excellent views of ${topLocations.map(l => l.name).join(' and ')}`);
  }
  
  return {
    recommendedSide,
    reasoning,
    leftScore: Math.round(leftScore),
    rightScore: Math.round(rightScore),
  };
}
