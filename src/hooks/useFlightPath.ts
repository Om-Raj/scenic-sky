import { useState, useEffect, useCallback, useRef } from 'react';
import { greatCirclePoints, getDistance, interpolateAlongPath, DEMO_AIRPORTS } from '@/lib/gis';
import type { FlightState, PathPoint, AnimationState } from '@/lib/types';

/**
 * Hook for managing flight path calculation, animation, and state
 */
export function useFlightPath() {
  const [flightState, setFlightState] = useState<FlightState | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Helper function to stop any running animation
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

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
      
      // Store the current position as the starting point for this animation
      const currentProgress = flightState.currentPosition;
      const remainingDuration = durationMs * (1 - currentProgress);
      
      setAnimationState({
        startTime: Date.now(),
        duration: remainingDuration,
        currentTime: 0,
        startPosition: currentProgress, // Remember where we started this animation
      });
    },
    [flightState]
  );

  // Pause flight animation
  const pauseAnimation = useCallback(() => {
    stopAnimation();
    setFlightState((prev) => (prev ? { ...prev, isPlaying: false } : null));
  }, [stopAnimation]);

  // Reset flight to beginning
  const resetAnimation = useCallback(() => {
    stopAnimation();
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
  }, [stopAnimation]);

  // Manually set position (for slider control)
  const setPosition = useCallback((position: number) => {
    // Clear any running animation when manually setting position
    stopAnimation();
    
    setFlightState((prev) =>
      prev
        ? {
            ...prev,
            currentPosition: Math.max(0, Math.min(1, position)),
            isPlaying: false, // Stop animation when manually setting position
          }
        : null
    );
    
    // Clear animation state so next play starts from this new position
    setAnimationState(null);
  }, [stopAnimation]);

  // Animation loop using requestAnimationFrame for smooth performance
  // Resumes from current position when play is pressed after pause
  useEffect(() => {
    if (!flightState?.isPlaying || !animationState) return;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - animationState.startTime;
      const animationProgress = Math.min(elapsed / animationState.duration, 1);
      
      // Calculate new position: start position + progress from that point
      // This ensures animation resumes from where it was paused
      const progressFromStart = animationProgress * (1 - animationState.startPosition);
      const newPosition = animationState.startPosition + progressFromStart;

      setFlightState((prev) => (prev ? { ...prev, currentPosition: newPosition } : null));

      if (animationProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - airplane should be at destination
        setFlightState((prev) => (prev ? { ...prev, currentPosition: 1, isPlaying: false } : null));
        setAnimationState(null);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      stopAnimation();
    };
  }, [flightState?.isPlaying, animationState, stopAnimation]);

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
