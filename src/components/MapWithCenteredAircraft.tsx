'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapWithCenteredAircraftProps {
  aircraftPosition: { lat: number; lng: number; bearing: number };
  onMapLoad?: (map: maplibregl.Map) => void;
  onBearingChange?: (bearing: number) => void; // Callback for bearing updates
  children?: React.ReactNode;
}

/**
 * Map component that keeps aircraft fixed at center of screen
 * Map moves beneath the aircraft as coordinates update
 */
export function MapWithCenteredAircraft({ 
  aircraftPosition, 
  onMapLoad, 
  onBearingChange,
  children 
}: MapWithCenteredAircraftProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: '© Esri',
          },
        },
        layers: [
          {
            id: 'satellite',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 18,
          },
        ],
      },
      center: [aircraftPosition.lng, aircraftPosition.lat],
      zoom: 3, // Close zoom to show aircraft perspective
      pitch: 45, // Tilted view for 3D effect
      bearing: aircraftPosition.bearing || 0, // Initialize with correct bearing for forward movement
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

    // Don't create a map marker - we'll use a fixed HTML element instead
    // This ensures the aircraft always stays at screen center

    map.current.on('load', () => {
      setIsLoaded(true);
      if (onMapLoad && map.current) {
        onMapLoad(map.current);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onMapLoad]);

  // Update aircraft position and keep it centered
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Calculate the bearing for map rotation to make aircraft appear to move forward
    // To make the plane appear to move forward (map coming from top to bottom):
    // We need to rotate the map so the aircraft's direction aligns with screen top
    // Map bearing formula: aircraftBearing (positive) - this rotates map to align direction with up
    const mapBearing = aircraftPosition.bearing || 0;

    // Use very short easeTo duration that matches animation frame rate (~16ms)
    // This provides smooth movement while maintaining sync with aircraft position
    map.current.easeTo({
      center: [aircraftPosition.lng, aircraftPosition.lat],
      bearing: mapBearing, // Rotate map so aircraft direction points up and terrain moves correctly
      duration: 16, // One frame duration for smooth but synchronized movement
      essential: true,
    });

    // Notify parent component of bearing change for sun calculations
    if (onBearingChange) {
      onBearingChange(mapBearing);
    }
  }, [aircraftPosition, isLoaded, onBearingChange]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Fixed aircraft icon at screen center */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div 
          className="aircraft-center-icon"
          style={{
            width: '32px',
            height: '32px',
            background: 'url("/airplane-black-shape.svg") center/contain no-repeat',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4)) brightness(1.2)',
            transform: 'rotate(0deg)',
            zIndex: 1000,
          }}
        />
      </div>

      {/* Minimal center indicator */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-1 h-1 bg-blue-500/40 rounded-full"></div>
      </div>

      {/* Render children when map is loaded */}
      {isLoaded && children}
    </div>
  );
}
