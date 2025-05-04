import { useRef, useState, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
interface TargetAudience {
  imageUrl: string;
  title: string;
  description: string;
}

// Reordered to match the desired sequence: PRIVACY LOVERS, TOTAL BEGINNERS, SPACE-SAVING FANS
const targetAudiences: TargetAudience[] = [{
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745078482/nik_v2extf.jpg",
  title: "PRIVACY LOVERS",
  description: "Win quietly, earn respect forever."
}, {
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745074773/dee_sszbgx.png",
  title: "TOTAL BEGINNERS",
  description: "Easy start to a stronger life."
}, {
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745074862/spa_qpav0e.png",
  title: "SPACE-SAVING FANS",
  description: "Turn your space into strength."
}];
const GymTarget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate carousel for mobile only
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % targetAudiences.length);
    }, 2500); // 2.5 seconds interval

    return () => clearInterval(interval);
  }, [isMobile]);
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/dR65kKbVz15O5bybIZ', '_blank');
  };
  return <section id="target" ref={containerRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center mb-20 transition-all duration-1000", isInView ? "opacity-100" : "opacity-0 translate-y-12")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-16 relative inline-block">
              MADE TO MOVE
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            {/* Desktop view - show grid layout */}
            {!isMobile && <div className="hidden md:grid md:grid-cols-3 gap-8">
                {targetAudiences.map((audience, index) => <div key={index} className={cn("text-center group cursor-pointer transition-all duration-500", "rounded-2xl p-8 bg-white border-2 border-gray-100 hover:border-yellow hover:shadow-xl", "transform hover:-translate-y-2", isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12")} style={{
              transitionDelay: `${index * 150}ms`
            }}>
                    <div className={cn("relative w-full overflow-hidden flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-all duration-500", "aspect-[2/3] rounded-2xl")}>
                      <img src={audience.imageUrl} alt={audience.title} className="w-full h-full object-cover rounded-2xl" />
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-black mb-2">
                      {audience.title}
                    </h3>
                    <p className="text-gray-700 text-base md:text-lg">
                      {audience.description}
                    </p>
                  </div>)}
              </div>}
            
            {/* Mobile view - show carousel */}
            {isMobile && <div className="block md:hidden">
                <div className="relative overflow-hidden">
                  <div className="flex justify-center">
                    {targetAudiences.map((audience, index) => <div key={index} className={cn("text-center transition-all duration-500 absolute w-full", index === activeIndex ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full")}>
                        <div className="flex justify-center items-center mb-4">
                          <div className="w-[80%] h-auto overflow-hidden flex items-center justify-center">
                            <img src={audience.imageUrl} alt={audience.title} className="w-full h-auto object-contain rounded-xl" style={{
                        maxHeight: '300px',
                        // Increased height by ~45%
                        width: 'auto',
                        margin: '0 auto'
                      }} />
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-black mb-2">
                          {audience.title}
                        </h3>
                        <p className="text-gray-700 text-base mx-auto" style={{
                    maxWidth: '85%'
                  }}>
                          {audience.description}
                        </p>
                      </div>)}
                  </div>
                  
                  {/* Carousel indicators */}
                  <div className="flex justify-center mt-6 gap-2 py-[172px]">
                    {targetAudiences.map((_, index) => <span key={index} className={cn("w-2 h-2 rounded-full transition-all duration-300", index === activeIndex ? "bg-yellow w-4" : "bg-gray-300")} />)}
                  </div>
                </div>
              </div>}
            
            {/* CTA Button - Centered */}
            <div className="mt-12 flex justify-center">
              <Button onClick={handleCheckout} className={cn("bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105")} size="lg">
                🛒 GET YOURS
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default GymTarget;