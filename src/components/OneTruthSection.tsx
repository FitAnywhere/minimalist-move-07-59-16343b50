import React, { useRef, useEffect, useState } from 'react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const OneTruthSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 }, true);
  const isMobile = useIsMobile();
  
  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const exerciseImages = [
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/36_tzpycv.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/37_atfe5o.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/30_gcqcbp.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/28_swid5q.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/35_uc5ypj.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/33_twqq1p.png'
  ];

  // Auto-rotate carousel when in view
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % exerciseImages.length);
    }, 1700);

    return () => clearInterval(interval);
  }, [isInView, exerciseImages.length]);

  // Add yellow underline animation when in view
  useEffect(() => {
    if (isInView && titleRef.current) {
      titleRef.current.style.setProperty('--underline-width', '100%');
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {isMobile ? (
          // Mobile Layout - Centered Stack
          <div className="text-center space-y-8">
            {/* Title */}
            <h2 
              ref={titleRef}
              className={cn(
                "text-3xl font-extrabold text-black relative inline-block",
                "after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-1 after:bg-yellow",
                "after:transition-all after:duration-1000 after:ease-out",
                "transition-all duration-1000 ease-out",
                isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ 
                animationDelay: '200ms',
                '--underline-width': isInView ? '100%' : '0%'
              } as React.CSSProperties & { '--underline-width': string }}
            >
              <span className="relative">
                TRAIN SMART
                <span 
                  className="absolute bottom-0 left-0 h-1 bg-yellow transition-all duration-1000 ease-out"
                  style={{ width: 'var(--underline-width, 0%)' }}
                />
              </span>
            </h2>

            {/* Bullet Points */}
            <div 
              className={cn(
                "space-y-4 transition-all duration-1000 ease-out",
                isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ animationDelay: '400ms' }}
            >
              <div className="space-y-2">
                <p className="font-bold text-black">ENDLESS EXERCISES?</p>
                <p className="italic text-gray-600">That's okay.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-black">REAL STRENGTH?</p>
                <p className="italic text-gray-600">Few moves done right.</p>
              </div>
            </div>

            {/* Carousel */}
            <div 
              className={cn(
                "flex justify-center transition-all duration-1000 ease-out",
                isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ animationDelay: '600ms' }}
            >
              <div className="relative w-full max-w-xs mx-auto">
                <div className="aspect-square relative overflow-hidden rounded-2xl shadow-lg">
                  {exerciseImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Exercise ${index + 1}`}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      )}
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Supporting Text */}
            <div 
              className={cn(
                "space-y-4 transition-all duration-1000 ease-out",
                isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ animationDelay: '800ms' }}
            >
              <p className="text-gray-700">Your coach gives you the plan.</p>
              <p className="text-gray-700">You give 15 minutes.</p>
              <div className="inline-block bg-gray-100 text-black font-bold px-4 py-2 rounded">
                THAT'S HOW YOU WIN
              </div>
            </div>
          </div>
        ) : (
          // Desktop Layout - Two Column Grid
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Title */}
              <h2 
                ref={titleRef}
                className={cn(
                  "text-4xl font-extrabold text-black relative inline-block",
                  "transition-all duration-1000 ease-out",
                  isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}
                style={{ 
                  animationDelay: '200ms',
                  '--underline-width': isInView ? '100%' : '0%'
                } as React.CSSProperties & { '--underline-width': string }}
              >
                <span className="relative">
                  TRAIN SMART
                  <span 
                    className="absolute bottom-0 left-0 h-1 bg-yellow transition-all duration-1000 ease-out"
                    style={{ width: 'var(--underline-width, 0%)' }}
                  />
                </span>
              </h2>

              {/* Bullet Points with Yellow Dots */}
              <div 
                className={cn(
                  "space-y-6 transition-all duration-1000 ease-out",
                  isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}
                style={{ animationDelay: '400ms' }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow rounded-full mt-2 flex-shrink-0"></div>
                  <div className="space-y-2">
                    <p className="font-bold text-black">ENDLESS EXERCISES?</p>
                    <p className="italic text-gray-600 pl-6">That's okay.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow rounded-full mt-2 flex-shrink-0"></div>
                  <div className="space-y-2">
                    <p className="font-bold text-black">REAL STRENGTH?</p>
                    <p className="italic text-gray-600 pl-6">Few moves done right.</p>
                  </div>
                </div>
              </div>

              {/* Supporting Text */}
              <div 
                className={cn(
                  "space-y-4 transition-all duration-1000 ease-out",
                  isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}
                style={{ animationDelay: '600ms' }}
              >
                <p className="text-gray-700">Your coach gives you the plan.</p>
                <p className="text-gray-700">You give 15 minutes.</p>
                <div className="inline-block bg-gray-100 text-black font-bold px-4 py-2 rounded">
                  THAT'S HOW YOU WIN
                </div>
              </div>
            </div>

            {/* Right Column - Carousel */}
            <div 
              className={cn(
                "flex justify-center transition-all duration-1000 ease-out",
                isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ animationDelay: '400ms' }}
            >
              <div className="relative w-full max-w-sm mx-auto">
                <div className="aspect-square relative overflow-hidden rounded-2xl shadow-lg">
                  {exerciseImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Exercise ${index + 1}`}
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      )}
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OneTruthSection;
