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
  return <section id="product" ref={containerRef} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Headings at the top */}
          <div className={cn("text-center mb-12 transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-black">TRANSFORM ANY SPACE </h2>
            <p className="mt-6 text-2xl">Gain the freedom to train on your terms</p>
          </div>
          
          {/* Two-column layout on desktop, stacked on mobile */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left column (features) on desktop */}
            <div className="flex flex-col space-y-6">
              {features.map((feature, index) => <Card key={index} className={cn("p-5 md:p-7 rounded-2xl bg-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-yellow-400/40", isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8")} style={{
              transitionDelay: `${(index + 1) * 200}ms`,
              animation: `fade-in 0.5s ease-out ${(index + 1) * 200}ms both`,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
                  <h4 className="font-semibold mb-3 text-lg md:text-xl">{feature.title}</h4>
                  <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
                </Card>)}
            </div>
            
            {/* Right column (video) on desktop */}
            <div className={cn("flex justify-center items-center transition-all duration-700 h-full", isInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
                <video className="w-full h-auto object-contain" autoPlay muted loop playsInline>
                  <source src="/home-360-tb.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ProductIntro;