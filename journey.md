# Development Journey: Scenic Sky Flight Visualization

## Project Overview
A modern Next.js application that visualizes Great-Circle flight paths between airports with a 3D sky dome showing real-time sun positioning based on aircraft location, date, and time.

## Recent Fixes

### Aug 16, 2025 - Fixed Modal Positioning and Animation Resume
**Issues**: 
- Modal was positioned to the side of sun sphere instead of above airplane
- Map movement didn't resume automatically when modal closed
**Fixes**: 
- Changed modal positioning to be centered above airplane (50% left, 40% top)
- Removed marker position calculation since modal is now centered
- Fixed animation resume logic to always restart animation when closing scenic modal
- Simplified ScenicModal props by removing unused markerPosition
**Files Changed**: 
- `src/components/ScenicModal.tsx` - Updated positioning to center above airplane
- `src/app/flight-map/page.tsx` - Fixed resume animation logic and removed marker position state

### Aug 16, 2025 - Updated ScenicModal UX and Flight Controls
**Changes**: 
- Removed Resume/Close buttons from ScenicModal component for cleaner UI
- Modified modal to be visually anchored so marker pin appears at bottom-center
- Updated FlightPath component to show "Resume" button when scenic modal is active
- Centralized resume functionality in flight control deck instead of modal
- Modal now uses `pointerEvents: 'none'` since it has no interactive elements
**Files Changed**: 
- `src/components/ScenicModal.tsx` - Removed buttons, updated positioning and styling
- `src/components/FlightPath/FlightPath.tsx` - Added Resume button logic for scenic paused state
- `src/app/flight-map/page.tsx` - Updated props and resume handling integration

### Aug 16, 2025 - Fixed Scenic Modal Coordinate Access Error
**Issue**: Runtime error "Cannot read properties of undefined (reading '0')" when accessing scenic location coordinates
**Root Cause**: Code was accessing `locationToShow.coordinates[0]` but `ScenicLocationWithDetection` uses `lat`/`lon` properties
**Fix**: Updated `src/app/flight-map/page.tsx` to use `locationToShow.lon` and `locationToShow.lat` instead of coordinates array
**Files Changed**: 
# Development Journey: Scenic Sky Flight Visualization

## Project Overview
A modern Next.js application that visualizes Great-Circle flight paths between airports with a 3D sky dome showing real-time sun positioning based on aircraft location, date, and time.

---

## Recent Fixes (high level)

- Aug 16, 2025 — Fixed modal positioning and animation resume (ScenicModal centering and resume logic)
- Aug 16, 2025 — UX polish for ScenicModal and flight controls (Resume button moved to flight controls)
- Aug 16, 2025 — Fixed ScenicModal coordinate access bug (use lat/lon)

---

## Key Prompts & Feature Evolution (chronological)

1. Initial Project Setup — Next.js + TypeScript, MapLibre GL, Turf.js, Tailwind/shadcn UI, airplane animation
2. Route-based architecture — form redirects to `/flight-map` with URL params
3. UI refinement — floating control deck with current time and progress
4. International Date Line fix — path segmentation to avoid wraparound
5. 3D Sun Visualization — Three.js sky dome with sun positioning
6. Seatmap integration — iframe seatmaps with postMessage-based selection
7. Flight seat recommendation system — scenic + solar scoring by side

---

## Major Bugs & Fixes (concise)

- Compass orientation: fixed coordinate mapping and bearing adjustments for the 3D dome
- Sphere rotation: corrected rotation math to match map bearing changes
- Timezone handling: added timezone-aware datetime parsing for airports and UTC consistency for solar calcs
- Case-sensitive paths: fixed aircraft file name resolution (B-787-9.html) and correct `/aircraft/...` public path
- Solar time bug: disabled inappropriate solar-time adjustment for flight visualization — keep UTC
- International date line: omitted problematic path segments to prevent wraparound

---

## Technical Architecture (summary)

- Core components: SkyDomeVisualization, MapWithCenteredAircraft, FlightPath, HeroForm, SeatmapPage
- Key libs: Three.js/@react-three/fiber, SunCalc, MapLibre GL, Turf.js
- Coordinate systems: WGS84 (lat/lon), Web Mercator for tiles, 3D Cartesian for scene

