
import { lazy, Suspense } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import CheatSystemSection from '@/components/CheatSystemSection';
import ProductIntro from '@/components/ProductIntro';
import TheChallengeSection from '@/components/TheChallengeSection';

// Lazy load non-critical sections with better chunking
const BundleOffer = lazy(() => import('@/components/BundleOffer'));
const GymTarget = lazy(() => import('@/components/gym/GymTarget'));
const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));
const TimeAndCostCalculator = lazy(() => import('@/components/TimeAndCostCalculator'));
const GymFAQ = lazy(() => import('@/components/gym/GymFAQ'));
const WisdomOfLegends = lazy(() => import('@/components/gym/WisdomOfLegends'));
const GymCallToAction = lazy(() => import('@/components/gym/GymCallToAction'));
const Footer = lazy(() => import('@/components/Footer'));

// Optimized loading fallback
const SectionLoader = () => (
  <div className="min-h-[200px] w-full flex items-center justify-center" aria-hidden="true">
    <div className="w-6 h-6 border-2 border-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      
      {/* Critical above-the-fold content - not lazy loaded */}
      <div id="hero">
        <HeroSection />
      </div>
      
      <div id="cheat-system">
        <CheatSystemSection />
      </div>
      
      {/* Lazy loaded sections below the fold */}
      <div id="target">
        <Suspense fallback={<SectionLoader />}>
          <GymTarget />
        </Suspense>
      </div>
      
      <div id="product">
        <ProductIntro />
      </div>
      
      <div id="the-challenge">
        <TheChallengeSection />
      </div>
      
      <div id="bundle">
        <Suspense fallback={<SectionLoader />}>
          <BundleOffer />
        </Suspense>
      </div>
      
      <div id="reviews">
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsCarousel />
        </Suspense>
      </div>
      
      <div id="calculator">
        <Suspense fallback={<SectionLoader />}>
          <TimeAndCostCalculator />
        </Suspense>
      </div>
      
      <div id="wisdom">
        <Suspense fallback={<SectionLoader />}>
          <WisdomOfLegends />
        </Suspense>
      </div>
      
      <div id="faq">
        <Suspense fallback={<SectionLoader />}>
          <GymFAQ />
        </Suspense>
      </div>
      
      <div id="cta">
        <Suspense fallback={<SectionLoader />}>
          <GymCallToAction />
        </Suspense>
      </div>
      
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
