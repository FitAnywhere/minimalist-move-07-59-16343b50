
import { lazy, Suspense } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import CheatSystemSection from '@/components/CheatSystemSection';
import ProductIntro from '@/components/ProductIntro';
import OneTruthSection from '@/components/OneTruthSection';
import TheChallengeSection from '@/components/TheChallengeSection';

// Lazy load non-critical sections
const BundleOffer = lazy(() => import('@/components/BundleOffer'));
const GymTarget = lazy(() => import('@/components/gym/GymTarget'));
const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));
const TimeAndCostCalculator = lazy(() => import('@/components/TimeAndCostCalculator'));
const GymFAQ = lazy(() => import('@/components/gym/GymFAQ'));
const WisdomOfLegends = lazy(() => import('@/components/gym/WisdomOfLegends'));
const GymCallToAction = lazy(() => import('@/components/gym/GymCallToAction'));
const Footer = lazy(() => import('@/components/Footer'));

// Loading fallback component
const SectionLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      
      {/* 1. Hero Section */}
      <div id="hero">
        <HeroSection />
      </div>
      
      {/* 2. CRUSH YOUR GOALS */}
      <div id="cheat-system" className="content-visibility-auto">
        <CheatSystemSection />
      </div>
      
      {/* 3. BUILT FOR */}
      <div id="target" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <GymTarget />
        </Suspense>
      </div>
      
      {/* 4. NO LIMITS */}
      <div id="product" className="content-visibility-auto">
        <ProductIntro />
      </div>
      
      {/* 5. ONE TRUTH */}
      <div id="one-truth" className="content-visibility-auto">
        <OneTruthSection />
      </div>
      
      {/* 6. THE CHALLENGE */}
      <div id="the-challenge" className="content-visibility-auto">
        <TheChallengeSection />
      </div>
      
      {/* 7. NO EXCUSES */}
      <div id="bundle" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <BundleOffer />
        </Suspense>
      </div>
      
      {/* 8. LOVED BY */}
      <div id="reviews" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsCarousel />
        </Suspense>
      </div>
      
      {/* 9. FOREVER YOURS */}
      <div id="calculator" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <TimeAndCostCalculator />
        </Suspense>
      </div>
      
      {/* 10. LIVE LIKE LEGENDS */}
      <div id="wisdom" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <WisdomOfLegends />
        </Suspense>
      </div>
      
      <div id="faq" className="content-visibility-auto">
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
