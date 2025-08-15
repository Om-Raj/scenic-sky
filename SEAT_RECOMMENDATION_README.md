# Flight Seat Recommendation System

A modular, reusable seat recommendation feature that analyzes flight paths to provide personalized seating suggestions based on scenic views and solar events.

## Features

### 🏔️ Scenic Location Detection
- Analyzes great circle flight paths for scenic locations within viewing distance
- **Mountains & Volcanoes**: 100km visibility radius
- **Cities, Oceans & Landmarks**: 50km visibility radius  
- Determines left/right aircraft side visibility using geographic bearings
- Ranks locations by distance, popularity, and visibility quality

### 🌅 Solar Event Calculation
- Precise astronomical calculations using `suncalc` library
- Accounts for cruising altitude (36,000 feet) horizon adjustments
- Detects sunrise, sunset, golden hour, and blue hour events
- Calculates sun position relative to aircraft heading
- Determines optimal viewing side for solar events

### 🎯 Intelligent Scoring
- Combines scenic location quality with solar event timing
- Considers location popularity (likes) and visibility distance
- Provides clear left/right side recommendations with reasoning

## Architecture

### Core Components

```
src/lib/
├── seat-recommendation-types.ts     # TypeScript interfaces
├── scenic-locations-data.ts         # Curated worldwide scenic locations
├── scenic-location-calculations.ts  # Geospatial visibility calculations  
├── solar-event-calculations.ts      # Astronomical solar position math
└── seat-recommendation-engine.ts    # Main orchestration engine

src/hooks/
└── useSeatRecommendation.ts         # React hook for state management

src/components/SeatRecommendation/
├── SeatRecommendationDisplay.tsx    # UI component for results
└── index.ts                         # Barrel export
```

### Data Flow

1. **Input Parsing**: Flight details (airports, dates, times) → validated parameters
2. **Path Generation**: Great circle route with ~200 sample points for accuracy
3. **Scenic Analysis**: Check 40+ worldwide locations for visibility along route
4. **Solar Analysis**: Calculate sun position at 10-minute intervals during flight
5. **Side Determination**: Use geographic bearings to assign left/right visibility
6. **Scoring & Ranking**: Combine distance, popularity, and visibility quality
7. **Recommendation**: Generate final left/right side suggestion with reasoning

## Usage Examples

### Basic Usage

```tsx
import { useSeatRecommendation } from '@/hooks/useSeatRecommendation';
import { SeatRecommendationDisplay } from '@/components/SeatRecommendation';

function FlightPlanner() {
  const { result, loading, generateRecommendation } = useSeatRecommendation();
  
  const handleSubmit = async () => {
    await generateRecommendation({
      airplaneModel: 'Boeing 787',
      departureDate: '2024-12-15',
      departureTime: '22:00',
      arrivalDate: '2024-12-16', 
      arrivalTime: '10:00',
      departureAirportCode: 'JFK',
      arrivalAirportCode: 'LHR',
    });
  };

  return (
    <div>
      {loading && <p>Analyzing route...</p>}
      {result && <SeatRecommendationDisplay result={result} />}
    </div>
  );
}
```

### URL Parameter Integration

```tsx
import { useAutoSeatRecommendation } from '@/hooks/useSeatRecommendation';

function FlightMapPage() {
  const searchParams = useSearchParams();
  const { result, loading } = useAutoSeatRecommendation(searchParams);
  
  // Automatically generates recommendations from URL parameters
  return (
    <div>
      {result && <SeatRecommendationDisplay result={result} />}
    </div>
  );
}
```

### Direct API Usage

```tsx
import { generateSeatRecommendation } from '@/lib/seat-recommendation-engine';

const result = await generateSeatRecommendation({
  airplaneModel: 'Airbus A350',
  departureDate: '2024-12-15',
  departureTime: '14:00', 
  arrivalDate: '2024-12-16',
  arrivalTime: '20:30',
  departureAirportCode: 'LAX',
  arrivalAirportCode: 'DEL',
});

// Result contains:
// - scenicViews: { left: string[], right: string[] }
// - solarEvents: { left: string[], right: string[] }  
// - detailedScenicLocations: ViewableLocation[]
// - detailedSolarEvents: SolarEvent[]
// - routeDistance: number
// - flightDuration: number
```

## API Reference

### Main Function

```typescript
generateSeatRecommendation(input: SeatRecommendationInput): Promise<SeatRecommendationResult>
```

