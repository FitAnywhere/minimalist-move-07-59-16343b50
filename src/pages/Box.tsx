
import { useEffect, lazy, Suspense } from 'react';
import NavBar from '@/components/NavBar';

// Lazy load sections
const WorkoutAddictSection = lazy(() => import('@/components/WorkoutAddictSection'));
const TestimonialsCarouselThird = lazy(() => import('@/components/TestimonialsCarouselThird'));
const LimitedOfferSection = lazy(() => import('@/components/LimitedOfferSection'));
const BoxTargetAndFAQ = lazy(() => import('@/components/box/BoxTargetAndFAQ'));
const BoxCallToAction = lazy(() => import('@/components/box/BoxCallToAction'));
const Footer = lazy(() => import('@/components/Footer'));

// Better loading fallback with reduced CLS (Cumulative Layout Shift)
const SectionLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Box = () => {
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      
      <div id="workout-addict" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <WorkoutAddictSection />
        </Suspense>
      </div>
      
      <div id="reviews-third" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsCarouselThird />
        </Suspense>
      </div>
      
      <div id="limited-offer" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <LimitedOfferSection />
        </Suspense>
      </div>
      
      <div id="target-faq" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <BoxTargetAndFAQ />
        </Suspense>
      </div>
      
      <div id="cta">
        <Suspense fallback={<SectionLoader />}>
          <BoxCallToAction />
        </Suspense>
      </div>
      
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Box;