---

## Seat Recommendation & Seatmap Integration

- Modular seat recommendation engine (`src/lib/seat-recommendation-engine.ts`) that computes scenic locations and solar events along great-circle paths and scores left vs right
- Hooks: `useSeatRecommendation`, `useAutoSeatRecommendation`
- UI components: `SeatComparisonDisplay`, `CompactSeatRecommendationDisplay`
- Iframe integration: postMessage for seat selection, utilities to scrape iframe seat elements and filter by features

---

## Quick Log — Prompts, Bugs, Solutions (appendix)

### Prompt: Replace ScenicModal with MapLibre Popup
- Bug: leftover `setCurrentScenicModal` after refactor
- Fix: replaced with `setCurrentScenicLocation`, added robust popup lifecycle handlers and exposed `showScenicPopup`/`closeScenicPopup`

### Prompt: GeoJSON & Hover Markers
- Bug: `text-field` requires glyphs in map style
- Fix: removed text labels, used custom `/map-marker.png` image via `map.loadImage(...).then(...)` fallback to circle markers

### Bug: loadImage Type/Response Fixes
- Symptom: Type mismatch for `addImage` and incorrect `loadImage` usage
- Fix: use `response.data` from Promise-based `map.loadImage` and fallback gracefully

### Prompt: Solar Time Adjustment Bug
- Symptom: Sun below horizon during daytime flights
- Root cause: double timezone/solar-time adjustment (longitude * 4 minutes) applied on frontend
- Fix: disable solar-time offset for flight visualization, use UTC-consistent solar calculations

### Prompt: Seat Scraper & Filtering
- Feature: Scrape iframe seat elements, detect best side using recommendation summary, collect seats (A for left, highest letter for right), parse `data-features`, exclude seats with any `"-"` value, map seat fields for display
- Utility files: `src/lib/iframe-seat-scraper.ts`, `src/hooks/useIframeSeatScraping.ts`, UI `IframeSeatDisplay.tsx`

---

## Files Changed (high level)

- `src/components/MapWithCenteredAircraft.tsx` — popup & GeoJSON refactor
- `src/app/flight-map/page.tsx` — popup integration, timezone fixes
- `src/components/SkyDomeVisualization.tsx` — solar-time adjustments
- `src/lib/*` — timezone, solar, scenic detection utilities
- `src/components/SeatRecommendation/*` — comparison and compact displays
- `src/lib/iframe-seat-scraper.ts`, `src/hooks/useIframeSeatScraping.ts`, `src/components/SeatRecommendation/IframeSeatDisplay.tsx` — new seat scraping integration

---

## Next Steps

1. Verify `/aircraft/*` images and HTML load correctly on Linux (case-sensitive)
2. Add seat ranking by positive features count and cap recommended seats (UI limit: 15)
3. Add telemetry for image loading & popup failures
4. Improve mobile touch interactions for scenic popups & hover fallbacks

---

## Short Log — Recent Prompts & Resolutions

- 2025-08-16: Fixed major solar/timezone issues and 3D sun visualization (see `SkyDomeVisualization.tsx`) — solution: use UTC and disable solar-time offsets
- 2025-08-16: Replaced ScenicModal with MapLibre popups; fixed leftover state bug
- 2025-08-16: Implemented iframe seat scraping and integrated with seat recommendation results
- 2025-08-16: Added quick stats and side-by-side comparisons for scenic/solar recommendations

### Aug 16, 2025 - Iframe Seat Scraper Integration
**Prompt**: Build a modular, reusable script that integrates into the existing seat recommendation system to scrape iframe seatmap content and recommend seats based on best view side.
**Implementation**: 
- Created `src/lib/iframe-seat-scraper.ts` with utilities for iframe access, seat collection, feature filtering, and data extraction
- Added `src/hooks/useIframeSeatScraping.ts` for React state management and integration
- Built `src/components/SeatRecommendation/IframeSeatDisplay.tsx` for displaying scraped seats
- Integrated with existing seat recommendation engine to determine best aircraft side
- Filters seats by positive features (excludes any seat with "-" value in features)
- Sorts by positive feature count and limits display to 15 seats maximum

