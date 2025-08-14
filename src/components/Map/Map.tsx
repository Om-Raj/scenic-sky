import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  onMapLoad?: (map: maplibregl.Map) => void;
  children?: React.ReactNode;
}

/**
 * MapLibre GL wrapper component with satellite imagery
 * Uses free raster tiles for Google Earth-style appearance
 */
export function Map({ onMapLoad, children }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize MapLibre with satellite/aerial imagery style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // Using OpenStreetMap as base - in production, replace with satellite tiles
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              // Using Esri World Imagery for satellite view (free, no API key required)
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
      center: [0, 20], // Centered on equator for global view
      zoom: 2,
      pitch: 0, // Can be adjusted for 3D effect
      bearing: 0,
    });

    // Add navigation controls (zoom, compass)
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

    // Handle map load event
    map.current.on('load', () => {
      setIsLoaded(true);
      if (onMapLoad && map.current) {
        onMapLoad(map.current);
      }
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onMapLoad]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      {/* Render children (flight controls) when map is loaded */}
      {isLoaded && children}
    </div>
  );
}
