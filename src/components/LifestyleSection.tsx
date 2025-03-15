
import { useRef, useState, useEffect } from 'react';
import { useInView, useParallax } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

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
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });
  const [highlightedText, setHighlightedText] = useState(false);
  
  // Initialize parallax effect on the background
  useParallax(backgroundRef, 0.05);
  
  // Trigger the text underline animation when in view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setHighlightedText(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isInView]);
  
  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
    >
      {/* Parallax Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full z-0 opacity-5"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/e524ebde-bbdd-4668-bfd4-595182310d6b.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "grid md:grid-cols-2 gap-12 items-center",
            "transition-all duration-1000 transform",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
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
                  
                  <p className={cn(
                    "relative inline-block text-gray-800 font-medium",
                    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:bg-yellow/60 after:rounded-full",
                    highlightedText ? "after:w-full after:transition-all after:duration-[1.5s]" : "after:w-0"
                  )}>
                    Every swing melts tension, every strike hones focus, and every session leaves you energized.
                  </p>
                </div>
                
                <p className="text-lg font-medium italic pt-4">
                  This isn't just a workout—it's a mind-body upgrade wrapped in premium materials. 
                  Once you feel that flow, you'll never go back.
                </p>
              </div>
              
              {/* Lifestyle Benefits */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold tracking-wide">WHY IT FITS YOUR LIFESTYLE</h3>
                
                <div className="space-y-4">
                  {lifestyleFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border border-transparent",
                        "transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-yellow-100",
                        "group",
                        "transition-opacity delay-[200] transform",
                        isInView ? "opacity-100" : "opacity-0",
                      )}
                      style={{
                        transitionDelay: `${300 + (index * 200)}ms`
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
            </div>
            
            {/* Image & CTA */}
            <div className={cn(
              "flex flex-col items-center space-y-6",
              "transition-all duration-700 delay-500 transform",
              isInView ? "opacity-100" : "opacity-0 translate-y-10"
            )}>
              {/* BoxFun Cap Image */}
              <div className="w-full max-w-md mx-auto perspective">
                <div className={cn(
                  "relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl",
                  "group"
                )}>
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
              <div className="w-full max-w-md mx-auto text-center mt-8">
                <Button 
                  className={cn(
                    "bg-yellow hover:bg-yellow-dark text-black font-bold py-3 px-8 rounded-full text-lg",
                    "transition-all duration-300 transform hover:scale-105",
                    "shadow-md hover:shadow-xl", 
                    "animate-[pulse_4s_ease-in-out_infinite]",
                    "w-full md:w-auto"
                  )}
                >
                  ORDER YOUR BOXFUN CAP <ChevronRight className="ml-1 h-5 w-5" />
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
    </section>
  );
};

export default LifestyleSection;