**Input Parameters:**
- `airplaneModel`: Aircraft type (for future seat map integration)
- `departureDate`/`departureTime`: Local departure date/time
- `arrivalDate`/`arrivalTime`: Local arrival date/time  
- `departureAirportCode`: IATA airport code (JFK, LAX, LHR, DEL, DXB)
- `arrivalAirportCode`: IATA airport code

**Output:**
```typescript
interface SeatRecommendationResult {
  scenicViews: { left: string[], right: string[] };     // Simple view names by side
  solarEvents: { left: string[], right: string[] };     // Solar event descriptions
  detailedScenicLocations: ViewableLocation[];           // Full location data
  detailedSolarEvents: SolarEvent[];                     // Full solar event data  
  routeDistance: number;                                 // Distance in km
  flightDuration: number;                                // Duration in hours
}
```

### Utility Functions

```typescript
// Get prioritized scenic views for a specific side
getPrioritizedScenicViews(result: SeatRecommendationResult, side: 'left' | 'right')

// Get formatted solar events with timing
getFormattedSolarEvents(result: SeatRecommendationResult, side: 'left' | 'right')

// Generate recommendation summary with reasoning
generateRecommendationSummary(result: SeatRecommendationResult)
```

## Scenic Locations Dataset

The system includes 40+ curated worldwide scenic locations:

### Mountains & Volcanoes (100km visibility)
- Mount Everest, Mount Fuji, Matterhorn, Mount Kilimanjaro
- Alps, Rockies, Andes mountain ranges
- Active volcanoes: Vesuvius, Mount Rainier

### Natural Landmarks (50km visibility)  
- Grand Canyon, Niagara Falls, Victoria Falls
- Yellowstone, Amazon Rainforest, Sahara Desert
- Uluru, Angel Falls, Aurora viewing zones

### Ocean & Coastal Features (50km visibility)
- Great Barrier Reef, Maldives Atolls
- Norwegian Fjords, Bora Bora Lagoon
- Ha Long Bay limestone karsts

### Cities & Cultural Sites (50km visibility)
- Manhattan, Dubai, Hong Kong skylines
- Pyramids of Giza, Taj Mahal, Machu Picchu
- Angkor Wat, Petra, Great Wall of China

Each location includes:
- Precise GPS coordinates
- Popularity rating (likes)
- Type classification
- Descriptive text

## Solar Calculations

### Astronomical Accuracy
- Uses `suncalc` library for precise solar positions
- Accounts for aircraft altitude (11,000m typical cruising)
- Calculates geometric horizon depression at altitude
- Determines visibility windows for solar events

### Event Types
- **Sunrise/Sunset**: Sun crosses horizon
- **Golden Hour**: Sun elevation 0-6° (warm lighting)
- **Blue Hour**: Sun elevation -6-0° (twilight colors)
- **Daylight**: Sun > 6° elevation

### Visibility Ratings
- **Excellent**: Clear view, optimal elevation
- **Good**: Good view, moderate elevation  
- **Fair**: Partial view, low elevation
- **Poor**: Limited/no visibility

## Performance Considerations

### Optimizations
- Efficient great circle sampling (200 points for accuracy)
- Pre-filtered scenic location dataset
- Vectorized distance calculations using Turf.js
- Minimal React re-renders with proper memoization

### Scalability
- Modular architecture supports additional data sources
- Configurable visibility thresholds per location type
- Extensible for real-time weather integration
- Ready for flight-specific seat map overlays

## Integration Points

### Existing Project Integration
The system integrates seamlessly with the existing flight path visualization:

1. **Flight Map Page**: Add seat recommendation sheet overlay
2. **URL Parameters**: Automatic generation from flight form data  
3. **Shared Calculations**: Reuses existing airport data and path generation
4. **Consistent Styling**: Uses established shadcn/ui component library

### Future Enhancements
- Real-time weather data for visibility adjustments
- Aircraft-specific seat map overlays
- Historical scenic event ratings
- User preference learning
- Integration with airline seat selection APIs

## Demo Routes

Try these example routes to see the system in action:

### Transatlantic Night Flight
- **Route**: JFK → LHR  
- **Time**: 22:00 → 10:00+1
- **Highlights**: Atlantic crossing, European approach, sunrise over UK

### Transpacific Day Flight  
- **Route**: LAX → DEL
- **Time**: 14:00 → 20:30+1
- **Highlights**: Pacific Ocean, mountain ranges, diverse landscapes

### Middle East Corridor
- **Route**: JFK → DXB
- **Time**: 23:30 → 18:00+1  
- **Highlights**: Polar route, European Alps, Middle Eastern approach

Access the demo at `/seat-recommendation` to experiment with different routes and timing.
