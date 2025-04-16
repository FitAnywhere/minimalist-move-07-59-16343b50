
import { useRef, useState, useCallback, memo } from 'react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import ScrollIndicator from './ui/ScrollIndicator';
import HeroContent from './ui/HeroContent';
import OptimizedHeroVideo from './ui/OptimizedHeroVideo';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroSection = memo(() => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isInView = useInView(heroRef, {
    threshold: 0.4
  });
  
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
                <HeroContent isInView={isInView} scrollToOwnBoth={() => {}} isMobile={true} />
                
                <OptimizedHeroVideo />
                
                <p className="mt-3 text-sm text-gray-600 ml-1 text-center my-[6px] mx-[30px]">
                  Launching Spring 2025. Reserve before we sell out.
                </p>
              </div>
            </>
          ) : (
            <>
              <HeroContent isInView={isInView} scrollToOwnBoth={() => {}} />
              <div className="order-1 md:order-2 w-full">
                <OptimizedHeroVideo />
                <p className="mt-3 text-sm text-gray-600 ml-1 text-center my-[6px] mx-[30px]">
                  Launching Spring 2025. Reserve before we sell out.
                </p>
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
