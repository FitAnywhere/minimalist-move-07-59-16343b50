
import React, { useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const GymTarget = () => {
  const targetSectionRef = useRef<HTMLElement>(null);
  const isTargetInView = useInView(targetSectionRef);
  const isMobile = useIsMobile();

  return (
    <section id="target" ref={targetSectionRef} className="py-24 bg-inherit">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center transition-all duration-1000", isTargetInView ? "opacity-100" : "opacity-0 translate-y-12")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-16 relative inline-block">
              EXPOSED
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isTargetInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            {/* Desktop Layout */}
            {!isMobile && (
              <div className="grid grid-cols-2 gap-12 items-center">
                {/* Left Column - Text */}
                <div className="text-left space-y-8">
                  {/* Three main lines - bigger and bold */}
                  <div className={cn("transition-all duration-1000 delay-200", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-3">
                      Parks judged them.
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-3">
                      Gyms pressured them.
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                      The attention broke them.
                    </p>
                  </div>

                  {/* Bands. Privacy. Progress. */}
                  <div className={cn("transition-all duration-1000 delay-600", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    <p className="text-base md:text-lg font-medium text-gray-800">
                      Bands. Privacy. Progress.
                    </p>
                  </div>

                  {/* Payoff Line */}
                  <div className={cn("transition-all duration-1000 delay-800", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    <p className="text-lg md:text-xl font-bold text-black">
                      Soon they'll come back untouchable.
                    </p>
                  </div>
                </div>

                {/* Right Column - Video */}
                <div className={cn("transition-all duration-1000 delay-400", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <div className="w-full max-w-sm mx-auto">
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        preload="metadata"
                      >
                        <source src="/0620(1).Mp4 (1).webm" type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Layout */}
            {isMobile && (
              <>
                {/* Three main lines - bigger and bold */}
                <div className={cn("mb-12 transition-all duration-1000 delay-200", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed mb-3">
                    Parks judged them.
                  </p>
                  <p className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed mb-3">
                    Gyms pressured them.
                  </p>
                  <p className="text-lg md:text-xl font-bold text-gray-800 leading-relaxed">
                    The attention broke them.
                  </p>
                </div>

                {/* Video Block */}
                <div className={cn("mb-8 transition-all duration-1000 delay-400", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <div className="w-full max-w-sm mx-auto">
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        preload="metadata"
                      >
                        <source src="/0620(1).Mp4 (1).webm" type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>

                {/* Bands. Privacy. Progress. */}
                <div className={cn("mb-8 transition-all duration-1000 delay-600", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-base md:text-lg font-medium text-gray-800">
                    Bands. Privacy. Progress.
                  </p>
                </div>

                {/* Payoff Line */}
                <div className={cn("transition-all duration-1000 delay-800", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg md:text-xl font-bold text-black">
                    Soon they'll come back untouchable.
                  </p>
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
