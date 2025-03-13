
import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
        <div className="max-w-5xl mx-auto">
          {/* Desktop: Two-column layout, Mobile: Stacked layout */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Column (Desktop) / Top (Mobile) - Text Content */}
            <div className={cn(
              "transition-all duration-700", 
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              <h2 className="text-black text-center md:text-left">
                TURN ANY SPACE INTO YOUR GYM
              </h2>
              
              <p className="mt-6 text-xl text-center md:text-left">
                Gain the freedom to train on your terms
              </p>
              
              {/* Collapsible content that appears below the subheading when "Read More" is clicked */}
              <Collapsible
                open={expanded}
                onOpenChange={setExpanded}
                className="mt-6"
              >
                <CollapsibleContent className="space-y-4">
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
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            {/* Right Column (Desktop) / Bottom (Mobile) - Video and Read More Button */}
            <div className={cn(
              "flex flex-col items-center transition-all duration-700", 
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              {/* Video Container - 50% smaller on desktop, 30% smaller on mobile */}
              <div className="w-[70%] md:w-[50%] aspect-video rounded-2xl overflow-hidden shadow-md mb-6">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/home-360-tb.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Read More Button - Always positioned below the video */}
              <CollapsibleTrigger asChild>
                <Button 
                  onClick={() => setExpanded(!expanded)} 
                  className="mt-4 px-6 py-3 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-all hover-lift flex items-center gap-2"
                  variant="outline"
                >
                  {expanded ? (
                    <>Show Less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Read More <ChevronDown className="h-4 w-4" /></>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductIntro;
