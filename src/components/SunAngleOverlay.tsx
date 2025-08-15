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
        className="absolute transition-all duration-1000 ease-out"
        style={{
          left: `${solarData.x}%`,
          top: `${solarData.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="relative"
          style={{
            filter: `brightness(${0.8 + solarData.intensity * 0.4}) saturate(${0.9 + solarData.intensity * 0.3})`,
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
          
          {/* Solar ray from sun to aircraft (center of screen) */}
          {solarData.intensity > 0.3 && (() => {
            // Ray starts from sun position and points to screen center (aircraft)
            const centerX = 50; // Screen center X (aircraft position)
            const centerY = 50; // Screen center Y (aircraft position)
            
            // Calculate vector from sun to center (aircraft)
            const deltaX = centerX - solarData.x; // Horizontal distance from sun to aircraft
            const deltaY = centerY - solarData.y; // Vertical distance from sun to aircraft
            
            // Calculate angle and length from sun to aircraft
            const angleRadians = Math.atan2(deltaY, deltaX);
            const angleDegrees = angleRadians * (180 / Math.PI);
            const rayLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Calculate horizon point for elevation reference
            const horizonRadius = 40; // Same as sun positioning radius
            const horizonX = 50 + (Math.sin(solarData.azimuth) * horizonRadius);
            const horizonY = 50 - (Math.cos(solarData.azimuth) * horizonRadius);
            
            return (
              <>
                {/* Main ray from sun to aircraft */}
                <div
                  className="absolute"
                  style={{
                    left: `${solarData.x}%`, // Start from sun position
                    top: `${solarData.y}%`,  // Start from sun position
                    width: `${rayLength}vh`, // Extend to aircraft at center
                    height: '3px',
                    transformOrigin: 'left center', // Rotate around sun position
                    transform: `translate(0, -50%) rotate(${angleDegrees}deg)`,
                    background: `linear-gradient(to right, 
                      rgba(255, 220, 100, ${solarData.intensity * 0.9}) 0%, 
                      rgba(255, 240, 150, ${solarData.intensity * 0.7}) 30%, 
                      rgba(255, 255, 200, ${solarData.intensity * 0.5}) 70%, 
                      rgba(255, 255, 255, ${solarData.intensity * 0.2}) 100%)`,
                    pointerEvents: 'none',
                    boxShadow: `0 0 8px rgba(255, 220, 100, ${solarData.intensity * 0.4})`,
                    zIndex: 1,
                  }}
                />
                
                {/* Horizon reference line from center to horizon point */}
                <div
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: `${Math.sqrt((horizonX - 50) ** 2 + (horizonY - 50) ** 2)}vh`,
                    height: '1px',
                    transformOrigin: 'left center',
                    transform: `translate(0, -50%) rotate(${Math.atan2(horizonY - 50, horizonX - 50) * (180 / Math.PI)}deg)`,
                    background: `linear-gradient(to right, 
                      rgba(255, 255, 255, 0.3) 0%, 
                      rgba(255, 255, 255, 0.1) 50%, 
                      transparent 100%)`,
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />
                
                {/* Horizon reference point */}
                <div
                  className="absolute"
                  style={{
                    left: `${horizonX}%`,
                    top: `${horizonY}%`,
                    width: '3px',
                    height: '3px',
                    backgroundColor: `rgba(255, 255, 255, 0.4)`,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
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
          <div>Ray Length: {Math.sqrt((50 - solarData.x) ** 2 + (50 - solarData.y) ** 2).toFixed(1)}vh</div>
          <div>Ray Angle: {(Math.atan2(50 - solarData.y, 50 - solarData.x) * 180 / Math.PI).toFixed(1)}°</div>
          <div>Intensity: {solarData.intensity.toFixed(2)}</div>
          <div>Aircraft: {latitude.toFixed(4)}, {longitude.toFixed(4)}</div>
        </div>
      )}
    </div>
  );
}
