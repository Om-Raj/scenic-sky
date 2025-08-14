// Type definitions for flight planning and visualization

export interface Airport {
  code: string;
  name: string;
  lat: number;
  lon: number;
}

export interface PathPoint {
  lat: number;
  lon: number;
  bearing?: number; // Direction the airplane should face at this point
}

export interface FlightState {
  departure: Airport;
  arrival: Airport;
  path: PathPoint[];
  currentPosition: number; // 0-1 progress along path
  isPlaying: boolean;
  totalDistance: number; // in kilometers
}

export interface FlightFormData {
  airplaneModel: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  departure: string; // airport code
  arrival: string; // airport code
}

// Animation state for smooth flight visualization
export interface AnimationState {
  startTime: number;
  duration: number; // milliseconds for full flight
  currentTime: number;
}
