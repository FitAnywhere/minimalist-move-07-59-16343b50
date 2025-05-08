import { useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';

// Lazy load sections
const WorkoutAddictSection = lazy(() => import('@/components/WorkoutAddictSection'));
const TestimonialsCarouselThird = lazy(() => import('@/components/TestimonialsCarouselThird'));
const LimitedOfferSection = lazy(() => import('@/components/LimitedOfferSection'));
const BoxTargetAndFAQ = lazy(() => import('@/components/box/BoxTargetAndFAQ'));
const BoxCallToAction = lazy(() => import('@/components/box/BoxCallToAction'));
const Footer = lazy(() => import('@/components/Footer'));

// Better loading fallback with reduced CLS (Cumulative Layout Shift)
const SectionLoader = () => <div className="min-h-[400px] w-full flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>;

const BoxTitleSection = () => {
  return <div className="hidden md:flex flex-col items-center justify-center pt-28 pb-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-4xl font-extrabold relative inline-block">
        BOXFUN
        <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"></span>
      </h1>
      <p className="text-gray-700 mt-4 text-lg font-bold">Strength and fun without stepping into a gym</p>
    </div>;
};

const Box = () => {
  const location = useLocation();
  
  // Critical rendering and routing enforcement for Box page
  useEffect(() => {
    // Force URL to be exactly /box
    if (window.location.pathname !== '/box') {
      console.log('Correcting Box page URL:', window.location.pathname, 'to /box');
      window.history.replaceState(null, null, '/box');
    }
    
    // Force scroll to top with redundancy
    window.scrollTo(0, 0);
    
    // Secondary scroll enforcement after a short delay to ensure complete render
    const scrollTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
      console.log('Box page - secondary scroll to top executed');
    }, 200);
    
    // Handle refresh detection and restore proper URL if needed
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Box page visibility changed to visible - enforcing correct URL');
        // Re-enforce path when tab becomes visible (might be after refresh)
        if (window.location.pathname !== '/box') {
          window.history.replaceState(null, null, '/box');
          window.scrollTo(0, 0);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(scrollTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location]);

  return (
    <div className="overflow-x-hidden">
      <NavBar />
      
      <BoxTitleSection />
      
      {/* 1. Hero/BOXFUN section */}
      <div id="workout-addict" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <WorkoutAddictSection />
        </Suspense>
      </div>
      
      {/* 2. WHY THEY LOVE BOXFUN? */}
      <div id="reviews-third" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsCarouselThird />
        </Suspense>
      </div>
      
      {/* 3. IT'S PERFECT IF... and 4. SPECIAL OFFER sections are inside BoxTargetAndFAQ */}
      <div id="perfect-if-and-limited-offer" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <BoxTargetAndFAQ />
        </Suspense>
      </div>
      
      {/* 5. WHAT IS A PRIVATE GYM? */}
      <div id="target-faq" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <LimitedOfferSection />
        </Suspense>
      </div>
      
      {/* 6. FREQUENTLY ASKED QUESTIONS and CTA */}
      <div id="cta">
        <Suspense fallback={<SectionLoader />}>
          <BoxCallToAction />
        </Suspense>
      </div>
      
      {/* Footer */}
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Box;
