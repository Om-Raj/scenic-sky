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
import { AIRPORTS } from '@/lib/constants/airports';
import type { FlightFormData } from '@/lib/types';
import { AIRPLANE_MODELS } from '@/lib/constants/airplane-models';


interface HeroFormProps {
  onSubmit: (data: FlightFormData) => void;
  isLoading?: boolean;
}

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
        {/* Row 1 (Desktop): Departure Date & Time | Arrival Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Departure Date & Time */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="departure-date">Departure Date</Label>
                <Input
                  id="departure-date"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      departureDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departure-time">Departure Time</Label>
                <Input
                  id="departure-time"
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      departureTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Arrival Date & Time */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="arrival-date">Arrival Date</Label>
                <Input
                  id="arrival-date"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      arrivalDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrival-time">Arrival Time</Label>
                <Input
                  id="arrival-time"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      arrivalTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 (Desktop): Departure Airport | Arrival Airport | Aircraft Model */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Departure Airport */}
          <div className="space-y-2">
            <Label htmlFor="departure">Departure Airport</Label>
            <Select
              value={formData.departure}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, departure: value }))
              }
            >
              <SelectTrigger id="departure">
                <SelectValue placeholder="Select departure airport" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md rounded-md">
                {AIRPORTS.map((airport) => (
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
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, arrival: value }))
              }
            >
              <SelectTrigger id="arrival">
                <SelectValue placeholder="Select arrival airport" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md rounded-md">
                {AIRPORTS.map((airport) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.code} - {airport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Aircraft Model */}
          <div className="space-y-2">
            <Label htmlFor="airplane-model">Aircraft Model</Label>
            <Select
              value={formData.airplaneModel}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, airplaneModel: value }))
              }
            >
              <SelectTrigger id="airplane-model">
                <SelectValue placeholder="Select aircraft" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md rounded-md">
                {AIRPLANE_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Display (above submit) */}
        {error && (
          <div
            className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Row 3: Submit button (always last) */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white w-full"
          >
            {isLoading ? 'Processing...' : 'Plan Flight Route'}
          </Button>
        </div>
      </form>
    </div>
  );
}
