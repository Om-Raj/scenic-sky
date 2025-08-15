'use client';

import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import SunCalc from 'suncalc';

type Props = {
  latitude: number;
  longitude: number;
  date?: Date; // UTC or local as you choose; pass a Date object
  mapBearing?: number; // Map rotation in degrees
  sizePx?: number; // diameter of HUD in px
  radius?: number; // sphere radius in scene units
};

const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

/**
 * Convert SunCalc output to scene XYZ coordinates.
 * Returns x (east), y (up), z (north), plus azimuthDeg and elevationDeg.
 */
function getSunPosition(date: Date, latitude: number, longitude: number, radius = 1.5) {
  const pos = SunCalc.getPosition(date, latitude, longitude);
  const elevationRad = pos.altitude; // radians, -π/2..+π/2
  const rawAzRad = pos.azimuth; // SunCalc azimuth in radians (from -π..π, measured from south?)

  // Convert SunCalc azimuth to degrees clockwise from North (0..360)
  // Common conversion: azDeg = (rawAzRad * RAD2DEG + 180) % 360
  const azDeg = (rawAzRad * RAD2DEG + 180) % 360;
  const azRadFromNorthClockwise = azDeg * DEG2RAD;

  // Map to Cartesian coords: x => East, y => Up, z => North
  // Fix coordinate system so North is at negative Z (top of screen)
  const x = radius * Math.cos(elevationRad) * Math.sin(azRadFromNorthClockwise); // East-West
  const z = -radius * Math.cos(elevationRad) * Math.cos(azRadFromNorthClockwise); // North-South (negative Z = North)
  const y = radius * Math.sin(elevationRad); // Up-Down

  return {
    x,
    y,
    z,
    elevationRad,
    azimuthRad: azRadFromNorthClockwise,
    elevationDeg: elevationRad * RAD2DEG,
    azimuthDeg: azDeg,
  };
}

/**
 * Generate ring line geometry for a circle at given elevation angle.
 * Returns a THREE.BufferGeometry ready for a Line (positions only).
 */
