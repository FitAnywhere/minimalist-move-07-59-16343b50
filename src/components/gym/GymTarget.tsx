
import React, { useRef, useState } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronRight } from 'lucide-react';

const GymTarget = () => {
  const targetSectionRef = useRef<HTMLElement>(null);
  const isTargetInView = useInView(targetSectionRef);
  const isMobile = useIsMobile();
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <section id="target" ref={targetSectionRef} className="py-24 bg-inherit">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center transition-all duration-1000", isTargetInView ? "opacity-100" : "opacity-0 translate-y-12")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6 md:mb-4 relative inline-block">
              EXPOSED
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isTargetInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            {/* Desktop Layout */}
            {!isMobile && (
              <>
                {/* Single line under title */}
                <div className={cn("text-center mb-8 transition-all duration-1000 delay-200", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg md:text-xl font-bold text-gray-800 leading-tight">Gyms judged you | Parks embarrassed you</p>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center px-[123px]">
                  {/* Left Column - Solution text and Bullet Points */}
                  <div className="text-left space-y-4">
                    {/* Solution text with animated arrow */}
                    <div className={cn("transition-all duration-1000 delay-300", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                      <div className="flex items-center mb-6">
                        <p className="text-xl md:text-2xl font-bold text-black mr-3">Take your power back.</p>
                        <ChevronRight className="w-6 h-6 text-yellow-400 animate-pulse" />
                      </div>
                    </div>

                    {/* Bullet points with yellow dots */}
                    <div className={cn("transition-all duration-1000 delay-400", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                      <div className="flex items-center mb-3">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full mr-4"></div>
                        <p className="text-xl md:text-2xl text-black">BANDS</p>
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full mr-4"></div>
                        <p className="text-xl md:text-2xl text-black">PRIVACY</p>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full mr-4"></div>
                        <p className="text-xl md:text-2xl text-black">PROGRESS</p>
                      </div>
                    </div>

                    {/* Payoff Line - moved lower with more spacing */}
                    <div className={cn("mt-12 transition-all duration-1000 delay-800", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                      <p className="text-lg md:text-xl font-bold text-black italic py-[13px] my-[34px]">You weren't weak. The game was rigged.</p>
                    </div>
                  </div>

                  {/* Right Column - Video (25% smaller) */}
                  <div className={cn("transition-all duration-1000 delay-600", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    <div className="w-full max-w-[225px] mx-auto">
                      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
                        {!videoError ? (
                          <video 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            className="w-full h-full object-cover" 
                            preload="metadata"
                            onError={handleVideoError}
                          >
                            <source src="/0620(1).Mp4 (1).webm" type="video/webm" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img 
                            src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750975069/Izdelek_brez_naslova_-_2025-06-26T235740.698_rxcquv.png"
                            alt="Workout fallback"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Mobile Layout */}
            {isMobile && (
              <>
                {/* Text above video - restored */}
                <div className={cn("mb-4 text-center transition-all duration-1000 delay-200", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg font-bold text-gray-800 leading-tight">Gyms judged you | Parks embarrassed you</p>
                </div>

                {/* Video Block */}
                <div className={cn("mb-2 transition-all duration-1000 delay-400", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <div className="w-full max-w-[200px] mx-auto">
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
                      {!videoError ? (
                        <video 
                          autoPlay 
                          muted 
                          loop 
                          playsInline 
                          className="w-full h-full object-cover" 
                          preload="metadata"
                          onError={handleVideoError}
                        >
                          <source src="/0620(1).Mp4 (1).webm" type="video/webm" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img 
                          src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750975069/Izdelek_brez_naslova_-_2025-06-26T235740.698_rxcquv.png"
                          alt="Workout fallback"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Solution text - close to video */}
                <div className={cn("mb-2 text-center transition-all duration-1000 delay-500", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg font-bold text-black">Take your power back.</p>
                </div>

                {/* BANDS | PRIVACY | PROGRESS - moved closer to solution text above */}
                <div className={cn("mb-8 text-center transition-all duration-1000 delay-600", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg font-bold text-black md:bg-transparent bg-yellow-50 md:px-0 px-3 md:py-0 py-2 md:rounded-none rounded-lg inline-block">
                    BANDS | PRIVACY | PROGRESS
                  </p>
                </div>

                {/* Payoff Line - more space above */}
                <div className={cn("text-center transition-all duration-1000 delay-800", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg font-bold text-black italic">You weren't weak. The game was rigged.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymTarget;
