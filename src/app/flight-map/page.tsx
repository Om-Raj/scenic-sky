'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapWithCenteredAircraft } from '@/components/MapWithCenteredAircraft';
import { SunAngleOverlay } from '@/components/SunAngleOverlay';
import { FlightPath } from '@/components/FlightPath';
import { useFlightPath } from '@/hooks/useFlightPath';
import { interpolateDateTime } from '@/lib/solar-calculations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plane } from 'lucide-react';
import maplibregl from 'maplibre-gl';

export default function FlightMapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    flightState, 
    generateFlightPath, 
    startAnimation, 
    pauseAnimation, 
    resetAnimation, 
    setPosition, 
    getCurrentPosition,
    progress, 
    isAnimating 
  } = useFlightPath();

  // Extract flight data from URL parameters
  const flightData = useMemo(() => ({
    airplaneModel: searchParams.get('airplaneModel') || '',
    departureDate: searchParams.get('departureDate') || '',
    departureTime: searchParams.get('departureTime') || '',
    arrivalDate: searchParams.get('arrivalDate') || '',
    arrivalTime: searchParams.get('arrivalTime') || '',
    departure: searchParams.get('departure') || '',
    arrival: searchParams.get('arrival') || '',
  }), [searchParams]);

  // Calculate current aircraft position and time for solar calculations
  const currentAircraftData = useMemo(() => {
    const currentPos = getCurrentPosition();
    if (!currentPos || !flightData.departureDate || !flightData.departureTime || !flightData.arrivalDate || !flightData.arrivalTime) {
      return null;
    }

    // Calculate current time based on flight progress
    const departureDateTime = new Date(`${flightData.departureDate}T${flightData.departureTime}`);
    const arrivalDateTime = new Date(`${flightData.arrivalDate}T${flightData.arrivalTime}`);
    const currentDateTime = interpolateDateTime(departureDateTime, arrivalDateTime, progress);

    return {
      position: {
        lat: currentPos.lat,
        lng: currentPos.lon,
        bearing: currentPos.bearing || 0,
      },
      dateTime: currentDateTime,
      // Convert lat/lng to 3D coordinates for sun ray (simplified mapping)
      position3D: {
        x: currentPos.lon / 180, // Normalize longitude to -1 to 1
        y: 0, // Aircraft at ground level for now
        z: currentPos.lat / 90, // Normalize latitude to -1 to 1
      },
    };
  }, [getCurrentPosition, progress, flightData]);

  // Generate flight path when component mounts or params change
  useEffect(() => {
    if (flightData.departure && flightData.arrival) {
      // Validate that departure and arrival are different
      if (flightData.departure === flightData.arrival) {
        console.error('Departure and arrival airports cannot be the same');
        router.push('/?error=same-airports');
        return;
      }

      setIsLoading(true);
      try {
        generateFlightPath(flightData.departure, flightData.arrival);
      } catch (error) {
        console.error('Error generating flight path:', error);
        // Redirect back to home with error parameter
        router.push('/?error=invalid-route');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Redirect to home if missing required parameters
      router.push('/?error=missing-params');
    }
  }, [flightData.departure, flightData.arrival, generateFlightPath, router]);

  // Callback when map is initialized and ready
  const handleMapLoad = useCallback((mapInstance: maplibregl.Map) => {
    setMap(mapInstance);
  }, []);

  // Calculate current flight time based on progress
  const calculateCurrentTime = () => {
    if (!flightData.departureDate || !flightData.departureTime || !flightData.arrivalDate || !flightData.arrivalTime) {
      return 'N/A';
    }
    
    const departureDateTime = new Date(`${flightData.departureDate}T${flightData.departureTime}`);
    const arrivalDateTime = new Date(`${flightData.arrivalDate}T${flightData.arrivalTime}`);
    
    // Calculate total flight duration in milliseconds
    const totalDuration = arrivalDateTime.getTime() - departureDateTime.getTime();
    
    // Calculate current time based on progress
    const currentTime = new Date(departureDateTime.getTime() + (totalDuration * progress));
    
    return currentTime.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate remaining flight time
  const calculateTimeLeft = () => {
    if (!flightData.departureDate || !flightData.departureTime || !flightData.arrivalDate || !flightData.arrivalTime) {
      return 'N/A';
    }
    
    const departureDateTime = new Date(`${flightData.departureDate}T${flightData.departureTime}`);
    const arrivalDateTime = new Date(`${flightData.arrivalDate}T${flightData.arrivalTime}`);
    
    // Calculate total flight duration in milliseconds
    const totalDuration = arrivalDateTime.getTime() - departureDateTime.getTime();
    
    // Calculate remaining time
    const remainingDuration = totalDuration * (1 - progress);
    
    // Convert to hours and minutes
    const hours = Math.floor(remainingDuration / (1000 * 60 * 60));
    const minutes = Math.floor((remainingDuration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // If loading or no aircraft data, show loading or fallback
  if (isLoading || !currentAircraftData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="relative z-50 p-4 bg-white/95 backdrop-blur-sm shadow-sm border-b">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Planner</span>
            </Button>

            {flightData.departure && flightData.arrival && (
              <div className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold">
                  {flightData.departure} → {flightData.arrival}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        <div className="h-[calc(100vh-73px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Calculating flight path...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Header */}
      <div className="relative z-50 p-4 bg-white/95 backdrop-blur-sm shadow-sm border-b">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Planner</span>
          </Button>

          {flightData.departure && flightData.arrival && (
            <div className="flex items-center space-x-2">
              <Plane className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold">
                {flightData.departure} → {flightData.arrival}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Map with Centered Aircraft */}
      <div className="h-[calc(100vh-73px)] relative">
        <MapWithCenteredAircraft
          aircraftPosition={currentAircraftData.position}
          onMapLoad={handleMapLoad}
        >
          {/* Flight controls overlay */}
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
              currentTime={calculateCurrentTime()}
              timeLeft={calculateTimeLeft()}
              progressPercent={Math.round(progress * 100)}
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
        </MapWithCenteredAircraft>

        {/* 3D Sun Overlay - positioned over the map */}
        <SunAngleOverlay
          latitude={currentAircraftData.position.lat}
          longitude={currentAircraftData.position.lng}
          date={currentAircraftData.dateTime}
          aircraftPosition={currentAircraftData.position3D}
        />
      </div>
    </div>
  );
}
