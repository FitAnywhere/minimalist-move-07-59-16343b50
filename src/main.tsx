
import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react'
import './index.css'
import './types/voiceflow.d.ts'

// Preload critical resources
const preloadCriticalResources = () => {
  // Preconnect to important domains
  const preconnects = [
    'https://player.vimeo.com',
    'https://i.vimeocdn.com',
    'https://f.vimeocdn.com',
    'https://i.pravatar.cc'
  ];
  
  preconnects.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
  
  // Set fetchpriority for key images
  document.querySelectorAll('img').forEach(img => {
    if (img.getBoundingClientRect().top < window.innerHeight) {
      (img as HTMLImageElement).fetchPriority = 'high';
    }
  });
};

// Lazy load App for better initial load time
const App = lazy(() => import('./App.tsx'));

// Simple loader while App is loading
const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-12 h-12 border-4 border-yellow rounded-full border-t-transparent animate-spin"></div>
  </div>
);

// Execute preloading
preloadCriticalResources();

// Render the app
createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<AppLoader />}>
    <App />
  </Suspense>
);
