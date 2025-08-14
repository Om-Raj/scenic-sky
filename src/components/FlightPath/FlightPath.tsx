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
  onResetView 
}: FlightPathProps) {
  const airplaneMarker = useRef<maplibregl.Marker | null>(null);

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

    // Fit map bounds to show entire path with padding
    const bounds = new maplibregl.LngLatBounds();
    pathCoordinates.forEach((coord) => bounds.extend(coord as [number, number]));
    map.fitBounds(bounds, { padding: 50 });

    // Cleanup function
    return () => {
      if (map.getSource('flight-path')) {
        map.removeLayer('flight-path-line');
        map.removeSource('flight-path');
      }
      if (airplaneMarker.current) {
        airplaneMarker.current.remove();
        airplaneMarker.current = null;
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
  const progressPercent = Math.round(progress * 100);

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
      <div className="flex flex-col space-y-4">
        {/* Flight Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Plane className="w-4 h-4 text-blue-600" />
            <span className="font-medium">
              {flightState.departure.code} → {flightState.arrival.code}
            </span>
          </div>
          <div className="text-gray-600">
            {progressPercent}% • {remainingKm} km remaining
          </div>
        </div>

        {/* Progress Slider */}
        <div className="space-y-2">
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
              variant="outline"
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
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
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleResetView}>
            Center View
          </Button>
        </div>
      </div>
    </div>
  );
}
