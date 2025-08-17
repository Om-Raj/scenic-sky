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
  const currentPopup = useRef<maplibregl.Popup | null>(null);
  const hoverPopup = useRef<maplibregl.Popup | null>(null); // Popup for hover interactions
  const currentHoverFeature = useRef<string | undefined>(undefined);
  // Track DOM-based scenic markers so we can clean them up on updates
  const scenicMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  // Snapshot initial position once; subsequent updates are handled by a separate effect
  const initialCenterRef = useRef<[number, number]>([
    aircraftPosition.lng,
    aircraftPosition.lat,
  ]);
  const initialBearingRef = useRef<number>(aircraftPosition.bearing || 0);

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

    // Ensure popup appears on top by setting high z-index
    const popupElement = currentPopup.current.getElement();
    if (popupElement) {
      popupElement.style.zIndex = '9999';
    }

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

  // Function to close hover popup
  const closeHoverPopup = useCallback(() => {
    if (hoverPopup.current) {
      hoverPopup.current.remove();
      hoverPopup.current = null;
    }
    currentHoverFeature.current = undefined;
  }, []);

  // Expose popup functions to parent component
  useEffect(() => {
    if (map.current && isLoaded) {
      // Add popup functions to map instance for external access without any
      const m = map.current as unknown as maplibregl.Map & {
        showScenicPopup?: typeof showScenicPopup;
        closeScenicPopup?: typeof closeScenicPopup;
      };
      m.showScenicPopup = showScenicPopup;
      m.closeScenicPopup = closeScenicPopup;
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
  center: initialCenterRef.current, // use initial snapshot to avoid effect deps
      zoom: 3, // Close zoom to show aircraft perspective
      pitch: 45, // Tilted view for 3D effect
  bearing: initialBearingRef.current, // initialize with snapshot
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
      // Clean up popups
      if (currentPopup.current) {
        currentPopup.current.remove();
        currentPopup.current = null;
      }
      if (hoverPopup.current) {
        hoverPopup.current.remove();
        hoverPopup.current = null;
      }
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onMapLoad]);

  // Add/update scenic location layers using GeoJSON source and DOM SVG markers
  useEffect(() => {
    if (!map.current || !isLoaded || !scenicLocations.length) return;

    // Remove existing scenic layers and source if they exist
    if (map.current.getLayer('scenic-layer')) {
      map.current.removeLayer('scenic-layer');
    }
    if (map.current.getLayer('scenic-hover-layer')) {
      map.current.removeLayer('scenic-hover-layer');
    }
    if (map.current.getSource('scenic-locations')) {
      map.current.removeSource('scenic-locations');
    }

    // Remove any existing DOM markers before re-adding
    scenicMarkersRef.current.forEach((marker) => marker.remove());
    scenicMarkersRef.current.clear();

    // Create GeoJSON data for scenic locations
    const geojsonData = {
      type: 'FeatureCollection' as const,
      features: scenicLocations.map(location => ({
        type: 'Feature' as const,
        properties: {
          name: location.name,
          type: location.type,
          description: location.description || `Beautiful ${location.type} worth seeing during your flight.`,
          likes: location.likes,
          distanceFromPath: location.distanceFromPath,
          id: `${location.lat}-${location.lon}`, // Unique identifier
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [location.lon, location.lat],
        },
      })),
    };

    // Add GeoJSON source (used for hover detection and future spatial queries)
    map.current.addSource('scenic-locations', {
      type: 'geojson',
      data: geojsonData,
    });

    // Create crisp DOM-based SVG markers per scenic location (bypass WebGL textures)
    scenicLocations.forEach((location) => {
      const id = `${location.lat}-${location.lon}`;
      const el = document.createElement('div');
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.transform = 'translateY(-6px)'; // nudge so it feels anchored
      el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))';
      el.style.pointerEvents = 'none'; // don't block map hover events
      el.innerHTML = `
        <svg height="32px" width="32px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-5.12 -5.12 522.24 522.24" xml:space="preserve" fill="#ff0000" stroke="#ff0000" stroke-width="5.12"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#ff0000;} </style> <g> <path class="st0" d="M256,0C160.798,0,83.644,77.155,83.644,172.356c0,97.162,48.158,117.862,101.386,182.495 C248.696,432.161,256,512,256,512s7.304-79.839,70.97-157.148c53.228-64.634,101.386-85.334,101.386-182.495 C428.356,77.155,351.202,0,256,0z M256,231.921c-32.897,0-59.564-26.668-59.564-59.564s26.668-59.564,59.564-59.564 c32.896,0,59.564,26.668,59.564,59.564S288.896,231.921,256,231.921z"></path> </g> </g></svg>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([location.lon, location.lat])
        .addTo(map.current!);

      scenicMarkersRef.current.set(id, marker);
    });

  // Add invisible hover detection layer with larger hit area
    map.current.addLayer({
      id: 'scenic-hover-layer',
      type: 'circle',
      source: 'scenic-locations',
      paint: {
        'circle-radius': 20, // Larger hover area
        'circle-opacity': 0, // Invisible
      },
    });

    // Add hover event listeners
    type FeatureProperties = {
      id: string;
      name: string;
      type: string;
      description: string;
      likes: number;
      distanceFromPath: number;
    };
    type GeoJSONPoint = {
      type: 'Point';
      coordinates: [number, number];
    };
    const handleMouseEnter = (e: maplibregl.MapLayerMouseEvent) => {
      const feature = e.features?.[0] as (maplibregl.MapGeoJSONFeature & { properties: FeatureProperties; geometry: GeoJSONPoint }) | undefined;
      if (!feature) return;
      
      const featureId = feature.properties.id;
      
      // Only show popup if we're hovering over a different feature
      if (currentHoverFeature.current !== featureId) {
        currentHoverFeature.current = featureId;
        
        // Change cursor style
        map.current!.getCanvas().style.cursor = 'pointer';
        
  const coordinates = (feature.geometry as GeoJSONPoint).coordinates.slice() as [number, number];
        
        // Handle longitude wrapping for popup positioning
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        // Create hover popup content
        const hoverContent = `
          <div class="p-3 max-w-xs">
            <div class="relative mb-3">
              <img 
                src="/sun-flare.png" 
                alt="${feature.properties.name}" 
                class="w-full h-20 object-cover rounded-lg"
              />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-2">${feature.properties.name}</h3>
            <div class="flex items-center justify-between">
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">${feature.properties.type}</span>
              <span class="text-xs text-gray-600">${feature.properties.distanceFromPath.toFixed(1)}km away</span>
            </div>
          </div>
        `;
        
        // Close existing hover popup
        if (hoverPopup.current) {
          hoverPopup.current.remove();
        }
        
        // Create and show hover popup
        hoverPopup.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          maxWidth: 'none',
          className: 'scenic-hover-popup',
        })
          .setLngLat(coordinates)
          .setHTML(hoverContent)
          .addTo(map.current!);

        // Ensure hover popup appears on top
        const hoverElement = hoverPopup.current.getElement();
        if (hoverElement) {
          hoverElement.style.zIndex = '9998';
        }
      }
    };

  const handleMouseLeave = () => {
      map.current!.getCanvas().style.cursor = '';
      closeHoverPopup();
    };

    // Attach event listeners to the hover layer
    map.current.on('mouseenter', 'scenic-hover-layer', handleMouseEnter);
    map.current.on('mouseleave', 'scenic-hover-layer', handleMouseLeave);

    // Cleanup function for this effect
    return () => {
      if (map.current) {
        // Remove hover event listeners
        map.current.off('mouseenter', 'scenic-hover-layer', handleMouseEnter);
        map.current.off('mouseleave', 'scenic-hover-layer', handleMouseLeave);

        // Remove layers and source
        if (map.current.getLayer('scenic-layer')) {
          map.current.removeLayer('scenic-layer');
        }
        if (map.current.getLayer('scenic-hover-layer')) {
          map.current.removeLayer('scenic-hover-layer');
        }
        if (map.current.getSource('scenic-locations')) {
          map.current.removeSource('scenic-locations');
        }
      }

      // Remove DOM markers
      scenicMarkersRef.current.forEach((marker) => marker.remove());
      scenicMarkersRef.current.clear();
      
      // Close hover popup
      closeHoverPopup();
    };
  }, [scenicLocations, isLoaded, closeHoverPopup]);

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
