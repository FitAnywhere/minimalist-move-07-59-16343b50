import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, Zap, Globe, Feather, Waves, ChevronDown, ChevronUp, Flame, Backpack } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  
  const sectionRef = useRef<HTMLElement>(null);
  const trxVideoRef = useRef<HTMLDivElement>(null);
  const bandsVideoRef = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(sectionRef);
  const isVideoInView = useInView(trxVideoRef, {
    threshold: 0.3
  });
  const isBandsVideoInView = useInView(bandsVideoRef, {
    threshold: 0.3
  });

  const toggleBandsFeature = (index: number) => {
    setBandsExpandedFeatures(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const areAllBandsFeaturesExpanded = () => {
    return bandsFeatures.every((_, index) => bandsExpandedFeatures[index]);
  };

  return (
    <section id="accessories" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn(
            "text-center mb-12 transition-all duration-700", 
            isInView ? "opacity-100" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-black">MAXIMIZE YOUR EXPERIENCE</h2>
            
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
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold mb-1">
                    MOVE THE WAY YOUR BODY WAS BUILT TO
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <p className="text-gray-700">🔹 No machines. No restrictions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <p className="text-gray-700">🔹 Pull, push, or hold</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <p className="text-gray-700">🔹 Your intensity, your rules</p>
                  </div>
                </div>
              </div>
              
              <div 
                ref={trxVideoRef} 
                className={cn(
                  "rounded-2xl overflow-hidden transition-all duration-700", 
                  isVideoInView ? "shadow-[0_0_20px_rgba(255,215,0,0.2)]" : "shadow-lg", 
                  isVideoInView ? "scale-[1.02]" : "scale-100"
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
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
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
