import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

// New structured features with hidden subtext
const features = [{
  title: "Unfold & go.",
  description: "No tools, no installation—just pure movement."
}, {
  title: "Seamless design.",
  description: "Folds away when you're done. Effortless. Invisible."
}, {
  title: "Built to last.",
  description: "Precision-crafted. Strong. Elegant. Just like you."
}, {
  title: "Endless potential.",
  description: "One station. Infinite possibilities. No limits."
}];
const ProductIntro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const [isOpen, setIsOpen] = useState(false);
  const [animationState, setAnimationState] = useState({
    title: false,
    subtitle: false,
    paragraph: false,
    features: [false, false, false, false],
    finalLine: false
  });

  // Trigger staggered animations when section comes into view
  useEffect(() => {
    if (isInView) {
      // Staggered animation for text elements
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        title: true
      })), 300);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        subtitle: true
      })), 800);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        paragraph: true
      })), 1300);

      // Staggered animation for feature points
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
        }, 1800 + index * 250);
      });

      // Final line animation
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        finalLine: true
      })), 3000);
    }
  }, [isInView]);
  return <section id="product" ref={containerRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Text Content Column - Left side */}
            <div className="space-y-8 order-last md:order-first">
              {/* Section Title */}
              <div className="space-y-4">
                <h2 className={cn("text-black font-bold tracking-wide transition-all duration-700 transform", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>LIVE FREE</h2>
                
                <p className={cn("text-2xl text-gray-800 font-medium transition-all duration-700 transform", animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>Space is luxury & strength is freedom.
OWN BOTH</p>
                
                <p className={cn("text-lg text-gray-700 transition-all duration-700 transform", animationState.paragraph ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  Your home is your sanctuary. Your time is priceless. Your training should respect both.
                </p>
              </div>
              
              {/* Feature Points with Toggle */}
              <div className="space-y-5">
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
                  {features.map((feature, index) => <div key={index} className={cn("transition-all duration-500 transform", animationState.features[index] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4")} style={{
                  transitionDelay: `${(index + 1) * 100}ms`
                }}>
                      <Card className={cn("p-4 rounded-lg bg-white border border-yellow-100 hover:shadow-md transition-all duration-300", "hover:-translate-y-1 hover:border-yellow-300 group")}>
                        <h4 className="font-semibold text-base md:text-lg group-hover:text-shadow-yellow">
                          {feature.title}
                        </h4>
                        <CollapsibleContent className="pt-2 text-gray-600 text-sm">
                          {feature.description}
                        </CollapsibleContent>
                      </Card>
                    </div>)}
                  
                  <div className="flex justify-center">
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2 border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50">
                        {isOpen ? <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Show Less
                          </> : <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            See More
                          </>}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </Collapsible>
              </div>
              
              {/* Final Line */}
              <p className={cn("font-medium text-lg italic text-gray-800 transition-all duration-700 transform", animationState.finalLine ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
                Train when you want. Where you want. Without compromise.
              </p>
            </div>
            
            {/* Video Column - Right side (unchanged) */}
            <div className={cn("flex justify-center items-center transition-all duration-700 h-full order-first md:order-last", isInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
              <div className="w-full max-w-[70%] mx-auto rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                <video className="w-full h-auto object-contain" autoPlay muted loop playsInline>
                  <source src="/home-360-tb.mp4" type="video/mp4" />
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