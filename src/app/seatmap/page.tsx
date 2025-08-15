'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Plane, Users } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="relative z-50 p-4 bg-white/95 backdrop-blur-sm shadow-sm border-b">
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
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-73px)] flex flex-col lg:flex-row">
        {/* Mobile: Seat Details (Top) */}
        <div className="lg:hidden p-4 bg-white border-b">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">
                {selectedSeat ? 'Selected Seat' : 'Recommended Seat'}
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                <div>
                  <div className="text-2xl font-bold text-blue-900">{currentSeat.seat}</div>
                  <div className="text-sm text-blue-700">{currentSeat.position} Seat</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Features</div>
                  <div className="space-y-1">
                    {currentSeat.features.map((feature, index) => (
                      <div key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {!selectedSeat && 'reason' in recommendedSeat && (
                <div className="text-sm text-gray-600 italic">
                  {recommendedSeat.reason}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seatmap Iframe */}
        <div className="flex-1 lg:w-[60%] relative">
          <div className="h-full p-4">
            <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
              {!iframeLoaded && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading seatmap...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src={`/aircraft/${getAircraftFileName(flightData.airplaneModel)}?seatbar=hide&tooltip_on_hover=true`}
                className={`w-full h-full border-0 ${iframeLoaded ? 'block' : 'hidden'}`}
                title="Aircraft Seatmap"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          </div>
        </div>

        {/* Desktop: Seat Details (Right Side) */}
        <div className="hidden lg:block lg:w-[40%] p-4">
          <div className="h-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">
                {selectedSeat ? 'Selected Seat' : 'Recommended Seat'}
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* Main Seat Info */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-900 mb-1">{currentSeat.seat}</div>
                  <div className="text-lg text-blue-700">{currentSeat.position} Seat</div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Features</div>
                    <div className="flex flex-wrap gap-2">
                      {currentSeat.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {!selectedSeat && 'reason' in recommendedSeat && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Why this seat?</div>
                      <div className="text-sm text-gray-600 italic">
                        {recommendedSeat.reason}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Flight Details */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Flight Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Aircraft:</span>
                    <span className="font-medium">{flightData.airplaneModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Route:</span>
                    <span className="font-medium">{flightData.departure} → {flightData.arrival}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Departure:</span>
                    <span className="font-medium">
                      {flightData.departureDate} at {flightData.departureTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Arrival:</span>
                    <span className="font-medium">
                      {flightData.arrivalDate} at {flightData.arrivalTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seat Selection Tips */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">💡 Seat Selection Tips</h3>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Window seats offer views but less mobility</li>
                  <li>• Aisle seats provide easy access to overhead bins</li>
                  <li>• Avoid seats near lavatories for quieter flight</li>
                  <li>• Exit row seats usually have extra legroom</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
