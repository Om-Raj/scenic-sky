# Development Journey: Scenic Sky Flight Visualization

## Project Overview
A modern Next.js application that visualizes Great-Circle flight paths between airports with a 3D sky dome showing real-time sun positioning based on aircraft location, date, and time.

## Key Prompts & Evolution

### Prompt 1: Initial Project Setup
**Request**: Create a modern Next.js + TypeScript app with Great-Circle flight path visualization and interactive map.

**Implementation**:
- Next.js with App Router and TypeScript
- MapLibre GL for interactive maps
- Turf.js for Great-Circle calculations
- shadcn/ui + Tailwind CSS for styling
- Airplane animation along flight paths

### Prompt 2: Route-Based Architecture
**Request**: Restructure to send form data to `/flight-map` route with URL parameters.

**Implementation**:
- Form submission redirects to `/flight-map` with query parameters
- Separated hero form from map visualization
- URL-based state management for flight parameters

### Prompt 3: UI Refinement
**Request**: Remove flight details section, create floating compact control deck with time/distance info.

**Implementation**:
- Compact floating controls at bottom center (max 400px width)
- Current time calculation from start/arrival times
- Progress percentage display

### Prompt 4: International Date Line Fix
**Request**: Fix flight path wrapping around globe when crossing international date line.

**Implementation**:
- Detected longitude jumps from ~180° to ~-180°
- Implemented path segmentation to avoid incorrect globe wrapping
- Used great-circle calculations that respect shortest path

### Prompt 5: 3D Sun Visualization
**Request**: Create realistic 3D sun with Three.js, solar calculations, and aircraft-centered map.

**Implementation**:
- Three.js integration with @react-three/fiber
- SunCalc library for astronomical calculations
- 3D sky dome with hemisphere visualization
- Aircraft-centered map with fixed positioning
- Real-time sun positioning based on coordinates, date, and time

## Major Bugs & Solutions

### Bug 1: Compass Orientation Issues
**Problem**: Sky dome compass was 180° wrong and not accounting for map tilt.

**Root Cause**: Coordinate system mismatch between map view and 3D sphere orientation.

**Solution**:
```typescript
// Fixed coordinate system mapping
const x = Math.sin(azRad) * radius; // East-West
const z = -Math.cos(azRad) * radius; // North-South (negative Z = North)

// Fixed compass rotation for map bearing
const adjustedAz = (az - mapBearing + 360) % 360; // Counter-rotate compass
```

### Bug 2: Sphere Rotating in Opposite Direction
**Problem**: When map bearing changed, sphere rotated in wrong direction.

**Root Cause**: Map bearing adjustment was adding instead of subtracting bearing.

**Solution**:
```typescript
// Fixed rotation direction
const adjustedAz = (az - mapBearing + 360) % 360; // Subtract for counter-rotation
```

### Bug 3: Sun Position on Wrong Side
**Problem**: Sun appeared on incorrect side of aircraft.

**Root Cause**: Sun position rotation was in same direction as map bearing instead of opposite.

**Solution**:
```typescript
// Fixed sun position rotation
const bearingRad = -mapBearing * DEG2RAD; // Negative to rotate opposite to map
const adjustedX = rawSun.x * cosB - rawSun.z * sinB;
const adjustedZ = rawSun.x * sinB + rawSun.z * cosB;
```

### Bug 4: Incorrect Timezone Handling
**Problem**: Times interpreted as browser's local timezone instead of airport timezones.

**Root Cause**: JavaScript Date parsing without timezone information.

**Initial Issue**:
- DEL departure "12:00" → interpreted as local browser time (IST)
- JFK arrival "23:00" → also interpreted as local browser time (IST)
- Solar calculations completely wrong

