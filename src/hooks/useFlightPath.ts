import { useState, useEffect, useCallback, useRef } from 'react';
import { greatCirclePoints, getDistance, interpolateAlongPath, DEMO_AIRPORTS } from '@/lib/gis';
import type { FlightState, Airport, PathPoint, AnimationState } from '@/lib/types';

/**
 * Hook for managing flight path calculation, animation, and state
 */
export function useFlightPath() {
  const [flightState, setFlightState] = useState<FlightState | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Calculate and set up flight path between two airports
  const generateFlightPath = useCallback((departureCode: string, arrivalCode: string) => {
    const departure = DEMO_AIRPORTS.find((airport) => airport.code === departureCode);
    const arrival = DEMO_AIRPORTS.find((airport) => airport.code === arrivalCode);

    if (!departure || !arrival) {
      throw new Error('Invalid airport codes');
    }

    // Generate smooth great-circle path with 100 points for animation
    const path = greatCirclePoints(departure, arrival, 100);
    const totalDistance = getDistance(departure, arrival);

    const newFlightState: FlightState = {
      departure,
      arrival,
      path,
      currentPosition: 0,
      isPlaying: false,
      totalDistance,
    };

    setFlightState(newFlightState);
    setAnimationState(null);

    return newFlightState;
  }, []);

  // Start flight animation with configurable duration
  const startAnimation = useCallback(
    (durationMs: number = 10000) => {
      if (!flightState) return;

      setFlightState((prev) => (prev ? { ...prev, isPlaying: true } : null));
      setAnimationState({
        startTime: Date.now(),
        duration: durationMs,
        currentTime: 0,
      });
    },
    [flightState]
  );

  // Pause flight animation
  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setFlightState((prev) => (prev ? { ...prev, isPlaying: false } : null));
  }, []);

  // Reset flight to beginning
  const resetAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setFlightState((prev) =>
      prev
        ? {
            ...prev,
            currentPosition: 0,
            isPlaying: false,
          }
        : null
    );
    setAnimationState(null);
  }, []);

  // Manually set position (for slider control)
  const setPosition = useCallback((position: number) => {
    setFlightState((prev) =>
      prev
        ? {
            ...prev,
            currentPosition: Math.max(0, Math.min(1, position)),
          }
        : null
    );
  }, []);

  // Animation loop using requestAnimationFrame for smooth performance
  useEffect(() => {
    if (!flightState?.isPlaying || !animationState) return;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - animationState.startTime;
      const progress = Math.min(elapsed / animationState.duration, 1);

      setFlightState((prev) => (prev ? { ...prev, currentPosition: progress } : null));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setFlightState((prev) => (prev ? { ...prev, isPlaying: false } : null));
        setAnimationState(null);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [flightState?.isPlaying, animationState]);

  // Get current airplane position and bearing for map display
  const getCurrentPosition = useCallback((): PathPoint | null => {
    if (!flightState?.path.length) return null;
    return interpolateAlongPath(flightState.path, flightState.currentPosition);
  }, [flightState]);

  // Calculate remaining distance for UI display
  const getRemainingDistance = useCallback((): number => {
    if (!flightState) return 0;
    return flightState.totalDistance * (1 - flightState.currentPosition);
  }, [flightState]);

  return {
    flightState,
    generateFlightPath,
    startAnimation,
    pauseAnimation,
    resetAnimation,
    setPosition,
    getCurrentPosition,
    getRemainingDistance,
    // Expose animation progress for UI feedback
    isAnimating: flightState?.isPlaying ?? false,
    progress: flightState?.currentPosition ?? 0,
  };
}
