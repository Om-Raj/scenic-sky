'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapWithCenteredAircraftProps {
  aircraftPosition: { lat: number; lng: number; bearing: number };
  onMapLoad?: (map: maplibregl.Map) => void;
  children?: React.ReactNode;
}

/**
 * Map component that keeps aircraft fixed at center of screen
 * Map moves beneath the aircraft as coordinates update
 */
export function MapWithCenteredAircraft({ 
  aircraftPosition, 
  onMapLoad, 
  children 
}: MapWithCenteredAircraftProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const aircraftMarker = useRef<maplibregl.Marker | null>(null);
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
      zoom: 8, // Close zoom to show aircraft perspective
      pitch: 45, // Tilted view for 3D effect
      bearing: aircraftPosition.bearing ? aircraftPosition.bearing - 180 : 0, // Rotate map so aircraft direction points up
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

    // Create aircraft marker element
    const aircraftElement = document.createElement('div');
    aircraftElement.className = 'aircraft-marker';
    aircraftElement.innerHTML = `
      <div style="
        width: 32px;
        height: 32px;
        background: url('/airplane-black-shape.svg') center/contain no-repeat;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4)) brightness(1.2);
        transform: rotate(0deg);
        transition: none;
        position: relative;
        z-index: 1000;
      "></div>
    `;

    // Create and position aircraft marker at map center - use offset to ensure true centering
    aircraftMarker.current = new maplibregl.Marker({
      element: aircraftElement,
      anchor: 'center',
      offset: [0, 0], // No offset needed for center anchor
    })
      .setLngLat([aircraftPosition.lng, aircraftPosition.lat])
      .addTo(map.current);

    map.current.on('load', () => {
      setIsLoaded(true);
      if (onMapLoad && map.current) {
        onMapLoad(map.current);
      }
    });

    return () => {
      if (aircraftMarker.current) {
        aircraftMarker.current.remove();
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onMapLoad]);

  // Update aircraft position and keep it centered
  useEffect(() => {
    if (!map.current || !aircraftMarker.current || !isLoaded) return;

    // Calculate the bearing for map rotation to keep aircraft direction pointing up
    // Aircraft bearing tells us which direction the aircraft is moving
    // We need to rotate the map so that this direction points to the top of the screen
    // Map bearing formula: aircraftBearing - 180 (to align movement direction with screen top)
    const mapBearing = aircraftPosition.bearing ? aircraftPosition.bearing - 180 : 0;

    // Update aircraft marker position FIRST to keep it truly centered
    aircraftMarker.current.setLngLat([aircraftPosition.lng, aircraftPosition.lat]);
    
    // Then smoothly move and rotate map to align aircraft movement direction with screen top
    map.current.easeTo({
      center: [aircraftPosition.lng, aircraftPosition.lat],
      bearing: mapBearing, // Rotate map so aircraft movement direction points up
      duration: 300, // Shorter duration for smoother updates
      essential: true,
    });
    
    // Keep aircraft icon pointing up (since map rotates to align direction)
    const aircraftElement = aircraftMarker.current.getElement();
    if (aircraftElement) {
      const iconDiv = aircraftElement.querySelector('div') as HTMLDivElement;
      if (iconDiv) {
        // Aircraft should point up since map rotation aligns movement direction with top
        iconDiv.style.transform = `rotate(0deg)`;
      }
    }
  }, [aircraftPosition, isLoaded]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Minimal center indicator */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-1 h-1 bg-blue-500/40 rounded-full"></div>
      </div>

      {/* Render children when map is loaded */}
      {isLoaded && children}
    </div>
  );
}
