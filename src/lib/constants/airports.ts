import { Airport } from "../types";


/**
 * Demo airport data with exact coordinates as specified
 */
export const AIRPORTS: Airport[] = [
  { code: 'JFK', name: 'New York John F. Kennedy', lat: 40.6413, lon: -73.7781, timezone: 'America/New_York' },
  { code: 'LAX', name: 'Los Angeles Intl', lat: 33.9416, lon: -118.4085, timezone: 'America/Los_Angeles' },
  { code: 'LHR', name: 'London Heathrow', lat: 51.47, lon: -0.4543, timezone: 'Europe/London' },
  { code: 'DEL', name: 'Indira Gandhi Intl, Delhi', lat: 28.5562, lon: 77.1, timezone: 'Asia/Kolkata' },
  { code: 'DXB', name: 'Dubai Intl', lat: 25.2532, lon: 55.3657, timezone: 'Asia/Dubai' },
  { code: 'CPT', name: 'Cape Town International', lat: -33.9706, lon: 18.6021, timezone: 'Africa/Johannesburg' },
  { code: 'EZE', name: 'Buenos Aires Ministro Pistarini', lat: -34.8222, lon: -58.5358, timezone: 'America/Argentina/Buenos_Aires' },
];