
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useInView } from '@/utils/animations';

const boxFunFeatures = [
  {
    title: "Portable & Powerful",
    description: "Take your boxing workouts anywhere with this lightweight yet durable attachment."
  },
  {
    title: "Pro-Level Boxing Workouts",
    description: "Experience studio-quality boxing training without the expensive memberships."
  },
  {
    title: "Aesthetic & Functional Design",
    description: "Sleek design that complements your PowerTower while delivering professional functionality."
  },
  {
    title: "Zero Installation, Instant Action",
    description: "Attaches in seconds to your PowerTower system – ready whenever inspiration strikes."
  }
];

const resistanceBandFeatures = [
  {
    title: "Enhanced Strength & Mobility",
    description: "Target specific muscle groups for comprehensive strength and mobility training."
  },
  {
    title: "Ultra-Portable Convenience",
    description: "Lightweight and compact – ideal for travel, outdoor workouts, or small spaces."
  },
  {
    title: "Ideal for All Fitness Levels",
    description: "Progressive resistance options suitable for beginners to advanced athletes."
  }
];

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState<'boxfun' | 'bands'>('boxfun');
  const [boxFunExpanded, setBoxFunExpanded] = useState(false);
  const [bandsExpanded, setBandsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  
  return (
    <section 
      id="accessories" 
      ref={sectionRef}
      className="py-24 bg-gray-50"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            className={cn(
              "text-center mb-12 transition-all duration-700",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            <h2 className="text-black">
              Complete Your System
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Essential accessories designed to maximize your fitness experience
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-gray-200 p-1 bg-white">
              <button
                onClick={() => setActiveTab('boxfun')}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
                  activeTab === 'boxfun' 
                    ? "bg-yellow text-black" 
                    : "bg-transparent text-gray-600 hover:bg-gray-50"
                )}
              >
                BoxFun
              </button>
              <button
                onClick={() => setActiveTab('bands')}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
                  activeTab === 'bands' 
                    ? "bg-yellow text-black" 
                    : "bg-transparent text-gray-600 hover:bg-gray-50"
                )}
              >
                Resistance Bands
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className={cn(
            "transition-all duration-500",
            activeTab === 'boxfun' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 hidden'
          )}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-3">Experience BoxFun</h3>
                <p className="text-lg text-gray-600 mb-6">Box Anytime, Anywhere.</p>
                
                <div 
                  className={cn(
                    "relative overflow-hidden transition-all duration-500",
                    boxFunExpanded ? "max-h-[1000px]" : "max-h-0"
                  )}
                >
                  <div className="space-y-4 mb-6">
                    {boxFunFeatures.map((feature, index) => (
                      <div 
                        key={index}
                        className="transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setBoxFunExpanded(!boxFunExpanded)}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {boxFunExpanded ? (
                    <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></>
                  ) : (
                    <>Read More <ChevronDown className="ml-1 w-4 h-4" /></>
                  )}
                </button>
              </div>
              
              <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1527576539890-dfa815648363" 
                  alt="BoxFun Attachment" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className={cn(
            "transition-all duration-500",
            activeTab === 'bands' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 hidden'
          )}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1433086966358-54859d0ed716" 
                  alt="Resistance Bands" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="order-1 md:order-2">
                <h3 className="text-2xl font-bold mb-3">Resistance Bands</h3>
                <p className="text-lg text-gray-600 mb-6">The Perfect Finishing Touch.</p>
                
                <div 
                  className={cn(
                    "relative overflow-hidden transition-all duration-500",
                    bandsExpanded ? "max-h-[1000px]" : "max-h-0"
                  )}
                >
                  <div className="space-y-4 mb-6">
                    {resistanceBandFeatures.map((feature, index) => (
                      <div 
                        key={index}
                        className="transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => setBandsExpanded(!bandsExpanded)}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  {bandsExpanded ? (
                    <>Show Less <ChevronUp className="ml-1 w-4 h-4" /></>
                  ) : (
                    <>Read More <ChevronDown className="ml-1 w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
