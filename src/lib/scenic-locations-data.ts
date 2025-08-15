// Predefined dataset of scenic locations worldwide
import type { ScenicLocation } from './seat-recommendation-types';

/**
 * Curated dataset of scenic locations for flight path analysis
 * Each location includes coordinates, type, and popularity metrics
 */
const RAW_SCENIC_LOCATIONS: ScenicLocation[] = [
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
  },

  // 1. Lake Baikal – deepest lake
  { name: 'Lake Baikal', lat: 53.5560, lon: 108.3526, type: 'natural', likes: 34000, description: "Deepest freshwater lake on Earth" },
  
  // 2. **Grand Canyon Skywalk**, USA (replacing Puerto Princesa)
  {
    name: 'Grand Canyon Skywalk',
    lat: 36.1316,
    lon: -113.8100,
    type: 'natural',
    likes: 30000,
    description: 'Glass bridge extending over the canyon, aerially distinctive'
  },
  
  // 3. **Victoria Harbour overhead view**, Hong Kong (replacing Lena Pillars)
  {
    name: 'Victoria Harbour, Hong Kong',
    lat: 22.2870,
    lon: 114.1739,
    type: 'city',
    likes: 45000,
    description: 'Iconic natural harbor and skyline readily visible from above'
  },
  
  // 4. **Red Sea Coral Reefs from coastal air**, Egypt/Saudi
  {
    name: 'Red Sea Coral Reef Coastline',
    lat: 23.5000,
    lon: 36.5000,
    type: 'natural',
    likes: 28000,
    description: 'Vivid coral reef patterns visible from aerial view over Red Sea coast'
  },
  
  // The rest of the original list (5–42), but ensure each remains visible from the air:
  // 5. Pink Beach (Komodo), visible from above: yes.
  { name: 'Pink Beach (Komodo)', lat: -8.4500, lon: 119.5330, type: 'natural', likes: 27000, description: "Beach with reddish-pink sand by foraminifera" },
  
  // 6. Red Beach (REPLACED earlier; now replaced by Red Sea Coastline)
  // skipped
  
  // 7. Rose Valley, Cappadocia
  { name: 'Rose Valley, Cappadocia', lat: 38.6610, lon: 34.8280, type: 'natural', likes: 26000, description: "Fairy-chimney rock formations in Turkey" },
  
  // 8. Uvs Lake Basin
  { name: 'Uvs Lake Basin', lat: 51.0000, lon: 90.0000, type: 'natural', likes: 14000, description: "Diverse landscapes across steppe, swamp, lakes" },
  
  // 9. Ulakhan-Sis Pillars — replaced due low visibility. New entry:
  {
    name: 'Pamukkale Terraces, Turkey',
    lat: 37.9240,
    lon: 29.1180,
    type: 'natural',
    likes: 21000,
    description: 'White travertine terraces visible from the air'
  },
  
  // 10. Yanar Dag (fire hill) – visible glow
  { name: 'Yanar Dag', lat: 40.3700, lon: 49.8400, type: 'natural', likes: 20000, description: "Natural continuously burning gas fire hill" },
  
  // 11. Yangykala Canyon
  { name: 'Yangykala Canyon', lat: 41.5000, lon: 56.6500, type: 'natural', likes: 16000, description: "Wave-shaped eroded rock canyon" },
  
  // 12. Zhangye Danxia
  { name: 'Zhangye Danxia', lat: 38.5050, lon: 100.4500, type: 'natural', likes: 32000, description: "Colorful layered rock formations" },
  
  // 13. Verdon Gorge
  { name: 'Verdon Gorge', lat: 43.7500, lon: 6.4667, type: 'natural', likes: 24000, description: "Dramatic turquoise river canyon in Europe" },
  
  // 14. Blue Grotto, Capri – visible from sky
  { name: 'Blue Grotto, Capri', lat: 40.5500, lon: 14.2430, type: 'natural', likes: 28000, description: "Seaside sea-cave illuminated in vivid blue—visible mouth" },
  
  // 15. Scala dei Turchi
  { name: 'Scala dei Turchi', lat: 37.2460, lon: 13.5980, type: 'natural', likes: 22000, description: "White marl cliffs on Sicily’s coast" },
  
  // 16. Stuðlagil Canyon
  { name: 'Stuðlagil Canyon', lat: 65.7500, lon: -14.8500, type: 'natural', likes: 18000, description: "Basalt column canyon revealed by dam" },
  
  // 17. Vatnajökull Glacier
  { name: 'Vatnajökull Glacier', lat: 64.2500, lon: -16.9000, type: 'natural', likes: 30000, description: "Europe’s largest glacier" },
  
  // 18. Devils Garden, Arches NP
  { name: 'Devils Garden, Arches NP', lat: 38.7584, lon: -109.6065, type: 'natural', likes: 25000, description: "Rock arches and towers in Arches National Park" },
  
  // 19. Grand Prismatic Spring
  { name: 'Grand Prismatic Spring', lat: 44.5250, lon: -110.8382, type: 'natural', likes: 35000, description: "Largest hot spring in the U.S. with rainbow colors" },
  
  // 20. Hierve el Agua
  { name: 'Hierve el Agua', lat: 17.1833, lon: -96.5833, type: 'natural', likes: 20000, description: "Rock-formed 'waterfalls' mineral terraces" },
  
  // 21. Hoh Rainforest – canopy visible
  { name: 'Hoh Rainforest', lat: 47.8610, lon: -123.9350, type: 'natural', likes: 21000, description: "Largest temperate rainforest in U.S." },
  
  // 22. Hopewell Rocks
  { name: 'Hopewell Rocks', lat: 45.5800, lon: -64.6900, type: 'natural', likes: 23000, description: "Flowerpot-shaped rock formations in tidal bay" },
  
  // 23. Horseshoe Bend
  { name: 'Horseshoe Bend', lat: 36.8790, lon: -111.5100, type: 'natural', likes: 27000, description: "Distinctive meander in Colorado River" },
  
  // 24. Ik Kil Cenote – aerial visibility not ideal (replace):
  {
    name: 'Iguazu Falls (Aerial View), Argentina/Brazil',
    lat: -25.6953,
    lon: -54.4367,
    type: 'natural',
    likes: 40000,
    description: 'Massive stepped waterfall system visible from the air'
  },
  
  // 25. Mammoth Hot Springs – visible as terraces
  { name: 'Mammoth Hot Springs', lat: 44.9760, lon: -110.7040, type: 'natural', likes: 20000, description: "Terraced hot spring deposits in Yellowstone" },
  
  // 26. Mendenhall Ice Caves – hidden; REPLACE:
  {
    name: 'Perito Moreno Glacier, Argentina',
    lat: -50.4977,
    lon: -73.0489,
    type: 'natural',
    likes: 30000,
    description: 'Advancing glacier visible with large striking ice front from above'
  },
  
  // 27. Monument Valley
  { name: 'Monument Valley', lat: 36.9989, lon: -110.0980, type: 'natural', likes: 30000, description: "Iconic red sandstone buttes" },
  
  // 28. Moraine Lake – visible turquoise lake
  { name: 'Moraine Lake', lat: 51.3213, lon: -116.1860, type: 'natural', likes: 29000, description: "Emerald lake in Valley of Ten Peaks" },
  
  // 29. Spotted Lake – colored pattern from air
  { name: 'Spotted Lake', lat: 49.1833, lon: -119.5000, type: 'natural', likes: 18000, description: "Mineral-rich lake forming colored spots" },
  
  // 30. Caño Cristales – colorful river
  { name: 'Caño Cristales', lat: 2.9000, lon: -73.7000, type: 'natural', likes: 24000, description: "River 'of five colors' in Colombia" },
  
  // 31. Salar de Uyuni – mirror effect
  { name: 'Salar de Uyuni', lat: -20.1338, lon: -67.4891, type: 'natural', likes: 35000, description: "World’s largest salt flat — mirror effect" },
  
  // 32. Geiranger Fjord
  { name: 'Geiranger Fjord', lat: 62.1000, lon: 7.2500, type: 'natural', likes: 31000, description: "UNESCO fjord with steep cliffs and waterfalls" },
  
  // 33. Na Pali Coast
  { name: 'Na Pali Coast', lat: 22.2000, lon: -159.6000, type: 'natural', likes: 33000, description: "Rugged Hawaiian coastline with sea cliffs" },
  
  // 34. Skógafoss
  { name: 'Skógafoss', lat: 63.5321, lon: -19.5110, type: 'natural', likes: 26000, description: "Powerful waterfall on Iceland’s south coast" },
  
  // 35. Dragon’s Blood Trees, Socotra – unique canopy shape
  { name: 'Dragon’s Blood Trees, Socotra', lat: 12.5000, lon: 54.0000, type: 'natural', likes: 22000, description: "Unique umbrella-shaped trees endemic to Socotra" },
  
  // 36. Redwood National Park – visible treetops
  { name: 'Redwood National Park', lat: 41.2130, lon: -124.0046, type: 'natural', likes: 28000, description: "Tallest trees on Earth — coastal redwoods" },
  
  // 37. Marble Caves, Chile – visible striking turquoise water
  { name: 'Marble Caves, Chile', lat: -46.6570, lon: -73.0550, type: 'natural', likes: 25000, description: "Turquoise water-lapped marble cavern in Patagonia" },
  
  // 38. Munnar Tea Plantations – rolling hills visible
  { name: 'Munnar Tea Plantations', lat: 10.0900, lon: 77.0600, type: 'natural', likes: 23000, description: "Rolling green tea hills in Kerala, India" },
  
  // 39. Milford Sound
  { name: 'Milford Sound', lat: -44.6700, lon: 167.9300, type: 'natural', likes: 34000, description: "Majestic fiord with dramatic cliffs and waterfalls" },
  
  // 40. Capri Island (viewpoint) — already visible
  { name: 'Capri Island (viewpoint)', lat: 40.5532, lon: 14.2220, type: 'natural', likes: 30000, description: "Island views over azure Tyrrhenian Sea" },
  
  // 41. Jökulsárlón Glacier Lagoon
  { name: 'Jökulsárlón Glacier Lagoon', lat: 64.0480, lon: -16.2100, type: 'natural', likes: 28000, description: "Floating icebergs in lagoon beside glacier" },
  
  // 42. Lake Pukaki – turquoise glacial lake
  { name: 'Lake Pukaki', lat: -44.1667, lon: 170.1500, type: 'natural', likes: 27000, description: "Glacial lake with turquoise waters" },

   // 43. Table Mountain, South Africa
  {
    name: 'Table Mountain',
    lat: -33.9628,
    lon: 18.4098,
    type: 'mountain',
    likes: 38000,
    description: 'Flat-topped mountain overlooking Cape Town'
  },
  // 44. Mount Elbrus, Russia
  {
    name: 'Mount Elbrus',
    lat: 43.3499,
    lon: 42.4453,
    type: 'mountain',
    likes: 36000,
    description: 'Highest peak in Europe'
  },
  // 45. Mount Etna, Italy
  {
    name: 'Mount Etna',
    lat: 37.7510,
    lon: 14.9934,
    type: 'volcano',
    likes: 35000,
    description: 'Active stratovolcano in Sicily'
  },
  // 46. Mount Aoraki / Cook, New Zealand
  {
    name: 'Mount Cook (Aoraki)',
    lat: -43.5950,
    lon: 170.1410,
    type: 'mountain',
    likes: 34000,
    description: 'Highest mountain in New Zealand'
  },
  // 47. Mount Ararat, Turkey
  {
    name: 'Mount Ararat',
    lat: 39.7021,
    lon: 44.2986,
    type: 'mountain',
    likes: 28000,
    description: 'Snow-capped peak associated with Noah’s Ark legend'
  },
  // 48. Mount Sinai, Egypt
  {
    name: 'Mount Sinai',
    lat: 28.5394,
    lon: 33.9750,
    type: 'mountain',
    likes: 26000,
    description: 'Historic mountain in the Sinai Peninsula'
  },
  // 49. Mount Roraima, Venezuela/Brazil/Guyana
  {
    name: 'Mount Roraima',
    lat: 5.1436,
    lon: -60.7622,
    type: 'mountain',
    likes: 31000,
    description: 'Flat-topped tepui on the triple border'
  },
  // 50. Blue Mountains, Australia
  {
    name: 'Blue Mountains',
    lat: -33.7000,
    lon: 150.3000,
    type: 'mountain',
    likes: 29000,
    description: 'Eucalyptus-covered plateau west of Sydney'
  },
  // 51. Pamir Mountains, Tajikistan
  {
    name: 'Pamir Mountains',
    lat: 38.5000,
    lon: 72.0000,
    type: 'mountain',
    likes: 27000,
    description: 'High peaks of Central Asia known as "Roof of the World"'
  },
  // 52. Karakoram Range, Pakistan
  {
    name: 'Karakoram Range',
    lat: 35.8825,
    lon: 76.5133,
    type: 'mountain',
    likes: 33000,
    description: 'Includes K2, second highest peak in the world'
  },
  // 53. Mount Shasta, USA
  {
    name: 'Mount Shasta',
    lat: 41.4092,
    lon: -122.1944,
    type: 'volcano',
    likes: 28000,
    description: 'Prominent volcanic peak in northern California'
  },
  // 54. Mount St. Helens, USA
  {
    name: 'Mount St. Helens',
    lat: 46.1912,
    lon: -122.1944,
    type: 'volcano',
    likes: 27000,
    description: 'Volcano famous for 1980 eruption'
  },
  // 55. Mount Yasur, Vanuatu
  {
    name: 'Mount Yasur',
    lat: -19.5320,
    lon: 169.4470,
    type: 'volcano',
    likes: 25000,
    description: 'Highly active volcano on Tanna Island'
  },
  // 56. Mount Teide, Spain (Canary Islands)
  {
    name: 'Mount Teide',
    lat: 28.2724,
    lon: -16.6425,
    type: 'volcano',
    likes: 34000,
    description: 'Highest peak in Spain and prominent volcanic cone'
  },
  // 57. Mount Erebus, Antarctica
  {
    name: 'Mount Erebus',
    lat: -77.5300,
    lon: 167.1600,
    type: 'volcano',
    likes: 24000,
    description: 'Southernmost active volcano on Earth'
  },
  // 58. Mount Pico, Azores, Portugal
  {
    name: 'Mount Pico',
    lat: 38.4700,
    lon: -28.4000,
    type: 'volcano',
    likes: 22000,
    description: 'Highest mountain in Portugal'
  },
  // 59. Mount Kenya, Kenya
  {
    name: 'Mount Kenya',
    lat: -0.1521,
    lon: 37.3084,
    type: 'mountain',
    likes: 30000,
    description: 'Second-highest peak in Africa'
  },
  // 60. Mount Meru, Tanzania
  {
    name: 'Mount Meru',
    lat: -3.2500,
    lon: 36.7500,
    type: 'mountain',
    likes: 24000,
    description: 'Volcanic mountain in Arusha National Park'
  },
  // 61. Mount Taranaki, New Zealand
  {
    name: 'Mount Taranaki',
    lat: -39.2970,
    lon: 174.0630,
    type: 'volcano',
    likes: 28000,
    description: 'Symmetrical volcanic cone on North Island'
  },
  // 62. Mount Tambora, Indonesia
  {
    name: 'Mount Tambora',
    lat: -8.2500,
    lon: 118.0000,
    type: 'volcano',
    likes: 25000,
    description: 'Volcano known for 1815 eruption'
  },
  // 63. Lake Titicaca, Bolivia/Peru
  {
    name: 'Lake Titicaca',
    lat: -15.7650,
    lon: -69.3450,
    type: 'natural',
    likes: 33000,
    description: 'Highest navigable lake in the world'
  },
  // 64. Lake Geneva, Switzerland/France
  {
    name: 'Lake Geneva',
    lat: 46.4500,
    lon: 6.6000,
    type: 'natural',
    likes: 32000,
    description: 'Crescent-shaped lake on the Swiss-French border'
  },
  // 65. Lake Victoria, Africa
  {
    name: 'Lake Victoria',
    lat: -1.0000,
    lon: 33.0000,
    type: 'natural',
    likes: 35000,
    description: 'Largest lake in Africa by area'
  },
  // 66. Lake Superior, USA/Canada
  {
    name: 'Lake Superior',
    lat: 47.7000,
    lon: -87.5000,
    type: 'natural',
    likes: 34000,
    description: 'Largest freshwater lake by surface area'
  },
  // 67. Lake Powell, USA
  {
    name: 'Lake Powell',
    lat: 37.0000,
    lon: -111.3000,
    type: 'natural',
    likes: 28000,
    description: 'Reservoir with dramatic desert scenery'
  },
  // 68. Lake Pukaki, New Zealand
  {
    name: 'Lake Pukaki',
    lat: -44.1667,
    lon: 170.1500,
    type: 'natural',
    likes: 27000,
    description: 'Glacial lake with turquoise waters'
  },
  // 69. Mekong Delta, Vietnam
  {
    name: 'Mekong Delta',
    lat: 10.0000,
    lon: 105.0000,
    type: 'natural',
    likes: 26000,
    description: 'Vast river delta in southern Vietnam'
  },
  // 70. Danube Delta, Romania/Ukraine
  {
    name: 'Danube Delta',
    lat: 45.2000,
    lon: 29.5000,
    type: 'natural',
    likes: 25000,
    description: 'Second largest river delta in Europe'
  },
  // 71. Okavango Delta, Botswana
  {
    name: 'Okavango Delta',
    lat: -19.0000,
    lon: 22.5000,
    type: 'natural',
    likes: 27000,
    description: 'Seasonal inland delta in the Kalahari Desert'
  },
  // 72. Hudson Bay, Canada
  {
    name: 'Hudson Bay',
    lat: 60.0000,
    lon: -85.0000,
    type: 'ocean',
    likes: 23000,
    description: 'Massive inland sea in northeastern Canada'
  },
  // 73. Bay of Biscay, France/Spain
  {
    name: 'Bay of Biscay',
    lat: 45.0000,
    lon: -5.0000,
    type: 'ocean',
    likes: 21000,
    description: 'Large gulf of the northeast Atlantic Ocean'
  },
  // 74. Gulf of Aqaba, Egypt/Jordan/Saudi Arabia
  {
    name: 'Gulf of Aqaba',
    lat: 28.0000,
    lon: 34.5000,
    type: 'ocean',
    likes: 24000,
    description: 'Narrow gulf at the northern Red Sea'
  },
  // 75. Coral Sea, Australia
  {
    name: 'Coral Sea',
    lat: -18.0000,
    lon: 152.0000,
    type: 'ocean',
    likes: 26000,
    description: 'Sea off Australia’s northeast coast'
  },
  // 76. Tasman Sea, Australia/New Zealand
  {
    name: 'Tasman Sea',
    lat: -40.0000,
    lon: 160.0000,
    type: 'ocean',
    likes: 25000,
    description: 'Sea between Australia and New Zealand'
  },
  // 77. Bay of Bengal
  {
    name: 'Bay of Bengal',
    lat: 15.0000,
    lon: 88.0000,
    type: 'ocean',
    likes: 27000,
    description: 'Largest bay in the world'
  },
  // 78. Gulf of California, Mexico
  {
    name: 'Gulf of California',
    lat: 26.0000,
    lon: -111.0000,
    type: 'ocean',
    likes: 28000,
    description: 'Sea of Cortez between Baja and mainland Mexico'
  },
  // 79. Andaman Sea
  {
    name: 'Andaman Sea',
    lat: 10.0000,
    lon: 97.0000,
    type: 'ocean',
    likes: 25000,
    description: 'Sea southeast of the Bay of Bengal'
  },
  // 80. Bering Sea
  {
    name: 'Bering Sea',
    lat: 58.0000,
    lon: -175.0000,
    type: 'ocean',
    likes: 23000,
    description: 'Sea between Alaska and Russia'
  },

  // 81. Paris Skyline with Eiffel Tower, France
  {
    name: 'Paris Skyline with Eiffel Tower',
    lat: 48.8584,
    lon: 2.2945,
    type: 'city',
    likes: 48000,
    description: 'Famous landmark and skyline along the Seine'
  },
  // 82. London Skyline with River Thames, UK
  {
    name: 'London Skyline with River Thames',
    lat: 51.5074,
    lon: -0.1278,
    type: 'city',
    likes: 47000,
    description: 'Historic city view winding along the Thames'
  },
  // 83. Rio de Janeiro with Christ the Redeemer, Brazil
  {
    name: 'Rio de Janeiro Skyline',
    lat: -22.9519,
    lon: -43.2105,
    type: 'city',
    likes: 49000,
    description: 'City framed by Sugarloaf Mountain and beaches'
  },
  // 84. Athens with Acropolis, Greece
  {
    name: 'Athens with Acropolis',
    lat: 37.9715,
    lon: 23.7267,
    type: 'cultural',
    likes: 42000,
    description: 'Ancient citadel above modern Athens'
  },
  // 85. Venice Lagoon, Italy
  {
    name: 'Venice Lagoon',
    lat: 45.4408,
    lon: 12.3155,
    type: 'city',
    likes: 45000,
    description: 'City of canals in a shallow lagoon'
  },
  // 86. Budapest with Parliament on the Danube, Hungary
  {
    name: 'Budapest Skyline',
    lat: 47.4979,
    lon: 19.0402,
    type: 'city',
    likes: 43000,
    description: 'Parliament and bridges along the Danube'
  },
  // 87. Prague Old Town and Vltava River, Czech Republic
  {
    name: 'Prague Old Town',
    lat: 50.0755,
    lon: 14.4378,
    type: 'city',
    likes: 42000,
    description: 'Historic core on both sides of the Vltava'
  },
  // 88. Barcelona with Sagrada Família, Spain
  {
    name: 'Barcelona Skyline',
    lat: 41.4036,
    lon: 2.1744,
    type: 'city',
    likes: 46000,
    description: 'Grid-patterned city with famous basilica'
  },
  // 89. Chicago Skyline on Lake Michigan, USA
  {
    name: 'Chicago Skyline',
    lat: 41.8781,
    lon: -87.6298,
    type: 'city',
    likes: 44000,
    description: 'Downtown skyscrapers along Lake Michigan'
  },
  // 90. Boston Harbor, USA
  {
    name: 'Boston Harbor',
    lat: 42.3601,
    lon: -71.0589,
    type: 'city',
    likes: 40000,
    description: 'Historic harbor and city layout visible from above'
  },
  // 91. Seattle with Space Needle, USA
  {
    name: 'Seattle Skyline',
    lat: 47.6062,
    lon: -122.3321,
    type: 'city',
    likes: 43000,
    description: 'City framed by Puget Sound and Mount Rainier in distance'
  },
  // 92. Miami Beach, USA
  {
    name: 'Miami Beach',
    lat: 25.7907,
    lon: -80.1300,
    type: 'city',
    likes: 41000,
    description: 'Long sandy barrier island and Art Deco district'
  },
  // 93. Havana with Malecón, Cuba
  {
    name: 'Havana Skyline',
    lat: 23.1136,
    lon: -82.3666,
    type: 'city',
    likes: 39000,
    description: 'Coastal capital with colorful colonial architecture'
  },
  // 94. Reykjavik with Faxaflói Bay, Iceland
  {
    name: 'Reykjavik Skyline',
    lat: 64.1355,
    lon: -21.8954,
    type: 'city',
    likes: 36000,
    description: 'Northernmost capital city with bay views'
  },
  // 95. Honolulu with Diamond Head, Hawaii
  {
    name: 'Honolulu with Diamond Head',
    lat: 21.3069,
    lon: -157.8583,
    type: 'city',
    likes: 45000,
    description: 'Urban skyline against volcanic tuff cone'
  },
  // 96. Cape Town with Table Bay, South Africa
  {
    name: 'Cape Town with Table Bay',
    lat: -33.9249,
    lon: 18.4241,
    type: 'city',
    likes: 46000,
    description: 'Coastal city at the foot of Table Mountain'
  },
  // 97. Istanbul with Bosphorus Strait, Turkey
  {
    name: 'Istanbul Skyline',
    lat: 41.0082,
    lon: 28.9784,
    type: 'city',
    likes: 47000,
    description: 'City bridging Europe and Asia on the Bosphorus'
  },
  // 98. Kuala Lumpur with Petronas Towers, Malaysia
  {
    name: 'Kuala Lumpur Skyline',
    lat: 3.1390,
    lon: 101.6869,
    type: 'city',
    likes: 44000,
    description: 'Modern skyline with twin towers'
  },
  // 99. Los Angeles with Santa Monica Bay, USA
  {
    name: 'Los Angeles Skyline and Coast',
    lat: 34.0522,
    lon: -118.2437,
    type: 'city',
    likes: 45000,
    description: 'Sprawling city to Pacific shoreline'
  },
  // 100. Toronto Skyline with CN Tower, Canada
  {
    name: 'Toronto Skyline',
    lat: 43.6532,
    lon: -79.3832,
    type: 'city',
    likes: 44000,
    description: 'Urban skyline on Lake Ontario'
  }

];

/**
 * Remove duplicate scenic locations by normalized name + coords.
 * Keeps the first occurrence (preserves original list ordering where possible).
 */
function dedupeLocations(arr: ScenicLocation[]): ScenicLocation[] {
  const seen = new Map<string, ScenicLocation>();
  for (const loc of arr) {
    // use normalized name + rounded coords as a stable key
    const key = `${loc.name.trim().toLowerCase()}|${loc.lat.toFixed(6)}|${loc.lon.toFixed(6)}`;
    if (!seen.has(key)) seen.set(key, loc);
  }
  return Array.from(seen.values());
}

// Export the cleaned array for other modules to consume.
export const SCENIC_LOCATIONS: ScenicLocation[] = dedupeLocations(RAW_SCENIC_LOCATIONS);

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
