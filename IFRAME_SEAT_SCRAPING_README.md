# Iframe Seat Scraping System

## Overview

The iframe seat scraping system is a modular, reusable solution that integrates with the existing seat recommendation engine to provide intelligent seat selection based on both scenic route analysis and actual aircraft seatmap data.

## Architecture

### Core Components

1. **`iframe-seat-scraper.ts`** - Core utilities for iframe access and seat processing
2. **`useIframeSeatScraping.ts`** - React hooks for state management and integration
3. **`IframeSeatDisplay.tsx`** - Display components for scraped seat data
4. **Seatmap Page Integration** - Updated seatmap page with full integration

### Data Flow

```
Seatmap Iframe → Seat Scraping → Feature Filtering → Seat Recommendation → Display
```

## Core Functionality

### 1. Iframe Access
```typescript
getIframeDocument(iframeElement: HTMLIFrameElement): Document | null
```
- Safely accesses iframe content
- Handles cross-origin restrictions gracefully
- Returns null if iframe is not accessible

### 2. Best Side Determination
```typescript
getBestViewSide(seatRecommendationResult: SeatRecommendationResult | null): 'left' | 'right'
```
- Reuses existing seat recommendation logic
- Analyzes scenic views and solar events
- Returns optimal aircraft side ('left' or 'right')

### 3. Seat Collection
```typescript
collectSeats(iframeDoc: Document, side: 'left' | 'right'): Element[]
```
- Collects seats from specified aircraft side
- **Left side**: All seats ending with "A"
- **Right side**: All seats ending with rightmost available letter (e.g., "H")
- Automatically detects available seat letters

### 4. Feature Validation
```typescript
filterSeats(seats: Element[]): Element[]
```
- Parses `data-features` JSON array
- **Excludes seats** where any feature has value: `"-"`
- Keeps only seats with positive (`"+"`) or neutral values
- Handles HTML entity decoding

### 5. Data Extraction
```typescript
mapSeatData(seats: Element[]): ScrapedSeatData[]
```
Extracts for each valid seat:
- `data-number` (seat number)
- `data-class` (cabin class)
- `data-label` (cabin label)
- `data-row-number`
- `data-features` (parsed JSON)
- `data-seat-uid`

## Usage Examples

### Basic Integration

```typescript
import { useIframeSeatScraping } from '@/hooks/useIframeSeatScraping';
import { useAutoSeatRecommendation } from '@/hooks/useSeatRecommendation';

function SeatmapPage() {
  const seatRecommendation = useAutoSeatRecommendation(searchParams);
  const iframeSeatScraping = useIframeSeatScraping(
    seatRecommendation.result,
    false // manual scraping
  );
  
  const handleIframeLoad = () => {
    if (iframeRef.current && seatRecommendation.result) {
      iframeSeatScraping.scrapeSeats(iframeRef.current);
    }
  };
  
  return (
    <iframe
      ref={iframeRef}
      src="/aircraft/seatmap.html"
      onLoad={handleIframeLoad}
    />
  );
}
```

### Display Components

```typescript
import { IframeSeatDisplay, CompactIframeSeatDisplay } from '@/components/SeatRecommendation';

// Full display with seat selection
<IframeSeatDisplay
  scrapedSeats={iframeSeatScraping.scrapedSeats}
  loading={iframeSeatScraping.loading}
  error={iframeSeatScraping.error}
  onSeatSelect={(seat) => console.log('Selected:', seat)}
  onRefresh={() => iframeSeatScraping.refetchSeats()}
/>

// Compact display for smaller areas
<CompactIframeSeatDisplay
  scrapedSeats={iframeSeatScraping.scrapedSeats}
  loading={iframeSeatScraping.loading}
  error={iframeSeatScraping.error}
/>
```

## HTML Seat Element Format

The system expects seat elements in this format:

```html
<div 
  class="seat-element"
  data-number="9H"
  data-class="P"
  data-label="Premium Economy"
  data-features='[{"name":"extraLegroom","value":"+"}, {"name":"noFloorStorage","value":"-"}]'
  data-row-number="9"
  data-seat-uid="9H-45e339c7b70e3"
  data-specs="{}"
>
</div>
```

### Feature Format
```json
[
  {"name": "extraLegroom", "value": "+"},
  {"name": "windowView", "value": "+"},
  {"name": "nearLavatory", "value": "-"},
  {"name": "limitedRecline", "value": "-"}
]
```

## Integration Guide

### Step 1: Import Required Hooks
```typescript
import { useIframeSeatScraping, useIframeLoadState } from '@/hooks/useIframeSeatScraping';
import { useAutoSeatRecommendation } from '@/hooks/useSeatRecommendation';
```

### Step 2: Set Up State Management
```typescript
const seatRecommendation = useAutoSeatRecommendation(searchParams);
const iframeSeatScraping = useIframeSeatScraping(seatRecommendation.result);
const iframeLoadState = useIframeLoadState(iframeRef.current);
```

### Step 3: Handle Iframe Loading
```typescript
const handleIframeLoad = () => {
  if (iframeRef.current && seatRecommendation.result && iframeLoadState.isReady) {
    iframeSeatScraping.scrapeSeats(iframeRef.current);
  }
};
```

### Step 4: Display Results
```typescript
<IframeSeatDisplay
  scrapedSeats={iframeSeatScraping.scrapedSeats}
  loading={iframeSeatScraping.loading}
  error={iframeSeatScraping.error}
  onRefresh={() => iframeSeatScraping.refetchSeats()}
/>
```

## Error Handling

The system includes comprehensive error handling:

- **Iframe Access Errors**: Cross-origin restrictions, missing iframe
- **Parsing Errors**: Invalid JSON in seat features
- **Loading States**: Iframe not ready, seatmap not loaded
- **Validation Errors**: No valid seats found, missing required data

### Common Error Scenarios

1. **"Cannot access iframe document"**
   - Iframe not loaded or cross-origin restriction
   - Solution: Ensure iframe is from same domain

2. **"No seats found on the recommended side"**
   - Seatmap not fully loaded or different HTML structure
   - Solution: Check seat element selectors and data attributes

3. **"All seats filtered out"**
   - All seats have negative features
   - Solution: Review feature filtering logic or seat data

## Testing

Run the test script to verify functionality:

```bash
node test-iframe-scraper.js
```

The test simulates:
- Side determination from seat recommendations
- Seat collection by aircraft side
- Feature-based filtering
- Data mapping and extraction

## Performance Considerations

- **Lazy Loading**: Only scrape when iframe is fully loaded
- **Debouncing**: Avoid excessive scraping on rapid updates
- **Memory Management**: Clean up event listeners and references
- **Error Recovery**: Graceful fallbacks when scraping fails

## Future Enhancements

1. **Cabin Class Filtering**: Prefer premium seats when available
2. **Seat Scoring**: Rank seats by multiple criteria
3. **Real-time Updates**: Watch for seatmap changes
4. **Accessibility Features**: Screen reader support for seat data
5. **Mobile Optimization**: Touch-friendly seat selection

## Troubleshooting

### Debug Mode
Enable console logging to debug scraping issues:

```javascript
// In browser console
localStorage.setItem('debug-seat-scraping', 'true');
```

### Common Solutions

- **Iframe not loading**: Check src URL and network requests
- **No seats found**: Verify HTML structure matches expected format
- **Features not parsing**: Check for HTML entity encoding issues
- **Cross-origin errors**: Ensure iframe content is from same domain

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

**Note**: Requires same-origin iframe content for full functionality.
