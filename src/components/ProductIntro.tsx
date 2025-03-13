
import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';

const features = [{
  title: "Minimalist, Premium Design",
  description: "Crafted with premium materials and a sleek, minimalist aesthetic that complements any modern living space."
}, {
  title: "Instant, Tool-Free Setup",
  description: "Ready to use in minutes with no tools required. Unfold, lock, and begin your premium fitness experience."
}, {
  title: "Lifetime Investment – No Monthly Fees",
  description: "One purchase, endless workouts. No subscriptions, no hidden costs – just lasting quality and performance."
}, {
  title: "Professional Grade Workouts",
  description: "Engineered to deliver the same quality workout experience as professional equipment in premium gyms."
}];

const ProductIntro = () => {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  
  return (
    <section id="product" ref={containerRef} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn("text-center transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-black">
              TURN ANY SPACE INTO YOUR GYM
            </h2>
            
            <p className="mt-6 text-xl">Gain the freedom to train on your terms</p>
            
            <button 
              onClick={() => setExpanded(!expanded)} 
              className="mt-4 flex items-center justify-center mx-auto bg-white border border-gray-200 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-all hover-lift"
            >
              {expanded ? (
                <>Show Less <ChevronUp className="ml-2 w-4 h-4" /></>
              ) : (
                <>Read More <ChevronDown className="ml-2 w-4 h-4" /></>
              )}
            </button>
            
            <div className="mt-8 max-w-3xl mx-auto">
              <video
                className="w-full rounded-2xl shadow-md"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/home-360-tb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          <div className="mt-12">
            <div className={cn("relative overflow-hidden transition-all duration-500", expanded ? "max-h-[1000px]" : "max-h-0")}>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "bg-gray-50 p-6 rounded-2xl transition-all", 
                      "hover:shadow-md hover:-translate-y-1 duration-300"
                    )} 
                    style={{
                      transitionDelay: `${(index + 1) * 100}ms`,
                      animation: `fade-in 0.5s ease-out ${(index + 1) * 100}ms both`
                    }}
                  >
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1486718448742-163732cd1544" 
                  alt="PowerTower Minimalist Design" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductIntro;
