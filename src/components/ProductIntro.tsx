
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
    <section id="product" ref={containerRef} style={{ backgroundColor: '#f6f6f6' }}>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Layout */}
          {isMobile && (
            <div className="space-y-6">
              {/* Title */}
              <div className="flex justify-center">
                <div className="space-y-6 flex flex-col items-center">
                  <h2 className={cn(
                    "text-3xl md:text-4xl font-bold uppercase text-black relative inline-block tracking-wide",
                    animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}>
                    NO PRESSURE
                    <span className={cn(
                      "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
                      animationState.title ? "scale-x-100" : "scale-x-0"
                    )}></span>
                  </h2>
                </div>
              </div>

              {/* Subtitle and single line bullet point */}
              <div className={cn(
                "text-center transition-all duration-1000",
                animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <div className="space-y-4 max-w-md mx-auto">
                  {/* Subtitle - CAPS on mobile */}
                  <p className="text-lg text-black font-bold uppercase">
                    15-MINUTES AND DONE
                  </p>
                  
                  {/* Single line bullet point */}
                  <p className="text-lg text-black leading-relaxed">
                    <span className="text-yellow-400 font-black text-2xl mr-2">→</span>No traffic. No mind battles. No anxiety.
                  </p>
                </div>
              </div>

              {/* Video - 20% smaller */}
              <div className={cn(
                "flex justify-center transition-all duration-1000",
                animationState.video ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <div className="max-w-[243px]">
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

              {/* Mobile-only text below video */}
              <div className={cn(
                "text-center transition-all duration-1000",
                animationState.video ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <p className="text-lg font-bold text-black tracking-wide leading-tight">
                  SET IT UP. WIN FROM HOME.
                </p>
              </div>

              {/* Final Text - italic and proper capitalization */}
              <div className={cn(
                "text-center transition-all duration-1000",
                animationState.finalText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <p className="text-lg font-bold italic text-black tracking-wide leading-tight py-0">
                  Succeed where you are in control.
                </p>
              </div>
            </div>
          )}

          {/* Desktop Layout */}
          {!isMobile && (
            <div className="space-y-16">
              {/* Centered Title and Subtitle */}
              <div className="text-center space-y-6">
                {/* Title */}
                <div className={cn(
                  "transition-all duration-1000",
                  animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                  <h2 className="text-4xl lg:text-5xl font-bold uppercase text-black relative inline-block tracking-wide">
                    NO PRESSURE
                    <span className={cn(
                      "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
                      animationState.title ? "scale-x-100" : "scale-x-0"
                    )}></span>
                  </h2>
                </div>

                {/* Subtitle */}
                <div className={cn(
                  "transition-all duration-1000",
                  animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                  <p className="text-2xl text-black font-bold">
                    15-minutes and done
                  </p>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-2 items-start">
                {/* Left Column - Bullet Points and Final Text */}
                <div className="space-y-16 px-[102px] py-0 my-[30px]">
                  {/* Bullet points */}
                  <div className={cn(
                    "transition-all duration-1000",
                    animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}>
                    <div className="space-y-3">
                      <p className="text-2xl text-black leading-relaxed">
                        <span className="text-yellow-400 mr-3 font-black text-4xl">→</span>NO TRAFFIC
                      </p>
                      <p className="text-2xl text-black leading-relaxed">
                        <span className="text-yellow-400 mr-3 font-black text-4xl">→</span>NO MIND BATTLES
                      </p>
                      <p className="text-2xl text-black leading-relaxed">
                        <span className="text-yellow-400 mr-3 font-black text-4xl">→</span>NO ANXIETY
                      </p>
                    </div>
                  </div>

                  {/* Final Text Section */}
                  <div className={cn(
                    "transition-all duration-1000",
                    animationState.finalText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}>
                    <div className="space-y-0">
                      <p className="text-lg font-bold text-black tracking-wide leading-tight">
                        SET IT UP. WIN FROM HOME.
                      </p>
                      <p className="text-lg font-bold italic text-black tracking-wide leading-tight">
                        Succeed where you are in control.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Video - 20% smaller */}
                <div className="space-y-8">
                  <div className={cn(
                    "transition-all duration-1000",
                    animationState.video ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}>
                    <div className="max-w-[308px] mx-auto">
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductIntro;