### Aug 16, 2025 - Text Overflow Fix
**Prompt**: Make overflow text use ellipsis in SeatComparisonDisplay component
**Bug**: Long text in summary reasoning and solar event titles could overflow containers
**Solution**: Added `truncate` class to summary reason and solar event title elements for clean ellipsis display

### Aug 16, 2025 - Flight Controls UI Fixes
**Prompt 1**: Fix trackClassName error in FlightPath slider and add blue color theme
**Bug**: `trackClassName` and `rangeClassName` props don't exist on Slider component
**Solution**: Replaced with Tailwind CSS selectors targeting internal slider elements with blue theme colors

**Prompt 2**: Hide date/time data in flight map navbar on small screens
**Solution**: Added `hidden sm:flex` classes to flight schedule div to hide departure/arrival times on mobile while keeping airport codes visible

**Prompt 3**: Flight control deck not centered on small screens
**Bug**: Control deck positioning issues on mobile due to `mx-4` margin and centering conflicts
**Solution**: Changed `mx-4` to `px-4` on outer container and added `mx-auto` to inner container for proper centering

### Aug 16, 2025 - Journey Documentation Merge
**Prompt**: Combine journey-doc.md into journey.md and add prompts/bugs/solutions log
**Implementation**: Merged both documentation files into single source of truth, organized chronologically with technical details and solution summaries

---

*This file is the single source of truth for development prompts, bug reports, fixes, and architectural notes.*

  let relativeBearing = bearingToTarget - aircraftBearing;
  // Normalize to -180 to 180 range
  return relativeBearing > 0 ? 'right' : 'left';
}
```

**Solar Event Detection**:
```typescript
// Detect sunrise/sunset along flight path with 15-minute sampling
export function findSolarEventsAlongPath(
  flightPath: PathPoint[],
  startTime: Date,
  endTime: Date
): SolarEvent[] {
  // Sample every 15 minutes along route
  // Detect sun visibility changes and special lighting conditions
  // Account for cruising altitude horizon adjustments
}
```

**Output Format** (as requested):
```typescript
// Scenic views by side
{
  "right": ["Grand Canyon", "Las Vegas Strip", "Rocky Mountains"],
  "left": ["Manhattan Skyline", "Niagara Falls"]
}

