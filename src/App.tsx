
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import ScrollToTopOnRefresh from "@/components/ui/ScrollToTopOnRefresh";
import Index from "./pages/Index";
import Box from "./pages/Box";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import { useEffect, lazy, Suspense, useState } from "react";

// Create a QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Reduce retries for faster feedback
      refetchOnWindowFocus: false, // Disable automatic refetches on window focus for better performance
    },
  },
});

// Track page views with Facebook Pixel
const RouteChangeTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track PageView on route change
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);
  
  return null;
};

// Custom Router wrapper to handle initial route path restoration
const RouterWithPathRestoration = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRestored, setIsRestored] = useState(false);
  
  useEffect(() => {
    // Only run once
    if (isRestored) return;
    
    // Check if there's any route path that needs to be restored from sessionStorage
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      console.log("Found redirect path in session storage, restoring to:", redirectPath);
      
      // Clear the stored path immediately to prevent loops
      sessionStorage.removeItem('redirectPath');
      
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        console.log("Navigating to:", redirectPath);
        navigate(redirectPath, { replace: true });
        setIsRestored(true);
      });
    } else {
      setIsRestored(true);
    }
  }, [navigate, isRestored]);

  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <RouteChangeTracker />
          <RouterWithPathRestoration>
            <ScrollToTopOnRefresh />
            <FloatingWhatsAppButton />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/box" element={<Box />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouterWithPathRestoration>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Add TypeScript interface for fbq
declare global {
  interface Window {
    fbq: any;
  }
}

export default App;
