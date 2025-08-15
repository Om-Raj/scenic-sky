'use client';

import React, { useMemo } from 'react';
import { 
  calculateSolarPosition, 
  solarAnglesTo3DPosition 
} from '@/lib/solar-calculations';

interface SunComponentProps {
  latitude: number;
  longitude: number;
  date: Date;
  mapBearing?: number; // Current map rotation for proper angle calculations
}

/**
 * 2D Sun Component using sun image
 * Renders realistic sun with position based on astronomical calculations
 * Shows solar elevation angle with perpendicular line to map surface
 */
export function SunAngleOverlay({ 
  latitude, 
  longitude, 
  date,
  mapBearing = 0
}: SunComponentProps) {
  // Calculate solar position for current time and location
  const solarData = useMemo(() => {
    const position = calculateSolarPosition(latitude, longitude, date);
    
    // Adjust azimuth for map bearing (rotation)
    // When map is rotated, we need to adjust the sun's apparent position
    const adjustedAzimuth = position.azimuth - (mapBearing * Math.PI / 180);
    
    // Map solar position to screen coordinates
    // Convert elevation and azimuth to screen x,y coordinates
    const elevation = Math.max(-0.5, position.elevation); // Clamp minimum elevation
    
    // Convert to screen coordinates (center = 50%, 50%)
    // Azimuth: 0 = north (top), π/2 = east (right), π = south (bottom), 3π/2 = west (left)
    // Elevation: positive = above horizon
    
    const radius = 40; // Radius from center in viewport percentage
    const elevationFactor = Math.sin(elevation) * 0.7 + 0.3; // 0.3 to 1.0 range
    
    // Calculate screen position accounting for map rotation
    const x = 50 + (Math.sin(adjustedAzimuth) * radius * elevationFactor);
    const y = 50 - (Math.cos(adjustedAzimuth) * radius * elevationFactor);
    
    // Clamp to screen bounds with margin
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    
    // Calculate intensity based on elevation
    const intensity = Math.max(0.2, Math.sin(elevation) + 0.3);
    
    return {
      x: clampedX,
      y: clampedY,
      elevation: position.elevation,
      azimuth: adjustedAzimuth,
      originalAzimuth: position.azimuth,
      intensity,
      isVisible: elevation > -0.3, // Show sun even slightly below horizon
      elevationDegrees: position.elevation * (180 / Math.PI),
      azimuthDegrees: adjustedAzimuth * (180 / Math.PI),
    };
  }, [latitude, longitude, date, mapBearing]);

  if (!solarData.isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {/* Sun Image */}
      <div
        className="absolute ease-linear" // Use linear easing to match map animation
        style={{
          left: `${solarData.x}%`,
          top: `${solarData.y}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 16ms linear, top 16ms linear, transform 16ms linear', // Match map update frequency
        }}
      >
        <div
          className="relative"
          style={{
            // Dynamic sizing based on solar elevation - made larger overall
            transform: `scale(${1.0 + (Math.max(0, Math.sin(solarData.elevation)) * 0.8)})`, // Scale 1.0x to 1.8x based on elevation
            filter: `brightness(${0.6 + solarData.intensity * 0.8}) saturate(${0.7 + solarData.intensity * 0.5}) contrast(${0.9 + Math.max(0, Math.sin(solarData.elevation)) * 0.3})`,
            transition: 'transform 16ms linear, filter 16ms linear', // Smooth scaling and brightness changes
          }}
        >
          {/* Main sun flare image */}
          <img
            src="/sun-flare.png"
            alt="Sun"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255, 200, 0, 0.6))',
              opacity: solarData.intensity,
            }}
          />
          
          {/* Studio shape point in center of sun */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/studio_shape_point.png"
              alt="Sun Center"
              className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              style={{
                filter: 'brightness(1.2) contrast(1.1)',
                opacity: solarData.intensity * 0.9,
              }}
            />
          </div>
          
          {/* Solar ray from sun center to aircraft (center of screen) */}
          {solarData.intensity > 0.3 && (() => {
            // Ray starts from the center of the small sun image (studio_shape_point.png) and points to aircraft
            const centerX = 50; // Exact screen center X (aircraft position)
            const centerY = 50; // Exact screen center Y (aircraft position)
            
            // Calculate vector from sun center to aircraft center
            const deltaX = centerX - solarData.x; // Horizontal distance from sun to aircraft
            const deltaY = centerY - solarData.y; // Vertical distance from sun to aircraft
            
            // Calculate angle and length from sun center to aircraft
            const angleRadians = Math.atan2(deltaY, deltaX);
            const angleDegrees = angleRadians * (180 / Math.PI);
            const rayLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            return (
              <>
                {/* Main ray from sun center (small sun image) to aircraft */}
                <div
                  className="absolute ease-linear"
                  style={{
                    left: `${solarData.x}%`, // Start from exact sun center (where small sun image is)
                    top: `${solarData.y}%`,  // Start from exact sun center (where small sun image is)
                    width: `${rayLength}vh`, // Extend exactly to aircraft at center
                    height: '4px', // Make ray slightly thicker for visibility
                    transformOrigin: 'left center', // Rotate around sun center (small sun image)
                    transform: `translate(0, -50%) rotate(${angleDegrees}deg)`,
                    transition: 'left 16ms linear, top 16ms linear, width 16ms linear, transform 16ms linear',
                    background: `linear-gradient(to right, 
                      rgba(255, 220, 100, ${solarData.intensity * 0.95}) 0%, 
                      rgba(255, 240, 150, ${solarData.intensity * 0.8}) 20%, 
                      rgba(255, 255, 200, ${solarData.intensity * 0.6}) 60%, 
                      rgba(255, 255, 255, ${solarData.intensity * 0.3}) 90%,
                      transparent 100%)`,
                    pointerEvents: 'none',
                    boxShadow: `0 0 12px rgba(255, 220, 100, ${solarData.intensity * 0.5})`,
                    zIndex: 1,
                  }}
                />
              </>
            );
          })()}
        </div>
      </div>
      
      {/* Optional: Sun position debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs">
          <div>Elevation: {solarData.elevationDegrees.toFixed(1)}°</div>
          <div>Azimuth: {solarData.azimuthDegrees.toFixed(1)}° (adjusted)</div>
          <div>Original Az: {(solarData.originalAzimuth * 180 / Math.PI).toFixed(1)}°</div>
          <div>Map Bearing: {mapBearing.toFixed(1)}°</div>
          <div>Sun Position: ({solarData.x.toFixed(1)}%, {solarData.y.toFixed(1)}%)</div>
          <div>Sun Scale: {(1.0 + (Math.max(0, Math.sin(solarData.elevation)) * 0.8)).toFixed(2)}x</div>
          <div>Ray Length: {Math.sqrt((50 - solarData.x) ** 2 + (50 - solarData.y) ** 2).toFixed(1)}vh</div>
          <div>Ray Angle: {(Math.atan2(50 - solarData.y, 50 - solarData.x) * 180 / Math.PI).toFixed(1)}°</div>
          <div>Intensity: {solarData.intensity.toFixed(2)}</div>
          <div>Aircraft: {latitude.toFixed(4)}, {longitude.toFixed(4)}</div>
        </div>
      )}
    </div>
  );
}
