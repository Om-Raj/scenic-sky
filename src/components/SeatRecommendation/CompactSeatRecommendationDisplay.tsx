// Compact seat recommendation display component for seatmap page
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SeatRecommendationResult } from '@/lib/seat-recommendation-types';
import { 
  getPrioritizedScenicViews, 
  getFormattedSolarEvents,
  generateRecommendationSummary 
} from '@/lib/seat-recommendation-engine';
import { Sparkles, Mountain, Sun, Clock, MapPin } from 'lucide-react';

interface CompactSeatRecommendationDisplayProps {
  result: SeatRecommendationResult;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * Compact display component for seat recommendations optimized for seatmap page sidebar
 */
export function CompactSeatRecommendationDisplay({ 
  result, 
  loading = false,
  error = null,
  className 
}: CompactSeatRecommendationDisplayProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
            Analyzing Route...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-red-600">
            <Sparkles className="w-5 h-5 mr-2" />
            Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const summary = generateRecommendationSummary(result);
  const leftViews = getPrioritizedScenicViews(result, 'left');
  const rightViews = getPrioritizedScenicViews(result, 'right');
  const leftSolarEvents = getFormattedSolarEvents(result, 'left');
  const rightSolarEvents = getFormattedSolarEvents(result, 'right');

  const formatDuration = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getVisibilityBadge = (visibility: string): string => {
    switch (visibility) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'poor': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const recommendedSide = summary.recommendedSide === 'left' ? 'Left' : 'Right';
  const recommendedViews = summary.recommendedSide === 'left' ? leftViews : rightViews;
  const recommendedSolarEvents = summary.recommendedSide === 'left' ? leftSolarEvents : rightSolarEvents;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Recommendation */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-blue-900">
            <Sparkles className="w-5 h-5 mr-2" />
            {recommendedSide} Side Recommended
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-blue-800">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-medium">
                {Math.round(result.routeDistance)} km • {formatDuration(result.flightDuration)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Left Score: <span className="font-semibold">{summary.leftScore}</span></div>
              <div>Right Score: <span className="font-semibold">{summary.rightScore}</span></div>
            </div>
          </div>
          
          {/* Top Reason */}
          {summary.reasoning.length > 0 && (
            <div className="p-2 bg-white/50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">{summary.reasoning[0]}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scenic Views */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Mountain className="w-4 h-4 mr-2 text-green-600" />
            Top Scenic Views ({recommendedViews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedViews.length > 0 ? (
            <div className="space-y-2">
              {recommendedViews.slice(0, 3).map((view, index) => (
                <div key={index} className="flex items-start justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{view.name}</div>
                    <div className="text-gray-600 text-xs mt-0.5">
                      {view.distanceFromRoute}km • {view.type}
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 text-xs rounded border ${getVisibilityBadge(view.visibility)} ml-2 shrink-0`}>
                    {view.visibility}
                  </span>
                </div>
              ))}
              {recommendedViews.length > 3 && (
                <div className="text-xs text-gray-500 text-center py-1">
                  +{recommendedViews.length - 3} more locations
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-500 py-2">No scenic views on this side</div>
          )}
        </CardContent>
      </Card>

      {/* Solar Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Sun className="w-4 h-4 mr-2 text-orange-500" />
            Solar Events ({recommendedSolarEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedSolarEvents.length > 0 ? (
            <div className="space-y-2">
              {recommendedSolarEvents.slice(0, 3).map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{event.type}</div>
                    <div className="text-gray-600 text-xs">
                      {event.time} • {event.progress}%
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 text-xs rounded border ${getVisibilityBadge(event.visibility)} ml-2`}>
                    {event.visibility}
                  </span>
                </div>
              ))}
              {recommendedSolarEvents.length > 3 && (
                <div className="text-xs text-gray-500 text-center py-1">
                  +{recommendedSolarEvents.length - 3} more events
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-500 py-2">No solar events on this side</div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-purple-600" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-green-50 rounded border border-green-200">
              <div className="text-base font-bold text-green-600">
                {result.detailedScenicLocations.filter(l => l.visibility === 'excellent').length}
              </div>
              <div className="text-green-700">Excellent Views</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded border border-orange-200">
              <div className="text-base font-bold text-orange-600">
                {result.detailedSolarEvents.filter(e => e.type === 'sunrise' || e.type === 'sunset').length}
              </div>
              <div className="text-orange-700">Sunrise/Sunset</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
