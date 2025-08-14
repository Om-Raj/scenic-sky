'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Map } from '@/components/Map';
import { FlightPath } from '@/components/FlightPath';
import { useFlightPath } from '@/hooks/useFlightPath';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plane, Clock, MapPin } from 'lucide-react';
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
    progress, 
    isAnimating 
  } = useFlightPath();

  // Extract flight data from URL parameters
  const flightData = {
    airplaneModel: searchParams.get('airplaneModel') || '',
    departureDate: searchParams.get('departureDate') || '',
    departureTime: searchParams.get('departureTime') || '',
    arrivalDate: searchParams.get('arrivalDate') || '',
    arrivalTime: searchParams.get('arrivalTime') || '',
    departure: searchParams.get('departure') || '',
    arrival: searchParams.get('arrival') || '',
  };

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

  // Format time for display
  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return 'N/A';
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with flight info and back button */}
      <div className="relative z-10 p-4 bg-white/95 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
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

          {/* Flight Details Grid - Responsive */}
          {flightData.departure && flightData.arrival && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Plane className="w-4 h-4 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-900">Aircraft:</span>
                  <div className="text-gray-600">{flightData.airplaneModel}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                <MapPin className="w-4 h-4 text-green-600" />
                <div>
                  <span className="font-medium text-gray-900">Departure:</span>
                  <div className="text-gray-600">{formatDateTime(flightData.departureDate, flightData.departureTime)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-medium text-gray-900">Arrival:</span>
                  <div className="text-gray-600">{formatDateTime(flightData.arrivalDate, flightData.arrivalTime)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="relative h-[calc(100vh-140px)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Calculating flight path...</p>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
