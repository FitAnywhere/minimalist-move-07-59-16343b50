
import { lazy, Suspense } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ProductIntro from '@/components/ProductIntro';
import ProductTabs from '@/components/ProductTabs';
import ChatbotHelper from '@/components/ChatbotHelper';

// Lazy load non-critical sections
const TimeAndCostCalculator = lazy(() => import('@/components/TimeAndCostCalculator'));
const GymTargetAndFAQ = lazy(() => import('@/components/gym/GymTargetAndFAQ'));
const BundleOffer = lazy(() => import('@/components/BundleOffer'));
const TargetAndFAQ = lazy(() => import('@/components/TargetAndFAQ'));
const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));
const LimitedOfferSection = lazy(() => import('@/components/LimitedOfferSection'));
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
      
      <div id="hero">
        <HeroSection />
      </div>
      
      <div id="product">
        <ProductIntro />
        <ProductTabs />
      </div>
      
      <div id="calculator" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <TimeAndCostCalculator />
        </Suspense>
      </div>
      
      <div id="target-faq" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <GymTargetAndFAQ />
        </Suspense>
      </div>
      
      <div id="bundle" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <BundleOffer />
        </Suspense>
      </div>
      
      <div id="investment" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <TargetAndFAQ />
        </Suspense>
      </div>
      
      <div id="training-library" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <LimitedOfferSection />
        </Suspense>
      </div>
      
      <div id="reviews" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsCarousel />
        </Suspense>
      </div>
      
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
      
      <ChatbotHelper />
    </div>
  );
};

export default Index;
