import { useRef, useEffect, useState } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Rocket, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
interface LifestyleFeature {
  title: string;
  description: string;
  className?: string;
}
const lifestyleFeatures: LifestyleFeature[] = [{
  title: "FEEL UNSTOPPABLE",
  description: "Tap into boundless energy to train like never before.",
  className: "font-bold italic"
}, {
  title: "GLOW WITH CONFIDENCE",
  description: "Walk with energy and unstoppable self-belief.",
  className: "glow-effect"
}, {
  title: "WORKOUT YOU'LL ACTUALLY LOVE",
  description: "It's addictive in the best way possible.",
  className: "font-light bg-gradient-to-r from-yellow-light to-yellow"
}];
const LifestyleSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const isInView = useInView(sectionRef, {
    threshold: 0.2
  });

  // Using the animation hook for the title
  useEffect(() => {
    if (!titleRef.current || !isInView) return;
    const handleIntersection = () => {
      titleRef.current?.classList.add('underline-animation');
    };
    handleIntersection();
    return () => {
      if (titleRef.current) {
        titleRef.current.classList.remove('underline-animation');
      }
    };
  }, [isInView, titleRef]);
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };
  return <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Dynamic Background with Parallax Effect */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {Array.from({
        length: 20
      }).map((_, i) => <div key={i} className="absolute rounded-full bg-yellow/10 blur-md parallax-bg" style={{
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
              <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold leading-tight relative inline-block">
                BECOME WORKOUT ADDICT
              </h2>
              
              <div className="space-y-4 text-gray-700">                
                <p className="text-gray-800 font-medium text-lg">
                  Once you feel that flow, you'll never go back
                </p>
              </div>
            </div>
            
            {/* Desktop: Rearranged layout with features and CTA on left, image on right */}
            <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
              {/* Lifestyle Benefits + CTA - Left side on desktop */}
              <div className="space-y-6 w-full md:w-1/2">
                <div className="grid gap-5">
                  {lifestyleFeatures.map((feature, index) => <div key={index} className={cn("px-6 py-3 rounded-full", "transition-all duration-300", "shadow-md hover:shadow-lg", "transform opacity-0 hover:translate-y-[-4px]", feature.className, hoverIndex === index ? "pulse-glow scale-105" : "", isInView ? "animate-fade-in opacity-100" : "")} style={{
                  animationDelay: `${300 + index * 200}ms`,
                  animationDuration: "0.4s",
                  background: feature.className?.includes("gradient") ? "" : "white"
                }} onMouseEnter={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(null)}>
                      <h4 className="text-lg font-semibold transition-all duration-300">
                        {feature.title}
                        {hoverIndex === index && <ArrowRight className="inline-block ml-2 w-4 h-4 animate-slide-in-right" />}
                      </h4>
                      
                      {isExpanded && <p className="text-gray-600 mt-2 animate-fade-in font-medium">
                          {feature.description}
                        </p>}
                    </div>)}
                </div>
                
                {/* Show More Link - Redesigned */}
                <div className="flex items-center ml-3 mt-1">
                  <button onClick={toggleExpanded} className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-800 transition-all duration-300 hover:scale-105 opacity-80 hover:opacity-100">
                    {isExpanded ? <>
                        Show Less <ChevronUp className="h-4 w-4" />
                      </> : <>
                        Show More <ChevronDown className="h-4 w-4" />
                      </>}
                  </button>
                </div>
                
                {/* Redesigned CTA Button - Larger and more curved */}
                <div className="mt-8">
                  <Button className={cn("bg-yellow hover:bg-yellow-dark text-black font-bold py-4 px-8 rounded-full text-lg", "transition-all duration-300 transform hover:scale-105", "shadow-md hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]", "w-full md:w-auto text-center", "flex items-center justify-center space-x-2")}>
                    <span>GET BOXFUN NOW</span> <Rocket className="ml-1 h-5 w-5 animate-float" />
                  </Button>
                  
                  {/* Visual CTA hint */}
                  <p className="text-sm text-gray-500 mt-3">
                    Limited stock available
                  </p>
                </div>
              </div>
              
              {/* Image - Right side on desktop */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-end">
                {/* Mobile Phone Frame with Product Image - slightly smaller */}
                <div className="w-full max-w-xs md:max-w-sm perspective scale-95 transition-transform duration-300">
                  <div className="relative transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                    {/* Mobile Phone Frame */}
                    <div className="absolute inset-0 bg-gray-800 rounded-[36px] shadow-lg transform transition-all duration-300 group-hover:shadow-xl"></div>
                    
                    {/* Phone Screen with Bezel */}
                    <div className="relative rounded-[32px] overflow-hidden border-8 border-gray-800 bg-white shadow-inner">
                      {/* Product Image Inside Phone */}
                      <img src="/bgg.png" alt="BoxFun Product" className="w-full h-auto object-cover transition-all duration-300" />
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