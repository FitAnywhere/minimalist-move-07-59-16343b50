
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
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          {isMobile && (
            <div className="space-y-12">
              {/* Title */}
              <div className="flex justify-center">
                <div className="space-y-6 flex flex-col items-center">
                  <h2 className={cn("text-3xl md:text-4xl font-bold uppercase text-black relative inline-block tracking-wide", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                    NO PRESSURE
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                  </h2>
                </div>
              </div>

              {/* Two-line text with yellow arrow */}
              <div className={cn("text-center transition-all duration-1000", animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="space-y-2 max-w-md mx-auto">
                  <p className="text-lg text-black leading-relaxed">
                    Open the box <span className="text-yellow-400">→</span> Set it up
                  </p>
                  <p className="text-lg text-black leading-relaxed font-bold uppercase">
                    START BECOMING STRONG
                  </p>
                </div>
              </div>

              {/* Video */}
              <div className={cn("flex justify-center transition-all duration-1000", animationState.video ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="max-w-[200px]">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full rounded-xl aspect-[3/4] object-cover"
                  >
                    <source src="/boxxingbars.webm" type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Final Text */}
              <div className={cn("text-center transition-all duration-1000", animationState.finalText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <p className="text-lg font-bold uppercase text-black tracking-wide leading-tight py-4">
                  SUCCEED WHEN YOU ARE IN CONTROL
                </p>
              </div>
            </div>
          )}

          {/* Desktop Layout */}
          {!isMobile && (
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Left Column - Title, List, and Final Text */}
              <div className="space-y-12">
                {/* Title */}
                <div className={cn("transition-all duration-1000", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <h2 className="text-4xl lg:text-5xl font-bold uppercase text-black relative inline-block tracking-wide">
                    NO PRESSURE
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
                  </h2>
                </div>

                {/* Three-line text with arrows */}
                <div className={cn("transition-all duration-1000", animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <div className="space-y-3">
                    <p className="text-xl text-black leading-relaxed font-bold uppercase">
                      <span className="text-yellow-400 mr-3">→</span>OPEN THE BOX
                    </p>
                    <p className="text-xl text-black leading-relaxed font-bold uppercase">
                      <span className="text-yellow-400 mr-3">→</span>SET IT UP
                    </p>
                    <p className="text-xl text-black leading-relaxed font-bold uppercase">
                      <span className="text-yellow-400 mr-3">→</span>START BECOMING STRONG
                    </p>
                  </div>
                </div>

                {/* Final Text with matching spacing */}
                <div className={cn("transition-all duration-1000", animationState.finalText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <p className="text-lg font-bold italic text-black tracking-wide leading-tight">
                    Succeed when you're in control.
                  </p>
                </div>
              </div>

              {/* Right Column - Video */}
              <div className="space-y-8">
                {/* Video */}
                <div className={cn("transition-all duration-1000", animationState.video ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <div className="max-w-[250px] mx-auto">
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      className="w-full rounded-xl aspect-[3/4] object-cover"
                    >
                      <source src="/boxxingbars.webm" type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
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
