
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
  // Check if we're on the nevergetsick subdomain
  const currentHostname = window.location.hostname;
  const isNeverGetSickSubdomain = currentHostname === 'nevergetsick.fitanywhere.today';
  
  // Debug logging
  console.log('Current hostname:', currentHostname);
  console.log('Is NeverGetSick subdomain:', isNeverGetSickSubdomain);

  if (isNeverGetSickSubdomain) {
    console.log('Rendering NeverGetSick subdomain version');
    // For the nevergetsick subdomain, show only the article
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTopOnRefresh />
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<NeverGetSick />} />
                <Route path="*" element={<NeverGetSick />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  console.log('Rendering main domain version');
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
