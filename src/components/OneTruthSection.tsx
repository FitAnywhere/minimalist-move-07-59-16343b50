
import { useRef, useState, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const OneTruthSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    threshold: 0.3
  });
  const isMobile = useIsMobile();

  const [animationState, setAnimationState] = useState({
    title: false,
    subtitle: false,
    content: false
  });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({ ...prev, title: true })), 100);
      setTimeout(() => setAnimationState(prev => ({ ...prev, subtitle: true })), 300);
      setTimeout(() => setAnimationState(prev => ({ ...prev, content: true })), 500);
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <div className={cn(
            "mb-8 transition-all duration-1000",
            animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-bold text-black relative inline-block">
              ONE TRUTH
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
                animationState.title ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className={cn(
            "mb-12 transition-all duration-1000",
            animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <p className="text-xl md:text-2xl text-gray-700 font-semibold">
              Success requires consistency, not perfection.
            </p>
          </div>

          {/* Content */}
          <div className={cn(
            "transition-all duration-1000",
            animationState.content ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              The difference between those who achieve their goals and those who don't isn't talent, luck, or perfect conditions. It's showing up consistently, even when motivation is low.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneTruthSection;
