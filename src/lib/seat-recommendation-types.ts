// Type definitions for seat recommendation system

export interface ScenicLocation {
  name: string;
  lat: number;
  lon: number;
  type: 'mountain' | 'volcano' | 'ocean' | 'city' | 'landmark' | 'natural' | 'cultural';
  sampleImage?: string;
  likes: number;
  description?: string;
}

export interface SideView {
  right: string[];
  left: string[];
}

export interface ViewableLocation extends ScenicLocation {
  distanceFromRoute: number; // Distance in km from flight path
  side: 'right' | 'left'; // Which side of aircraft it appears on
  routeProgress: number; // 0-1 position along route where it's closest
  visibility?: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface SolarEvent {
  type: 'sunrise' | 'sunset' | 'golden-hour' | 'blue-hour';
  time: Date;
  progress: number; // 0-1 position along route
  side: 'right' | 'left';
  elevation: number; // Sun elevation at time of event
  visibility: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface SeatRecommendationInput {
  airplaneModel: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  departureAirportCode: string;
  arrivalAirportCode: string;
}

export interface SeatRecommendationResult {
  scenicViews: SideView;
  solarEvents: SideView;
  detailedScenicLocations: ViewableLocation[];
  detailedSolarEvents: SolarEvent[];
  routeDistance: number;
  flightDuration: number; // in hours
}
