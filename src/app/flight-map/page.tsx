import { Suspense } from 'react';
import FlightMapPageContent from './FlightMapPageContent';

export default function FlightMapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading flight map...</div>}>
      <FlightMapPageContent />
    </Suspense>
  );
}
