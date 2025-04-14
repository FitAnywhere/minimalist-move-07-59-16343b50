
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import ScrollToTopOnRefresh from "@/components/ui/ScrollToTopOnRefresh";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";

// TypeScript safe declarations
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if ((f as any).fbq) return;
      n = (f as any).fbq = function () {
        (n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments));
      };
      if (!(f as any)._fbq) (f as any)._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode!.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    if (typeof window.fbq === 'function') {
      window.fbq('init', '1271374844408612');
      window.fbq('track', 'PageView');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTopOnRefresh />
          <Routes>
            <Route path="/" element={<Index />} />
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
