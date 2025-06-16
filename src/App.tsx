
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTopOnRefresh from "@/components/ui/ScrollToTopOnRefresh";

const queryClient = new QueryClient();

const Index = lazy(() => import("./pages/Index"));
const Box = lazy(() => import("./pages/Box"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NeverGetSick = lazy(() => import("./pages/NeverGetSick"));

const App = () => {
  // Enhanced subdomain detection with multiple checks
  const currentHostname = window.location.hostname;
  const currentHref = window.location.href;
  
  // Multiple ways to detect the nevergetsick subdomain
  const isNeverGetSickSubdomain = 
    currentHostname === 'nevergetsick.fitanywhere.today' ||
    currentHostname.startsWith('nevergetsick.') ||
    currentHref.includes('nevergetsick.fitanywhere.today');
  
  // Enhanced debug logging
  console.log('=== SUBDOMAIN DETECTION DEBUG ===');
  console.log('Current hostname:', currentHostname);
  console.log('Current href:', currentHref);
  console.log('Is NeverGetSick subdomain:', isNeverGetSickSubdomain);
  console.log('================================');

  // FORCE RENDER for nevergetsick subdomain - NO ROUTING, JUST THE ARTICLE
  if (isNeverGetSickSubdomain) {
    console.log('🔥 FORCING NeverGetSick subdomain render - NO HOMEPAGE!');
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-white">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading article...</div>}>
              <NeverGetSick />
            </Suspense>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  console.log('Rendering main domain version with full routing');
  // For the main domain, show the regular routes
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ScrollToTopOnRefresh />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/box" element={<Box />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/NeverGetSick" element={<NeverGetSick />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
