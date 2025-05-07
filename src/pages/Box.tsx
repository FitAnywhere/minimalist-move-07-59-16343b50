
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

const BoxTitleSection = () => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center pt-28 pb-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-4xl font-extrabold relative inline-block">
        BOXFUN
        <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"></span>
      </h1>
      <p className="text-gray-700 mt-4 text-lg">
        Freedom, strength, and fun — without ever stepping into a gym.
      </p>
    </div>
  );
};

const Box = () => {
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      
      <BoxTitleSection />
      
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
