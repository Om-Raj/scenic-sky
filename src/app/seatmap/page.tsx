'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Plane, Users, Sparkles } from 'lucide-react';
import { CompactSeatRecommendationDisplay, SeatComparisonDisplay, IframeSeatDisplay, ScrapedSeatDisplay } from '@/components/SeatRecommendation';
import { useAutoSeatRecommendation } from '@/hooks/useSeatRecommendation';
import { useIframeSeatScraping, useIframeLoadState } from '@/hooks/useIframeSeatScraping';

export default function SeatmapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  // Refs for iframe integration
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Use the seat recommendation hook with URL parameters
  const seatRecommendation = useAutoSeatRecommendation(searchParams);
  
  // Use iframe seat scraping hook
  const iframeSeatScraping = useIframeSeatScraping(
    seatRecommendation.result,
    false // Don't auto-scrape on recommendation change, we'll do it manually
  );
  
  // Monitor iframe load state
  const iframeLoadState = useIframeLoadState(iframeRef.current);

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

  // Handle messages from iframe (seat selection) - keeping for future compatibility
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'seatSelected') {
        console.log('Seat selected from iframe:', event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  
  // Handle iframe load completion
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    
    // Trigger seat scraping when iframe is loaded and we have seat recommendation
    if (iframeRef.current && seatRecommendation.result && !seatRecommendation.loading) {
      console.log('Iframe loaded, starting seat analysis...');
      // Small delay to ensure content is fully rendered
      setTimeout(() => {
        if (iframeRef.current) {
          iframeSeatScraping.scrapeSeats(iframeRef.current);
        }
      }, 1000);
    }
  };
  
  // Trigger seat scraping when seat recommendation becomes available
  useEffect(() => {
    if (seatRecommendation.result && iframeRef.current && iframeLoadState.isReady && !iframeSeatScraping.loading) {
      console.log('Seat recommendation available, triggering seat analysis...');
      iframeSeatScraping.scrapeSeats(iframeRef.current);
    }
  }, [seatRecommendation.result, iframeLoadState.isReady]);

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
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_auto_2fr] max-h-[100vh]">
        
        {/* Seat Details Section */}
        <section className="flex flex-col overflow-hidden border-b lg:border-b-0 lg:border-r bg-white max-h-[100vh]">
          <div className="flex-shrink-0 p-4 border-b bg-gray-50">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Recommended Seats</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-md mx-auto lg:max-w-none">
              <ScrapedSeatDisplay
                scrapedSeats={iframeSeatScraping.scrapedSeats}
                loading={iframeSeatScraping.loading || !iframeLoadState.isReady}
                error={iframeSeatScraping.error || iframeLoadState.error}
                onRefresh={() => {
                  if (iframeRef.current) {
                    iframeSeatScraping.scrapeSeats(iframeRef.current);
                  }
                }}
                maxSeats={30}
              />
            </div>
          </div>
        </section>

        {/* Seatmap Section */}
        <section className="flex flex-col lg:w-[400px] bg-gray-50 border-b lg:border-b-0 lg:border-r max-h-[100vh]">
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
                  ref={iframeRef}
                  src={`/aircraft/${flightData.airplaneModel}.html?seatbar=hide&tooltip_on_hover=true`}
                  className="w-full h-full border-0"
                  title="Aircraft Seatmap"
                  onLoad={handleIframeLoad}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Seat Recommendations Section */}
        <section className="flex flex-col overflow-hidden bg-white max-h-[100vh]">
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
                    <p className="text-gray-500 text-sm">Loading scenic analysis...</p>
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
