import { useRef } from 'react';
import { useInView, useTextUnderline } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
interface LifestyleFeature {
  title: string;
  description: string;
}
const lifestyleFeatures: LifestyleFeature[] = [{
  title: "MAXIMUM IMPACT",
  description: "Blends seamlessly with any modern space."
}, {
  title: "ON DEMAND",
  description: "Train whenever. No commutes or fees."
}, {
  title: "LIFETIME QUALITY & COMFORT",
  description: "Engineered for daily use and built to last."
}];
const LifestyleSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const keyPhraseRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(sectionRef, {
    threshold: 0.2
  });

  // Use the text underline animation hook
  useTextUnderline(keyPhraseRef, 1000);
  return <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-gray-50">
        {Array.from({
        length: 20
      }).map((_, i) => <div key={i} className="absolute rounded-full bg-yellow/10 blur-md" style={{
        width: `${Math.random() * 30 + 10}px`,
        height: `${Math.random() * 30 + 10}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 10 + 15}s linear infinite`,
        transform: `translateY(${Math.random() * 100}px)`,
        opacity: Math.random() * 0.5 + 0.1
      }} />)}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className={cn("transition-all duration-1000 transform", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            {/* Headline and Main Text - Centered */}
            <div className="space-y-8 mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">BECOME WORKOUT ADDICT</h2>
              
              <div className="space-y-4 text-gray-700">                
                <p ref={keyPhraseRef} className="relative inline-block text-gray-800 font-medium text-lg">Once you feel that flow, you'll never go back</p>
              </div>
            </div>
            
            {/* Desktop: Rearranged layout with features and CTA on left, image on right */}
            <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
              {/* Lifestyle Benefits + CTA - Left side on desktop */}
              <div className="space-y-6 w-full md:w-1/2">
                <div className="grid gap-4">
                  {lifestyleFeatures.map((feature, index) => <div key={index} className={cn("p-4 rounded-lg border border-transparent", "transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-yellow/20", "group bg-white/80 hover:bg-white", "transform opacity-0", isInView ? "animate-fade-in opacity-100" : "")} style={{
                  animationDelay: `${300 + index * 200}ms`
                }}>
                      <h4 className="text-lg font-semibold group-hover:text-shadow-yellow transition-all duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </div>)}
                </div>
                
                {/* CTA Button - Moved under the features */}
                <div className="mt-8">
                  <Button className={cn("bg-yellow hover:bg-yellow-dark text-black font-bold py-4 px-8 rounded-full text-lg", "transition-all duration-300 transform hover:scale-105", "shadow-md hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]", "w-full md:w-auto")}>
                    GET BOXFUN NOW <Rocket className="ml-1 h-5 w-5" />
                  </Button>
                  
                  {/* Visual CTA hint */}
                  <p className="text-sm text-gray-500 mt-3">
                    Limited stock available
                  </p>
                </div>
              </div>
              
              {/* Image - Right side on desktop */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
                {/* Mobile Phone Frame with Product Image */}
                <div className="w-full max-w-md perspective">
                  <div className="relative transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                    {/* Mobile Phone Frame */}
                    <div className="absolute inset-0 bg-gray-800 rounded-[36px] shadow-lg transform transition-all duration-300 group-hover:shadow-xl"></div>
                    
                    {/* Phone Screen with Bezel */}
                    <div className="relative rounded-[32px] overflow-hidden border-8 border-gray-800 bg-white shadow-inner">
                      {/* Product Image Inside Phone */}
                      <img src="/bgg.png" alt="BoxFun Product" className="w-full h-auto object-cover" />
                    </div>
                    
                    {/* Phone Button/Notch */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default LifestyleSection;