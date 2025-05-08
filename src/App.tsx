
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTopOnRefresh from "@/components/ui/ScrollToTopOnRefresh";
import Index from "./pages/Index";
import Box from "./pages/Box";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Custom Router wrapper to handle initial route path restoration
const RouterWithPathRestoration = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Check if there's any route path that needs to be restored
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      console.log("Found redirect path, restoring to:", redirectPath);
      // Clear the stored path immediately to prevent loops
      sessionStorage.removeItem('redirectPath');
      
      // Allow the initial render to complete then restore the path
      setTimeout(() => {
        window.history.replaceState(null, null, redirectPath);
      }, 0);
    }
  }, []);

  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
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

export default App;
