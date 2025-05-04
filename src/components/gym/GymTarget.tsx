
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

// Reordered as requested: Privacy Lovers, Total Beginners, Space-Saving Fans
const targetAudiences: TargetAudience[] = [
  {
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745078482/nik_v2extf.jpg",
    title: "PRIVACY LOVERS",
    description: "Win quietly, earn respect forever."
  },
  {
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745074773/dee_sszbgx.png",
    title: "TOTAL BEGINNERS",
    description: "Easy start to a stronger life."
  },
  {
    imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745074862/spa_qpav0e.png",
    title: "SPACE-SAVING FANS",
    description: "Turn your space into strength."
  }
];

const GymTarget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate images every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % targetAudiences.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/dR65kKbVz15O5bybIZ', '_blank');
  };

  const currentAudience = targetAudiences[currentIndex];

  return (
    <section id="target" ref={containerRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center mb-20 transition-all duration-1000", 
            isInView ? "opacity-100" : "opacity-0 translate-y-12")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-16 relative inline-block">
              MADE TO MOVE
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
                isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            {/* Carousel Container */}
            <div className="relative mx-auto mb-8">
              {/* Carousel Image Container - Made 20-30% larger */}
              <div className={cn(
                "relative overflow-hidden mx-auto",
                isMobile 
                  ? "w-[90%] h-[240px]" // Increased size on mobile 
                  : "w-[500px] h-[600px]" // Increased size on desktop by ~25%
              )}>
                {targetAudiences.map((audience, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 w-full h-full transition-opacity duration-1000",
                      currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                  >
                    <img 
                      src={audience.imageUrl} 
                      alt={audience.title}
                      className={cn(
                        "w-full h-full",
                        isMobile ? "object-contain" : "object-cover"
                      )}
                    />
                  </div>
                ))}
              </div>
              
              {/* Text for current slide */}
              <div className="mt-6 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-black mb-2">
                  {currentAudience.title}
                </h3>
                <p className="text-gray-700 text-base md:text-lg">
                  {currentAudience.description}
                </p>
              </div>
            </div>
            
            {/* CTA Button - Centered */}
            <div className="mt-12 flex justify-center">
              <Button 
                onClick={handleCheckout} 
                className={cn(
                  "bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", 
                  "transition-all duration-300 hover:shadow-md hover:scale-105"
                )}
                size="lg"
              >
                🛒 GET YOURS
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymTarget;