// Solar events by side  
{
  "right": ["Sunrise at 06:30 EST", "Golden hour at 07:15 EST"],
  "left": ["Sunset at 18:45 GMT"]
}
```

**Test Results**:
✅ Basic calculations verified (JFK→LHR: 5540km, 51° bearing)
✅ Side determination logic working correctly
✅ Scenic location visibility detection functional
✅ Solar calculations with altitude adjustments
✅ Modular architecture with clean separation of concerns
✅ React integration with URL parameter support
✅ UI components rendering correctly
✅ Demo page functional at `/seat-recommendation`
✅ Flight map integration with sheet overlay

## Future Enhancements
- Real-time weather data integration
- Multiple aircraft support
- Historical flight playback
- Enhanced astronomical features (moon phases, star positions)
- Improved timezone handling with full DST support
- Additional aircraft seatmap templates
- Advanced seat recommendation algorithms with machine learning
- Seat selection preferences and filtering
- Integration with airline booking systems
- Weather-based visibility adjustments for scenic locations
- Historical scenic event ratings and user feedback
- Aircraft-specific seat map overlays for recommendations

## Validation Results
✅ Correct sun positioning for all test scenarios
✅ Proper timezone handling for international flights  
✅ Accurate compass orientation relative to map bearing
✅ Smooth 3D visualization performance
✅ Great-circle path calculations working correctly
✅ Seatmap integration with URL parameter preservation
✅ Responsive seatmap layout for desktop and mobile
✅ Interactive seat selection with real-time updates
✅ Aircraft HTML files loading correctly from public directory
✅ Seat recommendation system with scenic location detection
✅ Solar event calculations with side-specific recommendations
✅ Modular architecture with 40+ curated scenic locations
✅ UI integration with standalone demo and flight map overlay

## 2025-08-16 — Major Solar & 3D Sun Visualization Fixes, Prompt/Bug Summary

### Prompts Implemented
- Next.js + TypeScript flight path visualizer with 3D sun, seat recommendations, and accurate solar calculations
- Route refactor: `/flight-map` with URL params
- UI update: floating controls, % progress, current time
- International Date Line path fix
- Realistic 3D sun with Three.js, animated, with ray to aircraft

### Bugs Solved
- Fixed critical bug: solar time adjustment was incorrectly applied, causing sun to appear below horizon during daytime flights. Now all solar calculations use UTC interpolation for flight paths.
- Fixed timezone interpolation and DST handling for great-circle routes, including international date line.
- Fixed 3D sun positioning: adopted geographic convention (X=East, Y=Up, Z=South), so sun moves East→South→West as expected and matches real-world solar position.
- Fixed compass and sun path to rotate correctly with map bearing.
- Omitted path segments crossing ±180° longitude to prevent wraparound glitches.

### Uncommitted Changes (after last commit)
- Fixed coordinate system in `src/components/SkyDomeVisualization.tsx` for sun and compass.
- Added test scripts: `test-del-jfk-flight.js`, `test-del-jfk-analysis.js`, `test-del-jfk-recommendations.js`, `debug-sun-3d-positioning.js`, `debug-coordinate-conversion.js`, `test-fixed-coordinates.js` for solar/seat/3D verification.
- No changes in `src/lib/solar-calculations.ts` since last commit.

### Status
- All known bugs from prompts are fixed and verified.
- All fixes to 3D sun, solar calculations, and path logic are uncommitted.

# 2025-08-16 — Timezone & Airport Fixes, CPT/EZE, UI Verification

- Added Cape Town (CPT) and Buenos Aires (EZE) to demo airport list in `gis.ts`.
- Rewrote timezone parsing logic in `timezone-utils.ts` to use fixed UTC offsets for demo airports, ensuring robust and correct local time display for all routes (especially CPT→EZE).
- Verified correct local time formatting for CPT→EZE in both test scripts (`test-timezone-fix.js`) and browser UI (navbar now matches expected output: 6:30 PM GMT+2, 11:00 PM GMT-3).
- Updated 3D sun visualization and solar calculations to match real-world sun position.
- All changes logged and verified; code is modular, robust, and ready for further features.

# 2025-08-16 — Seatmap UI: Left/Right Scenery Comparison & Recommendation

- Created `CompactSeatRecommendationDisplay` component for clean sidebar integration in seatmap page.
- Modified `src/app/seatmap/page.tsx` to auto-generate recommendations from URL params using `useAutoSeatRecommendation` hook.
- Updated layout: iframe max width 300px (left), right sidebar hosts side-by-side scenery comparison and seat recommendation.
- Implemented quality-based sorting for scenic views and solar events (excellent > good > fair > poor) in `SeatComparisonDisplay`.
- Fixed TypeScript indexing errors by typing quality map as `Record<string, number>`.
- Deduplicated `SCENIC_LOCATIONS` dataset using runtime dedupe function to remove duplicates (e.g., "Lake Pukaki" appeared multiple times).
- **Added journey completion percentage to scenic locations**: Now shows "Journey Completed: X%" for scenic views, matching solar events format.
- Updated `getPrioritizedScenicViews` function to include `routeProgress` property in return type.
- Modified all seat recommendation UI components to display scenic location progress alongside distance and type.
- All UI components integrated and sorted lists display properly with quality-based ordering and progress percentages.

## 2025-08-16 — Scenic Location Progress Percentages Added

- Added "Journey Completed: X%" display for scenic locations across all seat recommendation UIs so scenic views match solar events' progress formatting.
- Files changed: `src/lib/seat-recommendation-engine.ts`, `src/components/SeatRecommendation/SeatComparisonDisplay.tsx`, `src/components/SeatRecommendation/CompactSeatRecommendationDisplay.tsx`, `src/components/SeatRecommendation/SeatRecommendationDisplay.tsx`.
- Also updated `journey.md` to document the change and verified TypeScript checks for modified files (no errors).

## 2025-08-16 — Enhanced Flight Map with Scenic Location Markers & Animated Modals

**Major Feature Implementation**: Added interactive scenic location markers and animated modals to the flight map page using MapLibre GL (adapted from original Leaflet request).

**New Components**:
- `ScenicModal.tsx`: Animated modal component using Framer Motion with ShadCN UI styling, displays scenic location info with image, description, likes count, and type badge.
- `scenic-detection.ts`: Utility library for detecting scenic locations near flight paths with configurable detection radii (mountains/volcanoes: 100km, others: 50km).

**Enhanced Features**:
- **Scenic Markers**: Red pin markers automatically placed on map for scenic locations within detection range of flight path.
- **Smart Animation Pausing**: Plane animation automatically pauses for 3 seconds when reaching scenic locations, with smooth resume.
- **Progressive Triggering**: Each scenic location triggers only once during flight, with visited state tracking.
- **Hover Effects**: Scenic markers scale on hover with informational popups showing distance from route.
- **Modal Animations**: Smooth fade-in/slide-up animations using Framer Motion with backdrop blur effects.

**Technical Implementation**:
- Pre-computes scenic locations within detection range during flight path generation.
- Monitors flight progress for automatic triggering based on route position (0.5% trigger range).
- Integrates with existing MapLibre GL infrastructure and flight animation system.
- Performance optimized with efficient distance calculations and visited location tracking.

**Files Modified**:
- `src/app/flight-map/page.tsx`: Added scenic state management, progress monitoring, and modal triggering logic.
- `src/components/MapWithCenteredAircraft.tsx`: Enhanced to accept and render scenic location markers with popups.
- Added Framer Motion dependency for smooth animations.

**UI/UX Enhancements**:
- Clean, modern modal design with placeholder images and proper information hierarchy.
- Responsive positioning with automatic centering and backdrop blur.
- Manual close option for user control while maintaining 3-second auto-close.
- Visual feedback with marker scaling and smooth transitions.

**Testing Results**:
✅ Scenic locations correctly detected and marked along flight paths
✅ Animation pausing/resuming works smoothly 
✅ Modal animations and styling render properly
✅ TypeScript compilation passes with no errors
✅ Development server starts successfully
✅ Performance remains smooth with scenic marker rendering

### Aug 16, 2025 - Refactor: Replace ScenicModal with maplibregl.Popup
**Summary**
- Replaced the client-side `ScenicModal` component with `maplibregl.Popup` anchored to scenic markers so the popup content is rendered inside the map and attached to coordinates.

**Bug & fix**
- Bug: During the refactor a leftover call to `setCurrentScenicModal(null)` caused a runtime error since the state was renamed to `currentScenicLocation`.
- Fix: Replaced all references to `setCurrentScenicModal` with `setCurrentScenicLocation` in `src/app/flight-map/page.tsx` and added robust popup lifecycle handlers in `src/components/MapWithCenteredAircraft.tsx`.

**Implementation notes**
- Popups are created with `new maplibregl.Popup()` and `.setHTML()` using a compact shadcn-style card markup.
- Only one popup is allowed at a time: the code tracks `currentPopup` and removes it before opening a new one.
- Exposed `showScenicPopup` and `closeScenicPopup` helpers on the map instance so page-level code can pause/resume animation and close popups on reset.
- On reset, the flight page calls `map.closeScenicPopup()` to ensure no popups remain open and clears visited scenic state.

**Files touched**
- `src/components/MapWithCenteredAircraft.tsx` — popup creation, cleanup, and helper exposure.
- `src/app/flight-map/page.tsx` — state rename, popup wiring, pause/resume/reset integration.
- `src/app/globals.css` — added `.scenic-popup` styling for map popup content.

**Verification**
- Dev server compiles and `/flight-map` loads. Quick runtime patch applied to replace leftover `setCurrentScenicModal` usage.

### Aug 16, 2025 - GeoJSON Refactor: Custom Markers with Hover Functionality
**Summary**
- Replaced HTML div markers with GeoJSON-based MapLibre symbol layer for better performance and native map integration.
- Added hover functionality that works alongside existing click-to-pause behavior.

**Technical Implementation**
- Created GeoJSON source with scenic location features in `MapWithCenteredAircraft.tsx`
- Implemented symbol layer with custom `map-marker.png` image for consistent marker appearance
- Added hover event listeners (`mouseenter`/`mouseleave`) for scenic location layer
- Hover popup shows brief location name and type, distinct from detailed click popup

**Bug Fixes**
1. **MapLibre text-field glyphs error**: Initially tried to add text labels but MapLibre requires glyph fonts for text rendering. Removed text layer to avoid this requirement.
2. **Custom marker image loading**: Implemented proper Promise-based image loading with fallback to default circle marker if custom image fails.
3. **TypeScript compatibility**: Fixed type errors by properly typing GeoJSON feature properties and MapLibre event handlers.

**Key Code Changes**
```typescript
// GeoJSON source creation
const geojsonSource: GeoJSONSource = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: scenicLocations.map(location => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [location.lon, location.lat]
      },
      properties: {
        name: location.name,
        type: location.type,
        // ... other properties
      }
    }))
  }
};

