
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
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(9).fill(false));
  
  const carouselImages = [
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/36_tzpycv.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/37_atfe5o.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/30_gcqcbp.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/29_aien4c.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/28_swid5q.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506378/35_uc5ypj.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/31_z1ja4w.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506379/33_twqq1p.png',
    'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1750506380/34_kvn8lo.png'
  ];

  // Auto-rotate carousel when in view
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 1700);

    return () => clearInterval(interval);
  }, [isInView, carouselImages.length]);

  // Handle image load
  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // Add yellow underline animation when in view
  useEffect(() => {
    if (isInView && titleRef.current) {
      titleRef.current.classList.add('underline-animation');
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
                "text-3xl font-extrabold text-black relative",
                "transition-all duration-1000 ease-out",
                isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ animationDelay: '200ms' }}
            >
              TRAIN SMART
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
              <div className="relative max-w-xs aspect-square rounded-2xl overflow-hidden bg-yellow">
                {carouselImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Exercise ${index + 1}`}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                      currentImageIndex === index ? "opacity-100" : "opacity-0"
                    )}
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={() => handleImageLoad(index)}
                  />
                ))}
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
                  "text-4xl font-extrabold text-black relative",
                  "transition-all duration-1000 ease-out",
                  isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}
                style={{ animationDelay: '200ms' }}
              >
                TRAIN SMART
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
              <div className="relative max-w-sm aspect-square rounded-2xl overflow-hidden bg-yellow">
                {carouselImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Exercise ${index + 1}`}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                      currentImageIndex === index ? "opacity-100" : "opacity-0"
                    )}
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={() => handleImageLoad(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OneTruthSection;
