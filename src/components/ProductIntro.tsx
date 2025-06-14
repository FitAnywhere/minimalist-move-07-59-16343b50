import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const features = [{
  title: "PRIVATE",
  description: "Train in silence. No stares. No judgment."
}, {
  title: "FITS EVERYWHERE",
  description: "Corners, bedrooms, balconies..."
}, {
  title: "BEGINNER PROOF",
  description: "Elastics let you win from day one."
}];

const ProductIntro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const [animationState, setAnimationState] = useState({
    title: false,
    subtitle: false,
    paragraph: false,
    features: [false, false, false],
    finalLine: false
  });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        title: true
      })), 100);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        subtitle: true
      })), 300);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        paragraph: true
      })), 500);
      features.forEach((_, index) => {
        setTimeout(() => {
          setAnimationState(prev => {
            const updatedFeatures = [...prev.features];
            updatedFeatures[index] = true;
            return {
              ...prev,
              features: updatedFeatures
            };
          });
        }, 700 + index * 150);
      });
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        finalLine: true
      })), 1200);
    }
  }, [isInView]);

  return <section id="product" ref={containerRef} className="bg-black">
      <div className="container mx-auto px-4 py-[14px]">
        <div className="max-w-5xl mx-auto">
          {/* Desktop: Center title above grid */}
          {!isMobile && (
            <div className="flex justify-center mb-8">
              <div className="space-y-4 flex flex-col items-center">
                <h2 className={cn("text-3xl md:text-4xl font-extrabold text-white relative inline-block", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  NO LIMITS
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                </h2>
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-8 order-last md:order-first">
              {/* Mobile: Show title here */}
              {isMobile && (
                <div className="space-y-4 flex flex-col items-center">
                  <h2 className={cn("text-3xl md:text-4xl font-extrabold text-white relative inline-block", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    NO LIMITS
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                  </h2>
                </div>
              )}
              
              {isMobile && <video autoPlay muted loop playsInline className="w-full rounded-xl h-auto object-contain px-0 mx-[auto] py-[2px] my-[15px]">
                  <source src="/452025 Akcija.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>}
              
              <div className="space-y-5 md:space-y-6 my-[9px] mx-0 px-0 py-0 rounded-none">
                {features.map((feature, index) => <div key={index} className={cn(isMobile ? "px-[18px] py-3 space-y-1" : "px-6 py-2 md:py-3", "rounded-full", "transition-all duration-300 ease-in-out", "shadow-md", "transform", "bg-yellow", isMobile ? "text-center" : "text-center md:text-center", !isMobile && "max-w-[90%] mx-auto", animationState.features[index] ? "opacity-100" : "opacity-0")} style={{
                transitionDelay: `${(index + 1) * 100}ms`
              }}>
                    <div className="flex flex-col items-center md:items-center justify-center">
                      <h4 className={cn("text-lg font-bold text-black", isMobile ? "m-0 p-0" : "mb-1")}>
                        {feature.title}
                      </h4>
                    
                      <div className={cn("opacity-100", isMobile ? "mt-0" : "mt-0.5")}>
                        <p className={cn("text-black font-medium", isMobile ? "text-sm m-0 p-0" : "py-0")}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            
            <div className={cn("flex justify-center items-center transition-all duration-700 h-full order-first md:order-last hidden md:flex", isInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
              <div className="w-full max-w-[85%] mx-auto rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                <video className="w-full h-auto object-contain" autoPlay muted loop playsInline>
                  <source src="/452025 Akcija.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default ProductIntro;
