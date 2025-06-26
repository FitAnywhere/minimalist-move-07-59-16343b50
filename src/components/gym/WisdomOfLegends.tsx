
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Check } from 'lucide-react';

const WisdomOfLegends = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const isMobile = useIsMobile();
  const [animationState, setAnimationState] = useState({
    title: false,
    bullets: [false, false, false]
  });

  const bulletPoints = [
    "30 DAYS RISK-FREE",
    "3 YEARS FRAME GUARANTEE", 
    "PAY LATER AVAILABLE"
  ];

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        title: true
      })), 100);
      
      bulletPoints.forEach((_, index) => {
        setTimeout(() => {
          setAnimationState(prev => {
            const updatedBullets = [...prev.bullets];
            updatedBullets[index] = true;
            return {
              ...prev,
              bullets: updatedBullets
            };
          });
        }, 300 + index * 200);
      });
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <div className={cn("text-center mb-12 transition-all duration-1000", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              TRY IT. BREAK IT. RETURN IT.
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>

          {/* Bullet Points */}
          <div className="max-w-2xl mx-auto space-y-6">
            {bulletPoints.map((point, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-center gap-4 transition-all duration-500",
                  animationState.bullets[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
                <p className="text-xl md:text-2xl font-bold text-black text-center">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WisdomOfLegends;
