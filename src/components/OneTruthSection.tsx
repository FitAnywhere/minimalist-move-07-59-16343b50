
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const OneTruthSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });
  const isMobile = useIsMobile();
  const [animationState, setAnimationState] = useState({
    title: false,
    content: false,
    cta: false
  });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({ ...prev, title: true })), 100);
      setTimeout(() => setAnimationState(prev => ({ ...prev, content: true })), 300);
      setTimeout(() => setAnimationState(prev => ({ ...prev, cta: true })), 500);
    }
  }, [isInView]);

  const handleCTAClick = () => {
    window.open('https://buy.stripe.com/eVa28y4t7cOw33qeVa', '_blank');
  };

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <div className={cn(
            "mb-8 transition-all duration-1000",
            animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              ONE TRUTH
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
                animationState.title ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
          </div>

          {/* Content */}
          <div className={cn(
            "space-y-6 mb-8 transition-all duration-1000 delay-200",
            animationState.content ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <p className={cn(
              "text-lg md:text-xl text-gray-800 font-semibold leading-relaxed",
              isMobile ? "px-4" : "px-8"
            )}>
              Most people quit before they even start.
            </p>
            
            <p className={cn(
              "text-base md:text-lg text-gray-700 leading-relaxed",
              isMobile ? "px-4" : "px-8"
            )}>
              Not because they lack willpower. Not because they're lazy.
            </p>
            
            <p className={cn(
              "text-base md:text-lg text-gray-700 leading-relaxed font-medium",
              isMobile ? "px-4" : "px-8"
            )}>
              But because the gap between where they are and where they want to be feels impossible to cross.
            </p>
            
            <div className="py-4">
              <p className={cn(
                "text-xl md:text-2xl font-bold text-black",
                isMobile ? "px-4" : "px-8"
              )}>
                We built the bridge.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className={cn(
            "transition-all duration-1000 delay-400",
            animationState.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <Button 
              variant="yellow" 
              size="lg" 
              className="font-semibold"
              onClick={handleCTAClick}
            >
              START YOUR JOURNEY →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneTruthSection;
