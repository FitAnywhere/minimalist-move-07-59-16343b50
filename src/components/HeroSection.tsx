
import { useRef, useCallback, memo } from 'react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import ScrollIndicator from './ui/ScrollIndicator';
import HeroContent from './ui/HeroContent';
import HeroVideoSection from './ui/HeroVideoSection';
import HeroCallToAction from './ui/HeroCallToAction';
import { debounce } from '@/utils/eventOptimizers';

// Memoize the HeroSection component to prevent unnecessary rerenders
const HeroSection = memo(() => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Use a higher threshold to ensure better animation control
  const isInView = useInView(heroRef, {
    threshold: 0.4
  });

  // Memoize event handlers with debounce to improve performance
  const scrollToOwnBoth = useCallback(debounce((e: React.MouseEvent) => {
    e.preventDefault();
    const productSection = document.getElementById('product');
    if (productSection) {
      productSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, 150), []);
  
  return (
    <section 
      ref={heroRef} 
      className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white"
      aria-label="Introduction to FitAnywhere"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {isMobile ? (
            <>
              <div className="text-center order-1 w-full space-y-6">
                {/* Mobile layout with specific order */}
                <HeroContent isInView={isInView} scrollToOwnBoth={scrollToOwnBoth} isMobile={true} />
                
                {/* Video container for mobile */}
                <HeroVideoSection isInView={isInView} isMobile={true} />
                
                {/* CTA Button placed after content */}
                <HeroCallToAction isInView={isInView} isMobile={true} scrollToOwnBoth={scrollToOwnBoth} />
              </div>
            </> 
          ) : (
            <>
              <HeroContent isInView={isInView} scrollToOwnBoth={scrollToOwnBoth} />
              
              <div className="order-1 md:order-2 w-full">
                <HeroVideoSection isInView={isInView} isMobile={false} />
                <HeroCallToAction isInView={isInView} isMobile={false} scrollToOwnBoth={scrollToOwnBoth} />
              </div>
            </>
          )}
        </div>
      </div>
      
      <ScrollIndicator />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
