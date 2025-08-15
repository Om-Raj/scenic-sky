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
  aircraftPosition?: { x: number; y: number; z: number };
}

/**
 * 2D Sun Component using sun image
 * Renders realistic sun with position based on astronomical calculations
 */
export function SunAngleOverlay({ 
  latitude, 
  longitude, 
  date, 
  aircraftPosition 
}: SunComponentProps) {
  // Calculate solar position for current time and location
  const solarData = useMemo(() => {
    const position = calculateSolarPosition(latitude, longitude, date);
    
    // Map solar position to screen coordinates
    // Convert elevation and azimuth to screen x,y coordinates
    const elevation = Math.max(-0.5, position.elevation); // Clamp minimum elevation
    const azimuth = position.azimuth;
    
    // Convert to screen coordinates (center = 50%, 50%)
    // Azimuth: 0 = north (top), π/2 = east (right), π = south (bottom), 3π/2 = west (left)
    // Elevation: positive = above horizon
    
    const radius = 40; // Radius from center in viewport percentage
    const elevationFactor = Math.sin(elevation) * 0.7 + 0.3; // 0.3 to 1.0 range
    
    // Calculate screen position
    const x = 50 + (Math.sin(azimuth) * radius * elevationFactor);
    const y = 50 - (Math.cos(azimuth) * radius * elevationFactor);
    
    // Clamp to screen bounds with margin
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    
    // Calculate intensity based on elevation
    const intensity = Math.max(0.2, Math.sin(elevation) + 0.3);
    
    return {
      x: clampedX,
      y: clampedY,
      elevation: position.elevation,
      azimuth: position.azimuth,
      intensity,
      isVisible: elevation > -0.3, // Show sun even slightly below horizon
    };
  }, [latitude, longitude, date]);

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
          
          {/* Light ray from sun center to screen center (aircraft position) */}
          {aircraftPosition && solarData.intensity > 0.4 && (
            <div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: '2px',
                transformOrigin: 'top center',
                transform: `translate(-50%, 0) rotate(${Math.atan2(
                  50 - solarData.y, // Calculate angle to screen center (50%, 50%)
                  50 - solarData.x
                ) * (180 / Math.PI)}deg)`,
                height: `${Math.sqrt(
                  Math.pow(50 - solarData.x, 2) + Math.pow(50 - solarData.y, 2)
                )}vh`, // Length from sun to center
                background: `linear-gradient(to bottom, 
                  rgba(255, 220, 100, ${solarData.intensity * 0.8}) 0%, 
                  rgba(255, 220, 100, ${solarData.intensity * 0.4}) 50%, 
                  transparent 100%)`,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>
      
      {/* Optional: Sun position debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs">
          <div>Elevation: {(solarData.elevation * 180 / Math.PI).toFixed(1)}°</div>
          <div>Azimuth: {(solarData.azimuth * 180 / Math.PI).toFixed(1)}°</div>
          <div>Position: ({solarData.x.toFixed(1)}%, {solarData.y.toFixed(1)}%)</div>
          <div>Intensity: {solarData.intensity.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}
