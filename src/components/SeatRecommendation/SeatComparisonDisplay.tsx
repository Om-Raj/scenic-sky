// Side-by-side seat recommendation comparison for seatmap page
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SeatRecommendationResult } from '@/lib/seat-recommendation-types';
import { 
  getPrioritizedScenicViews, 
  getFormattedSolarEvents,
  generateRecommendationSummary 
} from '@/lib/seat-recommendation-engine';
import { Sparkles, Mountain, Sun, Clock, MapPin, ArrowLeft, ArrowRight, Star } from 'lucide-react';

interface SeatComparisonDisplayProps {
  result: SeatRecommendationResult;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * Side-by-side comparison of left vs right seat recommendations for seatmap page
 */
export function SeatComparisonDisplay({ 
  result, 
  loading = false,
  error = null,
  className 
}: SeatComparisonDisplayProps) {
  if (loading) {
    return (
      <div className={`h-full ${className}`}>
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
              Analyzing Scenic Views...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Calculating scenic views and solar events along your flight path...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-full ${className}`}>
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center text-red-600">
              <Sparkles className="w-5 h-5 mr-2" />
              Analysis Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summary = generateRecommendationSummary(result);
  
  // Sort scenic views by quality (excellent > good > fair > poor)
  const qualityOrder: Record<string, number> = { excellent: 4, good: 3, fair: 2, poor: 1 };
  const leftViews = getPrioritizedScenicViews(result, 'left')
    .sort((a, b) => (qualityOrder[b.visibility] || 0) - (qualityOrder[a.visibility] || 0));
  const rightViews = getPrioritizedScenicViews(result, 'right')
    .sort((a, b) => (qualityOrder[b.visibility] || 0) - (qualityOrder[a.visibility] || 0));
  
  // Sort solar events by quality (excellent > good > fair > poor)
  const leftSolarEvents = getFormattedSolarEvents(result, 'left')
    .sort((a, b) => (qualityOrder[b.visibility] || 0) - (qualityOrder[a.visibility] || 0));
  const rightSolarEvents = getFormattedSolarEvents(result, 'right')
    .sort((a, b) => (qualityOrder[b.visibility] || 0) - (qualityOrder[a.visibility] || 0));

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

  const getScoreColor = (score: number, isRecommended: boolean): string => {
    if (isRecommended) {
      return 'text-green-600 font-bold';
    }
    return score >= 7 ? 'text-blue-600' : score >= 4 ? 'text-yellow-600' : 'text-gray-600';
  };

  return (
    <div className={`h-full overflow-y-auto space-y-4 ${className}`}>
      {/* Main Recommendation Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center justify-between text-blue-900">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Seat Recommendation
            </div>
            <div className="text-sm font-normal text-blue-700">
              {Math.round(result.routeDistance)} km • {formatDuration(result.flightDuration)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 mb-2">
              {summary.recommendedSide === 'left' ? '← Left Side' : 'Right Side →'} Recommended
            </div>
            <div className="text-sm text-blue-800 mb-3">
              {summary.reasoning[0] || 'Based on scenic views and solar events'}
            </div>
            <div className="flex justify-center space-x-8 text-sm">
              <div className={`text-center ${summary.recommendedSide === 'left' ? 'font-bold' : ''}`}>
                <div className={getScoreColor(summary.leftScore, summary.recommendedSide === 'left')}>
                  {summary.leftScore}
                </div>
                <div className="text-gray-600">Left Score</div>
              </div>
              <div className={`text-center ${summary.recommendedSide === 'right' ? 'font-bold' : ''}`}>
                <div className={getScoreColor(summary.rightScore, summary.recommendedSide === 'right')}>
                  {summary.rightScore}
                </div>
                <div className="text-gray-600">Right Score</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100%-200px)]">
        {/* Left Side */}
        <Card className={`h-full ${summary.recommendedSide === 'left' ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2 text-blue-600" />
              Left Side
              {summary.recommendedSide === 'left' && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  ⭐ Best
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 h-full overflow-y-auto pb-4">
            {/* Scenic Views */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center">
                <Mountain className="w-4 h-4 mr-1 text-green-600" />
                Scenic Views ({leftViews.length})
              </h4>
              {leftViews.length > 0 ? (
                <div className="space-y-2">
                  {leftViews.slice(0, 4).map((view, index) => (
                    <div key={index} className="p-2 bg-white rounded border text-xs">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{view.name}</div>
                          <div className="text-gray-600 text-xs">
                            {Math.round(view.distanceFromRoute)}km • {view.type} • Journey Completed: {Math.round(view.routeProgress * 100)}%
                          </div>
                        </div>
                        <span className={`px-1.5 py-0.5 text-xs rounded border ${getVisibilityBadge(view.visibility)} ml-2 shrink-0`}>
                          {view.visibility}
                        </span>
                      </div>
                    </div>
                  ))}
                  {leftViews.length > 4 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{leftViews.length - 4} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded">
                  No scenic views on this side
                </div>
              )}
            </div>

            {/* Solar Events */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center">
                <Sun className="w-4 h-4 mr-1 text-orange-500" />
                Solar Events ({leftSolarEvents.length})
              </h4>
              {leftSolarEvents.length > 0 ? (
                <div className="space-y-2">
                  {leftSolarEvents.slice(0, 3).map((event, index) => (
                    <div key={index} className="p-2 bg-white rounded border text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{event.type}</div>
                          <div className="text-gray-600 text-xs">
                            {event.time} • Journey Completed: {event.progress}%
                          </div>
                        </div>
                        <span className={`px-1.5 py-0.5 text-xs rounded border ${getVisibilityBadge(event.visibility)} ml-2`}>
                          {event.visibility}
                        </span>
                      </div>
                    </div>
                  ))}
                  {leftSolarEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{leftSolarEvents.length - 3} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded">
                  No solar events on this side
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side */}
        <Card className={`h-full ${summary.recommendedSide === 'right' ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              Right Side
              <ArrowRight className="w-4 h-4 ml-2 text-blue-600" />
              {summary.recommendedSide === 'right' && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  ⭐ Best
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 h-full overflow-y-auto pb-4">
            {/* Scenic Views */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center">
                <Mountain className="w-4 h-4 mr-1 text-green-600" />
                Scenic Views ({rightViews.length})
              </h4>
              {rightViews.length > 0 ? (
                <div className="space-y-2">
                  {rightViews.slice(0, 4).map((view, index) => (
                    <div key={index} className="p-2 bg-white rounded border text-xs">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{view.name}</div>
                          <div className="text-gray-600 text-xs">
                            {Math.round(view.distanceFromRoute)}km • {view.type} • Journey Completed: {Math.round(view.routeProgress * 100)}%
                          </div>
                        </div>
                        <span className={`px-1.5 py-0.5 text-xs rounded border ${getVisibilityBadge(view.visibility)} ml-2 shrink-0`}>
                          {view.visibility}
                        </span>
                      </div>
                    </div>
                  ))}
                  {rightViews.length > 4 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{rightViews.length - 4} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded">
                  No scenic views on this side
                </div>
              )}
            </div>

            {/* Solar Events */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center">
                <Sun className="w-4 h-4 mr-1 text-orange-500" />
                Solar Events ({rightSolarEvents.length})
              </h4>
              {rightSolarEvents.length > 0 ? (
                <div className="space-y-2">
                  {rightSolarEvents.slice(0, 3).map((event, index) => (
                    <div key={index} className="p-2 bg-white rounded border text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{event.type}</div>
                          <div className="text-gray-600 text-xs">
                            {event.time} • Journey Completed: {event.progress}%
                          </div>
                        </div>
                        <span className={`px-1.5 py-0.5 text-xs rounded border ${getVisibilityBadge(event.visibility)} ml-2`}>
                          {event.visibility}
                        </span>
                      </div>
                    </div>
                  ))}
                  {rightSolarEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{rightSolarEvents.length - 3} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-500 py-4 text-center bg-gray-50 rounded">
                  No solar events on this side
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-4 gap-4 text-center text-xs">
            <div className="p-2 bg-green-50 rounded border border-green-200">
              <div className="text-lg font-bold text-green-600">
                {result.detailedScenicLocations.filter(l => l.visibility === 'excellent').length}
              </div>
              <div className="text-green-700">Excellent Views</div>
            </div>
            <div className="p-2 bg-blue-50 rounded border border-blue-200">
              <div className="text-lg font-bold text-blue-600">
                {result.detailedScenicLocations.filter(l => l.type === 'mountain' || l.type === 'volcano').length}
              </div>
              <div className="text-blue-700">Mountains</div>
            </div>
            <div className="p-2 bg-orange-50 rounded border border-orange-200">
              <div className="text-lg font-bold text-orange-600">
                {result.detailedSolarEvents.filter(e => e.type === 'sunrise' || e.type === 'sunset').length}
              </div>
              <div className="text-orange-700">Sunrise/Sunset</div>
            </div>
            <div className="p-2 bg-purple-50 rounded border border-purple-200">
              <div className="text-lg font-bold text-purple-600">
                {result.detailedSolarEvents.filter(e => e.type === 'golden-hour').length}
              </div>
              <div className="text-purple-700">Golden Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
