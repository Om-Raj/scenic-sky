import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DEMO_AIRPORTS } from '@/lib/gis';
import type { FlightFormData } from '@/lib/types';

interface HeroFormProps {
  onSubmit: (data: FlightFormData) => void;
  isLoading?: boolean;
}

const AIRPLANE_MODELS = ['Boeing 737', 'Airbus A320', 'A380 Demo', 'Cessna 172'];

export function HeroForm({ onSubmit, isLoading = false }: HeroFormProps) {
  const [formData, setFormData] = useState<FlightFormData>({
    airplaneModel: '',
    departureDate: new Date().toISOString().split('T')[0], // Today's date
    departureTime: '12:00', // Default time
    arrivalDate: new Date().toISOString().split('T')[0], // Today's date
    arrivalTime: '15:00', // Default arrival time (3 hours later)
    departure: '',
    arrival: '',
  });

  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation: ensure arrival !== departure
    if (formData.departure === formData.arrival) {
      setError('Departure and arrival airports must be different');
      return;
    }

    if (!formData.departure || !formData.arrival || !formData.airplaneModel) {
      setError('Please fill in all required fields');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Airplane Model */}
          <div className="space-y-2">
            <Label htmlFor="airplane-model">Aircraft Model</Label>
            <Select
              value={formData.airplaneModel}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, airplaneModel: value }))}
            >
              <SelectTrigger id="airplane-model">
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

          {/* Departure Date */}
          <div className="space-y-2">
            <Label htmlFor="departure-date">Departure Date</Label>
            <Input
              id="departure-date"
              type="date"
              value={formData.departureDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
            />
          </div>

          {/* Departure Time */}
          <div className="space-y-2">
            <Label htmlFor="departure-time">Departure Time</Label>
            <Input
              id="departure-time"
              type="time"
              value={formData.departureTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, departureTime: e.target.value }))}
            />
          </div>

          {/* Arrival Date */}
          <div className="space-y-2">
            <Label htmlFor="arrival-date">Arrival Date</Label>
            <Input
              id="arrival-date"
              type="date"
              value={formData.arrivalDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, arrivalDate: e.target.value }))}
            />
          </div>

          {/* Action Button - spans remaining space on large screens */}
          <div className="space-y-2 lg:flex lg:items-end">
            <Button type="submit" disabled={isLoading} className="w-full lg:h-10">
              {isLoading ? 'Processing...' : 'Plan Flight Route'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Arrival Time */}
          <div className="space-y-2">
            <Label htmlFor="arrival-time">Arrival Time</Label>
            <Input
              id="arrival-time"
              type="time"
              value={formData.arrivalTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, arrivalTime: e.target.value }))}
            />
          </div>

          {/* Departure Airport */}
          <div className="space-y-2">
            <Label htmlFor="departure">Departure Airport</Label>
            <Select
              value={formData.departure}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, departure: value }))}
            >
              <SelectTrigger id="departure">
                <SelectValue placeholder="Select departure airport" />
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
          <div className="space-y-2">
            <Label htmlFor="arrival">Arrival Airport</Label>
            <Select
              value={formData.arrival}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, arrival: value }))}
            >
              <SelectTrigger id="arrival">
                <SelectValue placeholder="Select arrival airport" />
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
        </div>

        {/* Error Display */}
        {error && (
          <div
            className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
            role="alert"
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
