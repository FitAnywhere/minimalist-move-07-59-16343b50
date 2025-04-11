
import { useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { throttle, rafThrottle } from '@/utils/eventOptimizers';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ChatbotHelper from '@/components/ChatbotHelper';

// Import critical components eagerly
import ProductIntro from '@/components/ProductIntro';
import ChampionSection from '@/components/ChampionSection';
import TrainingVault from '@/components/TrainingVault';

// Import utilities
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { setupAnchorClickHandler, handleExternalNavigation } from '@/utils/scrollUtils';
import { initVideoPreloading } from '@/utils/videoPreloader';
import { initStyles } from '@/utils/styleUtils';

// Better loading fallback with reduced CLS (Cumulative Layout Shift)
const SectionLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Define chunk names for better debugging and performance monitoring
const ProductTabs = lazy(() => import(/* webpackChunkName: "product-tabs" */ '@/components/ProductTabs'));
const WorkoutAddictSection = lazy(() => import(/* webpackChunkName: "workout-addict" */ '@/components/WorkoutAddictSection'));
const TestimonialsCarousel = lazy(() => import(/* webpackChunkName: "testimonials" */ '@/components/TestimonialsCarousel'));

// Define chunk group for below-the-fold content
const LifestyleSection = lazy(() => 
  import(/* webpackChunkName: "below-fold-1" */ '@/components/LifestyleSection').catch(err => {
    console.error('Failed to load LifestyleSection:', err);
    return { default: () => <div className="min-h-[400px]" role="alert">Loading content...</div> };
  })
);

const BundleOffer = lazy(() => 
  import(/* webpackChunkName: "below-fold-1" */ '@/components/BundleOffer').catch(err => {
    console.error('Failed to load BundleOffer:', err);
    return { default: () => <div className="min-h-[400px]" role="alert">Loading content...</div> };
  })
);

// Define another chunk group for further below-the-fold content
const TestimonialsCarouselThird = lazy(() => 
  import(/* webpackChunkName: "below-fold-2" */ '@/components/TestimonialsCarouselThird').catch(err => {
    console.error('Failed to load TestimonialsCarouselThird:', err);
    return { default: () => <div className="min-h-[400px]" role="alert">Loading content...</div> };
  })
);

const LimitedOfferSection = lazy(() => 
  import(/* webpackChunkName: "below-fold-2" */ '@/components/LimitedOfferSection').catch(err => {
    console.error('Failed to load LimitedOfferSection:', err);
    return { default: () => <div className="min-h-[400px]" role="alert">Loading content...</div> };
  })
);

// Define final chunk group for lowest content
const TimeAndCostCalculator = lazy(() => 
  import(/* webpackChunkName: "below-fold-3" */ '@/components/TimeAndCostCalculator').catch(err => {
    console.error('Failed to load TimeAndCostCalculator:', err);
    return { default: () => <div className="min-h-[400px]" role="alert">Loading content...</div> };
  })
);

const TargetAndFAQ = lazy(() => 
  import(/* webpackChunkName: "below-fold-3" */ '@/components/TargetAndFAQ').catch(err => {
    console.error('Failed to load TargetAndFAQ:', err);
    return { default: () => <div className="min-h-[400px]" role="alert">Loading content...</div> };
  })
);

const CallToAction = lazy(() => 
  import(/* webpackChunkName: "footer-group" */ '@/components/CallToAction').catch(err => {
    console.error('Failed to load CallToAction:', err);
    return { default: () => <div className="min-h-[400px]" role="alert">Loading content...</div> };
  })
);

const Footer = lazy(() => 
  import(/* webpackChunkName: "footer-group" */ '@/components/Footer').catch(err => {
    console.error('Failed to load Footer:', err);
    return { default: () => <div className="min-h-[400px]" role="alert">Loading content...</div> };
  })
);

const Index = () => {
  const location = useLocation();
  const initialLoadRef = useRef(true);
  
  // Set up section observation with optimized throttled callback
  useSectionObserver({
    sectionIds: ['product', 'lifestyle', 'bundle', 'reviews', 'training-vault', 'workout-addict'],
    onVisibilityChange: rafThrottle((id, isVisible) => {
      if (isVisible) {
        console.log(`Section ${id} is now visible`);
        
        // Prefetch next section components when current section becomes visible
        if (id === 'product') {
          // Prefetch workout-addict content when product section is visible
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'script';
          link.href = '/src/components/WorkoutAddictSection.tsx';
          document.head.appendChild(link);
        }
      }
    })
  });
  
  useEffect(() => {
    // Initialize styles
    initStyles();
    
    // Initialize video preloading
    initVideoPreloading();
    
    // Set up anchor click handler with improved throttling
    const cleanupAnchorHandler = setupAnchorClickHandler();
    
    // Handle external navigation
    if (initialLoadRef.current) {
      handleExternalNavigation(location);
      initialLoadRef.current = false;
    }
    
    // Optimize scroll performance with passive listeners
    const optimizedScroll = throttle(() => {
      // Throttled scroll handler logic
    }, 100);
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    
    return () => {
      cleanupAnchorHandler();
      window.removeEventListener('scroll', optimizedScroll);
    };
  }, [location]);
  
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      
      {/* Critical hero section - not lazy loaded */}
      <section id="hero" aria-label="Introduction to FitAnywhere">
        <HeroSection />
      </section>
      
      {/* Critical product section - not lazy loaded */}
      <section id="product" aria-label="Product information">
        <ProductIntro />
        <Suspense fallback={<SectionLoader />}>
          <ProductTabs />
        </Suspense>
      </section>
      
      <section id="champion-section" aria-label="Champion information">
        <ChampionSection />
      </section>
      
      <section id="training-vault" aria-label="Training vault">
        <TrainingVault />
      </section>
      
      {/* Below-the-fold sections - all lazy loaded */}
      <section id="reviews" className="content-visibility-auto" aria-label="Customer testimonials">
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsCarousel />
        </Suspense>
      </section>
      
      <Suspense fallback={<SectionLoader />}>
        <section id="bundle" className="content-visibility-auto" aria-label="Bundle offers">
          <BundleOffer />
        </section>
        
        <section id="workout-addict" className="content-visibility-auto" aria-label="Workout addict information">
          <WorkoutAddictSection />
        </section>
        
        <section id="reviews-third" className="content-visibility-auto" aria-label="More customer testimonials">
          <TestimonialsCarouselThird />
        </section>
        
        <section id="limited-offer" className="content-visibility-auto" aria-label="Limited time offers">
          <LimitedOfferSection />
        </section>
        
        <section id="calculator" className="content-visibility-auto" aria-label="Time and cost calculator">
          <TimeAndCostCalculator />
        </section>
        
        <section id="target-faq" className="content-visibility-auto" aria-label="Target audience and FAQ">
          <TargetAndFAQ />
        </section>
        
        <section id="cta" aria-label="Call to action">
          <CallToAction />
        </section>
        
        <Footer />
      </Suspense>
      
      <ChatbotHelper />
    </div>
  );
};

export default Index;
