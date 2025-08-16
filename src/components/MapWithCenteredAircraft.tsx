'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ScenicLocationWithDetection } from '@/lib/scenic-detection';

interface MapWithCenteredAircraftProps {
  aircraftPosition: { lat: number; lng: number; bearing: number };
  onMapLoad?: (map: maplibregl.Map) => void;
  onBearingChange?: (bearing: number) => void; // Callback for bearing updates
  scenicLocations?: ScenicLocationWithDetection[]; // Scenic markers to display
  children?: React.ReactNode;
  onScenicPopup?: (location: ScenicLocationWithDetection | null) => void; // Callback for popup management
}

/**
 * Map component that keeps aircraft fixed at center of screen
 * Map moves beneath the aircraft as coordinates update
 */
export function MapWithCenteredAircraft({ 
  aircraftPosition, 
  onMapLoad, 
  onBearingChange,
  scenicLocations = [],
  children,
  onScenicPopup 
}: MapWithCenteredAircraftProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const scenicMarkers = useRef<maplibregl.Marker[]>([]);
  const currentPopup = useRef<maplibregl.Popup | null>(null);

  // Function to create popup content HTML using shadcn-style components
  const createPopupContent = (location: ScenicLocationWithDetection) => {
    return `
      <div class="p-0 max-w-xs">
        <div class="relative">
          <img 
            src="/sun-flare.png" 
            alt="${location.name}" 
            class="w-full h-24 object-cover rounded-t-lg"
          />
        </div>
        <div class="p-4">
          <h3 class="text-sm font-semibold text-gray-900 leading-tight mb-2">
            ${location.name}
          </h3>
          <p class="text-xs text-gray-600 mb-3 leading-relaxed">
            ${location.description || `Beautiful ${location.type} worth seeing during your flight.`}
          </p>
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ${location.type}
            </span>
            <div class="flex items-center space-x-1 text-xs text-red-500">
              <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="font-medium">
                ${(location.likes / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Function to show scenic popup
  const showScenicPopup = useCallback((location: ScenicLocationWithDetection) => {
    if (!map.current) return;

    // Close existing popup
    if (currentPopup.current) {
      currentPopup.current.remove();
    }

    // Create new popup
    currentPopup.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: 'none',
      className: 'scenic-popup',
    })
      .setLngLat([location.lon, location.lat])
      .setHTML(createPopupContent(location))
      .addTo(map.current);

    // Notify parent component
    if (onScenicPopup) {
      onScenicPopup(location);
    }
  }, [onScenicPopup]);

  // Function to close scenic popup
  const closeScenicPopup = useCallback(() => {
    if (currentPopup.current) {
      currentPopup.current.remove();
      currentPopup.current = null;
    }

    // Notify parent component
    if (onScenicPopup) {
      onScenicPopup(null);
    }
  }, [onScenicPopup]);

  // Expose popup functions to parent component
  useEffect(() => {
    if (map.current && isLoaded) {
      // Add popup functions to map instance for external access
      (map.current as any).showScenicPopup = showScenicPopup;
      (map.current as any).closeScenicPopup = closeScenicPopup;
    }
  }, [isLoaded, showScenicPopup, closeScenicPopup]);

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
      // Clean up scenic markers
      scenicMarkers.current.forEach(marker => marker.remove());
      scenicMarkers.current = [];
      
      // Clean up popup
      if (currentPopup.current) {
        currentPopup.current.remove();
        currentPopup.current = null;
      }
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onMapLoad]);

  // Add/update scenic location markers
  useEffect(() => {
    if (!map.current || !isLoaded || !scenicLocations.length) return;

    // Clear existing markers
    scenicMarkers.current.forEach(marker => marker.remove());
    scenicMarkers.current = [];

    // Add new markers for scenic locations
    scenicLocations.forEach(location => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.innerHTML = `
        <div class="scenic-marker" style="
          width: 24px;
          height: 24px;
          background: #ef4444;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          📍
        </div>
      `;

      // Add hover effect
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
      });
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
      });

      // Create and add marker
      const marker = new maplibregl.Marker(markerElement)
        .setLngLat([location.lon, location.lat])
        .addTo(map.current!);

      scenicMarkers.current.push(marker);
    });
  }, [scenicLocations, isLoaded]);

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
