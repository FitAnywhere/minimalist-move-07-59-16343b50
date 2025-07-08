
import { useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const OneTruthSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });
  const isMobile = useIsMobile();

  return (
    <section ref={sectionRef} className="py-24 bg-white" id="one-truth">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center transition-all duration-1000", isInView ? "opacity-100" : "opacity-0 translate-y-12")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6 md:mb-4 relative inline-block">
              NO PRESSURE
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            {/* Desktop Layout */}
            {!isMobile && (
              <>
                {/* Single line under title */}
                <div className={cn("text-center mb-8 transition-all duration-1000 delay-200", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg md:text-xl font-bold text-gray-800 leading-tight">Succeed where you are in control.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center px-[123px]">
                  {/* Left Column - Bullet Points */}
                  <div className={cn("text-left space-y-4", "md:max-w-none lg:max-w-[85%]")}>
                    {/* Bullet points with yellow arrows */}
                    <div className={cn("transition-all duration-1000 delay-400", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                      <div className="flex items-center mb-4">
                        <div className="text-yellow-400 mr-4 text-xl flex-shrink-0">→</div>
                        <p className="text-xl md:text-2xl text-black font-bold">AVOID TRAFFIC</p>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="text-yellow-400 mr-4 text-xl flex-shrink-0">→</div>
                        <p className="text-xl md:text-2xl text-black font-bold">ELIMINATE MIND BATTLES</p>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="text-yellow-400 mr-4 text-xl flex-shrink-0">→</div>
                        <p className="text-xl md:text-2xl text-black font-bold">NEVER FEEL ANXIOUS</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image */}
                  <div className={cn("transition-all duration-1000 delay-600", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    <div className="w-full max-w-[300px] mx-auto">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-2xl">
                        <img
                          src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750977338/beach_training_kgszq4.jpg"
                          alt="Beach training setup"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Mobile Layout */}
            {isMobile && (
              <>
                {/* Text above image */}
                <div className={cn("mb-4 text-center transition-all duration-1000 delay-200", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg font-bold text-gray-800 leading-tight">Succeed where you are in control.</p>
                </div>

                {/* Image Block */}
                <div className={cn("mb-6 transition-all duration-1000 delay-400", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <div className="w-full max-w-[280px] mx-auto">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-2xl">
                      <img
                        src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750977338/beach_training_kgszq4.jpg"
                        alt="Beach training setup"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Bullet points - mobile format with soft yellow background */}
                <div className={cn("text-center transition-all duration-1000 delay-600", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <div className="bg-yellow-50 px-4 py-3 rounded-lg inline-block">
                    <p className="text-lg font-bold text-black">
                      → AVOID TRAFFIC<br/>
                      → ELIMINATE MIND BATTLES<br/>
                      → NEVER FEEL ANXIOUS
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneTruthSection;
