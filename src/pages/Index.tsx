
import { useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ChatbotHelper from '@/components/ChatbotHelper';

// Import critical components eagerly instead of lazy loading
import ProductIntro from '@/components/ProductIntro';
// Import ChampionSection eagerly as well to avoid dynamic import errors
import ChampionSection from '@/components/ChampionSection';

// Continue lazy loading other components
const ProductTabs = lazy(() => import('@/components/ProductTabs'));
const LifestyleSection = lazy(() => import('@/components/LifestyleSection'));
const BundleOffer = lazy(() => import('@/components/BundleOffer'));
const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));
const TimeAndCostCalculator = lazy(() => import('@/components/TimeAndCostCalculator'));
const TargetAndFAQ = lazy(() => import('@/components/TargetAndFAQ'));
const CallToAction = lazy(() => import('@/components/CallToAction'));
const Footer = lazy(() => import('@/components/Footer'));

// Loading fallback
const SectionLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  const location = useLocation();
  const initialLoadRef = useRef(true);
  
  // Add preload for Vimeo API
  useEffect(() => {
    // Preload Vimeo player API
    const preloadVimeoAPI = () => {
      if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        document.body.appendChild(script);
      }
    };
    
    // Add preload hints for critical videos
    const addVideoPreloadHints = () => {
      const videoIds = [
        '1067255623', // Hero video - highest priority
        '1067257145', // TRX video
        '1067257124', // Bands video
        '1067256239', // Testimonial videos
        '1067256372',
        '1067256399'
      ];
      
      videoIds.forEach((id, index) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'fetch';
        link.href = `https://player.vimeo.com/video/${id}`;
        link.crossOrigin = 'anonymous';
        // Set highest priority for hero video
        link.setAttribute('importance', index === 0 ? 'high' : 'auto');
        document.head.appendChild(link);
      });
    };
    
    preloadVimeoAPI();
    addVideoPreloadHints();
    
    // Improved scroll handling
    const handleNavigation = () => {
      const handleTargetSection = (targetId: string) => {
        setTimeout(() => {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
              behavior: 'smooth'
            });
          }
        }, 800);
      };

      // Handle external navigation with state
      if (location.state?.fromExternalPage) {
        if (location.state.targetSection) {
          handleTargetSection(`#${location.state.targetSection}`);
        } else {
          window.scrollTo(0, 0);
        }
      } 
      // Handle URL hash on initial load
      else if (window.location.hash && initialLoadRef.current) {
        handleTargetSection(window.location.hash);
      }
      
      initialLoadRef.current = false;
    };
    
    handleNavigation();
    
    // Optimized anchor click handler with passive event
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.hostname === window.location.hostname) {
        e.preventDefault();
        
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
          
          history.pushState(null, '', anchor.hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick, { passive: false });
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [location]);
  
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      <div id="hero">
        <HeroSection />
      </div>
      
      {/* ProductIntro is now eagerly loaded */}
      <div id="product">
        <ProductIntro />
        <Suspense fallback={<SectionLoader />}>
          <ProductTabs />
        </Suspense>
      </div>
      
      {/* ChampionSection is now eagerly loaded */}
      <ChampionSection />
      
      <Suspense fallback={<SectionLoader />}>
        <div id="lifestyle">
          <LifestyleSection />
        </div>
        <div id="bundle">
          <BundleOffer />
        </div>
        <div id="reviews">
          <TestimonialsCarousel />
        </div>
        <TimeAndCostCalculator />
        <TargetAndFAQ />
        <CallToAction />
        <Footer />
      </Suspense>
      
      {/* Add ChatbotHelper component */}
      <ChatbotHelper />
    </div>
  );
};

export default Index;
