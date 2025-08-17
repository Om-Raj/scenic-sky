import React, { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw } from 'lucide-react';
import type { FlightState } from '@/lib/types';

interface FlightPathProps {
  map: maplibregl.Map;
  flightState: FlightState | null;
  progress: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onProgressChange: (progress: number) => void;
  currentTime: string;
  timeLeft: string;
  progressPercent: number;
  isAnimationPaused?: boolean; // New prop to track scenic modal pause state
  onResume?: () => void; // New prop for resuming from scenic modal
}

/**
 * Floating control panel for flight animation
 * Designed for aircraft-centered map view
 */
export function FlightPath({ 
  map, 
  flightState, 
  progress, 
  isPlaying, 
  onPlay, 
  onPause, 
  onReset, 
  onProgressChange, 
  currentTime,
  timeLeft,
  progressPercent,
  isAnimationPaused = false,
  onResume
}: FlightPathProps) {
  // Add flight path to map when flightState changes
  useEffect(() => {
    if (!flightState || !map) return;

    // Remove existing path and markers
    if (map.getSource('flight-path')) {
      map.removeLayer('flight-path-line');
      map.removeSource('flight-path');
    }

    // Add flight path as GeoJSON line
    const pathCoordinates = flightState.path.map((point) => [point.lon, point.lat]);

    map.addSource('flight-path', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: pathCoordinates,
        },
      },
    });

    // Style the flight path line
    map.addLayer({
      id: 'flight-path-line',
      type: 'line',
      source: 'flight-path',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ef4444', // Red flight path
        'line-width': 2,
        'line-opacity': 0.6,
      },
    });

    // Cleanup function
    return () => {
      try {
        if (map && map.isStyleLoaded && map.isStyleLoaded() && map.getSource('flight-path')) {
          if (map.getLayer('flight-path-line')) {
            map.removeLayer('flight-path-line');
          }
          map.removeSource('flight-path');
        }
      } catch (error) {
        console.warn('Error cleaning up flight path:', error);
      }
    };
  }, [flightState, map]);

  // Handle slider change for manual position control
  const handleSliderChange = (value: number[]) => {
    if (!isPlaying) {
      onProgressChange(value[0] / 100);
    }
  };

  if (!flightState) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-sm px-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20 mx-auto">
        <div className="flex flex-col space-y-3">
          {/* Current Time and Progress */}
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {currentTime}
            </div>
            <div className="text-sm text-gray-600">
              {progressPercent}% • {timeLeft} remaining
            </div>
          </div>

          {/* Progress Slider */}
          <div className="px-2">
            <Slider
              value={[progress * 100]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              className="w-full [&_.relative.h-2]:bg-blue-200 [&_.absolute.h-full]:bg-blue-500 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:bg-white"
              disabled={isPlaying}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="px-4 py-2 rounded-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              variant={isAnimationPaused ? "default" : (isPlaying ? "default" : "outline")}
              size="sm"
              onClick={isAnimationPaused ? onResume : (isPlaying ? onPause : onPlay)}
              className="px-6 py-2 rounded-full"
            >
              {isAnimationPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </Button>
            {/* View button removed per UI request */}
          </div>
        </div>
      </div>
    </div>
  );
}
