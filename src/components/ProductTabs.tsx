
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Zap, Globe, Feather, Waves, ChevronDown, ChevronUp, Flame, Backpack } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FloatingParticles from './FloatingParticles';
import { useIsMobile } from '@/hooks/use-mobile';

const bandsFeatures = [
  {
    title: "⚡ Effortless Assistance",
    description: "Lighten the load and build strength with confidence.",
    icon: Zap
  }, 
  {
    title: "🔥 Next-Level Resistance",
    description: "Push past plateaus, and keep progressing.",
    icon: Flame
  }, 
  {
    title: "🎒 Anywhere, Anytime",
    description: "Unfold, clip in, and train—whether at home or on the go.",
    icon: Backpack
  }
];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState<'trx' | 'bands'>('trx');
  const [bandsExpandedFeatures, setBandsExpandedFeatures] = useState<Record<number, boolean>>({});
  const [bulletPointsVisible, setBulletPointsVisible] = useState<boolean[]>([false, false, false]);
  const [headingHovered, setHeadingHovered] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const trxVideoRef = useRef<HTMLDivElement>(null);
  const bandsVideoRef = useRef<HTMLDivElement>(null);
  const trxTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  
  const isInView = useInView(sectionRef);
  const isVideoInView = useInView(trxVideoRef, {
    threshold: 0.3
  });
  const isBandsVideoInView = useInView(bandsVideoRef, {
    threshold: 0.3
  });
  const isTrxTextInView = useInView(trxTextRef, {
    threshold: 0.2
  });
  
  const isMobile = useIsMobile();

  // Staggered animation for bullet points
  useEffect(() => {
    if (isTrxTextInView) {
      const timers = [0, 200, 400].map((delay, index) => 
        setTimeout(() => {
          setBulletPointsVisible(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, delay)
      );
      
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [isTrxTextInView]);

  const toggleBandsFeature = (index: number) => {
    setBandsExpandedFeatures(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const areAllBandsFeaturesExpanded = () => {
    return bandsFeatures.every((_, index) => bandsExpandedFeatures[index]);
  };

  const handleHeadingHover = (isHovered: boolean) => {
    setHeadingHovered(isHovered);
    if (isHovered) {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 300);
    }
  };

  return (
    <section id="accessories" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn(
            "text-center mb-12 transition-all duration-700", 
            isInView ? "opacity-100" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              MAXIMIZE YOUR EXPERIENCE
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
          </div>
          
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-gray-200 p-1 bg-white">
              <button 
                onClick={() => setActiveTab('trx')} 
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300", 
                  activeTab === 'trx' ? "bg-yellow text-black" : "bg-transparent text-gray-600 hover:bg-gray-50"
                )}
              >
                TRX
              </button>
              <button 
                onClick={() => setActiveTab('bands')} 
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300", 
                  activeTab === 'bands' ? "bg-yellow text-black" : "bg-transparent text-gray-600 hover:bg-gray-50"
                )}
              >
                BANDS
              </button>
            </div>
          </div>
          
          <div className={cn(
            "transition-all duration-500", 
            activeTab === 'trx' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 hidden'
          )}>
            <div className={cn(
              "grid gap-8 items-center",
              isMobile ? "grid-cols-1" : "md:grid-cols-2"
            )}>
              {/* Video section - conditionally ordered based on viewport */}
              <div 
                ref={trxVideoRef} 
                className={cn(
                  "rounded-2xl overflow-hidden transition-all duration-700", 
                  isVideoInView ? "shadow-[0_0_20px_rgba(255,215,0,0.2)]" : "shadow-lg", 
                  isVideoInView ? "scale-[1.02]" : "scale-100",
                  isMobile ? "order-1" : "order-2"
                )}
              >
                <video 
                  src="/trx.mp4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-1000", 
                    isVideoInView ? "scale-[1.05]" : "scale-100"
                  )} 
                />
              </div>
              
              {/* Text section - conditionally ordered based on viewport */}
              <div 
                ref={trxTextRef} 
                className={cn(
                  "space-y-8 md:pr-6 transition-all duration-500",
                  isTrxTextInView ? "opacity-100" : "opacity-0 translate-y-4",
                  isMobile ? "order-2" : "order-1"
                )}
              >
                <div className={cn(
                  "relative space-y-2 transition-all duration-700",
                  isTrxTextInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <h3 
                    ref={headingRef}
                    className={cn(
                      "text-xl md:text-2xl font-semibold mb-3 transition-all duration-500 leading-tight tracking-wider text-gray-700 relative z-10",
                      isTrxTextInView ? "scale-100" : "scale-95",
                      pulsing ? "text-shadow-yellow" : ""
                    )}
                    onMouseEnter={() => handleHeadingHover(true)}
                    onMouseLeave={() => handleHeadingHover(false)}
                  >
                    MOVE THE WAY YOUR BODY WAS BUILT TO
                  </h3>
                  
                  {/* Particles container */}
                  <div className="absolute inset-0 w-full h-full">
                    <FloatingParticles isHovered={headingHovered} />
                  </div>
                </div>
                
                <div className="space-y-8 md:space-y-9 mt-8 relative z-10">
                  <div className={cn(
                    "flex items-start gap-3 transition-all duration-700 transform",
                    bulletPointsVisible[0] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <p className="text-gray-700 text-lg font-medium uppercase hover:scale-[1.02] transition-transform duration-300">🔹 NO MACHINES. NO RESTRICTIONS.</p>
                  </div>
                  <div className={cn(
                    "flex items-start gap-3 transition-all duration-700 transform",
                    bulletPointsVisible[1] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <p className="text-gray-700 text-lg font-medium uppercase hover:scale-[1.02] transition-transform duration-300">🔹 PULL, PUSH, OR HOLD.</p>
                  </div>
                  <div className={cn(
                    "flex items-start gap-3 transition-all duration-700 transform",
                    bulletPointsVisible[2] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <p className="text-gray-700 text-lg font-medium uppercase hover:scale-[1.02] transition-transform duration-300">🔹 YOUR INTENSITY. YOUR RULES.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "transition-all duration-500", 
            activeTab === 'bands' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 hidden'
          )}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 space-y-6">
                <div className="space-y-2 mb-6">
                  <h3 className="text-2xl font-bold group transition-all duration-300">
                    <span className="inline-flex items-center relative group-hover:text-yellow-600">
                      AMPLIFY YOUR WORKOUT
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    </span>
                  </h3>
                  <p className="text-lg text-gray-700">More power. More support. No limits.</p>
                </div>
                
                <div className="space-y-5 mb-6">
                  {bandsFeatures.map((feature, index) => (
                    <Collapsible 
                      key={index} 
                      className="w-full" 
                      open={!!bandsExpandedFeatures[index]} 
                      onOpenChange={() => toggleBandsFeature(index)}
                    >
                      <div 
                        className={cn(
                          "transition-all duration-500 transform", 
                          isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        )} 
                        style={{
                          transitionDelay: isInView ? `${index * 200}ms` : "0ms"
                        }}
                      >
                        <div className="group relative">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold group-hover:text-black relative">
                              {feature.title}
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                            </h4>
                          </div>
                        </div>
                      </div>
                      
                      <CollapsibleContent className="space-y-4 pl-7 mb-3">
                        <div 
                          className={cn(
                            "transition-all duration-500 opacity-0 translate-y-2", 
                            bandsExpandedFeatures[index] ? "opacity-100 translate-y-0" : ""
                          )} 
                          style={{
                            transitionDelay: bandsExpandedFeatures[index] ? `150ms` : "0ms"
                          }}
                        >
                          <p className="text-gray-600 relative">
                            {feature.description}
                            <span className="absolute inset-0 bg-gradient-to-r from-yellow-50/0 to-yellow-50/0 hover:from-yellow-50 hover:to-yellow-50/0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></span>
                          </p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
                
                <div className="mt-4 font-medium text-gray-700 italic">
                  From first reps to peak performance—bands move with you.
                </div>
                
                <div className="mt-2">
                  <button 
                    onClick={() => {
                      const allExpanded = areAllBandsFeaturesExpanded();
                      const newState = !allExpanded;
                      const updatedState: Record<number, boolean> = {};
                      bandsFeatures.forEach((_, index) => {
                        updatedState[index] = newState;
                      });
                      setBandsExpandedFeatures(updatedState);
                    }} 
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
                  >
                    {areAllBandsFeaturesExpanded() ? 
                      <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></> : 
                      <>Show More <ChevronDown className="ml-1 w-4 h-4" /></>
                    }
                  </button>
                </div>
              </div>
              
              <div 
                ref={bandsVideoRef} 
                className={cn(
                  "order-1 md:order-2 rounded-2xl overflow-hidden transition-all duration-700", 
                  isBandsVideoInView ? "shadow-[0_0_20px_rgba(255,215,0,0.2)]" : "shadow-lg", 
                  isBandsVideoInView ? "scale-[1.02]" : "scale-100"
                )}
              >
                <video 
                  src="/bands.mp4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-1000", 
                    isBandsVideoInView ? "scale-[1.05]" : "scale-100"
                  )} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
