
import { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useVideoOptimization } from '@/hooks/useVideoOptimization';
import VideoPlayer from './VideoPlayer';

interface HeroVideoSectionProps {
  isInView: boolean;
  isMobile: boolean;
}

const HeroVideoSection = memo(({ isInView, isMobile }: HeroVideoSectionProps) => {
  const [containerRef, isVisible, isLoaded] = useVideoOptimization({
    threshold: 0.2,
    rootMargin: '200px',
    priorityLoad: true, // Hero video is critical
    lazyLoad: false // No lazy loading for hero video
  });

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative transition-all duration-1000 delay-300", 
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        isMobile ? "mt-4" : ""
      )}
      style={isMobile ? { minHeight: '56.25vw' } : { minHeight: '350px' }}
    >
      <div className="relative rounded-xl overflow-hidden shadow-lg flex justify-center">
        <div className={isMobile ? "w-full" : "w-full max-w-[95%] mx-auto"}>
          <div className="aspect-video rounded-xl overflow-hidden">
            <VideoPlayer 
              src="/114 Intor Video Optt.mp4" 
              poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
              priority={true}
              preload="auto"
              width={1280}
              height={720}
              fetchpriority="high"
            />
          </div>
          
          {!isMobile && (
            <p className="mt-3 text-sm text-gray-600 ml-1 text-center my-[6px] mx-[30px]">
              Launching Spring 2025. Reserve before we sell out.
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

HeroVideoSection.displayName = 'HeroVideoSection';
export default HeroVideoSection;