function makeLatitudeRingGeometry(elevationDeg: number, radius = 1.5, segments = 64) {
  const elevRad = elevationDeg * DEG2RAD;
  const r = Math.cos(elevRad) * radius;
  const y = Math.sin(elevRad) * radius;
  const points: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const az = (i / segments) * Math.PI * 2;
    const x = r * Math.cos(az);
    const z = -r * Math.sin(az); // Fix coordinate system: adjust Z for proper orientation
    points.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

/**
 * Generate meridian line geometry for a given azimuth (0..360 from North clockwise).
 * Samples elevation from 0 (horizon) to 90 (zenith).
 */
function makeMeridianGeometry(azimuthDeg: number, radius = 1.5, segments = 36) {
  const azRad = azimuthDeg * DEG2RAD;
  const points: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const elev = (i / segments) * 90; // 0..90 deg
    const elevRad = elev * DEG2RAD;
    const r = Math.cos(elevRad) * radius;
    const y = Math.sin(elevRad) * radius;
    const x = r * Math.sin(azRad);
    const z = -r * Math.cos(azRad); // Fix coordinate system: negative Z = North
    points.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

/**
 * Generate sun day path geometry - shows sun trajectory for the current day
 */
function makeSunDayPathGeometry(date: Date, latitude: number, longitude: number, radius = 1.5) {
  const points: number[] = [];
  const currentDate = new Date(date);
  
  for (let hour = 0; hour < 24; hour += 0.5) {
    const testDate = new Date(currentDate);
    testDate.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    
    const sunPos = getSunPosition(testDate, latitude, longitude, radius);
    
    // Only add points where sun is above horizon
    if (sunPos.elevationDeg > 0) {
      points.push(sunPos.x, sunPos.y, sunPos.z);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

/**
 * Generate sun ray geometry from sun position to center (airplane)
 */
function makeSunRayGeometry(sunPosition: { x: number; y: number; z: number }) {
  const points = [
    sunPosition.x, sunPosition.y, sunPosition.z, // Sun position
    0, 0, 0 // Center (airplane position)
  ];
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

/**
 * The interior hemisphere mesh (inverted normals via BackSide) for subtle atmosphere.
 */
function HemisphereMesh({ radius = 1.5 }: { radius?: number }) {
  const geom = useMemo(() => new THREE.SphereGeometry(radius, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), [radius]);
  // Note: SphereGeometry args: (radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
  // thetaLength = PI/2 makes a hemisphere (top half)
  return (
    <mesh geometry={geom}>
      <meshBasicMaterial
        side={THREE.BackSide}
        transparent
        opacity={0.08}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * Main Scene: hemisphere with grid, compass on circumference, sun day path, and sun ray.
 */
function SkySphereScene({ 
  latitude, 
  longitude, 
  date = new Date(), 
  mapBearing = 0,
  radius = 1.5 
}: { 
  latitude: number; 
  longitude: number; 
  date?: Date; 
  mapBearing?: number;
  radius?: number; 
}) {
  // Sun position memoized and adjusted for map bearing
  const sun = useMemo(() => {
    const rawSun = getSunPosition(date, latitude, longitude, radius);
    
    // Adjust sun position for map bearing (rotate opposite to map)
    // When map rotates clockwise, sun should appear to rotate counter-clockwise
    const bearingRad = -mapBearing * DEG2RAD; // Negative to rotate opposite to map
    const cosB = Math.cos(bearingRad);
    const sinB = Math.sin(bearingRad);
    
    // Rotate the sun position to account for map bearing
    const adjustedX = rawSun.x * cosB - rawSun.z * sinB;
    const adjustedZ = rawSun.x * sinB + rawSun.z * cosB;
    
    return {
      ...rawSun,
      x: adjustedX,
      z: adjustedZ
    };
  }, [date, latitude, longitude, radius, mapBearing]);

  // Sun day path geometry adjusted for map bearing
  const sunDayPath = useMemo(() => {
    try {
      const points: number[] = [];
      const currentDate = new Date(date);
      const bearingRad = -mapBearing * DEG2RAD; // Negative to rotate opposite to map
      const cosB = Math.cos(bearingRad);
      const sinB = Math.sin(bearingRad);
      
      for (let hour = 0; hour < 24; hour += 0.5) {
        const testDate = new Date(currentDate);
        testDate.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        
        const sunPos = getSunPosition(testDate, latitude, longitude, radius);
        
        // Only add points where sun is above horizon
        if (sunPos.elevationDeg > 0) {
          // Adjust position for map bearing
          const adjustedX = sunPos.x * cosB - sunPos.z * sinB;
          const adjustedZ = sunPos.x * sinB + sunPos.z * cosB;
          points.push(adjustedX, sunPos.y, adjustedZ);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      return geometry;
    } catch (e) {
      console.warn('Failed to generate sun day path:', e);
      return null;
    }
  }, [date, latitude, longitude, radius, mapBearing]);

  // Sun ray geometry
  const sunRay = useMemo(() => {
    if (sun.elevationDeg > 0) {
      return makeSunRayGeometry(sun);
    }
    return null;
  }, [sun]);

  // Precompute latitude rings (elevations) and meridians (azimuths)
  const latRings = useMemo(() => [0, 15, 30, 45, 60, 75], []);
  const meridians = useMemo(() => [0, 45, 90, 135, 180, 225, 270, 315], []);

  // subtle bobbing animation for sun using frame clock
  const sunRef = React.useRef<THREE.Mesh | null>(null);
  useFrame((state) => {
    if (sunRef.current) {
      const t = state.clock.elapsedTime;
      const bob = 1 + 0.02 * Math.sin(t * 1.5);
      sunRef.current.scale.setScalar(bob);
    }
  });

  return (
    // Add slight forward tilt to match map's 3D perspective
    <group rotation={[0.2, 0, 0]}>
      {/* Hemisphere interior for subtle atmosphere */}
      <HemisphereMesh radius={radius * 1.02} />

      {/* Latitude rings: including equator (0°) */}
      {latRings.map((deg) => {
        const geo = useMemo(() => makeLatitudeRingGeometry(deg, radius, 96), [deg, radius]);
        const isEquator = deg === 0;
        return (
          <primitive key={`lat-${deg}`} object={new THREE.Line(geo)}>
            <lineBasicMaterial
              attach="material"
              color={isEquator ? '#ffffff' : '#9fc9ff'}
              transparent
              opacity={isEquator ? 0.9 : 0.35}
            />
          </primitive>
        );
      })}

      {/* Meridians */}
      {meridians.map((az) => {
        const geo = useMemo(() => makeMeridianGeometry(az, radius, 48), [az, radius]);
        const isCardinal = az % 90 === 0;
        return (
          <primitive key={`mer-${az}`} object={new THREE.Line(geo)}>
            <lineBasicMaterial
              attach="material"
              color={isCardinal ? '#ffffff' : '#9fc9ff'}
              transparent
              opacity={isCardinal ? 0.8 : 0.28}
            />
          </primitive>
        );
      })}

      {/* Sun day path */}
      {sunDayPath && (
        <primitive object={new THREE.Line(sunDayPath)}>
          <lineBasicMaterial
            attach="material"
            color="#ff6b35"
            transparent
            opacity={0.8}
            linewidth={2}
          />
        </primitive>
      )}

      {/* Sun ray from sun to center (airplane) */}
      {sunRay && sun.elevationDeg > 0 && (
        <primitive object={new THREE.Line(sunRay)}>
          <lineBasicMaterial
            attach="material"
            color="#ffd700"
            transparent
            opacity={0.6}
            linewidth={3}
          />
        </primitive>
      )}

      {/* Compass labels at circumference (equator) - rotate opposite to map bearing */}
      {[
        { label: 'N', az: 0 },
        { label: 'E', az: 90 },
        { label: 'S', az: 180 },
        { label: 'W', az: 270 },
      ].map(({ label, az }) => {
        // Adjust azimuth by map bearing so compass always points to true north
        // When map rotates clockwise, compass should rotate counter-clockwise
        const adjustedAz = (az - mapBearing + 360) % 360;
        const azRad = adjustedAz * DEG2RAD;
        
        // Position with corrected coordinate system:
        // North (0°) at negative Z (top of screen)
        // East (90°) at positive X (right of screen)  
        const x = Math.sin(azRad) * radius;
        const z = -Math.cos(azRad) * radius;
        
        return (
          <group key={`label-${label}`} position={[x, 0.02, z]}>
            <Text fontSize={0.14} color="#fff" anchorX="center" anchorY="middle" maxWidth={1}>
              {label}
            </Text>
          </group>
        );
      })}

      {/* Sun: small bright sphere + sprite halo - only show if above horizon */}
      {sun.elevationDeg > 0 && (
        <group position={[sun.x, sun.y, sun.z]}>
          <mesh ref={sunRef}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ffd76b" toneMapped={false} />
          </mesh>

          {/* simple sprite halo */}
          <sprite scale={[0.6, 0.6, 1]}>
            <spriteMaterial
              attach="material"
              color="#ffd76b"
              transparent
              opacity={0.25}
              depthWrite={false}
            />
          </sprite>

          {/* small elevation/azimuth readout as 3D text near the sun */}
          <Html center position={[0.12, 0.06, 0]}>
            <div style={{
              color: 'white',
              fontSize: 10,
              padding: '2px 6px',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: 4,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              {`Az ${sun.azimuthDeg.toFixed(0)}° • El ${sun.elevationDeg.toFixed(0)}°`}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

/**
 * HUD wrapper: circular fixed overlay with Canvas.
 */
export default function SkySphereVisualization({
  latitude,
  longitude,
  date = new Date(),
  mapBearing = 0,
  sizePx = 300,
  radius = 1.5,
}: Props) {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${sizePx}px`,
        height: `${sizePx}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.18)',
        background: 'radial-gradient(circle, rgba(135,206,235,0.06) 0%, rgba(25,25,112,0.08) 100%)',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <Canvas
        orthographic={false}
        camera={{ 
          position: [0, 1.5, 2], 
          fov: 55,
          // Camera looks down at the hemisphere to match map perspective
          up: [0, 1, 0]
        }}
        style={{ width: '100%', height: '100%', touchAction: 'none', pointerEvents: 'none' }}
        onCreated={({ camera }) => {
          // Point camera down towards the hemisphere center
          camera.lookAt(0, 0, 0);
        }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight intensity={0.3} position={[5, 10, 2]} />

        <SkySphereScene 
          latitude={latitude} 
          longitude={longitude} 
          date={date} 
          mapBearing={mapBearing}
          radius={radius} 
        />
      </Canvas>
    </div>
  );
}
