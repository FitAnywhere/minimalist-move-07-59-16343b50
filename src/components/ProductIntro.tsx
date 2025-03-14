
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Card } from '@/components/ui/card';

const features = [{
  title: "2-Minute, tool free setup",
  description: "Unfold, lock, and go—no installation needed."
}, {
  title: "Foldable & lightweight",
  description: "Store with ease, move effortlessly, train anywhere."
}, {
  title: "Lifetime durability",
  description: "Premium build—no fees, no hidden costs."
}, {
  title: "Professional versatility",
  description: "One station, endless workouts for every muscle group."
}];

const ProductIntro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  
  return <section id="product" ref={containerRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Headings at the top */}
          <div className={cn("text-center mb-10 transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-black">TRANSFORM ANY SPACE </h2>
            <p className="mt-6 text-2xl">Freedom to stay strong and healthy on your terms</p>
          </div>
          
          {/* Two-column layout on desktop, stacked on mobile with video above boxes */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Video above on mobile, left column on desktop */}
            <div className={cn("flex justify-center items-center transition-all duration-700 h-full order-first md:order-last", isInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
              <div className="w-full max-w-[70%] mx-auto rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                <video className="w-full h-auto object-contain" autoPlay muted loop playsInline>
                  <source src="/home-360-tb.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            
            {/* Boxes below on mobile, right column on desktop */}
            <div className="flex flex-col space-y-4 order-last md:order-first">
              {features.map((feature, index) => <Card key={index} className={cn("p-4 md:p-5 rounded-2xl bg-white border border-yellow-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-yellow-300", isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8")} style={{
              transitionDelay: `${(index + 1) * 200}ms`,
              animation: `fade-in 0.5s ease-out ${(index + 1) * 200}ms both`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
            }}>
                  <h4 className="font-semibold mb-2 text-base md:text-lg">{feature.title}</h4>
                  <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
                </Card>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default ProductIntro;
