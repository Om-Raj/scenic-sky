// Test script to verify seat recommendation calculations
import { generateSeatRecommendation } from '../src/lib/seat-recommendation-engine.js';

async function testSeatRecommendation() {
  console.log('🧪 Testing Seat Recommendation System...\n');

  const testCases = [
    {
      name: 'Transatlantic Night Flight (JFK → LHR)',
      input: {
        airplaneModel: 'Boeing 787',
        departureDate: '2024-12-15',
        departureTime: '22:00',
        arrivalDate: '2024-12-16',
        arrivalTime: '10:00',
        departureAirportCode: 'JFK',
        arrivalAirportCode: 'LHR',
      }
    },
    {
      name: 'Transpacific Day Flight (LAX → DEL)',
      input: {
        airplaneModel: 'Airbus A350',
        departureDate: '2024-12-15',
        departureTime: '14:00',
        arrivalDate: '2024-12-16',
        arrivalTime: '20:30',
        departureAirportCode: 'LAX',
        arrivalAirportCode: 'DEL',
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📍 ${testCase.name}`);
    console.log('=' .repeat(50));
    
    try {
      const result = await generateSeatRecommendation(testCase.input);
      
      console.log(`📊 Route Distance: ${Math.round(result.routeDistance)} km`);
      console.log(`⏱️  Flight Duration: ${Math.round(result.flightDuration * 10) / 10} hours`);
      console.log(`🏔️  Scenic Locations: ${result.detailedScenicLocations.length} visible`);
      console.log(`🌅 Solar Events: ${result.detailedSolarEvents.length} events`);
      
      console.log('\n🎯 Scenic Views by Side:');
      console.log(`   Left: ${result.scenicViews.left.length} (${result.scenicViews.left.join(', ')})`);
      console.log(`   Right: ${result.scenicViews.right.length} (${result.scenicViews.right.join(', ')})`);
      
      console.log('\n🌞 Solar Events by Side:');
      console.log(`   Left: ${result.solarEvents.left.length} (${result.solarEvents.left.join(', ')})`);
      console.log(`   Right: ${result.solarEvents.right.length} (${result.solarEvents.right.join(', ')})`);
      
      // Show top 3 scenic locations with details
      const topLocations = result.detailedScenicLocations
        .sort((a, b) => {
          const visibilityOrder = { excellent: 4, good: 3, fair: 2, poor: 1 };
          const aScore = (visibilityOrder[a.visibility] || 1) * 1000 + a.likes;
          const bScore = (visibilityOrder[b.visibility] || 1) * 1000 + b.likes;
          return bScore - aScore;
        })
        .slice(0, 3);
      
      if (topLocations.length > 0) {
        console.log('\n🏆 Top Scenic Locations:');
        topLocations.forEach((loc, index) => {
          console.log(`   ${index + 1}. ${loc.name} (${loc.side} side, ${loc.visibility}, ${Math.round(loc.distanceFromRoute)}km)`);
        });
      }

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n✅ Test completed!');
}

// Run the test
testSeatRecommendation().catch(console.error);