// Hover event handling
map.on('mouseenter', 'scenic-locations', (e) => {
  // Show hover popup
});
map.on('mouseleave', 'scenic-locations', () => {
  // Hide hover popup
});
```

**Performance Benefits**
- Native MapLibre rendering instead of DOM manipulation
- Better integration with map layers and zoom levels
- Consistent behavior with map interactions

**Files Modified**
- `src/components/MapWithCenteredAircraft.tsx` - Complete GeoJSON refactor
- `public/map-marker.png` - Added custom marker image asset

### Aug 16, 2025 - Journey Documentation & Scenic Locations Integration
**Summary**
- Created comprehensive `journey.md` documenting all prompts, bugs, solutions, and technical decisions from project inception
- Replaced seat recommendation UI with scenic locations discovery feature ordered by flight journey progress

**Journey Documentation Features**
- Chronological prompt history with implementation details
- Complete bug catalog with root cause analysis and technical solutions
- Code examples for major fixes (coordinate systems, timezone handling, solar calculations)
- Performance optimization strategies and lessons learned
- Architecture overview with component relationships and coordinate system mappings

**Scenic Locations Integration**
- Modified flight-map page to display scenic locations sheet instead of seat recommendations
- Locations sorted by `detectionProgress` (journey percentage when discovered)
- Card-based UI showing location name, type, distance from route, and journey completion percentage
- Smooth sheet animation and responsive design for mobile/desktop

**Technical Changes**
```typescript
// Journey-ordered scenic locations display
const sortedScenicLocations = useMemo(() => {
  return detectedScenicLocations
    .filter(loc => loc.detectionProgress !== undefined)
    .sort((a, b) => (a.detectionProgress || 0) - (b.detectionProgress || 0));
}, [detectedScenicLocations]);

