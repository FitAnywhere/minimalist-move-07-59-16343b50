
import { useRef, useState, useCallback, memo, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import ScrollIndicator from './ui/ScrollIndicator';
import HeroContent from './ui/HeroContent';
import HeroCarousel from './ui/HeroCarousel';
import WhyAverageMenModal from './ui/WhyAverageMenModal';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroSection = memo(() => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isRendered, setIsRendered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // More efficient inView detection
  const isInView = useInView(heroRef, {
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  });

  // Optimize rendering with requestIdleCallback
  useEffect(() => {
    const scheduleRender = () => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          setIsRendered(true);
        }, { timeout: 500 });
      } else {
        setTimeout(() => setIsRendered(true), 100);
      }
    };
    
    scheduleRender();
  }, []);

  const handleCTAClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <section 
      ref={heroRef} 
      aria-label="Introduction to FitAnywhere" 
      className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white/[0.57]"
    >
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {isMobile ? (
            <>
              <div className="text-center order-1 w-full space-y-6">
                <HeroContent 
                  isInView={isInView} 
                  scrollToOwnBoth={() => {}} 
                  isMobile={true} 
                  overrideTitle="STILL WEAK?" 
                />
                
                <div className="relative">
                  <HeroCarousel />
                </div>
                
                {isRendered && (
                  <div className={cn(
                    "transition-all duration-1000 delay-500", 
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}>
                    <div className="mt-4 space-y-1">
                      <p className="text-gray-700 font-bold text-base">Don't buy a pull-up bar.</p>
                      <p className="text-gray-700 px-0 py-[4px] font-bold text-base">Buy the future version of yourself.</p>
                    </div>
                    
                    <div className="mt-6 flex flex-col items-center">
                      <ArrowDown className="mb-4 w-6 h-6 animate-bounce text-yellow" />
                      <button 
                        onClick={handleCTAClick} 
                        className="inline-block text-lg font-semibold px-6 py-2 bg-yellow text-black rounded-full shadow-sm hover:bg-yellow-dark transition-colors uppercase"
                      >
                        WHY YOU MUST START
                      </button>
                      <p className="text-gray-600 text-sm mt-2 opacity-70">
                        30-day guarantee | Beginner-proof | Coach included
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <HeroContent 
                isInView={isInView} 
                scrollToOwnBoth={() => {}} 
                overrideTitle="STILL WEAK?" 
                onCTAClick={handleCTAClick} 
              />
              <div className="order-1 md:order-2 w-full flex flex-col items-center">
                <HeroCarousel />
              </div>
            </>
          )}
        </div>
      </div>
      
      {isRendered && <ScrollIndicator />}
      
      <WhyAverageMenModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
