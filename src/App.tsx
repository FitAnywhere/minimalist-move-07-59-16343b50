
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { lazy, Suspense } from "react";
import { addResourceHints } from "@/utils/resourceLoader";

// Lazy-loaded page components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-16 h-16 relative">
      <div className="w-16 h-16 rounded-full border-4 border-yellow/30 animate-pulse"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
);

// Setup query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Custom component to handle scroll to top on refresh
const ScrollToTopOnRefresh = () => {
  useEffect(() => {
    // Only execute on page load/refresh, not on navigation
    if (performance.navigation.type === 1 || !performance.navigation.type) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
};

// Initialize resource hints
const InitResourceHints = () => {
  useEffect(() => {
    // Add critical resource hints
    addResourceHints([
      { url: 'https://player.vimeo.com', type: 'preconnect' },
      { url: 'https://i.vimeocdn.com', type: 'preconnect' },
      { url: 'https://f.vimeocdn.com', type: 'preconnect' },
      { url: 'https://i.pravatar.cc', type: 'preconnect' },
      { url: 'https://fonts.googleapis.com', type: 'preconnect' },
      { url: 'https://fonts.gstatic.com', type: 'preconnect', as: 'font' }
    ]);
    
    // Preload Vimeo API
    const preloadVimeoAPI = document.createElement('link');
    preloadVimeoAPI.rel = 'preload';
    preloadVimeoAPI.as = 'script';
    preloadVimeoAPI.href = 'https://player.vimeo.com/api/player.js';
    document.head.appendChild(preloadVimeoAPI);
    
    // Add fetchpriority for critical resources
    document.querySelectorAll('img[src^="/"]').forEach(img => {
      if (img.getBoundingClientRect().top < window.innerHeight) {
        (img as HTMLImageElement).fetchPriority = 'high';
      }
    });
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTopOnRefresh />
        <InitResourceHints />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