// Card-based scenic location display
{sortedScenicLocations.map((location, index) => (
  <Card key={index} className="p-4 border-l-4 border-l-blue-500">
    <h3 className="font-semibold text-lg">{location.name}</h3>
    <p className="text-sm text-muted-foreground">{location.type}</p>
    <p className="text-xs mt-2">
      Journey: {Math.round(location.detectionProgress || 0)}% • 
      Distance: {location.distance}km from route
    </p>
  </Card>
))}
```

**Files Modified**
- `journey.md` - Created comprehensive documentation (40+ entries)
- `src/app/flight-map/page.tsx` - Scenic locations sheet integration
- Removed flight details section as requested in original prompts

### Aug 16, 2025 - UI Polish: Sheet Background & Popup Z-Index Fixes
**Summary**
- Fixed sheet background transparency issue causing poor readability
- Resolved popup z-index conflicts with 3D sun sphere visualization

**Issues Identified**
1. **Sheet Background**: Scenic locations sheet had transparent background making text hard to read over map
2. **Popup Z-Index**: Scenic location popups were appearing behind the 3D sun sphere, making them inaccessible during flight

**Solutions Implemented**
1. **Sheet Background Fix**:
```typescript
// Added explicit white background to SheetContent
<SheetContent className="bg-white w-full sm:w-[400px] sm:max-w-[400px]">
```

2. **Popup Z-Index Fix**:
```css
/* CSS approach in globals.css */
.scenic-popup {
  z-index: 9999 !important;
}
.scenic-hover-popup {
  z-index: 9998 !important;
}
```

```typescript
// Programmatic approach in MapWithCenteredAircraft.tsx
const popupElement = popup.getElement();
if (popupElement) {
  popupElement.style.zIndex = '9999';
}

