import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
const features = [{
  title: "PRIVATE",
  description: "Comfort at home"
}, {
  title: "EASY",
  description: "Support from day one"
}, {
  title: "FAST",
  description: "Ready in 2 minutes"
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
  return <section id="product" ref={containerRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-8 order-last md:order-first">
              <div className="space-y-4">
                <h2 className={cn("text-3xl md:text-4xl font-extrabold text-black relative inline-block", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", isMobile ? "text-center mx-auto block w-full" : "")}>
                  NO LIMITS
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                </h2>
              </div>
              
              {isMobile && <video autoPlay muted loop playsInline className="w-full max-w-[64%] mx-auto rounded-xl h-auto object-contain py-[2px] my-[8px]">
                  <source src="/intro women.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>}
              
              <div className="space-y-5 my-[10px] px-[73px] py-[41px] mx-[24px] rounded-none">
                {features.map((feature, index) => <div key={index} className={cn("px-6 py-3 rounded-full", "transition-all duration-300 ease-in-out", "shadow-md", "transform", "border-2 border-yellow bg-white", animationState.features[index] ? "opacity-100" : "opacity-0")} style={{
                transitionDelay: `${(index + 1) * 100}ms`
              }}>
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold">
                      {feature.title}
                    </h4>
                  </div>
                  
                  <div className="mt-2 opacity-100">
                    <p className="text-gray-600 py-0 font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>)}
              </div>
            </div>
            
            <div className={cn("flex justify-center items-center transition-all duration-700 h-full order-first md:order-last hidden md:flex", isInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
              <div className="w-full max-w-[70%] mx-auto rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                <video className="w-full h-auto object-contain" autoPlay muted loop playsInline>
                  <source src="/intro women.mp4" type="video/mp4" />
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