'use client';

import React, { useState, useCallback } from 'react';
import { HeroForm } from '@/components/HeroForm';
import { Map } from '@/components/Map';
import { FlightPath } from '@/components/FlightPath';
import { useFlightPath } from '@/hooks/useFlightPath';
import type { FlightFormData } from '@/lib/types';
import maplibregl from 'maplibre-gl';

export default function Home() {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { 
    flightState, 
    generateFlightPath, 
    startAnimation, 
    pauseAnimation, 
    resetAnimation, 
    setPosition, 
    progress, 
    isAnimating 
  } = useFlightPath();

  // Handle form submission to visualize flight path
  const handleFlightSubmit = useCallback(
    async (formData: FlightFormData) => {
      setIsLoading(true);

      try {
        // Generate flight path using great-circle calculation
        generateFlightPath(formData.departure, formData.arrival);
      } catch (error) {
        console.error('Error generating flight path:', error);
        // In a real app, you'd show user-friendly error messaging
      } finally {
        setIsLoading(false);
      }
    },
    [generateFlightPath]
  );

  // Callback when map is initialized and ready
  const handleMapLoad = useCallback((mapInstance: maplibregl.Map) => {
    setMap(mapInstance);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section with Form */}
      <div className="relative z-10 pt-8 pb-6">
        <HeroForm onSubmit={handleFlightSubmit} isLoading={isLoading} />
      </div>

      {/* Map Section */}
      <div className="relative h-[calc(100vh-200px)] mx-4 mb-4">
        <Map onMapLoad={handleMapLoad}>
          {/* Flight path controls overlay on map when flight is active */}
          {map && flightState && (
            <FlightPath
              map={map}
              flightState={flightState}
              progress={progress}
              isPlaying={isAnimating}
              onPlay={() => startAnimation(15000)} // 15 second flight duration
              onPause={pauseAnimation}
              onReset={resetAnimation}
              onProgressChange={setPosition}
              onResetView={() => {
                // Reset view to show full flight path
                if (map && flightState) {
                  const bounds = new maplibregl.LngLatBounds();
                  flightState.path.forEach((point) => bounds.extend([point.lon, point.lat]));
                  map.fitBounds(bounds, { padding: 50 });
                }
              }}
            />
          )}
        </Map>
      </div>
    </div>
  );
}