const hoverElement = hoverPopup.current.getElement();
if (hoverElement) {
  hoverElement.style.zIndex = '9998';
}
```

**Technical Approach**
- Used both CSS `!important` declarations and programmatic style manipulation for redundant coverage
- Main scenic popup gets highest z-index (9999), hover popup slightly lower (9998)
- Ensures popups always appear above 3D sun sphere and other map elements

**Files Modified**
- `src/app/flight-map/page.tsx` - Added `bg-white` class to SheetContent
- `src/app/globals.css` - Added high z-index rules for popup elements
- `src/components/MapWithCenteredAircraft.tsx` - Added programmatic z-index setting

**Verification**
✅ Sheet background now white and readable over map content
✅ Scenic popups appear above sun sphere during flight animation
✅ Hover popups maintain proper layering hierarchy
✅ No visual conflicts between UI elements during flight visualization

### Aug 16, 2025 - SeatmapPage Responsive Grid Layout Refactor
**Summary**
- Refactored SeatmapPage component from flex-based layout to responsive CSS grid system
- Implemented future-ready structure for QuickStatsFooter integration
- Enhanced responsive behavior and eliminated layout overflow issues

**Technical Implementation**
- **Main Structure**: Changed from single flex container to `flex flex-col` with `flex-1 min-h-0` main content area
- **Grid System**: Implemented `grid-cols-1 lg:grid-cols-[1fr_auto_2fr]` for responsive three-column desktop layout
- **Section Architecture**: Each section now uses consistent `flex flex-col` with fixed header and scrollable content

**Layout Improvements**
1. **Responsive Grid Columns**:
   - Mobile: Single column stack with natural height flow
   - Desktop: Three-column layout (Seat Details | Seatmap | Recommendations)
   - Column proportions: 1fr (flexible) | auto (400px fixed) | 2fr (larger flexible)

2. **Individual Section Structure**:
```tsx
<section className="flex flex-col overflow-hidden">
  <div className="flex-shrink-0 p-4 border-b bg-gray-50">
    {/* Fixed section header */}
  </div>
  <div className="flex-1 overflow-y-auto p-4">
    {/* Scrollable content area */}
  </div>
</section>
```

3. **Height Management**:
   - Removed hardcoded `h-[calc(100vh-89px)]` constraints
   - Used `flex-1 min-h-0` for proper content distribution
   - Each section scrolls independently without double scrollbars

**Future-Ready Features**
- **QuickStatsFooter Preparation**: Layout structure ready for footer integration
- **Calculation Ready**: When footer added, will use `min-h-[calc(100vh-headerHeight-footerHeight)]`
- **No Overlap Prevention**: Flex structure ensures content doesn't conflict with future footer

**Visual Enhancements**
- **Section Headers**: Added distinct header bars with titles, icons, and background colors
- **Better Contrast**: Gray backgrounds for seatmap section and section headers
- **Semantic Structure**: Proper `<header>`, `<main>`, `<section>` HTML5 elements
- **Loading States**: Improved iframe loading overlay with proper z-index stacking

**Responsive Behavior**
- **Mobile Optimization**: Sections stack vertically, each takes natural content height
- **Desktop Layout**: Sections share available height equally within grid constraints
- **Independent Scrolling**: Each section maintains its own scroll state
- **Clean Borders**: Visual separation between sections with consistent spacing

**Technical Benefits**
- **Performance**: Removed unnecessary `hidden` class toggling on iframe
- **Maintainability**: Cleaner component structure with reduced nesting
- **Accessibility**: Proper semantic HTML structure and ARIA considerations
- **Scalability**: Easy to add/modify sections without layout breaking

**Files Modified**
- `src/app/seatmap/page.tsx` - Complete layout architecture refactor

**Verification Results**
✅ Responsive layout works smoothly from mobile to desktop
✅ Each section scrolls independently without layout conflicts
✅ Iframe loads properly with improved loading state display
✅ Grid proportions maintain proper spacing across screen sizes
✅ Future footer integration won't cause overlap issues
✅ TypeScript compilation passes without errors
✅ Clean semantic HTML structure for better accessibility



````
