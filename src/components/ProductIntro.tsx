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
  return <section id="product" ref={containerRef} style={{
    backgroundColor: '#f8f6df'
  }}>
      <div className="container mx-auto px-4 py-[14px]">
        <div className="max-w-5xl mx-auto">
          {/* Desktop: Center title above grid */}
          {!isMobile && <div className="flex justify-center mb-8">
              <div className="space-y-4 flex flex-col items-center">
                <h2 className={cn("text-3xl md:text-4xl font-extrabold text-black relative inline-block", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  NO LIMITS
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                </h2>
              </div>
            </div>}
          
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-8 order-last md:order-first">
              {/* Mobile: Show title here */}
              {isMobile && <div className="space-y-4 flex flex-col items-center">
                  <h2 className={cn("text-3xl md:text-4xl font-extrabold text-black relative inline-block", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    NO LIMITS
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                  </h2>
                </div>}
              
              {isMobile && <video autoPlay muted loop playsInline className="w-full rounded-xl h-auto object-contain px-0 mx-[auto] py-[2px] my-[15px]">
                  <source src="/452025 Akcija.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>}
              
              
            </div>
            
            
          </div>
        </div>
      </div>
    </section>;
};
export default ProductIntro;