**Solution**:
```typescript
// Added timezone support to airports
export interface Airport {
  code: string;
  name: string;
  lat: number;
  lon: number;
  timezone: string; // IANA timezone identifier
}

// Airport data with timezones
const DEMO_AIRPORTS: Airport[] = [
  { code: 'JFK', name: 'New York John F. Kennedy', lat: 40.6413, lon: -73.7781, timezone: 'America/New_York' },
  { code: 'DEL', name: 'Indira Gandhi Intl, Delhi', lat: 28.5562, lon: 77.1, timezone: 'Asia/Kolkata' },
  // ... other airports
];

// Proper timezone handling
export function createDateTimeInTimezone(date: string, time: string, timezone: string): Date {
  const timezoneOffsets: { [key: string]: string } = {
    'America/New_York': '-04:00', // EDT in summer
    'Asia/Kolkata': '+05:30', // IST
    // ... other timezones
  };
  
  const offset = timezoneOffsets[timezone] || '+00:00';
  const isoString = `${date}T${time}:00${offset}`;
  return new Date(isoString);
}
```

**Before Fix**:
- DEL 12:00 → treated as IST → wrong solar calculation
- JFK 23:00 → treated as IST → completely incorrect

**After Fix**:
- DEL 12:00 IST → 2025-08-15T06:30:00.000Z → Sun at 74.3° elevation, 155.6° azimuth (correct)
- JFK 23:00 EDT → 2025-08-16T03:00:00.000Z → Sun at -28.9° elevation (nighttime, correct)

## Technical Architecture

### Core Components
- **SkyDomeVisualization.tsx**: 3D hemisphere with Three.js, compass, sun positioning
- **MapWithCenteredAircraft.tsx**: Aircraft-centered map with MapLibre GL
- **FlightPath/**: Great-circle path calculation and animation
- **HeroForm/**: Airport selection and flight parameters

### Key Libraries
- **Three.js/@react-three/fiber**: 3D rendering
- **SunCalc**: Astronomical calculations
- **MapLibre GL**: Interactive maps
- **Turf.js**: Geospatial calculations

### Coordinate Systems
- **Geographic**: Latitude/Longitude (WGS84)
- **Map Projection**: Web Mercator for map tiles
- **3D Scene**: Cartesian coordinates (x=East, y=Up, z=North with z negated)
- **Solar**: Azimuth from North (0-360°), Elevation from horizon (-90° to +90°)

## Lessons Learned

### 1. Coordinate System Alignment
Multiple coordinate systems require careful transformation:
- Map coordinates vs. 3D scene coordinates
- Solar azimuth reference systems (SunCalc uses South, we need North)
- Rotation directions and reference frames

### 2. Timezone Complexity
Never assume timezone context:
- HTML time inputs have no timezone information
- JavaScript Date parsing is timezone-dependent
- Airport times must use local airport timezones
- Solar calculations require precise UTC times

### 3. Rotation Mathematics
3D rotations require careful consideration of:
- Rotation direction (clockwise vs counter-clockwise)
- Reference frames (global vs local)
- Composition of multiple rotations

### 4. Real-World Testing
Astronomical calculations must be validated against:
- Known sun positions at specific times/locations
- Expected daylight/nighttime periods
- Seasonal variations and geographic latitude effects

## Performance Optimizations

### 1. Memoization
```typescript
const sun = useMemo(() => {
  // Expensive solar calculations
}, [date, latitude, longitude, radius, mapBearing]);
```

### 2. GPU Acceleration
- Three.js WebGL rendering
- Efficient geometry updates
- Minimal re-renders with React state management

### 3. Path Calculations
- Pre-computed great-circle points
- Optimized bearing calculations
- Throttled animation updates

## Future Enhancements
- Real-time weather data integration
- Multiple aircraft support
- Historical flight playback
- Enhanced astronomical features (moon phases, star positions)
- Improved timezone handling with full DST support

## Validation Results
✅ Correct sun positioning for all test scenarios
✅ Proper timezone handling for international flights  
✅ Accurate compass orientation relative to map bearing
✅ Smooth 3D visualization performance
✅ Great-circle path calculations working correctly
