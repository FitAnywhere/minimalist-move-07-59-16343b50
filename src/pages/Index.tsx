
import { lazy, Suspense } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import ProductIntro from '@/components/ProductIntro';
import CheatSystemSection from '@/components/CheatSystemSection';

// Lazy load non-critical sections
const BundleOffer = lazy(() => import('@/components/BundleOffer'));
const GymTarget = lazy(() => import('@/components/gym/GymTarget'));
const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));
const TimeAndCostCalculator = lazy(() => import('@/components/TimeAndCostCalculator'));
const GymVideoSection = lazy(() => import('@/components/gym/GymVideoSection'));
const GymFAQ = lazy(() => import('@/components/gym/GymFAQ'));
const QuizSection = lazy(() => import('@/components/quiz/QuizSection'));
const WisdomOfLegends = lazy(() => import('@/components/gym/WisdomOfLegends'));
const GymCallToAction = lazy(() => import('@/components/gym/GymCallToAction'));
const WorkoutAddictSection = lazy(() => import('@/components/WorkoutAddictSection'));
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
      
      {/* Added video section above quiz section */}
      <div id="video-section" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <GymVideoSection />
        </Suspense>
      </div>
      
      {/* Time Hacks section */}
      <div id="time-hacks" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <CheatSystemSection />
        </Suspense>
      </div>
      
      <div id="workout-addict" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <WorkoutAddictSection />
        </Suspense>
      </div>
      
      <div id="limited-offer" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <LimitedOfferSection />
        </Suspense>
      </div>
      
      <div id="quiz" className="content-visibility-auto">
        <Suspense fallback={<SectionLoader />}>
          <QuizSection />
        </Suspense>
      </div>
      
      {/* Add new Wisdom of Legends section here - between Quiz and FAQ */}
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
