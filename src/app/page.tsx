import { Suspense } from 'react';
import HomePageContent from './HomePageContent';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
