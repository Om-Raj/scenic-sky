// Seat recommendation display component
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SeatRecommendationResult } from '@/lib/seat-recommendation-types';
import { 
  getPrioritizedScenicViews, 
  getFormattedSolarEvents,
  generateRecommendationSummary 
} from '@/lib/seat-recommendation-engine';

interface SeatRecommendationDisplayProps {
  result: SeatRecommendationResult;
  className?: string;
}

/**
 * Display component for seat recommendations with scenic views and solar events
 */
export function SeatRecommendationDisplay({ 
  result, 
  className 
}: SeatRecommendationDisplayProps) {
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

  const getVisibilityColor = (visibility: string): string => {
    switch (visibility) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getVisibilityBadge = (visibility: string): string => {
    switch (visibility) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Flight Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Flight Overview
            <span className="text-sm font-normal text-gray-500">
              {Math.round(result.routeDistance)} km • {formatDuration(result.flightDuration)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Scenic Locations:</strong> {result.detailedScenicLocations.length} visible
            </div>
            <div>
              <strong>Solar Events:</strong> {result.detailedSolarEvents.length} events
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Summary */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">
            🎯 Recommended: {summary.recommendedSide === 'left' ? 'Left' : 'Right'} Side
          </CardTitle>
          <CardDescription className="text-blue-700">
            Based on scenic views and solar events along your route
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {summary.reasoning.map((reason, index) => (
              <div key={index} className="flex items-center text-sm text-blue-800">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                {reason}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span>Left Score: <strong>{summary.leftScore}</strong></span>
            <span>Right Score: <strong>{summary.rightScore}</strong></span>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side */}
        <Card className={summary.recommendedSide === 'left' ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center">
              ←️ Left Side
              {summary.recommendedSide === 'left' && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Recommended
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scenic Views */}
            <div>
              <h4 className="font-semibold mb-2">Scenic Views ({leftViews.length})</h4>
              {leftViews.length > 0 ? (
                <div className="space-y-2">
                  {leftViews.slice(0, 5).map((view, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">{view.name}</div>
                          <div className="text-gray-600 text-xs">{view.description}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            {view.distanceFromRoute}km • {view.type}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getVisibilityBadge(view.visibility)}`}>
                          {view.visibility}
                        </span>
                      </div>
                    </div>
                  ))}
                  {leftViews.length > 5 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{leftViews.length - 5} more locations
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No scenic views on this side</div>
              )}
            </div>

            {/* Solar Events */}
            <div>
              <h4 className="font-semibold mb-2">Solar Events ({leftSolarEvents.length})</h4>
              {leftSolarEvents.length > 0 ? (
                <div className="space-y-2">
                  {leftSolarEvents.map((event, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{event.type}</div>
                          <div className="text-gray-600 text-xs">
                            {event.time} • {event.progress}% through flight
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getVisibilityBadge(event.visibility)}`}>
                          {event.visibility}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No solar events on this side</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side */}
        <Card className={summary.recommendedSide === 'right' ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center">
              Right Side ➡️
              {summary.recommendedSide === 'right' && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Recommended
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scenic Views */}
            <div>
              <h4 className="font-semibold mb-2">Scenic Views ({rightViews.length})</h4>
              {rightViews.length > 0 ? (
                <div className="space-y-2">
                  {rightViews.slice(0, 5).map((view, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium">{view.name}</div>
                          <div className="text-gray-600 text-xs">{view.description}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            {view.distanceFromRoute}km • {view.type}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getVisibilityBadge(view.visibility)}`}>
                          {view.visibility}
                        </span>
                      </div>
                    </div>
                  ))}
                  {rightViews.length > 5 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{rightViews.length - 5} more locations
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No scenic views on this side</div>
              )}
            </div>

            {/* Solar Events */}
            <div>
              <h4 className="font-semibold mb-2">Solar Events ({rightSolarEvents.length})</h4>
              {rightSolarEvents.length > 0 ? (
                <div className="space-y-2">
                  {rightSolarEvents.map((event, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{event.type}</div>
                          <div className="text-gray-600 text-xs">
                            {event.time} • {event.progress}% through flight
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getVisibilityBadge(event.visibility)}`}>
                          {event.visibility}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No solar events on this side</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {result.detailedScenicLocations.filter(l => l.visibility === 'excellent').length}
              </div>
              <div className="text-gray-600">Excellent Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {result.detailedScenicLocations.filter(l => l.type === 'mountain' || l.type === 'volcano').length}
              </div>
              <div className="text-gray-600">Mountains/Volcanoes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {result.detailedSolarEvents.filter(e => e.type === 'sunrise' || e.type === 'sunset').length}
              </div>
              <div className="text-gray-600">Sunrise/Sunset</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {result.detailedSolarEvents.filter(e => e.type === 'golden-hour').length}
              </div>
              <div className="text-gray-600">Golden Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
