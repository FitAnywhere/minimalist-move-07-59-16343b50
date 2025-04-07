
import { useEffect, useRef, lazy, Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ChatbotHelper from '@/components/ChatbotHelper';

// Import critical components eagerly instead of lazy loading
import ProductIntro from '@/components/ProductIntro';
// Import ChampionSection eagerly as well to avoid dynamic import errors
import ChampionSection from '@/components/ChampionSection';
import TrainingVault from '@/components/TrainingVault';
import LimitedOfferSection from '@/components/LimitedOfferSection';

// Continue lazy loading other components with better error boundaries and loading fallbacks
const ProductTabs = lazy(() => import('@/components/ProductTabs'));
const LifestyleSection = lazy(() => 
  import('@/components/LifestyleSection').catch(err => {
    console.error('Failed to load LifestyleSection:', err);
    return { default: () => <div className="min-h-[400px]">Loading content...</div> };
  })
);
const BundleOffer = lazy(() => 
  import('@/components/BundleOffer').catch(err => {
    console.error('Failed to load BundleOffer:', err);
    return { default: () => <div className="min-h-[400px]">Loading content...</div> };
  })
);
const TestimonialsCarousel = lazy(() => 
  import('@/components/TestimonialsCarousel').catch(err => {
    console.error('Failed to load TestimonialsCarousel:', err);
    return { default: () => <div className="min-h-[400px]">Loading content...</div> };
  })
);
const TimeAndCostCalculator = lazy(() => 
  import('@/components/TimeAndCostCalculator').catch(err => {
    console.error('Failed to load TimeAndCostCalculator:', err);
    return { default: () => <div className="min-h-[400px]">Loading content...</div> };
  })
);
const TargetAndFAQ = lazy(() => 
  import('@/components/TargetAndFAQ').catch(err => {
    console.error('Failed to load TargetAndFAQ:', err);
    return { default: () => <div className="min-h-[400px]">Loading content...</div> };
  })
);
const CallToAction = lazy(() => 
  import('@/components/CallToAction').catch(err => {
    console.error('Failed to load CallToAction:', err);
    return { default: () => <div className="min-h-[400px]">Loading content...</div> };
  })
);
const Footer = lazy(() => 
  import('@/components/Footer').catch(err => {
    console.error('Failed to load Footer:', err);
    return { default: () => <div className="min-h-[400px]">Loading content...</div> };
  })
);

// Better loading fallback with reduced CLS (Cumulative Layout Shift)
const SectionLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Critical videos to preload with proper timing
const CRITICAL_VIDEOS = [
  '1067255623', // Hero video
  '1067257145', // TRX video
  '1067257124', // Bands video 
  '1067256372', // Testimonial videos
  '1067256325',
  '1067256399',
  '1073152410', // TrainingVault video
];

const Index = () => {
  const location = useLocation();
  const initialLoadRef = useRef(true);
  const vimeoAPILoadedRef = useRef(false);
  const [sectionsInView, setSectionsInView] = useState({});
  
  useEffect(() => {
    // Preload Vimeo player API
    const preloadVimeoAPI = () => {
      if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]') && !vimeoAPILoadedRef.current) {
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        script.id = 'vimeo-player-api';
        
        script.onload = () => {
          console.log("Vimeo Player API loaded");
          vimeoAPILoadedRef.current = true;
          
          // Once API is loaded, preload critical videos
          preloadCriticalVideos();
        };
        
        script.onerror = () => {
          console.error("Failed to load Vimeo Player API");
          
          // Retry loading after a delay
          setTimeout(() => {
            const failedScript = document.getElementById('vimeo-player-api');
            if (failedScript) failedScript.remove();
            preloadVimeoAPI();
          }, 2000);
        };
        
        document.head.appendChild(script);
      } else if (vimeoAPILoadedRef.current) {
        // If API is already loaded, preload videos
        preloadCriticalVideos();
      }
    };
    
    // Add preload hints for critical videos
    const preloadCriticalVideos = () => {
      CRITICAL_VIDEOS.forEach((id, index) => {
        const existingLink = document.querySelector(`link[href*="${id}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          
          // Use appropriate preload strategy based on importance
          if (index === 0) {
            link.rel = 'preload';
            link.as = 'fetch';
            // Fix: Remove the importance attribute which isn't supported in TypeScript's HTMLLinkElement
            // Use dataset instead for custom attributes
            link.dataset.importance = 'high';
          } else {
            link.rel = 'prefetch';
            link.as = 'fetch';
            // Fix: Remove the importance attribute which isn't supported in TypeScript's HTMLLinkElement
            link.dataset.importance = 'low';
          }
          
          link.href = `https://player.vimeo.com/video/${id}`;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
          
          console.log(`Preloaded video: ${id}`);
        }
      });
    };
    
    // Add scale keyframes for carousel arrows
    const addScaleKeyframes = () => {
      if (!document.querySelector('#scale-keyframes')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'scale-keyframes';
        styleSheet.textContent = `
          @keyframes scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          
          .scale-animation {
            animation: scale 8s ease-in-out infinite;
          }
          
          @keyframes pulse-yellow {
            0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
          }
          
          .button-retry-pulse {
            animation: pulse-yellow 2s infinite;
          }
        `;
        document.head.appendChild(styleSheet);
      }
    };
    
    // Execute preloads with requestIdleCallback for better performance
    if (window.requestIdleCallback) {
      requestIdleCallback(() => {
        preloadVimeoAPI();
        addScaleKeyframes();
      }, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        preloadVimeoAPI();
        addScaleKeyframes();
      }, 100);
    }
    
    // Set up intersection observer for section loading
    const observeSections = () => {
      const options = {
        root: null,
        rootMargin: '200px 0px', // Load 200px before section comes into view
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setSectionsInView(prev => ({ ...prev, [id]: true }));
            
            // Once loaded, stop observing
            observer.unobserve(entry.target);
          }
        });
      }, options);
      
      // Observe all main sections
      ['product', 'lifestyle', 'bundle', 'reviews', 'training-vault'].forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
      
      return () => observer.disconnect();
    };
    
    // Start observing after a short delay to allow initial render
    const observerTimer = setTimeout(observeSections, 500);
    
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
      clearTimeout(observerTimer);
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
      
      {/* Training Vault section */}
      <div id="training-vault">
        <TrainingVault />
      </div>
      
      <Suspense fallback={<SectionLoader />}>
        {/* Testimonials section (Why They Love It) */}
        <div id="reviews">
          <TestimonialsCarousel />
        </div>
        
        {/* LifestyleSection (Become Workout Addict) moved here - after testimonials */}
        <div id="lifestyle">
          <LifestyleSection />
        </div>
        
        {/* Bundle Offer (Your Lifetime Investment) */}
        <div id="bundle">
          <BundleOffer />
        </div>
        
        {/* Add the new independent Limited Offer section */}
        <LimitedOfferSection />
        
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
