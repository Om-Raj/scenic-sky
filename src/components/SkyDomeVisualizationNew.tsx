'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import SunCalc from 'suncalc';

interface SkyDomeVisualizationProps {
  aircraftCoordinates: {
    lat: number;
    lng: number;
  };
  currentTime?: Date;
  mapBearing?: number;
}

interface SunPathParams {
  showSunSurface: boolean;
  showAnalemmas: boolean;
  showSunDayPath: boolean;
  showHourlyMarkers: boolean;
  radius: number;
  latitude: number;
  longitude: number;
  currentDate: Date;
}

/**
 * Calculate sun position in 3D space using spherical coordinates
 */
function getSunPosition(date: Date, latitude: number, longitude: number, radius: number = 1.5) {
  const sunPosition = SunCalc.getPosition(date, latitude, longitude);
  
  // Convert to spherical coordinates (azimuth, elevation)
  const azimuthRad = sunPosition.azimuth;
  const elevationRad = sunPosition.altitude;
  
  // Convert to Cartesian coordinates for 3D positioning
  const x = radius * Math.cos(elevationRad) * Math.cos(azimuthRad);
  const z = radius * Math.cos(elevationRad) * Math.sin(azimuthRad);
  const y = radius * Math.sin(elevationRad);
  
  return { x, y, z, elevation: elevationRad, azimuth: azimuthRad };
}

/**
 * Enhanced Sun Sphere with glow effects and dynamic sizing
 */
