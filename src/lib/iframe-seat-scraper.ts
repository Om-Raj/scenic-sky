// Modular iframe seat scraping utilities for seatmap integration
import type { SeatRecommendationResult } from './seat-recommendation-types';
import { generateRecommendationSummary } from './seat-recommendation-engine';

/**
 * Scraped seat data extracted from iframe
 */
export interface ScrapedSeatData {
  seatNumber: string;      // data-number
  cabinClass: string;      // data-class
  cabinLabel: string;      // data-label (e.g., "Premium Economy")
  rowNumber: string;       // data-row-number
  features: SeatFeature[]; // parsed data-features JSON
  uid: string;            // data-seat-uid
}

/**
 * Individual seat feature with name and value
 */
export interface SeatFeature {
  name: string;
  value: '+' | '-' | string; // Usually '+' (positive), '-' (negative), or neutral
}

/**
 * Recommended seats result for display components
 */
export interface RecommendedSeatsResult {
  bestSide: 'left' | 'right';
  recommendedSeats: ScrapedSeatData[];
  reasoning: string[];
  totalSeatsFound: number;
  validSeatsAfterFiltering: number;
}

/**
 * Safely access the iframe document content
 * @param iframeElement The iframe element to access
 * @returns The iframe's document or null if not accessible
 */
export function getIframeDocument(iframeElement: HTMLIFrameElement): Document | null {
  try {
    // Check if iframe is loaded and has content
    if (!iframeElement.contentDocument && !iframeElement.contentWindow?.document) {
      console.warn('Iframe document not accessible - may not be loaded or cross-origin');
      return null;
    }
    
    return iframeElement.contentDocument || iframeElement.contentWindow?.document || null;
  } catch (error) {
    console.error('Error accessing iframe document:', error);
    return null;
  }
}

/**
 * Determine the best view side from existing seat recommendation result
 * @param seatRecommendationResult Result from the existing seat recommendation system
 * @returns The recommended aircraft side ('left' or 'right')
 */
export function getBestViewSide(seatRecommendationResult: SeatRecommendationResult | null): 'left' | 'right' {
  if (!seatRecommendationResult) {
    console.warn('No seat recommendation result provided, defaulting to left side');
    return 'left';
  }
  
  const summary = generateRecommendationSummary(seatRecommendationResult);
  return summary.recommendedSide;
}

/**
 * Collect all seats from the specified side of the aircraft
 * @param iframeDoc The iframe document containing the seatmap
 * @param side Which side to collect seats from ('left' or 'right')
 * @returns Array of seat elements from the specified side
 */
export function collectSeats(iframeDoc: Document, side: 'left' | 'right'): Element[] {
  // Find all seat elements (typically have class containing 'seat' and data-number attribute)
  const allSeats = iframeDoc.querySelectorAll('[data-number][data-class][data-features]');
  
  if (allSeats.length === 0) {
    console.warn('No seats found in iframe - seatmap may not be loaded');
    return [];
  }
  
  // Determine the rightmost letter for right-side seats
  const seatNumbers = Array.from(allSeats).map(seat => 
    seat.getAttribute('data-number') || ''
  ).filter(Boolean);
  
  const seatLetters = seatNumbers
    .map(num => num.slice(-1)) // Get last character (seat letter)
    .filter(letter => /[A-Z]/.test(letter)); // Only valid letters
  
  const rightmostLetter = seatLetters.sort().pop() || 'H'; // Default to 'H' if no letters found
  
  console.log(`Found seat letters: ${[...new Set(seatLetters)].sort().join(', ')}`);
  console.log(`Using rightmost letter: ${rightmostLetter}`);
  
  // Filter seats based on side
  const filteredSeats = Array.from(allSeats).filter(seat => {
    const seatNumber = seat.getAttribute('data-number') || '';
    const seatLetter = seatNumber.slice(-1);
    
    if (side === 'left') {
      // Left side: seats ending with 'A'
      return seatLetter === 'A';
    } else {
      // Right side: seats ending with the rightmost letter
      return seatLetter === rightmostLetter;
    }
  });
  
  console.log(`Collected ${filteredSeats.length} seats from ${side} side`);
  return filteredSeats;
}

/**
 * Filter seats based on feature validation rules
 * @param seats Array of seat elements to filter
 * @returns Array of valid seats that pass feature validation
 */
