import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

// Updated features with new text
const features = [{
  title: "MONEY",
  description: "Saves you 602,6€ every year"
}, {
  title: "TIME",
  description: "Gains you 104 hours every year"
}, {
  title: "SPACE",
  description: "Folds away in 2 minutes."
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
  const [showSpecs, setShowSpecs] = useState(false);
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
                  RARE LUXURIES
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                </h2>
                
                <p className={cn("text-2xl text-gray-800 font-medium transition-all duration-700 transform", animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", isMobile ? "text-center mx-auto" : "")}>Build dream body while gaining money, time and space.</p>
              </div>
              
              {isMobile && <div className={cn("flex justify-center items-center transition-all duration-700 h-full md:hidden", isInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
                  <div className="w-full max-w-[64%] mx-auto rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                    <video autoPlay muted loop playsInline className="w-full h-auto object-contain py-[2px] my-[8px]">
                      <source src="/home-360-tb.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>}
              
              <div className="space-y-5 my-[9px] mx-0 px-0 py-0 rounded-none">
                {features.map((feature, index) => <div key={index} className={cn("px-6 py-3 rounded-full", "transition-all duration-300 ease-in-out", "shadow-md", "transform", "border-2 border-yellow bg-white",
              // Changed to white background with yellow border
              animationState.features[index] ? "opacity-100" : "opacity-0")} style={{
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
              
              <div className="space-y-4">
                <p className={cn("font-medium text-lg italic text-gray-800 transition-all duration-700 transform", animationState.finalLine ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>Train when you want. Where you want. </p>
                
                <div className={cn("transition-all duration-700 transform", animationState.finalLine ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
                  <Button variant="outline" size="sm" className="uppercase font-bold border-yellow border-2 bg-transparent text-black hover:bg-yellow-light/20 transition-all text-xs py-1" onClick={() => setShowSpecs(true)}>
                    Specifications
                  </Button>
                </div>
              </div>
            </div>
            
            <div className={cn("flex justify-center items-center transition-all duration-700 h-full order-first md:order-last hidden md:flex", isInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
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

      <Dialog open={showSpecs} onOpenChange={setShowSpecs}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Product Specifications</DialogTitle>
          </DialogHeader>
          
          <DialogClose className="absolute right-4 top-4 rounded-full p-1.5 opacity-70 ring-offset-background transition-opacity hover:bg-gray-100 hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="space-y-6 text-left mt-2 px-2">
            <div>
              <h3 className="font-semibold text-lg">Material & Construction</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Made from high-quality, round steel bars</li>
                <li>Thickness: 2 mm</li>
                <li>Width: 38 mm</li>
                <li>Durable powder-coated finish for lasting protection</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Dimensions</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Adjustable Frame Height: 195–235 cm</li>
                <li>Width: 67 cm</li>
                <li>Length: 100 cm</li>
                <li>Weight: 24.3 kg</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Stability & Safety Features</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Rubber pads included, preventing slipping and protecting surfaces</li>
                <li>Innovative clamp-based assembly system eliminates the need for nuts or bolts</li>
                <li>Secure clamps provide exceptional stability and ease of assembly</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Load Capacity</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Pull-Up Bar: Maximum recommended load 150 kg (successfully tested up to 200+ kg)</li>
                <li>Parallel Bars: Maximum recommended load 200 kg (successfully tested up to 250+ kg)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Design Excellence</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Elegant, perfected design featuring smooth bends instead of sharp angles</li>
                <li>All open ends securely covered with plugs for added safety and a premium look</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Color Availability</h3>
              <ul className="list-disc pl-6 space-y-1.5 mt-2">
                <li>Black</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>;
};
export default ProductIntro;