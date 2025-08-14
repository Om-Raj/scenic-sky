'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeroForm } from '@/components/HeroForm';
import type { FlightFormData } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check for error parameters in URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      switch (error) {
        case 'same-airports':
          setErrorMessage('Departure and arrival airports must be different');
          break;
        case 'invalid-route':
          setErrorMessage('Invalid flight route. Please check your airport selections');
          break;
        case 'missing-params':
          setErrorMessage('Missing flight parameters. Please fill out the form again');
          break;
        default:
          setErrorMessage('An error occurred. Please try again');
      }
      
      // Clear error message after 5 seconds
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Handle form submission to navigate to flight map route
  const handleFlightSubmit = useCallback(
    async (formData: FlightFormData) => {
      setIsLoading(true);
      setErrorMessage(''); // Clear any existing error

      try {
        // Additional validation
        if (formData.departure === formData.arrival) {
          setErrorMessage('Departure and arrival airports must be different');
          setIsLoading(false);
          return;
        }

        // Create URL parameters from form data
        const params = new URLSearchParams({
          airplaneModel: formData.airplaneModel,
          departureDate: formData.departureDate,
          departureTime: formData.departureTime,
          arrivalDate: formData.arrivalDate,
          arrivalTime: formData.arrivalTime,
          departure: formData.departure,
          arrival: formData.arrival,
        });

        // Navigate to flight map page with parameters
        router.push(`/flight-map?${params.toString()}`);
      } catch (error) {
        console.error('Error navigating to flight map:', error);
        setErrorMessage('An error occurred while processing your request. Please try again.');
        setIsLoading(false);
      }
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section with Form */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Scenic Sky Flight Planner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Plan and visualize great-circle flight paths between major airports. 
              Experience smooth flight animations on an interactive satellite map.
            </p>
          </div>
          
          <HeroForm onSubmit={handleFlightSubmit} isLoading={isLoading} />
          
          {/* Error Message Display */}
          {errorMessage && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {errorMessage}
            </div>
          )}
          
          {/* Feature highlights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white/80 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Great-Circle Routes</h3>
              <p className="text-gray-600">Optimal flight paths calculated using spherical geometry for the shortest distance between airports.</p>
            </div>
            
            <div className="p-6 bg-white/80 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interactive Animation</h3>
              <p className="text-gray-600">Watch aircraft travel along realistic flight paths with smooth animations and progress controls.</p>
            </div>
            
            <div className="p-6 bg-white/80 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Satellite Imagery</h3>
              <p className="text-gray-600">View flights over detailed satellite imagery with smooth zoom and pan controls for the full experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
