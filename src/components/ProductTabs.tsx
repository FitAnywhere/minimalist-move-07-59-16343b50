
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useInView } from '@/utils/animations';

const trxFeatures = [{
  title: "Personalized intensity",
  description: "Shift your angle to dial in the perfect challenge."
}, {
  title: "Gravity powered strength",
  description: "Harness your weight for balance and power."
}, {
  title: "Dynamic flow",
  description: "Unlock versatile, full body workouts."
}];

const bandsFeatures = [{
  title: "Beginner-Friendly",
  description: "Extra support for easier, confident moves."
}, {
  title: "Pro-Level Challenge",
  description: "Add intensity to break plateaus."
}, {
  title: "Portable & Versatile",
  description: "Train anywhere, anytime."
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
                <h3 className="text-2xl font-bold mb-3">Experience TRX</h3>
                <p className="text-lg text-gray-600 mb-6">Turn movement into fun while stressing less and sweating more.</p>
                
                <div className={cn("relative overflow-hidden transition-all duration-500", trxExpanded ? "max-h-[1000px]" : "max-h-0")}>
                  <div className="space-y-4 mb-6">
                    {trxFeatures.map((feature, index) => <div key={index} className="transition-all duration-300" style={{
                    animationDelay: `${index * 100}ms`
                  }}>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>)}
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
                <p className="text-lg text-gray-600 mb-6">Expand your PowerTower</p>
                
                <div className={cn("relative overflow-hidden transition-all duration-500", bandsExpanded ? "max-h-[1000px]" : "max-h-0")}>
                  <div className="space-y-4 mb-6">
                    {bandsFeatures.map((feature, index) => <div key={index} className="transition-all duration-300" style={{
                    animationDelay: `${index * 100}ms`
                  }}>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>)}
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
