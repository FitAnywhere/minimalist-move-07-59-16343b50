
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

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTopOnRefresh />
          <FloatingWhatsAppButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/box" element={<Box />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
