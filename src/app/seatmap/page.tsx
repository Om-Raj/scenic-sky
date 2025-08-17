import { Suspense } from 'react';
import SeatmapPageContent from './SeatmapPageContent';

export default function SeatmapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading seatmap...</div>}>
      <SeatmapPageContent />
    </Suspense>
  );
}
