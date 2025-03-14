
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, Zap, Globe, Settings, Feather, Waves, ChevronDown, ChevronUp } from 'lucide-react';
import { useInView } from '@/utils/animations';

const trxFeatures = [{
  title: "Personalized intensity",
  description: "Shift your angle for perfect challenge",
  icon: Settings
}, {
  title: "Gravity powered",
  description: "Harness your weight",
  icon: Feather
}, {
  title: "Dynamic flow",
  description: "Unlock full body workouts",
  icon: Waves
}];

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

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState<'trx' | 'bands'>('trx');
  const [trxExpanded, setTrxExpanded] = useState(false);
  const [bandsExpanded, setBandsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

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
          
          {/* Content */}
          <div className={cn("transition-all duration-500", activeTab === 'trx' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 hidden')}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-3">TRX</h3>
                <p className="text-lg text-gray-600 mb-6">Train smarter</p>
                
                <div className={cn("relative overflow-hidden transition-all duration-500", trxExpanded ? "max-h-[1000px]" : "max-h-0")}>
                  <div className="space-y-4 mb-6">
                    {trxFeatures.map((feature, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "transition-all duration-500 opacity-0 translate-y-4",
                          trxExpanded && "opacity-100 translate-y-0"
                        )} 
                        style={{
                          transitionDelay: trxExpanded ? `${index * 200}ms` : "0ms"
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
                          <div className="relative pl-7">
                            <p className="text-gray-600">{feature.description}</p>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-yellow-50 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button onClick={() => setTrxExpanded(!trxExpanded)} className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors">
                  {trxExpanded ? <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></> : <>Read More <ChevronDown className="ml-1 w-4 h-4" /></>}
                </button>
              </div>
              
              <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                <video 
                  src="/trx.mp4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
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
                
                <div className={cn("relative overflow-hidden transition-all duration-500", bandsExpanded ? "max-h-[1000px]" : "max-h-0")}>
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
                          <div className="pl-7 relative">
                            <p className="text-gray-600">{feature.description}</p>
                            <div className="absolute inset-0 bg-yellow-300/0 group-hover:bg-yellow-300/10 rounded-lg transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] -z-10"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button onClick={() => setBandsExpanded(!bandsExpanded)} className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors">
                  {bandsExpanded ? <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></> : <>Read More <ChevronDown className="ml-1 w-4 h-4" /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default ProductTabs;
