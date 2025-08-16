// Display component for scraped seats from iframe
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RecommendedSeatsResult } from '@/lib/iframe-seat-scraper';
import { formatSeatFeatures, getSeatDisplayClass } from '@/lib/iframe-seat-scraper';
import { RefreshCw, Plane, AlertCircle, CheckCircle } from 'lucide-react';

interface ScrapedSeatDisplayProps {
  scrapedSeats: RecommendedSeatsResult | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  className?: string;
  maxSeats?: number; // Limit number of seats to display
}

/**
 * Display scraped and filtered seats in a card format matching the existing design
 */
export function ScrapedSeatDisplay({ 
  scrapedSeats, 
  loading = false,
  error = null,
  onRefresh,
  className = '',
  maxSeats = 3
}: ScrapedSeatDisplayProps) {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-blue-700 text-sm">Analyzing aircraft seats...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <div className="text-sm font-medium text-red-800">Analysis Failed</div>
              </div>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="text-red-600 border-red-300 hover:bg-red-100"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
            <p className="text-red-700 text-xs">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!scrapedSeats || scrapedSeats.recommendedSeats.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Plane className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">No suitable seats found</p>
                {onRefresh && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    className="mt-2"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Analyze Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort seats by positive feature count (seats with more "+" features first)
  const sortedSeats = [...scrapedSeats.recommendedSeats]
    .map(seat => ({
      ...seat,
      positiveFeatureCount: seat.features.filter(f => f.value === '+').length
    }))
    .sort((a, b) => b.positiveFeatureCount - a.positiveFeatureCount)
    .slice(0, maxSeats);

  const getPositionFromSeat = (seatNumber: string): string => {
    const letter = seatNumber.slice(-1);
    // Assume A and rightmost letter are window seats
    if (letter === 'A' || ['F', 'G', 'H', 'I', 'J', 'K'].includes(letter)) {
      return 'Window';
    }
    return 'Aisle'; // Simplified logic
  };

  const getCabinClassName = (cabinClass: string, cabinLabel: string): string => {
    if (cabinLabel) return cabinLabel;
    
    switch (cabinClass.toLowerCase()) {
      case 'f': return 'First Class';
      case 'j': return 'Business Class';
      case 'p': return 'Premium Economy';
      case 'y': return 'Economy';
      default: return 'Economy';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary Card */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-green-800">
                  {scrapedSeats.bestSide.charAt(0).toUpperCase() + scrapedSeats.bestSide.slice(1)} Side Recommended
                </div>
                <div className="text-xs text-green-700">
                  {sortedSeats.length} best seats found
                </div>
              </div>
            </div>
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="text-green-700 hover:bg-green-100 h-8 w-8 p-0"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Seats */}
      {sortedSeats.map((seat, index) => (
        <Card 
          key={seat.uid || `${seat.seatNumber}-${index}`}
          className={`bg-blue-50 border-blue-200 ${index === 0 ? 'ring-2 ring-blue-300' : ''}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xl font-bold text-blue-900">{seat.seatNumber}</div>
                <div className="text-sm text-blue-700">{getPositionFromSeat(seat.seatNumber)} Seat</div>
              </div>
              {index === 0 && (
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  Top Choice
                </div>
              )}
            </div>
            
            {/* Cabin Class */}
            <div className="mb-3">
              <span className={`text-xs px-2 py-1 rounded border ${getSeatDisplayClass(seat.cabinClass)}`}>
                {getCabinClassName(seat.cabinClass, seat.cabinLabel)}
              </span>
            </div>
            
            {/* Features */}
            <div className="space-y-2">
              <div className="text-xs text-gray-600 uppercase tracking-wide">Features</div>
              <div className="flex flex-wrap gap-1">
                {formatSeatFeatures(seat.features).map((feature, featureIndex) => {
                  const isPositive = feature.includes('✓');
                  const isNeutral = !feature.includes('✓') && !feature.includes('✗');
                  
                  return (
                    <span 
                      key={featureIndex}
                      className={`text-xs px-2 py-1 rounded ${
                        isPositive 
                          ? 'bg-green-100 text-green-800' 
                          : isNeutral 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {feature}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Quality Score */}
            <div className="text-xs text-blue-600 mt-3 pt-3 border-t border-blue-200">
              {seat.positiveFeatureCount} positive features • Row {seat.rowNumber}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Show more indicator if there are additional seats */}
      {scrapedSeats.recommendedSeats.length > maxSeats && (
        <div className="text-center py-2">
          <div className="text-xs text-gray-500">
            +{scrapedSeats.recommendedSeats.length - maxSeats} more seats available
          </div>
        </div>
      )}
    </div>
  );
}
