// React hook for iframe seat scraping and integration with seat recommendation system
import { useState, useEffect, useCallback } from 'react';
import type { SeatRecommendationResult } from '../lib/seat-recommendation-types';
import type { RecommendedSeatsResult, ScrapedSeatData } from '../lib/iframe-seat-scraper';
import { scrapeRecommendedSeats } from '../lib/iframe-seat-scraper';

interface UseIframeSeatScrapingState {
  scrapedSeats: RecommendedSeatsResult | null;
  loading: boolean;
  error: string | null;
  lastScrapedAt: Date | null;
}

interface UseIframeSeatScrapingReturn extends UseIframeSeatScrapingState {
  scrapeSeats: (iframeElement: HTMLIFrameElement) => void;
  reset: () => void;
  refetchSeats: () => void;
}

/**
 * Hook for scraping seats from seatmap iframe and integrating with seat recommendations
 * @param seatRecommendationResult Result from the seat recommendation system
 * @param autoScrapeOnChange Whether to automatically scrape when recommendation changes
 * @returns Seat scraping state and control functions
 */
export function useIframeSeatScraping(
  seatRecommendationResult: SeatRecommendationResult | null,
  autoScrapeOnChange: boolean = false
): UseIframeSeatScrapingReturn {
  const [state, setState] = useState<UseIframeSeatScrapingState>({
    scrapedSeats: null,
    loading: false,
    error: null,
    lastScrapedAt: null,
  });

  // Store iframe reference for auto-refetch functionality
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);

  /**
   * Scrape seats from the provided iframe element
   */
  const scrapeSeats = useCallback((iframeElement: HTMLIFrameElement) => {
    if (!iframeElement) {
      setState(prev => ({
        ...prev,
        error: 'No iframe element provided',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    // Store iframe reference for potential re-scraping
    setIframeRef(iframeElement);

    try {
      // Use the seat scraping utility
      const result = scrapeRecommendedSeats(iframeElement, seatRecommendationResult);
      
      if (result) {
        setState({
          scrapedSeats: result,
          loading: false,
          error: null,
          lastScrapedAt: new Date(),
        });
        
        console.log(`Successfully scraped ${result.recommendedSeats.length} recommended seats from ${result.bestSide} side`);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to scrape seats - iframe may not be loaded or no valid seats found',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred while scraping seats',
      }));
      console.error('Error in seat scraping:', error);
    }
  }, [seatRecommendationResult]);

  /**
   * Re-scrape seats using the last used iframe element
   */
  const refetchSeats = useCallback(() => {
    if (iframeRef) {
      scrapeSeats(iframeRef);
    } else {
      setState(prev => ({
        ...prev,
        error: 'No iframe reference available for refetch',
      }));
    }
  }, [iframeRef, scrapeSeats]);

  /**
   * Reset the scraping state
   */
  const reset = useCallback(() => {
    setState({
      scrapedSeats: null,
      loading: false,
      error: null,
      lastScrapedAt: null,
    });
    setIframeRef(null);
  }, []);

  // Auto-scrape when seat recommendation changes (if enabled)
  useEffect(() => {
    if (autoScrapeOnChange && seatRecommendationResult && iframeRef) {
      console.log('Auto-scraping seats due to seat recommendation change');
      scrapeSeats(iframeRef);
    }
  }, [seatRecommendationResult, autoScrapeOnChange, iframeRef, scrapeSeats]);

  return {
    ...state,
    scrapeSeats,
    reset,
    refetchSeats,
  };
}

/**
 * Hook for managing selected seat state with iframe integration
 * @param scrapedSeats Array of scraped seat data
 * @returns Selected seat state and selection functions
 */
export function useIframeSeatSelection(
  scrapedSeats: ScrapedSeatData[] | null
): {
  selectedSeat: ScrapedSeatData | null;
  selectSeat: (seat: ScrapedSeatData) => void;
  clearSelection: () => void;
  isValidSelection: boolean;
} {
  const [selectedSeat, setSelectedSeat] = useState<ScrapedSeatData | null>(null);

  // Clear selection if scraped seats change
  useEffect(() => {
    if (scrapedSeats && selectedSeat) {
      // Check if current selection is still valid
      const stillValid = scrapedSeats.some(seat => seat.uid === selectedSeat.uid);
      if (!stillValid) {
        setSelectedSeat(null);
      }
    }
  }, [scrapedSeats, selectedSeat]);

  const selectSeat = useCallback((seat: ScrapedSeatData) => {
    setSelectedSeat(seat);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSeat(null);
  }, []);

  const isValidSelection = selectedSeat !== null && 
    (scrapedSeats?.some(seat => seat.uid === selectedSeat.uid) ?? false);

  return {
    selectedSeat,
    selectSeat,
    clearSelection,
    isValidSelection,
  };
}

/**
 * Utility hook to detect when iframe is fully loaded and ready for scraping
 * @param iframeElement The iframe element to monitor
 * @returns Loading state and ready status
 */
export function useIframeLoadState(iframeElement: HTMLIFrameElement | null): {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
} {
  const [state, setState] = useState({
    isLoading: true,
    isReady: false,
    error: null as string | null,
  });

  useEffect(() => {
    if (!iframeElement) {
      setState({
        isLoading: false,
        isReady: false,
        error: 'No iframe element provided',
      });
      return;
    }

    const checkIframeReady = () => {
      try {
        const doc = iframeElement.contentDocument || iframeElement.contentWindow?.document;
        
        if (doc && doc.readyState === 'complete') {
          // Additional check for seatmap content
          const seats = doc.querySelectorAll('[data-number]');
          
          if (seats.length > 0) {
            setState({
              isLoading: false,
              isReady: true,
              error: null,
            });
          } else {
            // Iframe loaded but no seats found yet
            setState(prev => ({
              ...prev,
              isLoading: true,
              error: 'Seatmap content not ready',
            }));
          }
        }
      } catch (error) {
        setState({
          isLoading: false,
          isReady: false,
          error: 'Cannot access iframe content - possible cross-origin restriction',
        });
      }
    };

    // Initial check
    checkIframeReady();

    // Set up event listeners
    const handleLoad = () => {
      // Small delay to ensure content is fully rendered
      setTimeout(checkIframeReady, 500);
    };

    const handleError = () => {
      setState({
        isLoading: false,
        isReady: false,
        error: 'Failed to load iframe content',
      });
    };

    iframeElement.addEventListener('load', handleLoad);
    iframeElement.addEventListener('error', handleError);

    // Polling fallback for dynamic content
    const pollInterval = setInterval(checkIframeReady, 1000);

    return () => {
      iframeElement.removeEventListener('load', handleLoad);
      iframeElement.removeEventListener('error', handleError);
      clearInterval(pollInterval);
    };
  }, [iframeElement]);

  return state;
}
