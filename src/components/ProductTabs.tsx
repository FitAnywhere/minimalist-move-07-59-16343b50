
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, Zap, Globe, Settings, Feather, Waves, ChevronDown, ChevronUp } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Keep the bandsFeatures array the same
const bandsFeatures = [{
  title: "Beginner friendly",
  description: "Extra support for confident moves",
  icon: Check
}, {
  title: "Pro challenge",
  description: "Add intensity to break plateaus",
  icon: Zap
}, {
  title: "Portable & versatile",
  description: "Train anywhere, anytime",
  icon: Globe
}];

// Updated trxFeatures with new content
const trxFeatures = [{
  title: "🌀 Adaptive Strength",
  description: "Tilt, pull, or push. Your intensity, your rules.",
  icon: Zap
}, {
  title: "🌍 Gravity in Your Favor",
  description: "No weights. No restrictions. Just pure movement.",
  icon: Feather
}, {
  title: "🌊 Seamless Motion",
  description: "Full-body workouts with effortless control.",
  icon: Waves
}];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState<'trx' | 'bands'>('trx');
  const [trxExpanded, setTrxExpanded] = useState(false);
  const [bandsExpanded, setBandsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trxVideoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef);
  const isVideoInView = useInView(trxVideoRef, { threshold: 0.3 });

  return <section id="accessories" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn("text-center mb-12 transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-black">MAXIMIZE YOUR EXPERIENCE</h2>
            <p className="mt-4 text-gray-600 text-2xl">Expand your PowerTower</p>
          </div>
          
          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-gray-200 p-1 bg-white">
              <button onClick={() => setActiveTab('trx')} className={cn("px-6 py-3 rounded-full text-sm font-medium transition-all duration-300", activeTab === 'trx' ? "bg-yellow text-black" : "bg-transparent text-gray-600 hover:bg-gray-50")}>
                TRX
              </button>
              <button onClick={() => setActiveTab('bands')} className={cn("px-6 py-3 rounded-full text-sm font-medium transition-all duration-300", activeTab === 'bands' ? "bg-yellow text-black" : "bg-transparent text-gray-600 hover:bg-gray-50")}>
                BANDS
              </button>
            </div>
          </div>
          
          {/* TRX Content - Updated with new design and content */}
          <div className={cn("transition-all duration-500", activeTab === 'trx' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 hidden')}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                {/* Updated title with animation */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold mb-1 group transition-all duration-300">
                    <span className="inline-flex items-center relative group-hover:text-yellow-600">
                      ⚡ EXPAND YOUR POWER
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></span>
                    </span>
                  </h3>
                  <p className="text-lg text-gray-700 mb-4">Master your body. Move with purpose.</p>
                </div>
                
                {/* Feature points with collapsible content */}
                <Collapsible 
                  open={trxExpanded} 
                  onOpenChange={setTrxExpanded}
                  className="w-full"
                >
                  <div className="space-y-5">
                    {trxFeatures.map((feature, index) => (
                      <div 
                        key={index} 
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
                            <feature.icon 
                              className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-600" 
                            />
                            <h4 className="font-semibold group-hover:text-black relative">
                              {feature.title}
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <CollapsibleContent className="space-y-4">
                    {trxFeatures.map((feature, index) => (
                      <div 
                        key={`desc-${index}`} 
                        className={cn(
                          "pl-7 transition-all duration-500 opacity-0 translate-y-2",
                          trxExpanded ? "opacity-100 translate-y-0" : ""
                        )} 
                        style={{
                          transitionDelay: trxExpanded ? `${index * 150}ms` : "0ms"
                        }}
                      >
                        <p className="text-gray-600 relative">
                          {feature.description}
                          <span className="absolute inset-0 bg-gradient-to-r from-yellow-50/0 to-yellow-50/0 hover:from-yellow-50 hover:to-yellow-50/0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></span>
                        </p>
                      </div>
                    ))}
                    
                    <div 
                      className={cn(
                        "mt-4 font-medium text-gray-700 italic transition-all duration-500 opacity-0 translate-y-2",
                        trxExpanded ? "opacity-100 translate-y-0" : ""
                      )} 
                      style={{
                        transitionDelay: trxExpanded ? "450ms" : "0ms"
                      }}
                    >
                      No more crowded gyms. Just pure movement on your terms.
                    </div>
                  </CollapsibleContent>
                  
                  {/* Show More/Less Button - Fixed: moved inside Collapsible */}
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors mt-2">
                      {trxExpanded ? 
                        <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></> : 
                        <>Show More <ChevronDown className="ml-1 w-4 h-4" />
                      </>}
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
              
              {/* Video container with enhancements */}
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
          
          {/* BANDS Content - Keep this unchanged */}
          <div className={cn("transition-all duration-500", activeTab === 'bands' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 hidden')}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                <video 
                  src="/bands.mp4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold mb-3">BANDS</h3>
                <p className="text-lg text-gray-600 mb-6">No excuses</p>
                
                {/* Fixed: Wrapped the bands content in a Collapsible component */}
                <Collapsible open={bandsExpanded} onOpenChange={setBandsExpanded}>
                  <div className="space-y-4 mb-6">
                    {bandsFeatures.map((feature, index) => (
                      <div key={index} className="transition-all duration-300">
                        <div className="group relative">
                          <div className="flex items-center gap-2 mb-1">
                            <feature.icon 
                              className="w-5 h-5 text-gray-800 transition-transform duration-300 group-hover:animate-bounce" 
                            />
                            <h4 className="font-semibold group-hover:text-black relative">
                              {feature.title}
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                            </h4>
                          </div>
                          <CollapsibleContent>
                            <div className="pl-7 relative">
                              <p className="text-gray-600">{feature.description}</p>
                              <div className="absolute inset-0 bg-yellow-300/0 group-hover:bg-yellow-300/10 rounded-lg transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] -z-10"></div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors">
                      {bandsExpanded ? <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></> : <>Read More <ChevronDown className="ml-1 w-4 h-4" /></>}
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default ProductTabs;
