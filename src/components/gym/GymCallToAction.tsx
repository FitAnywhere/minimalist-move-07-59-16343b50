import { useRef, useEffect } from 'react';
import { useInView, useParallax } from '@/utils/animations';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const GymCallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isInView = useInView(sectionRef, {
    threshold: 0.3
  });

  // Set up parallax effect
  useParallax(backgroundRef, 0.05);
  
  const handleCTAClick = () => {
    // Mobile-specific scrolling to pricing carousel
    if (isMobile) {
      setTimeout(() => {
        // Look for the pricing component specifically within the bundle section
        const pricingElement = document.querySelector('#bundle-offer .max-w-3xl') || 
                             document.querySelector('#bundle-offer [class*="pricing"]') ||
                             document.querySelector('#bundle-offer');
        
        if (pricingElement) {
          // Calculate offset to land directly on the carousel for mobile
          const elementRect = pricingElement.getBoundingClientRect();
          const offsetTop = elementRect.top + window.scrollY - 80; // Adjusted for mobile header
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        } else {
          // Fallback - look for bundle section with adjusted mobile offset
          const bundleSection = document.querySelector('#bundle-offer') || document.querySelector('#bundle');
          if (bundleSection) {
            const elementRect = bundleSection.getBoundingClientRect();
            const offsetTop = elementRect.top + window.scrollY - 60;
            
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    } else {
      // Desktop fallback - keep existing behavior
      const bundleSection = document.querySelector('#bundle-offer') || document.querySelector('#bundle');
      if (bundleSection) {
        const elementRect = bundleSection.getBoundingClientRect();
        const offsetTop = elementRect.top + window.scrollY - 100;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section id="order" ref={sectionRef} style={{
      background: 'linear-gradient(to bottom, #8A898C 0%, #555555 40%, #333333 70%, #222222 85%, black 100%)'
    }} className="relative py-8 overflow-hidden min-h-[auto] md:min-h-[40vh] flex items-center md:py-0 bg-zinc-500">
      {/* Parallax Background */}
      <div ref={backgroundRef} className="absolute inset-0 opacity-30">
        {/* Background content if needed */}
      </div>
      
      <div className="container relative z-20 mx-auto px-4 md:px-6 py-[23px] my-[26px]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="space-y-5 md:space-y-4 my-0 py-0">
            {/* Main headline - larger than before, yellow */}
            <h2 className={cn("font-bold text-xl md:text-2xl lg:text-3xl text-yellow transition-all duration-1000 mb-2", isInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>RESULTS DON'T WAIT</h2>
            
            {/* Subheadline - white, smaller */}
            
            
            {/* CTA Button - yellow with black text */}
            <div className={cn("transition-all duration-1000 mt-6 md:mt-8", isInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
              <Button onClick={handleCTAClick} variant="yellow" size="xl" className="font-semibold tracking-wide transition-all duration-300 hover:bg-yellow-dark hover:shadow-lg hover:-translate-y-1">
                LOCK IN NOW
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymCallToAction;
