// Component to display scraped iframe seats alongside existing seat recommendations
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RecommendedSeatsResult, ScrapedSeatData } from '@/lib/iframe-seat-scraper';
import { formatSeatFeatures, getSeatDisplayClass } from '@/lib/iframe-seat-scraper';
import { 
  Plane, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface IframeSeatDisplayProps {
  scrapedSeats: RecommendedSeatsResult | null;
  loading?: boolean;
  error?: string | null;
  onSeatSelect?: (seat: ScrapedSeatData) => void;
  selectedSeat?: ScrapedSeatData | null;
  onRefresh?: () => void;
  className?: string;
}

/**
 * Display component for scraped iframe seats with recommendation integration
 */
export function IframeSeatDisplay({
  scrapedSeats,
  loading = false,
  error = null,
  onSeatSelect,
  selectedSeat,
  onRefresh,
  className
}: IframeSeatDisplayProps) {
  if (loading) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Plane className="w-5 h-5 mr-2 text-blue-600" />
            Analyzing Aircraft Seats...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Scanning seatmap for optimal seats...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            Seat Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-4">{error}</p>
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Analysis</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scrapedSeats) {
    return (
      <Card className={`h-full ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Plane className="w-5 h-5 mr-2 text-gray-500" />
            Aircraft Seat Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Ready to analyze seatmap when loaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { bestSide, recommendedSeats, reasoning, totalSeatsFound, validSeatsAfterFiltering } = scrapedSeats;
  const sideIcon = bestSide === 'left' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />;

  return (
    <Card className={`h-full overflow-hidden ${className}`}>
      {/* Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Plane className="w-5 h-5 mr-2 text-blue-600" />
            Recommended Aircraft Seats
          </div>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
        
        {/* Summary */}
        <div className="mt-2 text-sm text-blue-800">
          <div className="flex items-center space-x-2 mb-1">
            {sideIcon}
            <span className="font-semibold">{bestSide.charAt(0).toUpperCase() + bestSide.slice(1)} Side Optimal</span>
          </div>
          <div className="text-xs text-blue-700">
            {validSeatsAfterFiltering} recommended seats from {totalSeatsFound} total
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-0 h-full overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Reasoning Section */}
          <div className="p-4 bg-gray-50 border-b">
            <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
              Analysis Summary
            </h4>
            <div className="space-y-1">
              {reasoning.slice(0, 3).map((reason, index) => (
                <div key={index} className="text-xs text-gray-600 flex items-start">
                  <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seats List */}
          <div className="flex-1 overflow-y-auto p-4">
            {recommendedSeats.length > 0 ? (
              <div className="space-y-3">
                {recommendedSeats.map((seat, index) => (
                  <SeatCard
                    key={seat.uid || index}
                    seat={seat}
                    isSelected={selectedSeat?.uid === seat.uid}
                    onSelect={onSeatSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No optimal seats found on {bestSide} side</p>
                <p className="text-gray-400 text-xs mt-1">All seats may have negative features</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Individual seat card component
 */
interface SeatCardProps {
  seat: ScrapedSeatData;
  isSelected?: boolean;
  onSelect?: (seat: ScrapedSeatData) => void;
}

function SeatCard({ seat, isSelected = false, onSelect }: SeatCardProps) {
  const cabinClassStyle = getSeatDisplayClass(seat.cabinClass);
  const formattedFeatures = formatSeatFeatures(seat.features);
  
  return (
    <div
      className={`
        border rounded-lg p-3 transition-all cursor-pointer hover:shadow-md
        ${isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
      onClick={() => onSelect?.(seat)}
    >
      {/* Seat Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">{seat.seatNumber}</span>
            <span className={`px-2 py-1 text-xs rounded border ${cabinClassStyle}`}>
              {seat.cabinLabel || seat.cabinClass}
            </span>
          </div>
          <div className="text-xs text-gray-600">Row {seat.rowNumber}</div>
        </div>
        
        {isSelected && (
          <CheckCircle className="w-5 h-5 text-blue-600" />
        )}
      </div>

      {/* Features */}
      {formattedFeatures.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-gray-600 uppercase tracking-wide">Features</div>
          <div className="flex flex-wrap gap-1">
            {formattedFeatures.map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for smaller display areas
 */
export function CompactIframeSeatDisplay({
  scrapedSeats,
  loading = false,
  error = null,
  className
}: Omit<IframeSeatDisplayProps, 'onSeatSelect' | 'selectedSeat' | 'onRefresh'>) {
  if (loading) {
    return (
      <div className={`p-4 bg-blue-50 rounded-lg border border-blue-200 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span className="text-sm text-blue-700">Analyzing seats...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 rounded-lg border border-red-200 ${className}`}>
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">Analysis failed</span>
        </div>
      </div>
    );
  }

  if (!scrapedSeats) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center space-x-2">
          <Plane className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Ready to analyze</span>
        </div>
      </div>
    );
  }

  const { bestSide, recommendedSeats, validSeatsAfterFiltering } = scrapedSeats;
  const sideIcon = bestSide === 'left' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />;

  return (
    <div className={`p-4 bg-green-50 rounded-lg border border-green-200 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {sideIcon}
            <span className="text-sm font-semibold text-green-800">
              {bestSide.charAt(0).toUpperCase() + bestSide.slice(1)} Side Optimal
            </span>
          </div>
          <span className="text-sm text-green-700">{validSeatsAfterFiltering} seats</span>
        </div>
        
        {recommendedSeats.length > 0 && (
          <div className="text-xs text-green-700">
            Top pick: <span className="font-semibold">{recommendedSeats[0].seatNumber}</span>
            {recommendedSeats[0].cabinLabel && (
              <span className="ml-1">({recommendedSeats[0].cabinLabel})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
