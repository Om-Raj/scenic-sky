// Demo page showcasing the seat recommendation feature
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SeatRecommendationDisplay } from '@/components/SeatRecommendation';
import { useSeatRecommendation } from '@/hooks/useSeatRecommendation';
import type { SeatRecommendationInput } from '@/lib/seat-recommendation-types';
import { DEMO_AIRPORTS } from '@/lib/gis';

const AIRPLANE_MODELS = [
  'Boeing 737',
  'Airbus A320',
  'Boeing 787',
  'Airbus A350',
  'Boeing 777',
  'Airbus A380',
];

export default function SeatRecommendationDemo() {
  const [formData, setFormData] = useState<SeatRecommendationInput>({
    airplaneModel: 'Boeing 737',
    departureDate: '2024-12-15',
    departureTime: '10:00',
    arrivalDate: '2024-12-15',
    arrivalTime: '18:00',
    departureAirportCode: 'JFK',
    arrivalAirportCode: 'LHR',
  });

  const {
    result,
    loading,
    error,
    recommendationSummary,
    generateRecommendation,
    reset,
  } = useSeatRecommendation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateRecommendation(formData);
  };

  const handleInputChange = (field: keyof SeatRecommendationInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadPresetRoute = (preset: 'transatlantic' | 'transpacific' | 'polar') => {
    const presets = {
      transatlantic: {
        departureAirportCode: 'JFK',
        arrivalAirportCode: 'LHR',
        departureDate: '2024-12-15',
        departureTime: '22:00',
        arrivalDate: '2024-12-16',
        arrivalTime: '10:00',
      },
      transpacific: {
        departureAirportCode: 'LAX',
        arrivalAirportCode: 'DEL',
        departureDate: '2024-12-15',
        departureTime: '14:00',
        arrivalDate: '2024-12-16',
        arrivalTime: '20:30',
      },
      polar: {
        departureAirportCode: 'JFK',
        arrivalAirportCode: 'DXB',
        departureDate: '2024-12-15',
        departureTime: '23:30',
        arrivalDate: '2024-12-16',
        arrivalTime: '18:00',
      },
    };

    setFormData(prev => ({ ...prev, ...presets[preset] }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Flight Seat Recommendation</h1>
        <p className="text-gray-600">
          Get personalized seat recommendations based on scenic views and solar events along your flight path.
        </p>
      </div>

      {/* Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Flight Details</CardTitle>
          <CardDescription>
            Enter your flight information to get seat recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Presets */}
            <div>
              <Label className="text-sm font-medium">Quick Presets</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadPresetRoute('transatlantic')}
                >
                  JFK → LHR (Night Flight)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadPresetRoute('transpacific')}
                >
                  LAX → DEL (Day Flight)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadPresetRoute('polar')}
                >
                  JFK → DXB (Red-eye)
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Airplane Model */}
              <div>
                <Label htmlFor="airplane">Airplane Model</Label>
                <Select
                  value={formData.airplaneModel}
                  onValueChange={(value) => handleInputChange('airplaneModel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select aircraft" />
                  </SelectTrigger>
                  <SelectContent>
                    {AIRPLANE_MODELS.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Departure Airport */}
              <div>
                <Label htmlFor="departure">Departure Airport</Label>
                <Select
                  value={formData.departureAirportCode}
                  onValueChange={(value) => handleInputChange('departureAirportCode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select departure" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_AIRPORTS.map((airport) => (
                      <SelectItem key={airport.code} value={airport.code}>
                        {airport.code} - {airport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Arrival Airport */}
              <div>
                <Label htmlFor="arrival">Arrival Airport</Label>
                <Select
                  value={formData.arrivalAirportCode}
                  onValueChange={(value) => handleInputChange('arrivalAirportCode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select arrival" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_AIRPORTS.map((airport) => (
                      <SelectItem key={airport.code} value={airport.code}>
                        {airport.code} - {airport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Departure Date */}
              <div>
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  required
                />
              </div>

              {/* Departure Time */}
              <div>
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                  id="departureTime"
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => handleInputChange('departureTime', e.target.value)}
                  required
                />
              </div>

              {/* Arrival Date */}
              <div>
                <Label htmlFor="arrivalDate">Arrival Date</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                  required
                />
              </div>

              {/* Arrival Time */}
              <div className="md:col-span-2 lg:col-span-1">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Analyzing Route...' : 'Get Seat Recommendation'}
              </Button>
              {result && (
                <Button type="button" variant="outline" onClick={reset}>
                  Reset
                </Button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing flight path and calculating scenic views...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <SeatRecommendationDisplay result={result} />
      )}

      {/* Feature Info */}
      {!result && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🏔️ Scenic Location Detection</h4>
                <p className="text-sm text-gray-600">
                  We analyze the great circle flight path and identify scenic locations within viewing distance:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                  <li>Mountains & volcanoes (within 100km)</li>
                  <li>Cities, oceans & landmarks (within 50km)</li>
                  <li>Determines left/right side visibility</li>
                  <li>Ranks by distance and popularity</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🌅 Solar Event Calculation</h4>
                <p className="text-sm text-gray-600">
                  Using precise astronomical calculations, we determine:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                  <li>Sunrise and sunset timing along route</li>
                  <li>Golden hour and blue hour periods</li>
                  <li>Sun position relative to aircraft heading</li>
                  <li>Visibility at cruising altitude</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Try different routes and times to see how seat recommendations change.
                Night flights often offer better stargazing, while day flights provide scenic landscape views.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
