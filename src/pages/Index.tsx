
import { lazy, Suspense } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ProductIntro from '@/components/ProductIntro';
import ChatbotHelper from '@/components/ChatbotHelper';

// Lazy load non-critical sections
const BundleOffer = lazy(() => import('@/components/BundleOffer'));
const GymTarget = lazy(() => import('@/components/gym/GymTarget'));
const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));
const TimeAndCostCalculator = lazy(() => import('@/components/TimeAndCostCalculator'));
const GymFAQ = lazy(() => import('@/components/gym/GymFAQ'));
const QuizSection = lazy(() => import('@/components/quiz/QuizSection'));
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
      
      <div id="hero">
        <HeroSection />
      </div>
      
      <div id="product">
        <ProductIntro />
      </div>
      
      <div id="bundle" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <BundleOffer />
        </Suspense>
      </div>
      
      <div id="target" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <GymTarget />
        </Suspense>
      </div>
      
      <div id="reviews" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsCarousel />
        </Suspense>
      </div>
      
      <div id="calculator" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <TimeAndCostCalculator />
        </Suspense>
      </div>
      
      <div id="faq" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <GymFAQ />
        </Suspense>
      </div>
      
      <div id="quiz" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <QuizSection />
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
      
      <ChatbotHelper />
    </div>
  );
};

export default Index;
