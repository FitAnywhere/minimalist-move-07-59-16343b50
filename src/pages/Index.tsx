
import { useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';

// Lazy load components that aren't immediately visible
const ProductIntro = lazy(() => import('@/components/ProductIntro'));
const ProductTabs = lazy(() => import('@/components/ProductTabs'));
const ChampionSection = lazy(() => import('@/components/ChampionSection'));
const LifestyleSection = lazy(() => import('@/components/LifestyleSection'));
const BundleOffer = lazy(() => import('@/components/BundleOffer'));
const TestimonialsCarousel = lazy(() => import('@/components/TestimonialsCarousel'));
const TargetAndFAQ = lazy(() => import('@/components/TargetAndFAQ'));
const CallToAction = lazy(() => import('@/components/CallToAction'));
const Footer = lazy(() => import('@/components/Footer'));

// Loading fallback
const SectionLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  const location = useLocation();
  const initialLoadRef = useRef(true);
  
  // Improved scroll handling
  useEffect(() => {
    // Handle navigation from external pages
    const handleNavigation = () => {
      const handleTargetSection = (targetId: string) => {
        setTimeout(() => {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
              behavior: 'smooth'
            });
          }
        }, 800);
      };

      // Handle external navigation with state
      if (location.state?.fromExternalPage) {
        if (location.state.targetSection) {
          handleTargetSection(`#${location.state.targetSection}`);
        } else {
          window.scrollTo(0, 0);
        }
      } 
      // Handle URL hash on initial load
      else if (window.location.hash && initialLoadRef.current) {
        handleTargetSection(window.location.hash);
      }
      
      initialLoadRef.current = false;
    };
    
    handleNavigation();
    
    // Optimized anchor click handler with passive event
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.hostname === window.location.hostname) {
        e.preventDefault();
        
        const targetElement = document.querySelector(anchor.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
          
          history.pushState(null, '', anchor.hash);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick, { passive: false });
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [location]);
  
  return (
    <div className="overflow-x-hidden">
      <NavBar />
      <div id="hero">
        <HeroSection />
      </div>
      
      <Suspense fallback={<SectionLoader />}>
        <div id="product">
          <ProductIntro />
          <ProductTabs />
        </div>
        <ChampionSection />
        <div id="lifestyle">
          <LifestyleSection />
        </div>
        <div id="bundle">
          <BundleOffer />
        </div>
        <div id="reviews">
          <TestimonialsCarousel />
        </div>
        <TargetAndFAQ />
        <CallToAction />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
