
import { useEffect, useRef, lazy, Suspense, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ChatbotHelper from '@/components/ChatbotHelper';
import { preloadVimeoVideo } from '@/utils/videoLoader';
import { addResourceHints } from '@/utils/resourceLoader';

// Import critical components eagerly
import ProductIntro from '@/components/ProductIntro';
import ChampionSection from '@/components/ChampionSection';

// Better loading fallback with reduced CLS
const SectionLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lazy load non-critical components
const ProductTabs = lazy(() => import('@/components/ProductTabs'));
const TrainingVault = lazy(() => import('@/components/TrainingVault'));
const WorkoutAddictSection = lazy(() => import('@/components/WorkoutAddictSection'));
const LifestyleSection = lazy(() => import('@/components/LifestyleSection'));
const BundleOffer = lazy(() => import('@/components/BundleOffer'));
const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));
const TestimonialsCarouselSecond = lazy(() => import('@/components/TestimonialsCarouselSecond'));
const TestimonialsCarouselThird = lazy(() => import('@/components/TestimonialsCarouselThird'));
const LimitedOfferSection = lazy(() => import('@/components/LimitedOfferSection'));
const TimeAndCostCalculator = lazy(() => import('@/components/TimeAndCostCalculator'));
const TargetAndFAQ = lazy(() => import('@/components/TargetAndFAQ'));
const CallToAction = lazy(() => import('@/components/CallToAction'));
const Footer = lazy(() => import('@/components/Footer'));

// Critical videos to preload
const CRITICAL_VIDEOS = [
  { id: '1067255623', hash: '45e88fd96b', priority: 'high' }, // Hero video
  { id: '1067257145', hash: '45e88fd96b', priority: 'low' }, // TRX video  
  { id: '1067257124', hash: '1c3b52f7d4', priority: 'low' }, // Bands video
  { id: '1067256372', hash: '70ab6c252c', priority: 'low' }, // Testimonial videos
];

const Index = () => {
  const location = useLocation();
  const initialLoadRef = useRef(true);
  const [sectionsInView, setSectionsInView] = useState<Record<string, boolean>>({});
  
  // Initialize resource preloading
  useEffect(() => {
    // Add resource hints for key domains
    addResourceHints([
      { url: 'https://player.vimeo.com', type: 'preconnect' },
      { url: 'https://i.vimeocdn.com', type: 'preconnect' },
      { url: 'https://f.vimeocdn.com', type: 'preconnect' }
    ]);
    
    // Preload critical videos with appropriate priorities
    CRITICAL_VIDEOS.forEach(({ id, hash, priority }) => {
      preloadVimeoVideo(id, hash, priority as 'high' | 'low');
    });
    
    // Add animation keyframes if needed
    const addKeyframes = () => {
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
    
    // Execute with requestIdleCallback if available
    if (window.requestIdleCallback) {
      requestIdleCallback(addKeyframes, { timeout: 2000 });
    } else {
      setTimeout(addKeyframes, 100);
    }
  }, []);
  
  // Set up intersection observer for section loading
  useEffect(() => {
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
      ['product', 'lifestyle', 'bundle', 'reviews', 'training-vault', 'workout-addict'].forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
      
      return () => observer.disconnect();
    };
    
    // Start observing after a short delay to allow initial render
    const observerTimer = setTimeout(observeSections, 500);
    
    return () => clearTimeout(observerTimer);
  }, []);
  
  // Handle navigation and scrolling
  useEffect(() => {
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
  
  // Memoized component loader for better performance
  const LazyComponent = useCallback(({ component: Component, id }: { component: React.ComponentType, id: string }) => {
    const shouldRender = sectionsInView[id] || initialLoadRef.current;
    
    return (
      <div id={id}>
        {shouldRender ? (
          <Suspense fallback={<SectionLoader />}>
            <Component />
          </Suspense>
        ) : (
          <SectionLoader />
        )}
      </div>
    );
  }, [sectionsInView]);
  
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      <div id="hero">
        <HeroSection />
      </div>
      
      <div id="product">
        <ProductIntro />
        <Suspense fallback={<SectionLoader />}>
          <ProductTabs />
        </Suspense>
      </div>
      
      <ChampionSection />
      
      <LazyComponent component={TrainingVault} id="training-vault" />
      
      <LazyComponent component={TestimonialsCarousel} id="reviews" />
      
      <LazyComponent component={BundleOffer} id="bundle" />
      
      <LazyComponent component={WorkoutAddictSection} id="workout-addict" />
      
      <LazyComponent component={TestimonialsCarouselSecond} id="reviews-second" />
      
      <LazyComponent component={TestimonialsCarouselThird} id="reviews-third" />
      
      <LazyComponent component={LimitedOfferSection} id="limited-offer" />
      
      <Suspense fallback={<SectionLoader />}>
        <TimeAndCostCalculator />
        <TargetAndFAQ />
        <CallToAction />
        <Footer />
      </Suspense>
      
      <ChatbotHelper />
    </div>
  );
};

export default Index;
