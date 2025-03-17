
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [{
  title: "UNFOLD & GO",
  description: "No tools, no installation"
}, {
  title: "MODERN DESIGN",
  description: "Folds away when you're done"
}, {
  title: "INFINITE POSSIBILITIES",
  description: "One station without limits"
}];

const ProductIntro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
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
      })), 300);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        subtitle: true
      })), 800);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        paragraph: true
      })), 1300);

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

      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        finalLine: true
      })), 3000);
    }
  }, [isInView]);

  return (
    <section id="product" ref={containerRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-8 order-last md:order-first">
              <div className="space-y-4">
                <h2 className={cn("text-3xl md:text-4xl font-extrabold text-black relative inline-block", 
                  animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  OWN BOTH
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
                    animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                </h2>
                
                <p className={cn("text-2xl text-gray-800 font-medium transition-all duration-700 transform", 
                  animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  Space is luxury & time is freedom
                </p>
              </div>
              
              <div className="space-y-5">
                <Accordion type="single" collapsible className="w-full">
                  {features.map((feature, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className={cn(
                        "mb-3 transition-all duration-500 transform rounded-lg overflow-hidden", 
                        animationState.features[index] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                        "border border-yellow-100 data-[state=open]:border-yellow-300 data-[state=open]:bg-yellow-50"
                      )}
                      style={{
                        transitionDelay: `${(index + 1) * 100}ms`
                      }}
                    >
                      <AccordionTrigger 
                        className={cn(
                          "px-4 py-3 hover:no-underline group transition-all duration-300",
                          "hover:brightness-105 hover:shadow-md"
                        )}
                      >
                        <div className="flex items-center">
                          <span className="text-green-600 mr-2">✅</span>
                          <span className="font-semibold text-base md:text-lg uppercase group-hover:text-shadow-yellow">
                            {feature.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 pt-0 text-gray-600 text-sm">
                        {feature.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              
              <p className={cn(
                "font-medium text-lg italic text-gray-800 transition-all duration-700 transform", 
                animationState.finalLine ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              )}>
                Train when you want. Where you want. Without compromise.
              </p>
            </div>
            
            <div className={cn(
              "flex justify-center items-center transition-all duration-700 h-full order-first md:order-last", 
              isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}>
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
    </section>
  );
};

export default ProductIntro;
