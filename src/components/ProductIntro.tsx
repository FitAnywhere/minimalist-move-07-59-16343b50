
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Card } from '@/components/ui/card';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  
  return (
    <section id="product" ref={containerRef} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Headings at the top */}
          <div className={cn(
            "text-center mb-12 transition-all duration-700", 
            isInView ? "opacity-100" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-black">
              TURN ANY SPACE INTO YOUR GYM
            </h2>
            <p className="mt-6 text-xl">Gain the freedom to train on your terms</p>
          </div>
          
          {/* Two-column layout on desktop, stacked on mobile */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left column (features) on desktop, below video on mobile */}
            <div className={cn(
              "md:order-1 order-2 grid grid-cols-1 gap-6",
              isInView ? "opacity-100" : "opacity-0"
            )}>
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={cn(
                    "p-6 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-gray-50",
                    isInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}
                  style={{
                    transitionDelay: `${(index + 1) * 100}ms`,
                    animation: `fade-in 0.5s ease-out ${(index + 1) * 100}ms both`
                  }}
                >
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
            
            {/* Right column (video) on desktop, above features on mobile */}
            <div className={cn(
              "md:order-2 order-1 flex justify-center items-center transition-all duration-700 mb-8 md:mb-0",
              isInView ? "opacity-100" : "opacity-0 scale-95"
            )}>
              <div className="w-full md:max-w-[90%] rounded-2xl overflow-hidden shadow-md">
                <video
                  className="w-full h-auto object-contain"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductIntro;
