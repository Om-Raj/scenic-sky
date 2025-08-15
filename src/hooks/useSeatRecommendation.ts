// React hook for managing seat recommendation state and calculations
import { useState, useEffect, useCallback } from 'react';
import type { 
  SeatRecommendationInput, 
  SeatRecommendationResult 
} from '../lib/seat-recommendation-types';
import { 
  generateSeatRecommendation,
  getPrioritizedScenicViews,
  getFormattedSolarEvents,
  generateRecommendationSummary
} from '../lib/seat-recommendation-engine';

interface UseSeatRecommendationState {
  result: SeatRecommendationResult | null;
  loading: boolean;
  error: string | null;
  recommendationSummary: ReturnType<typeof generateRecommendationSummary> | null;
}

interface UseSeatRecommendationReturn extends UseSeatRecommendationState {
  generateRecommendation: (input: SeatRecommendationInput) => Promise<void>;
  getPrioritizedViews: (side: 'left' | 'right') => ReturnType<typeof getPrioritizedScenicViews>;
  getFormattedEvents: (side: 'left' | 'right') => ReturnType<typeof getFormattedSolarEvents>;
  reset: () => void;
}

/**
 * Hook for managing seat recommendation calculations and state
 * @returns Seat recommendation state and utility functions
 */
export function useSeatRecommendation(): UseSeatRecommendationReturn {
  const [state, setState] = useState<UseSeatRecommendationState>({
    result: null,
    loading: false,
    error: null,
    recommendationSummary: null,
  });

  /**
   * Generate seat recommendation based on flight parameters
   * @param input Flight details
   */
  const generateRecommendation = useCallback(async (input: SeatRecommendationInput) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Validate input before processing
      if (!input.departureAirportCode || !input.arrivalAirportCode) {
        throw new Error('Departure and arrival airports are required');
      }
      
      if (!input.departureDate || !input.departureTime) {
        throw new Error('Departure date and time are required');
      }
      
      if (!input.arrivalDate || !input.arrivalTime) {
        throw new Error('Arrival date and time are required');
      }
      
      // Generate the recommendation
      const result = await generateSeatRecommendation(input);
      const recommendationSummary = generateRecommendationSummary(result);
      
      setState({
        result,
        loading: false,
        error: null,
        recommendationSummary,
      });
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to generate recommendation',
      }));
    }
  }, []);

  /**
   * Get prioritized scenic views for specified side
   * @param side Aircraft side ('left' or 'right')
   * @returns Prioritized scenic locations
   */
  const getPrioritizedViews = useCallback((side: 'left' | 'right') => {
    if (!state.result) return [];
    return getPrioritizedScenicViews(state.result, side);
  }, [state.result]);

  /**
   * Get formatted solar events for specified side
   * @param side Aircraft side ('left' or 'right')
   * @returns Formatted solar events with timing
   */
  const getFormattedEvents = useCallback((side: 'left' | 'right') => {
    if (!state.result) return [];
    return getFormattedSolarEvents(state.result, side);
  }, [state.result]);

  /**
   * Reset recommendation state
   */
  const reset = useCallback(() => {
    setState({
      result: null,
      loading: false,
      error: null,
      recommendationSummary: null,
    });
  }, []);

  return {
    ...state,
    generateRecommendation,
    getPrioritizedViews,
    getFormattedEvents,
    reset,
  };
}

/**
 * Hook for extracting simple seat recommendation from URL parameters
 * Compatible with existing flight form structure
 * @param searchParams URL search parameters
 * @returns Seat recommendation input object or null
 */
export function useSeatRecommendationFromParams(
  searchParams: URLSearchParams
): SeatRecommendationInput | null {
  const [input, setInput] = useState<SeatRecommendationInput | null>(null);

  useEffect(() => {
    const airplaneModel = searchParams.get('airplaneModel');
    const departureDate = searchParams.get('departureDate');
    const departureTime = searchParams.get('departureTime');
    const arrivalDate = searchParams.get('arrivalDate');
    const arrivalTime = searchParams.get('arrivalTime');
    const departure = searchParams.get('departure');
    const arrival = searchParams.get('arrival');

    // Check if all required parameters are present
    if (
      airplaneModel &&
      departureDate &&
      departureTime &&
      arrivalDate &&
      arrivalTime &&
      departure &&
      arrival
    ) {
      setInput({
        airplaneModel,
        departureDate,
        departureTime,
        arrivalDate,
        arrivalTime,
        departureAirportCode: departure,
        arrivalAirportCode: arrival,
      });
    } else {
      setInput(null);
    }
  }, [searchParams]);

  return input;
}

/**
 * Hook for automatic seat recommendation generation based on URL parameters
 * @param searchParams URL search parameters
 * @returns Complete seat recommendation state
 */
export function useAutoSeatRecommendation(
  searchParams: URLSearchParams
): UseSeatRecommendationReturn {
  const recommendationHook = useSeatRecommendation();
  const input = useSeatRecommendationFromParams(searchParams);

  // Automatically generate recommendation when input changes
  useEffect(() => {
    if (input && !recommendationHook.loading && !recommendationHook.result) {
      recommendationHook.generateRecommendation(input);
    }
  }, [input, recommendationHook]);

  return recommendationHook;
}
