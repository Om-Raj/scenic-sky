'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Plane, Users, Sparkles } from 'lucide-react';
import { CompactSeatRecommendationDisplay, SeatComparisonDisplay } from '@/components/SeatRecommendation';
import { useAutoSeatRecommendation } from '@/hooks/useSeatRecommendation';

interface SeatData {
  seat: string;
  position: 'Window' | 'Aisle' | 'Middle';
  features: string[];
}

export default function SeatmapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Use the seat recommendation hook with URL parameters
  const seatRecommendation = useAutoSeatRecommendation(searchParams);

  // Extract flight data from URL parameters
  const flightData = {
    airplaneModel: searchParams.get('airplaneModel') || '',
    departureDate: searchParams.get('departureDate') || '',
    departureTime: searchParams.get('departureTime') || '',
    arrivalDate: searchParams.get('arrivalDate') || '',
    arrivalTime: searchParams.get('arrivalTime') || '',
    departure: searchParams.get('departure') || '',
    arrival: searchParams.get('arrival') || '',
  };

  // Map airplane model to HTML file name
  const getAircraftFileName = (model: string) => {
    switch (model.toLowerCase()) {
      case 'boeing 737':
        return 'B-737-9.html';
      case 'boeing 787':
        return 'B-787-9.html';
      case 'airbus a320':
        return 'airbus-a320.html';
      case 'a380 demo':
        return 'a380-demo.html';
      case 'cessna 172':
        return 'cessna-172.html';
      default:
        return 'B-787-9.html'; // fallback to existing file (case-sensitive)
    }
  };

  // Handle messages from iframe (seat selection)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'seatSelected') {
        setSelectedSeat(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Get seat recommendation based on flight details
  const getSeatRecommendation = () => {
    if (!flightData.departure || !flightData.arrival) {
      return {
        seat: '12A',
        position: 'Window' as const,
        features: ['Recommended', 'Great view'],
        reason: 'Window seat for scenic views'
      };
    }

    // Simple recommendation logic based on route
    const isLongHaul = ['LAX', 'LHR', 'DEL', 'DXB'].includes(flightData.departure) && 
                      ['LAX', 'LHR', 'DEL', 'DXB'].includes(flightData.arrival);
    
    if (isLongHaul) {
      return {
        seat: '7A',
        position: 'Window' as const,
        features: ['Extra legroom', 'Window view', 'Quiet zone'],
        reason: 'Premium economy with extra comfort for long flights'
      };
    } else {
      return {
        seat: '12C',
        position: 'Aisle' as const,
        features: ['Easy access', 'Quick boarding'],
        reason: 'Convenient aisle access for shorter flights'
      };
    }
  };

  const recommendedSeat = getSeatRecommendation();
  const currentSeat = selectedSeat || recommendedSeat;

  // Navigate back to flight map with preserved parameters
  const goBackToMap = () => {
    const params = new URLSearchParams();
    Object.entries(flightData).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/flight-map?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Fixed Header */}
      <header className="flex-shrink-0 p-4 bg-white/95 backdrop-blur-sm shadow-sm border-b z-50">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={goBackToMap}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Map</span>
          </Button>

          <div className="flex items-center space-x-4">
            {flightData.departure && flightData.arrival && (
              <div className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold">
                  {flightData.departure} → {flightData.arrival}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{flightData.airplaneModel || 'Aircraft'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content - Responsive Layout */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_auto_2fr]">
        
        {/* Seat Details Section */}
        <section className="flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r bg-white">
          <div className="flex-shrink-0 p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">
                {selectedSeat ? 'Selected Seat' : 'Recommended Seat'}
              </h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-md mx-auto lg:max-w-none space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold text-blue-900">{currentSeat.seat}</div>
                      <div className="text-sm text-blue-700">{currentSeat.position} Seat</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Features</div>
                    <div className="flex flex-wrap gap-1">
                      {currentSeat.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {!selectedSeat && 'reason' in recommendedSeat && (
                    <div className="text-sm text-gray-600 italic mt-3 pt-3 border-t border-blue-200">
                      {recommendedSeat.reason}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Seatmap Section */}
        <section className="flex flex-col lg:w-[400px] bg-gray-50 border-b lg:border-b-0 lg:border-r">
          <div className="flex-shrink-0 p-4 border-b bg-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Aircraft Layout</h2>
          </div>
          
          <div className="flex-1 overflow-hidden p-4 h-full">
            <div className="h-full max-w-md mx-auto">
              <div className="h-full min-h-[70vh] lg:min-h-0 bg-white rounded-lg shadow-lg overflow-hidden relative">
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Loading seatmap...</p>
                    </div>
                  </div>
                )}
                
                <iframe
                  src={`/aircraft/${getAircraftFileName(flightData.airplaneModel)}?seatbar=hide&tooltip_on_hover=true`}
                  className="w-full h-full border-0"
                  title="Aircraft Seatmap"
                  onLoad={() => setIframeLoaded(true)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Seat Recommendations Section */}
        <section className="flex flex-col overflow-hidden bg-white">
          <div className="flex-shrink-0 p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Seat Recommendations</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="h-full">
              {seatRecommendation.result ? (
                <SeatComparisonDisplay 
                  result={seatRecommendation.result}
                  loading={seatRecommendation.loading}
                  error={seatRecommendation.error}
                  className="h-full"
                />
              ) : seatRecommendation.loading ? (
                <SeatComparisonDisplay 
                  result={null as any}
                  loading={true}
                  error={null}
                  className="h-full"
                />
              ) : seatRecommendation.error ? (
                <SeatComparisonDisplay 
                  result={null as any}
                  loading={false}
                  error={seatRecommendation.error}
                  className="h-full"
                />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Loading seat recommendations...</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}