function SunSphere({ 
  position, 
  elevation, 
  params 
}: { 
  position: [number, number, number];
  elevation: number;
  params: SunPathParams;
}) {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Calculate sun size and brightness based on elevation
  const elevationDegrees = (elevation * 180) / Math.PI;
  const sunSize = Math.max(0.03, 0.08 * Math.sin(Math.max(0, elevation)));
  const brightness = Math.max(0.3, Math.sin(Math.max(0, elevation)));
  const glowSize = sunSize * 3;
  
  useFrame((state) => {
    if (sunRef.current && glowRef.current) {
      // Gentle pulsing animation
      const pulse = 1 + 0.1 * Math.sin(state.clock.elapsedTime * 2);
      sunRef.current.scale.setScalar(pulse);
      glowRef.current.scale.setScalar(pulse * 0.8);
    }
  });

  return (
    <group position={position}>
      {/* Sun core */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[sunSize, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color().setHSL(0.1, 1, brightness)}
          transparent
          opacity={brightness}
        />
      </mesh>
      
      {/* Sun glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[glowSize, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color().setHSL(0.15, 0.8, 0.6)}
          transparent
          opacity={brightness * 0.3}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[glowSize * 1.5, 16, 16]} />
        <meshBasicMaterial 
          color={new THREE.Color().setHSL(0.2, 0.6, 0.4)}
          transparent
          opacity={brightness * 0.1}
        />
      </mesh>
    </group>
  );
}

/**
 * Sun Day Path - shows sun trajectory for current day
 */
function SunDayPath({ params }: { params: SunPathParams }) {
  const pathPoints = useMemo(() => {
    const points = [];
    const currentDate = new Date(params.currentDate);
    
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(currentDate);
      date.setHours(hour, 0, 0, 0);
      const sunPos = getSunPosition(date, params.latitude, params.longitude, params.radius);
      
      // Only add points where sun is above horizon
      if (sunPos.y > 0) {
        points.push(new THREE.Vector3(sunPos.x, sunPos.y, sunPos.z));
      }
    }
    
    return points;
  }, [params]);

  if (!params.showSunDayPath || pathPoints.length === 0) return null;

  const curve = new THREE.CatmullRomCurve3(pathPoints, false);
  const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.01, 8, false);

  return (
    <mesh geometry={tubeGeometry}>
      <meshBasicMaterial 
        color="red" 
        transparent 
        opacity={0.7}
      />
    </mesh>
  );
}

/**
 * Analemmas - figure-8 patterns showing sun position at same time throughout the year
 */
function Analemmas({ params }: { params: SunPathParams }) {
  const analemmaData = useMemo(() => {
    if (!params.showAnalemmas) return [];
    
    const analemmas = [];
    
    // Create analemma for each hour from 7 AM to 6 PM
    for (let hour = 7; hour < 18; hour++) {
      const points = [];
      
      // Calculate sun position for this hour throughout the year
      for (let dayOfYear = 1; dayOfYear <= 365; dayOfYear += 5) {
        const date = new Date(2024, 0, dayOfYear);
        date.setHours(hour, 0, 0, 0);
        
        const sunPos = getSunPosition(date, params.latitude, params.longitude, params.radius);
        
        // Only add points where sun is above horizon
        if (sunPos.y > 0) {
          points.push(sunPos.x, sunPos.y, sunPos.z);
        }
      }
      
      if (points.length > 0) {
        analemmas.push({
          hour,
          points: new Float32Array(points)
        });
      }
    }
    
    return analemmas;
  }, [params]);

  if (!params.showAnalemmas) return null;

  return (
    <>
      {analemmaData.map(({ hour, points }) => (
        <line key={hour}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length / 3}
              array={points}
              itemSize={3}
            />
          </bufferGeometry>
          <lineDashedMaterial 
            color="yellow" 
            transparent 
            opacity={0.6}
            dashSize={0.05}
            gapSize={0.03}
          />
        </line>
      ))}
    </>
  );
}

/**
 * Sun Surface - 3D surface showing all sun positions throughout the year
 */
function SunSurface({ params }: { params: SunPathParams }) {
  const surfaceGeometry = useMemo(() => {
    if (!params.showSunSurface) return null;
    
    const vertices = [];
    const indices = [];
    let vertexIndex = 0;
    
    // Create grid of sun positions across months and hours
    for (let month = 0; month < 12; month++) {
      for (let hour = 6; hour < 19; hour++) {
        const date1 = new Date(2024, month, 15, hour, 0, 0);
        const date2 = new Date(2024, month, 15, hour + 1, 0, 0);
        const date3 = new Date(2024, month + 1 > 11 ? 0 : month + 1, 15, hour, 0, 0);
        const date4 = new Date(2024, month + 1 > 11 ? 0 : month + 1, 15, hour + 1, 0, 0);
        
        const pos1 = getSunPosition(date1, params.latitude, params.longitude, params.radius);
        const pos2 = getSunPosition(date2, params.latitude, params.longitude, params.radius);
        const pos3 = getSunPosition(date3, params.latitude, params.longitude, params.radius);
        const pos4 = getSunPosition(date4, params.latitude, params.longitude, params.radius);
        
        // Only add triangles where sun is above horizon
        if (pos1.y > 0 && pos2.y > 0 && pos3.y > 0 && pos4.y > 0) {
          // Add vertices
          vertices.push(pos1.x, pos1.y, pos1.z);
          vertices.push(pos2.x, pos2.y, pos2.z);
          vertices.push(pos3.x, pos3.y, pos3.z);
          vertices.push(pos4.x, pos4.y, pos4.z);
          
          // Add triangles
          indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);
          indices.push(vertexIndex + 1, vertexIndex + 3, vertexIndex + 2);
          
          vertexIndex += 4;
        }
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }, [params]);

  if (!params.showSunSurface || !surfaceGeometry) return null;

  return (
    <mesh geometry={surfaceGeometry}>
      <meshBasicMaterial 
        color="yellow" 
        transparent 
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Hourly markers on the sun path
 */
function HourlyMarkers({ params }: { params: SunPathParams }) {
  const markers = useMemo(() => {
    if (!params.showHourlyMarkers) return [];
    
    const markerData = [];
    const currentDate = new Date(params.currentDate);
    
    for (let hour = 6; hour <= 18; hour += 2) {
      const date = new Date(currentDate);
      date.setHours(hour, 0, 0, 0);
      const sunPos = getSunPosition(date, params.latitude, params.longitude, params.radius);
      
      if (sunPos.y > 0) {
        markerData.push({
          position: [sunPos.x, sunPos.y, sunPos.z] as [number, number, number],
          hour: hour
        });
      }
    }
    
    return markerData;
  }, [params]);

  if (!params.showHourlyMarkers) return null;

  return (
    <>
      {markers.map(({ position, hour }) => (
        <group key={hour} position={position}>
          <mesh>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="orange" />
          </mesh>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.08}
            color="orange"
            anchorX="center"
            anchorY="middle"
          >
            {hour}:00
          </Text>
        </group>
      ))}
    </>
  );
}

/**
 * Compass labels (N, E, S, W)
 */
function CompassLabels({ mapBearing = 0 }: { mapBearing?: number }) {
  const radius = 1.6;
  const labels = [
    { direction: 'N', azimuth: 0 },
    { direction: 'E', azimuth: 90 },
    { direction: 'S', azimuth: 180 },
    { direction: 'W', azimuth: 270 },
  ];

  return (
    <>
      {labels.map(({ direction, azimuth }) => {
        const adjustedAzimuth = ((azimuth - mapBearing) * Math.PI) / 180;
        const x = radius * Math.cos(adjustedAzimuth);
        const z = radius * Math.sin(adjustedAzimuth);
        
        return (
          <Text
            key={direction}
            position={[x, 0.1, z]}
            fontSize={0.15}
            color="yellow"
            anchorX="center"
            anchorY="middle"
          >
            {direction}
          </Text>
        );
      })}
    </>
  );
}

/**
 * Hemisphere background with grid lines
 */
function SkyGrid() {
  const points = [];
  
  // Elevation circles
  for (let elevation = 15; elevation <= 75; elevation += 15) {
    const elevRad = (elevation * Math.PI) / 180;
    const radius = Math.cos(elevRad) * 1.5;
    const height = Math.sin(elevRad) * 1.5;
    
    for (let i = 0; i <= 64; i++) {
      const azimuth = (i / 64) * 2 * Math.PI;
      const x = radius * Math.cos(azimuth);
      const z = radius * Math.sin(azimuth);
      points.push(x, height, z);
    }
  }
  
  // Azimuth lines
  for (let azimuth = 0; azimuth < 360; azimuth += 30) {
    const azimuthRad = (azimuth * Math.PI) / 180;
    for (let elevation = 0; elevation <= 90; elevation += 3) {
      const elevRad = (elevation * Math.PI) / 180;
      const radius = Math.cos(elevRad) * 1.5;
      const height = Math.sin(elevRad) * 1.5;
      const x = radius * Math.cos(azimuthRad);
      const z = radius * Math.sin(azimuthRad);
      points.push(x, height, z);
    }
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={new Float32Array(points)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#4a90e2" size={0.002} />
    </points>
  );
}

/**
 * Main 3D Scene Component
 */
function SkyDomeScene({
  aircraftCoordinates,
  currentTime = new Date(),
  mapBearing = 0,
}: SkyDomeVisualizationProps) {
  const [params, setParams] = useState<SunPathParams>({
    showSunSurface: true,
    showAnalemmas: true,
    showSunDayPath: true,
    showHourlyMarkers: true,
    radius: 1.5,
    latitude: aircraftCoordinates.lat,
    longitude: aircraftCoordinates.lng,
    currentDate: currentTime,
  });

  // Update params when props change
  useEffect(() => {
    setParams(prev => ({
      ...prev,
      latitude: aircraftCoordinates.lat,
      longitude: aircraftCoordinates.lng,
      currentDate: currentTime,
    }));
  }, [aircraftCoordinates, currentTime]);

  // Calculate current sun position
  const sunPosition = useMemo(() => {
    return getSunPosition(currentTime, aircraftCoordinates.lat, aircraftCoordinates.lng, params.radius);
  }, [currentTime, aircraftCoordinates, params.radius]);

  return (
    <group rotation={[0, (mapBearing * Math.PI) / 180, 0]}>
      {/* Sky grid background */}
      <SkyGrid />
      
      {/* Compass labels */}
      <CompassLabels mapBearing={0} />
      
      {/* Current sun position */}
      <SunSphere 
        position={[sunPosition.x, sunPosition.y, sunPosition.z]}
        elevation={sunPosition.elevation}
        params={params}
      />
      
      {/* Sun path visualizations */}
      <SunDayPath params={params} />
      <Analemmas params={params} />
      <SunSurface params={params} />
      <HourlyMarkers params={params} />
    </group>
  );
}

/**
 * Main component with responsive sizing
 */
export function SkyDomeVisualization({
  aircraftCoordinates,
  currentTime = new Date(),
  mapBearing = 0,
}: SkyDomeVisualizationProps) {
  const [containerSize, setContainerSize] = useState(300);

  useEffect(() => {
    const updateSize = () => {
      const maxSize = Math.min(300, window.innerWidth * 0.9);
      setContainerSize(maxSize);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        background: 'radial-gradient(circle, rgba(135, 206, 235, 0.1) 0%, rgba(25, 25, 112, 0.2) 100%)',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 50,
        }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.6} />
        <SkyDomeScene
          aircraftCoordinates={aircraftCoordinates}
          currentTime={currentTime}
          mapBearing={mapBearing}
        />
      </Canvas>
    </div>
  );
}
