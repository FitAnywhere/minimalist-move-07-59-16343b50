
import { useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ChatbotHelper from '@/components/ChatbotHelper';

// Import critical components eagerly
import ProductIntro from '@/components/ProductIntro';
import ChampionSection from '@/components/ChampionSection';
import TrainingVault from '@/components/TrainingVault';
import WorkoutAddictSection from '@/components/WorkoutAddictSection';

// Import utilities
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { setupAnchorClickHandler, handleExternalNavigation } from '@/utils/scrollUtils';
import { initVideoPreloading } from '@/utils/videoPreloader';
import { initStyles } from '@/utils/styleUtils';

// Continue lazy loading other components with better error boundaries and fallbacks
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
const TestimonialsCarouselThird = lazy(() => 
  import('@/components/TestimonialsCarouselThird').catch(err => {
    console.error('Failed to load TestimonialsCarouselThird:', err);
    return { default: () => <div className="min-h-[400px]">Loading content...</div> };
  })
);
const LimitedOfferSection = lazy(() => 
  import('@/components/LimitedOfferSection').catch(err => {
    console.error('Failed to load LimitedOfferSection:', err);
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

const Index = () => {
  const location = useLocation();
  const initialLoadRef = useRef(true);
  
  // Set up section observation
  useSectionObserver({
    sectionIds: ['product', 'lifestyle', 'bundle', 'reviews', 'training-vault', 'workout-addict'],
    onVisibilityChange: (id, isVisible) => {
      if (isVisible) {
        console.log(`Section ${id} is now visible`);
      }
    }
  });
  
  useEffect(() => {
    // Initialize styles
    initStyles();
    
    // Initialize video preloading
    initVideoPreloading();
    
    // Set up anchor click handler
    const cleanupAnchorHandler = setupAnchorClickHandler();
    
    // Handle external navigation
    if (initialLoadRef.current) {
      handleExternalNavigation(location);
      initialLoadRef.current = false;
    }
    
    return () => {
      cleanupAnchorHandler();
    };
  }, [location]);
  
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
      
      <div id="training-vault">
        <TrainingVault />
      </div>
      
      <Suspense fallback={<SectionLoader />}>
        <div id="reviews">
          <TestimonialsCarousel />
        </div>
        
        <div id="bundle">
          <BundleOffer />
        </div>
        
        <div id="workout-addict">
          <WorkoutAddictSection />
        </div>
        
        <div id="reviews-third">
          <TestimonialsCarouselThird />
        </div>
        
        <div id="limited-offer">
          <LimitedOfferSection />
        </div>
        
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
