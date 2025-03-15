
import { useRef, useState, useEffect } from 'react';
import { useInView, useTextUnderline } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

interface LifestyleFeature {
  title: string;
  description: string;
}

const lifestyleFeatures: LifestyleFeature[] = [
  {
    title: "Minimalist Design, Maximum Impact",
    description: "Seamlessly blends with any modern interior."
  },
  {
    title: "On-Demand Convenience",
    description: "Train on your schedule—no commutes, no monthly fees."
  },
  {
    title: "Lifetime Quality & Comfort",
    description: "Engineered for everyday performance and built to last."
  }
];

const LifestyleSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const keyPhraseRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });
  
  // Use the text underline animation hook
  useTextUnderline(keyPhraseRef, 1000);
  
  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
    >
      {/* Floating Particles Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-yellow/10 blur-md"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 15}s linear infinite`,
              transform: `translateY(${Math.random() * 100}px)`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "transition-all duration-1000 transform",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {/* Headline and Main Text - Full Width */}
            <div className="space-y-8 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                What if fitness was something you couldn't wait to do?
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  A ritual that sharpens your mind, syncs your breath, and leaves you unstoppable.
                </p>
                
                <p>No more crowded gyms or clunky gear.</p>
                
                <p>
                  Just a sleek, comfortable BoxFun cap that transforms your living room into a 
                  stress-relieving, cardio-charged playground.
                </p>
                
                <p ref={keyPhraseRef} className="relative inline-block text-gray-800 font-medium">
                  Every swing melts tension, every strike hones focus, and every session leaves you energized.
                </p>
              </div>
              
              <p className="text-lg font-medium italic pt-4">
                This isn't just a workout—it's a mind-body upgrade wrapped in premium materials. 
                Once you feel that flow, you'll never go back.
              </p>
            </div>
            
            {/* Desktop: Right-aligned image + CTA */}
            <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
              {/* Lifestyle Benefits - Left side on desktop, full width on mobile */}
              <div className="space-y-6 w-full md:w-1/2">
                <h3 className="text-xl font-bold tracking-wide">WHY IT FITS YOUR LIFESTYLE</h3>
                
                <div className="grid gap-4">
                  {lifestyleFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border border-transparent",
                        "transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-yellow/20",
                        "group bg-white/80 hover:bg-white",
                        "transform opacity-0",
                        isInView ? "animate-fade-in opacity-100" : ""
                      )}
                      style={{
                        animationDelay: `${300 + (index * 200)}ms`
                      }}
                    >
                      <h4 className="text-lg font-semibold group-hover:text-shadow-yellow transition-all duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Image & CTA - Right side on desktop, centered on mobile */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-end space-y-6">
                {/* BoxFun Cap Image */}
                <div className="w-full max-w-md perspective">
                  <div className="relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                    <img 
                      src="/lovable-uploads/e524ebde-bbdd-4668-bfd4-595182310d6b.png" 
                      alt="BoxFun Cap" 
                      className="w-full h-auto object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="w-full max-w-md text-center">
                  <Button 
                    className={cn(
                      "bg-yellow hover:bg-yellow-dark text-black font-bold py-4 px-8 rounded-full text-lg",
                      "transition-all duration-300 transform hover:scale-105",
                      "shadow-md hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]", 
                      "animate-pulse",
                      "w-full md:w-auto"
                    )}
                  >
                    GET YOUR BOXFUN CAP NOW <Rocket className="ml-1 h-5 w-5" />
                  </Button>
                  
                  {/* Visual CTA hint */}
                  <p className="text-sm text-gray-500 mt-3">
                    Limited stock available for summer release
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
