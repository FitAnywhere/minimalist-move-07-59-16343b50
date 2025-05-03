
import { useRef, useState, useCallback, memo } from 'react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import ScrollIndicator from './ui/ScrollIndicator';
import HeroContent from './ui/HeroContent';
import HeroCarousel from './ui/HeroCarousel';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroSection = memo(() => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isInView = useInView(heroRef, {
    threshold: 0.4
  });

  return (
    <section ref={heroRef} className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white" aria-label="Introduction to FitAnywhere">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {isMobile ? (
            <>
              <div className="text-center order-1 w-full space-y-6">
                <HeroContent isInView={isInView} scrollToOwnBoth={() => {}} isMobile={true} overrideTitle="START STRONG" />
                
                <div className="relative">
                  <p className="text-sm text-gray-600 mb-2 font-medium">THE FIRST LUXURY PRIVATE GYM</p>
                  <HeroCarousel />
                </div>
                
                <div className={cn("transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <div className="mt-4 space-y-1">
                    <p className="text-gray-700 font-bold text-base">No strength? No experience?</p>
                    <p className="text-gray-700 px-0 py-[4px] font-bold text-base">We built this for you.</p>
                  </div>
                  
                  <div className="mt-6 flex flex-col items-center">
                    <span className="inline-block text-lg font-semibold px-6 py-2 bg-yellow text-black rounded-full shadow-sm">
                      NOW 40% OFF
                    </span>
                    <ArrowDown className="mt-4 w-6 h-6 animate-bounce text-yellow" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <HeroContent isInView={isInView} scrollToOwnBoth={() => {}} overrideTitle="START STRONG" />
              <div className="order-1 md:order-2 w-full flex flex-col items-center">
                <HeroCarousel />
                <p className="mt-3 text-sm text-gray-600 text-center">THE FIRST LUXURY PRIVATE GYM</p>
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
