// Predefined dataset of scenic locations worldwide
import type { ScenicLocation } from './seat-recommendation-types';

/**
 * Curated dataset of scenic locations for flight path analysis
 * Each location includes coordinates, type, and popularity metrics
 */
export const SCENIC_LOCATIONS: ScenicLocation[] = [
  // Mountains & Volcanoes
  {
    name: 'Mount Everest',
    lat: 27.9881,
    lon: 86.9250,
    type: 'mountain',
    likes: 50000,
    description: 'World\'s highest peak in the Himalayas'
  },
  {
    name: 'Mount Fuji',
    lat: 35.3606,
    lon: 138.7274,
    type: 'volcano',
    likes: 45000,
    description: 'Iconic volcanic mountain in Japan'
  },
  {
    name: 'Matterhorn',
    lat: 45.9763,
    lon: 7.6586,
    type: 'mountain',
    likes: 35000,
    description: 'Pyramidal peak in the Swiss Alps'
  },
  {
    name: 'Mount Kilimanjaro',
    lat: -3.0674,
    lon: 37.3556,
    type: 'volcano',
    likes: 40000,
    description: 'Africa\'s highest peak with snow-capped summit'
  },
  {
    name: 'Mount McKinley (Denali)',
    lat: 63.0692,
    lon: -151.0070,
    type: 'mountain',
    likes: 25000,
    description: 'North America\'s highest peak in Alaska'
  },
  {
    name: 'Mount Vesuvius',
    lat: 40.8218,
    lon: 14.4289,
    type: 'volcano',
    likes: 30000,
    description: 'Famous volcano overlooking Naples Bay'
  },
  {
    name: 'Mount Rainier',
    lat: 46.8523,
    lon: -121.7603,
    type: 'volcano',
    likes: 28000,
    description: 'Iconic stratovolcano in Washington State'
  },
  {
    name: 'Alps Mountain Range',
    lat: 46.5197,
    lon: 8.0512,
    type: 'mountain',
    likes: 42000,
    description: 'Majestic European mountain range'
  },
  {
    name: 'Rocky Mountains',
    lat: 39.7392,
    lon: -104.9903,
    type: 'mountain',
    likes: 38000,
    description: 'Spectacular North American mountain range'
  },
  {
    name: 'Andes Mountains',
    lat: -13.1631,
    lon: -72.5450,
    type: 'mountain',
    likes: 36000,
    description: 'World\'s longest continental mountain range'
  },

  // Natural Landmarks
  {
    name: 'Grand Canyon',
    lat: 36.1069,
    lon: -112.1129,
    type: 'natural',
    likes: 55000,
    description: 'Massive canyon carved by the Colorado River'
  },
  {
    name: 'Niagara Falls',
    lat: 43.0962,
    lon: -79.0377,
    type: 'natural',
    likes: 48000,
    description: 'Powerful waterfalls on US-Canada border'
  },
  {
    name: 'Victoria Falls',
    lat: -17.9243,
    lon: 25.8572,
    type: 'natural',
    likes: 35000,
    description: 'Spectacular waterfall on Zambezi River'
  },
  {
    name: 'Uluru (Ayers Rock)',
    lat: -25.3444,
    lon: 131.0369,
    type: 'natural',
    likes: 32000,
    description: 'Sacred monolith in Australian Outback'
  },
  {
    name: 'Yellowstone National Park',
    lat: 44.4280,
    lon: -110.5885,
    type: 'natural',
    likes: 40000,
    description: 'Geothermal wonderland with geysers'
  },
  {
    name: 'Angel Falls',
    lat: 5.9678,
    lon: -62.5369,
    type: 'natural',
    likes: 25000,
    description: 'World\'s highest uninterrupted waterfall'
  },
  {
    name: 'Amazon Rainforest',
    lat: -3.4653,
    lon: -62.2159,
    type: 'natural',
    likes: 45000,
    description: 'World\'s largest tropical rainforest'
  },
  {
    name: 'Sahara Desert',
    lat: 23.4162,
    lon: 25.6628,
    type: 'natural',
    likes: 38000,
    description: 'World\'s largest hot desert'
  },

  // Ocean & Coastal Features
  {
    name: 'Great Barrier Reef',
    lat: -18.2871,
    lon: 147.6992,
    type: 'ocean',
    likes: 50000,
    description: 'World\'s largest coral reef system'
  },
  {
    name: 'Maldives Atolls',
    lat: 3.2028,
    lon: 73.2207,
    type: 'ocean',
    likes: 42000,
    description: 'Pristine coral atolls in Indian Ocean'
  },
  {
    name: 'Norwegian Fjords',
    lat: 62.1734,
    lon: 7.6953,
    type: 'ocean',
    likes: 38000,
    description: 'Dramatic glacial fjords in Norway'
  },
  {
    name: 'Bora Bora Lagoon',
    lat: -16.5004,
    lon: -151.7415,
    type: 'ocean',
    likes: 35000,
    description: 'Stunning turquoise lagoon in French Polynesia'
  },
  {
    name: 'Ha Long Bay',
    lat: 20.9101,
    lon: 107.1839,
    type: 'ocean',
    likes: 40000,
    description: 'Limestone karsts rising from emerald waters'
  },

  // Cities & Urban Landmarks
  {
    name: 'Manhattan Skyline',
    lat: 40.7831,
    lon: -73.9712,
    type: 'city',
    likes: 60000,
    description: 'Iconic skyscrapers of New York City'
  },
  {
    name: 'Dubai Skyline',
    lat: 25.2048,
    lon: 55.2708,
    type: 'city',
    likes: 45000,
    description: 'Futuristic cityscape with Burj Khalifa'
  },
  {
    name: 'Hong Kong Skyline',
    lat: 22.3193,
    lon: 114.1694,
    type: 'city',
    likes: 42000,
    description: 'Dramatic skyline between mountains and harbor'
  },
  {
    name: 'Singapore Skyline',
    lat: 1.3521,
    lon: 103.8198,
    type: 'city',
    likes: 38000,
    description: 'Modern cityscape with Marina Bay'
  },
  {
    name: 'Sydney Harbour',
    lat: -33.8568,
    lon: 151.2153,
    type: 'city',
    likes: 48000,
    description: 'Beautiful harbor with Opera House and Bridge'
  },
  {
    name: 'Las Vegas Strip',
    lat: 36.1147,
    lon: -115.1728,
    type: 'city',
    likes: 35000,
    description: 'Glittering entertainment district in desert'
  },
  {
    name: 'San Francisco Bay',
    lat: 37.8044,
    lon: -122.2711,
    type: 'city',
    likes: 40000,
    description: 'Scenic bay with Golden Gate Bridge'
  },

  // Cultural & Historical Landmarks
  {
    name: 'Pyramids of Giza',
    lat: 29.9792,
    lon: 31.1342,
    type: 'cultural',
    likes: 55000,
    description: 'Ancient pyramids and Sphinx'
  },
  {
    name: 'Taj Mahal',
    lat: 27.1751,
    lon: 78.0421,
    type: 'cultural',
    likes: 52000,
    description: 'Magnificent marble mausoleum'
  },
  {
    name: 'Machu Picchu',
    lat: -13.1631,
    lon: -72.5450,
    type: 'cultural',
    likes: 48000,
    description: 'Ancient Incan citadel in the Andes'
  },
  {
    name: 'Angkor Wat',
    lat: 13.4125,
    lon: 103.8670,
    type: 'cultural',
    likes: 40000,
    description: 'Magnificent temple complex in Cambodia'
  },
  {
    name: 'Stonehenge',
    lat: 51.1789,
    lon: -1.8262,
    type: 'cultural',
    likes: 30000,
    description: 'Mysterious prehistoric stone circle'
  },
  {
    name: 'Easter Island Statues',
    lat: -27.1127,
    lon: -109.3497,
    type: 'cultural',
    likes: 28000,
    description: 'Enigmatic moai statues in Pacific Ocean'
  },
  {
    name: 'Petra',
    lat: 30.3285,
    lon: 35.4444,
    type: 'cultural',
    likes: 45000,
    description: 'Rose-red city carved into rock'
  },
  {
    name: 'Great Wall of China',
    lat: 40.4319,
    lon: 116.5704,
    type: 'cultural',
    likes: 58000,
    description: 'Ancient fortification across northern China'
  },

  // Additional Natural Wonders
  {
    name: 'Aurora Borealis Zone',
    lat: 69.6496,
    lon: 18.9553,
    type: 'natural',
    likes: 35000,
    description: 'Northern lights viewing area in Norway'
  },
  {
    name: 'Patagonia',
    lat: -49.3227,
    lon: -72.9491,
    type: 'natural',
    likes: 32000,
    description: 'Dramatic landscapes at the end of the world'
  },
  {
    name: 'Iceland Glaciers',
    lat: 64.9631,
    lon: -19.0208,
    type: 'natural',
    likes: 30000,
    description: 'Spectacular glacial formations'
  },
  {
    name: 'Serengeti Plains',
    lat: -2.3333,
    lon: 34.8333,
    type: 'natural',
    likes: 38000,
    description: 'Vast savanna with wildlife migrations'
  }
];

/**
 * Get scenic locations filtered by type and popularity
 * @param minLikes Minimum number of likes to include
 * @param types Array of location types to include
 * @returns Filtered array of scenic locations
 */
export function getFilteredScenicLocations(
  minLikes: number = 0,
  types: ScenicLocation['type'][] = ['mountain', 'volcano', 'ocean', 'city', 'landmark', 'natural', 'cultural']
): ScenicLocation[] {
  return SCENIC_LOCATIONS.filter(
    location => location.likes >= minLikes && types.includes(location.type)
  );
}

/**
 * Get top scenic locations by popularity
 * @param count Number of locations to return
 * @param types Array of location types to include
 * @returns Top scenic locations sorted by likes
 */
export function getTopScenicLocations(
  count: number = 20,
  types: ScenicLocation['type'][] = ['mountain', 'volcano', 'ocean', 'city', 'landmark', 'natural', 'cultural']
): ScenicLocation[] {
  return SCENIC_LOCATIONS
    .filter(location => types.includes(location.type))
    .sort((a, b) => b.likes - a.likes)
    .slice(0, count);
}