export function filterSeats(seats: Element[]): Element[] {
  return seats.filter(seat => {
    const featuresJson = seat.getAttribute('data-features');
    
    if (!featuresJson) {
      console.warn('Seat missing data-features attribute:', seat.getAttribute('data-number'));
      return false;
    }
    
    try {
      // Parse the features JSON (handle HTML entity encoding)
      const decodedJson = featuresJson
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      
      const features: SeatFeature[] = JSON.parse(decodedJson);
      
      // Exclude seats where any feature has value: "-"
      const hasNegativeFeature = features.some(feature => feature.value === '-');
      
      if (hasNegativeFeature) {
        console.log(`Filtering out seat ${seat.getAttribute('data-number')} - has negative features`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error parsing seat features:', error, featuresJson);
      return false;
    }
  });
}

/**
 * Extract seat data from seat elements into structured objects
 * @param seats Array of valid seat elements
 * @returns Array of structured seat data objects
 */
export function mapSeatData(seats: Element[]): ScrapedSeatData[] {
  return seats.map(seat => {
    const featuresJson = seat.getAttribute('data-features') || '[]';
    
    // Parse features with proper HTML entity decoding
    let features: SeatFeature[] = [];
    try {
      const decodedJson = featuresJson
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      
      features = JSON.parse(decodedJson);
    } catch (error) {
      console.error('Error parsing features for seat:', seat.getAttribute('data-number'), error);
    }
    
    return {
      seatNumber: seat.getAttribute('data-number') || '',
      cabinClass: seat.getAttribute('data-class') || '',
      cabinLabel: seat.getAttribute('data-label') || '',
      rowNumber: seat.getAttribute('data-row-number') || '',
      features,
      uid: seat.getAttribute('data-seat-uid') || '',
    };
  });
}

/**
 * Main function to scrape and process seats from iframe
 * @param iframeElement The seatmap iframe element
 * @param seatRecommendationResult Result from existing seat recommendation system
 * @returns Processed seat recommendations or null if failed
 */
export function scrapeRecommendedSeats(
  iframeElement: HTMLIFrameElement,
  seatRecommendationResult: SeatRecommendationResult | null
): RecommendedSeatsResult | null {
  try {
    // Step 1: Access iframe content
    const iframeDoc = getIframeDocument(iframeElement);
    if (!iframeDoc) {
      console.error('Cannot access iframe document');
      return null;
    }
    
    // Step 2: Determine best view side
    const bestSide = getBestViewSide(seatRecommendationResult);
    
    // Step 3: Collect seats from the best side
    const rawSeats = collectSeats(iframeDoc, bestSide);
    if (rawSeats.length === 0) {
      console.warn('No seats found on the recommended side');
      return null;
    }
    
    // Step 4: Filter seats based on features
    const validSeats = filterSeats(rawSeats);
    
    // Step 5: Extract seat data
    const seatData = mapSeatData(validSeats);
    
    // Step 6: Generate reasoning
    const summary = seatRecommendationResult ? 
      generateRecommendationSummary(seatRecommendationResult) : null;
    
    const reasoning = [
      `Selected ${bestSide} side based on scenic view analysis`,
      `Found ${rawSeats.length} total seats on ${bestSide} side`,
      `${validSeats.length} seats pass feature validation`,
      ...(summary?.reasoning || [])
    ];
    
    return {
      bestSide,
      recommendedSeats: seatData,
      reasoning,
      totalSeatsFound: rawSeats.length,
      validSeatsAfterFiltering: validSeats.length,
    };
    
  } catch (error) {
    console.error('Error scraping seats from iframe:', error);
    return null;
  }
}

/**
 * Format seat features for display
 * @param features Array of seat features
 * @returns Array of formatted feature strings
 */
export function formatSeatFeatures(features: SeatFeature[]): string[] {
  return features.map(feature => {
    const formattedName = feature.name
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
    
    const indicator = feature.value === '+' ? '✓' : 
                     feature.value === '-' ? '✗' : 
                     feature.value;
    
    return `${formattedName} ${indicator}`;
  });
}

/**
 * Get display class for seat based on cabin class
 * @param cabinClass The cabin class code (P, Y, F, etc.)
 * @returns CSS class string for styling
 */
export function getSeatDisplayClass(cabinClass: string): string {
  switch (cabinClass.toLowerCase()) {
    case 'f':
    case 'first':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'j':
    case 'business':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'p':
    case 'premium':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'y':
    case 'economy':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
