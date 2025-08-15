import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Plane } from 'lucide-react';
import { interpolateAlongPath } from '@/lib/gis';
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
  onResetView?: () => void;
}

/**
 * Component for rendering flight path and controlling airplane animation
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
  onResetView 
}: FlightPathProps) {
  const airplaneMarker = useRef<maplibregl.Marker | null>(null);
  const departureMarker = useRef<maplibregl.Marker | null>(null);
  const arrivalMarker = useRef<maplibregl.Marker | null>(null);

  // Add flight path to map when flightState changes
  useEffect(() => {
    if (!flightState || !map) return;

    // Remove existing path and markers
    if (map.getSource('flight-path')) {
      map.removeLayer('flight-path-line');
      map.removeSource('flight-path');
    }

    if (airplaneMarker.current) {
      airplaneMarker.current.remove();
      airplaneMarker.current = null;
    }

    if (departureMarker.current) {
      departureMarker.current.remove();
      departureMarker.current = null;
    }

    if (arrivalMarker.current) {
      arrivalMarker.current.remove();
      arrivalMarker.current = null;
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
        'line-width': 3,
        'line-opacity': 0.8,
      },
    });

    // Create airplane marker with custom icon
    const airplaneElement = createAirplaneElement();
    const startPosition = flightState.path[0];

    airplaneMarker.current = new maplibregl.Marker({
      element: airplaneElement,
      anchor: 'center',
    })
      .setLngLat([startPosition.lon, startPosition.lat])
      .addTo(map);

    // Create departure airport marker
    const departureElement = createLocationPinElement('Departure', flightState.departure.code);
    departureMarker.current = new maplibregl.Marker({
      element: departureElement,
      anchor: 'bottom',
    })
      .setLngLat([flightState.departure.lon, flightState.departure.lat])
      .addTo(map);

    // Create arrival airport marker
    const arrivalElement = createLocationPinElement('Arrival', flightState.arrival.code);
    arrivalMarker.current = new maplibregl.Marker({
      element: arrivalElement,
      anchor: 'bottom',
    })
      .setLngLat([flightState.arrival.lon, flightState.arrival.lat])
      .addTo(map);

    // Fit map bounds to show entire path with padding
    const bounds = new maplibregl.LngLatBounds();
    pathCoordinates.forEach((coord) => bounds.extend(coord as [number, number]));
    map.fitBounds(bounds, { padding: 50 });

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
      
      if (airplaneMarker.current) {
        airplaneMarker.current.remove();
        airplaneMarker.current = null;
      }

      if (departureMarker.current) {
        departureMarker.current.remove();
        departureMarker.current = null;
      }

      if (arrivalMarker.current) {
        arrivalMarker.current.remove();
        arrivalMarker.current = null;
      }
    };
  }, [flightState, map]);

  // Update airplane position and rotation during animation
  useEffect(() => {
    if (!flightState || !airplaneMarker.current) return;

    const currentPos = interpolateAlongPath(flightState.path, progress);
    if (!currentPos) return;

    // Update marker position
    airplaneMarker.current.setLngLat([currentPos.lon, currentPos.lat]);

    // Rotate airplane to face direction of travel
    const airplaneElement = airplaneMarker.current.getElement();
    if (currentPos.bearing !== undefined) {
      airplaneElement.style.transform = `rotate(${currentPos.bearing}deg)`;
    }
  }, [flightState, progress]);

  // Create custom airplane icon element
  function createAirplaneElement(): HTMLElement {
    const element = document.createElement('div');
    element.className = 'airplane-marker';
    element.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        background: #3b82f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        transition: transform 0.1s ease;
      ">
        <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    `;
    return element;
  }

  // Create location pin element for airports
  function createLocationPinElement(type: string, code: string): HTMLElement {
    const element = document.createElement('div');
    element.className = 'location-pin-marker';
    element.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
      ">
        <img 
          src="/location_pin.png" 
          alt="${type} Airport" 
          style="
            width: 32px;
            height: 32px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          "
        />
        <div style="
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          margin-top: 2px;
          white-space: nowrap;
        ">
          ${code}
        </div>
      </div>
    `;
    return element;
  }

  // Reset map view to airplane position
  const handleResetView = () => {
    const currentPos = interpolateAlongPath(flightState?.path || [], progress);
    if (currentPos && map) {
      map.flyTo({
        center: [currentPos.lon, currentPos.lat],
        zoom: 6,
        pitch: 0,
        bearing: 0,
        duration: 1000,
      });
    }
  };

  // Handle slider change for manual position control
  const handleSliderChange = (value: number[]) => {
    if (!isPlaying) {
      onProgressChange(value[0] / 100);
    }
  };

  if (!flightState) return null;

  const remainingKm = Math.round(flightState.totalDistance * (1 - progress));

  return (
    <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
      <div className="flex flex-col space-y-3">
        {/* Flight Route Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Plane className="w-4 h-4 text-blue-600" />
            <span className="font-medium">
              {flightState.departure.code} → {flightState.arrival.code}
            </span>
          </div>
          <div className="text-gray-600">
            {progressPercent}%
          </div>
        </div>

        {/* Time Information - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500 mb-1">Current Time</div>
            <div className="font-medium text-sm">{currentTime}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500 mb-1">Time Left</div>
            <div className="font-medium text-sm">{timeLeft}</div>
          </div>
        </div>

        {/* Progress Slider */}
        <div className="space-y-1">
          <Slider
            value={[progress * 100]}
            onValueChange={handleSliderChange}
            max={100}
            step={1}
            className="w-full"
            disabled={isPlaying}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              className="px-3 py-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Play
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onReset();
                if (onResetView) onResetView();
              }}
              className="px-3 py-1"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetView}
            className="px-3 py-1"
          >
            Center
          </Button>
        </div>
      </div>
    </div>
  );
}
