
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Check, Shield } from 'lucide-react';

const WisdomOfLegends = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const isMobile = useIsMobile();
  const [animationState, setAnimationState] = useState({
    title: false,
    subtitle: false,
    icon: false,
    bullets: [false, false, false],
    image: false,
    quote: false
  });

  const bulletPoints = ["30 DAYS RISK-FREE", "3 YEARS FRAME GUARANTEE", "PAY LATER AVAILABLE"];

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        title: true
      })), 100);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        subtitle: true
      })), 300);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        icon: true
      })), 500);
      bulletPoints.forEach((_, index) => {
        setTimeout(() => {
          setAnimationState(prev => {
            const updatedBullets = [...prev.bullets];
            updatedBullets[index] = true;
            return {
              ...prev,
              bullets: updatedBullets
            };
          });
        }, 700 + index * 200);
      });

      // Add animations for image and quote
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        image: true
      })), 1500);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        quote: true
      })), 1700);
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-16" style={{
      backgroundColor: '#f6f6f6'
    }}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <div className={cn("text-center mb-4 transition-all duration-1000", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              NO REGRETS
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className={cn("text-center mb-8 transition-all duration-1000", animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <p className="text-lg md:text-xl text-gray-700 font-bold">
              Try it. Break it. Return it.
            </p>
          </div>

          {/* Bullet Points */}
          <div className="max-w-2xl mx-auto space-y-4 mb-12 md:px-[181px] px-[22px]">
            {bulletPoints.map((point, index) => (
              <div key={index} className={cn("flex items-center gap-4 transition-all duration-500", animationState.bullets[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} style={{
                transitionDelay: `${index * 200}ms`
              }}>
                <div className="flex-shrink-0">
                  <Check className="w-6 h-6 text-green-500" strokeWidth={2.5} />
                </div>
                <p className="text-lg md:text-xl text-black">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Social Proof Section */}
          <div className="max-w-lg mx-auto text-center">
            {/* Customer Image - smaller size (20-25% reduction), with margin-top for spacing */}
            <div className={cn("mb-6 mt-8 transition-all duration-800", animationState.image ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
              <img 
                src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750947270/Izdelek_brez_naslova_-_2025-06-26T161419.256_t4lzso.png" 
                alt="Customer testimonial" 
                className="w-56 h-72 md:w-64 md:h-80 mx-auto object-cover shadow-lg border border-black rounded-3xl" 
              />
            </div>

            {/* Testimonial Quote */}
            <div className={cn("mb-6 transition-all duration-800", animationState.quote ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <blockquote className="text-lg md:text-xl text-gray-700 italic font-medium leading-relaxed">
                "Didn't think I'd keep it... To return it now? No chance."
              </blockquote>
            </div>

            {/* Guarantee Icon with Risk-Free Text - moved below the quote */}
            <div className={cn("flex justify-center items-center gap-3 transition-all duration-800", animationState.icon ? "opacity-100 scale-100" : "opacity-0 scale-75")}>
              <div className="relative">
                <Shield className="w-16 h-16 text-green-500 drop-shadow-lg" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" strokeWidth={3} />
                </div>
              </div>
              <span className="text-green-500 font-bold text-lg drop-shadow-lg">RISK-FREE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WisdomOfLegends;
