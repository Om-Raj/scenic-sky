'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapWithCenteredAircraft } from '@/components/MapWithCenteredAircraft';

import SkyDomeVisualization from '@/components/SkyDomeVisualization';
import { FlightPath } from '@/components/FlightPath';
import { SeatRecommendationDisplay } from '@/components/SeatRecommendation';
import { useFlightPath } from '@/hooks/useFlightPath';
import { useAutoSeatRecommendation } from '@/hooks/useSeatRecommendation';
import { interpolateDateTime, createDateTimeInTimezone, calculateFlightSolarPosition } from '@/lib/solar-calculations';
import { formatAirportTime, formatFlightSchedule, parseAirportLocalTime, formatAirportLocalTime } from '@/lib/timezone-utils';
import { DEMO_AIRPORTS } from '@/lib/gis';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Plane, Users, MapPin } from 'lucide-react';
import maplibregl from 'maplibre-gl';

export default function FlightMapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMapBearing, setCurrentMapBearing] = useState(0); // Track current map bearing
  
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

  // Add seat recommendation hook
  const seatRecommendation = useAutoSeatRecommendation(searchParams);

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

  // Calculate flight schedule with proper timezone display
  const flightSchedule = useMemo(() => {
    if (!flightData.departureDate || !flightData.departureTime || !flightData.arrivalDate || !flightData.arrivalTime) {
      return null;
    }

    const departureAirport = DEMO_AIRPORTS.find(apt => apt.code === flightData.departure);
    const arrivalAirport = DEMO_AIRPORTS.find(apt => apt.code === flightData.arrival);
    
    if (!departureAirport || !arrivalAirport) {
      return null;
    }

    // Parse times in their respective airport timezones (FIXED)
    const departureDateTime = parseAirportLocalTime(
      flightData.departureDate, 
      flightData.departureTime, 
      departureAirport
    );
    const arrivalDateTime = parseAirportLocalTime(
      flightData.arrivalDate, 
      flightData.arrivalTime, 
      arrivalAirport
    );

    return {
      departureLocal: formatAirportLocalTime(departureDateTime, departureAirport),
      arrivalLocal: formatAirportLocalTime(arrivalDateTime, arrivalAirport),
      departureUTC: departureDateTime.toISOString(),
      arrivalUTC: arrivalDateTime.toISOString()
    };
  }, [flightData]);

  // Calculate current aircraft position and time for solar calculations
  const currentAircraftData = useMemo(() => {
    const currentPos = getCurrentPosition();
    if (!currentPos || !flightData.departureDate || !flightData.departureTime || !flightData.arrivalDate || !flightData.arrivalTime) {
      return null;
    }

    // Find airport timezone information
    const departureAirport = DEMO_AIRPORTS.find(apt => apt.code === flightData.departure);
    const arrivalAirport = DEMO_AIRPORTS.find(apt => apt.code === flightData.arrival);
    
    if (!departureAirport || !arrivalAirport) {
      return null;
    }

    // Calculate current time based on flight progress with proper timezone handling
    const departureDateTime = parseAirportLocalTime(
      flightData.departureDate, 
      flightData.departureTime, 
      departureAirport
    );
    const arrivalDateTime = parseAirportLocalTime(
      flightData.arrivalDate, 
      flightData.arrivalTime, 
      arrivalAirport
    );
    
    // Use simple UTC interpolation for accurate solar calculations
    // Solar position calculations require UTC time, not timezone-adjusted time
    const currentDateTime = interpolateDateTime(
      departureDateTime, 
      arrivalDateTime, 
      progress
    );

    return {
      position: {
        lat: currentPos.lat,
        lng: currentPos.lon,
        bearing: currentPos.bearing || 0,
      },
      dateTime: currentDateTime,
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

  // Callback when map bearing changes
  const handleBearingChange = useCallback((bearing: number) => {
    setCurrentMapBearing(bearing);
  }, []);

  // Callback when map is initialized and ready
  const handleMapLoad = useCallback((mapInstance: maplibregl.Map) => {
    setMap(mapInstance);
  }, []);

  // Navigate to seatmap with preserved URL parameters
  const goToSeatmap = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(flightData).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/seatmap?${params.toString()}`);
  }, [flightData, router]);

  // Calculate current flight time based on progress with proper timezone handling
  const calculateCurrentTime = () => {
    if (!flightData.departureDate || !flightData.departureTime || !flightData.arrivalDate || !flightData.arrivalTime) {
      return 'N/A';
    }
    
    // Find airport timezone information
    const departureAirport = DEMO_AIRPORTS.find(apt => apt.code === flightData.departure);
    const arrivalAirport = DEMO_AIRPORTS.find(apt => apt.code === flightData.arrival);
    
    if (!departureAirport || !arrivalAirport) {
      return 'N/A';
    }
    
    // Create timezone-aware departure and arrival times (FIXED)
    const departureDateTime = parseAirportLocalTime(
      flightData.departureDate, 
      flightData.departureTime, 
      departureAirport
    );
    const arrivalDateTime = parseAirportLocalTime(
      flightData.arrivalDate, 
      flightData.arrivalTime, 
      arrivalAirport
    );
    
    // Calculate total flight duration in milliseconds
    const totalDuration = arrivalDateTime.getTime() - departureDateTime.getTime();
    
    // Calculate current time based on progress
    const currentTime = new Date(departureDateTime.getTime() + (totalDuration * progress));
    
    // Format current time in UTC for clarity during international flight
    return currentTime.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    });
  };

  // Calculate remaining flight time with proper timezone handling
  const calculateTimeLeft = () => {
    if (!flightData.departureDate || !flightData.departureTime || !flightData.arrivalDate || !flightData.arrivalTime) {
      return 'N/A';
    }
    
    // Find airport timezone information
    const departureAirport = DEMO_AIRPORTS.find(apt => apt.code === flightData.departure);
    const arrivalAirport = DEMO_AIRPORTS.find(apt => apt.code === flightData.arrival);
    
    if (!departureAirport || !arrivalAirport) {
      return 'N/A';
    }
    
    // Create timezone-aware departure and arrival times (FIXED)
    const departureDateTime = parseAirportLocalTime(
      flightData.departureDate, 
      flightData.departureTime, 
      departureAirport
    );
    const arrivalDateTime = parseAirportLocalTime(
      flightData.arrivalDate, 
      flightData.arrivalTime, 
      arrivalAirport
    );
    
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
              <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold">
                    {flightData.departure} → {flightData.arrival}
                  </span>
                </div>
                {flightSchedule && (
                  <div className="text-xs text-gray-600 flex items-center space-x-4">
                    <span>Dep: {flightSchedule.departureLocal}</span>
                    <span>•</span>
                    <span>Arr: {flightSchedule.arrivalLocal}</span>
                  </div>
                )}
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
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold">
                  {flightData.departure} → {flightData.arrival}
                </span>
              </div>
              {flightSchedule && (
                <div className="text-xs text-gray-600 flex items-center space-x-4">
                  <span>Dep: {flightSchedule.departureLocal}</span>
                  <span>•</span>
                  <span>Arr: {flightSchedule.arrivalLocal}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Map with Centered Aircraft */}
      <div className="h-[calc(100vh-73px)] relative">
        {/* Floating Seatmap Button */}
        <Button
          onClick={goToSeatmap}
          className="absolute top-4 left-4 z-40 bg-white/90 hover:bg-white/95 text-gray-700 border border-gray-200 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl rounded-full w-12 h-12 p-0"
          variant="outline"
          aria-label="View seatmap"
        >
          <Users className="w-5 h-5" />
        </Button>

        {/* Floating Seat Recommendation Button */}
        {seatRecommendation.result && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="absolute top-4 left-20 z-40 bg-white/90 hover:bg-white/95 text-gray-700 border border-gray-200 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl rounded-full w-12 h-12 p-0"
                variant="outline"
                aria-label="View seat recommendations"
              >
                <MapPin className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[400px] sm:w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Seat Recommendations</SheetTitle>
                <SheetDescription>
                  Scenic views and solar events for your flight
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <SeatRecommendationDisplay result={seatRecommendation.result} />
              </div>
            </SheetContent>
          </Sheet>
        )}

        <MapWithCenteredAircraft
          aircraftPosition={currentAircraftData.position}
          onMapLoad={handleMapLoad}
          onBearingChange={handleBearingChange}
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

        {/* 3D Sky Dome Visualization - positioned over the map */}
        <SkyDomeVisualization
          latitude={currentAircraftData.position.lat}
          longitude={currentAircraftData.position.lng}
          date={currentAircraftData.dateTime}
          mapBearing={currentMapBearing}
        />
      </div>
    </div>
  );
}
