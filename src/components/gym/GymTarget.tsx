
import React, { useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';

const GymTarget = () => {
  const targetSectionRef = useRef<HTMLElement>(null);
  const isTargetInView = useInView(targetSectionRef);

  return (
    <section id="target" ref={targetSectionRef} className="py-24 bg-inherit">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn("text-center transition-all duration-1000", isTargetInView ? "opacity-100" : "opacity-0 translate-y-12")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-16 relative inline-block">
              BUILT FOR
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isTargetInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            {/* Headline */}
            <div className={cn("mb-8 transition-all duration-1000 delay-200", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <h3 className="text-2xl md:text-3xl font-bold text-black leading-tight">
                They quit because you watched.
              </h3>
            </div>

            {/* Subheadline */}
            <div className={cn("mb-12 transition-all duration-1000 delay-400", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Parks judged them.<br />
                Gyms pressured them.<br />
                The attention broke them.
              </p>
            </div>

            {/* Video Block */}
            <div className={cn("mb-12 transition-all duration-1000 delay-600", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <div className="flex flex-col items-center">
                <p className="text-base md:text-lg font-medium text-gray-800 mb-6">
                  🎥 These 3 train in silence.<br />
                  Bands. Privacy. Progress.
                </p>
                
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
                      <source src="/0620(1).Mp4.webm" type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>

            {/* Payoff Line */}
            <div className={cn("transition-all duration-1000 delay-800", isTargetInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <p className="text-lg md:text-xl font-bold text-black">
                Soon they'll come back untouchable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymTarget;
