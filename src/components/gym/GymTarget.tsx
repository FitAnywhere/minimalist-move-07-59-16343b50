import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';

const GymTarget = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const [animationState, setAnimationState] = useState({
    title: false,
    subtitle: false,
    video: false,
    finalText: false
  });
  const [videoError, setVideoError] = useState(false);

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

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <section ref={containerRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Centered Title */}
          <div className={cn("text-center mb-16 transition-all duration-1000", animationState.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h2 className="text-4xl lg:text-5xl font-bold text-black uppercase tracking-wide relative inline-block">
              WHO IS THIS FOR?
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", animationState.title ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Video */}
            <div className="flex justify-center">
              <div className={cn("transition-all duration-1000", animationState.video ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="max-w-[400px] mx-auto relative">
                  {!videoError ? (
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline 
                      className="w-full h-full object-cover rounded-lg"
                      onError={handleVideoError}
                    >
                      <source src="/114 Trxbands 11044.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750975069/Izdelek_brez_naslova_-_2025-06-26T235740.698_rxcquv.png"
                      alt="Workout demonstration"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Text Content */}
            <div className="space-y-8">
              {/* Subtitle */}
              <div className={cn("transition-all duration-1000", animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <p className="text-2xl font-bold text-black uppercase tracking-wide">
                  THIS IS FOR YOU IF:
                </p>
              </div>

              {/* Bullet Points */}
              <div className={cn("space-y-4 transition-all duration-1000", animationState.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-400 text-2xl font-black mt-1">→</span>
                  <p className="text-lg text-black leading-relaxed">
                    You're tired of excuses and ready to commit to real change
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-400 text-2xl font-black mt-1">→</span>
                  <p className="text-lg text-black leading-relaxed">
                    You want results but don't have time for complicated routines
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-400 text-2xl font-black mt-1">→</span>
                  <p className="text-lg text-black leading-relaxed">
                    You're ready to invest in yourself and your health
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-400 text-2xl font-black mt-1">→</span>
                  <p className="text-lg text-black leading-relaxed">
                    You want a system that works anywhere, anytime
                  </p>
                </div>
              </div>

              {/* Final Text */}
              <div className={cn("transition-all duration-1000", animationState.finalText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <p className="text-xl font-bold italic text-black tracking-wide leading-tight">
                  If this sounds like you, then FitAnywhere is your solution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymTarget;
