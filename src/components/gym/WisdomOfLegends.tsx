import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';

const legends = [{
  name: "Bruce Lee",
  quote: "The goal isn't to live forever, but to create something that will.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099087/Screenshot_78_wzkvza.png"
}, {
  name: "Arnold",
  quote: "Strength does not come from winning. Your struggles develop your strengths.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099087/Screenshot_79_f9vjuh.png"
}, {
  name: "Ali",
  quote: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion'.",
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744099087/Screenshot_80_t2qrous.png"
}];

const WisdomOfLegends = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const isMobile = useIsMobile();
  const [animationState, setAnimationState] = useState({
    title: false,
    cards: [false, false, false]
  });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        title: true
      })), 100);
      legends.forEach((_, index) => {
        setTimeout(() => {
          setAnimationState(prev => {
            const updatedCards = [...prev.cards];
            updatedCards[index] = true;
            return {
              ...prev,
              cards: updatedCards
            };
          });
        }, 300 + index * 200);
      });
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-16" style={{ backgroundColor: '#f8f6df' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <div className={cn("text-center mb-12 transition-all duration-1000", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              LIVE LIKE LEGENDS
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>

          {/* Legends Grid */}
          <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3")}>
            {legends.map((legend, index) => (
              <Card
                key={index}
                className={cn(
                  "bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg",
                  animationState.cards[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <img
                  src={legend.imageUrl}
                  alt={legend.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <p className="text-gray-600 italic text-sm mb-4">
                    "{legend.quote}"
                  </p>
                  <p className="text-black font-semibold text-right">
                    - {legend.name}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WisdomOfLegends;
