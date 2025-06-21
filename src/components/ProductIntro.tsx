
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const ProductIntro = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const isMobile = useIsMobile();
  const [animationState, setAnimationState] = useState({
    title: false,
    subtitle: false,
    video: false,
    finalText: false
  });

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
        video: true
      })), 500);
      setTimeout(() => setAnimationState(prev => ({
        ...prev,
        finalText: true
      })), 700);
    }
  }, [isInView]);

  return (
    <section id="product" ref={containerRef} style={{ backgroundColor: '#f8f6df' }}>
      <div className="container mx-auto px-4 py-[14px]">
        <div className="max-w-5xl mx-auto">
          {/* Mobile Layout */}
          {isMobile && (
            <div className="space-y-8">
              {/* Title */}
              <div className="flex justify-center">
                <div className="space-y-4 flex flex-col items-center">
                  <h2 className={cn("text-3xl md:text-4xl font-extrabold text-black relative inline-block", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    NO PRESSURE
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                  </h2>
                </div>
              </div>

              {/* Subline */}
              <div className={cn("text-center transition-all duration-1000", animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <p className="text-lg text-black">
                  You open the box, set it up and start becoming strong on your own time in your own space.
                </p>
              </div>

              {/* Video */}
              <div className={cn("flex justify-center transition-all duration-1000", animationState.video ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full max-w-sm rounded-xl aspect-[3/4] object-cover"
                >
                  <source src="/boxing setup.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Final Text */}
              <div className={cn("text-center transition-all duration-1000", animationState.finalText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <p className="text-lg font-semibold text-black">
                  GET YOUR FIRST WIN. FINALLY IN PEACE.
                </p>
              </div>
            </div>
          )}

          {/* Desktop Layout */}
          {!isMobile && (
            <div className="space-y-8">
              {/* Title - Centered above everything */}
              <div className="flex justify-center">
                <div className="space-y-4 flex flex-col items-center">
                  <h2 className={cn("text-3xl md:text-4xl font-extrabold text-black relative inline-block", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    NO PRESSURE
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                  </h2>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left Column - Subline */}
                <div className={cn("space-y-4 transition-all duration-1000", animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-xl text-black leading-relaxed">
                    You open the box, set it up and start becoming strong on your own time in your own space.
                  </p>
                </div>

                {/* Right Column - Video and Final Text */}
                <div className="space-y-6">
                  {/* Video */}
                  <div className={cn("transition-all duration-1000", animationState.video ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      className="w-full rounded-xl aspect-[3/4] object-cover"
                    >
                      <source src="/boxing setup.webm" type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Final Text */}
                  <div className={cn("text-center transition-all duration-1000", animationState.finalText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    <p className="text-lg font-semibold text-black">
                      GET YOUR FIRST WIN. FINALLY IN PEACE.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductIntro;
