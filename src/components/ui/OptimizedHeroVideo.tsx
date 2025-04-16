
import { useState, useEffect, useRef, memo } from 'react';
import HeroVideo from './HeroVideo';

const OptimizedHeroVideo = memo(() => {
  const [showVideo, setShowVideo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let observerTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !observerTriggered) {
          observerTriggered = true;
          // Add delay to ensure LCP paints image, not video
          setTimeout(() => {
            setShowVideo(true);
          }, 3000); // 3 second delay to ensure image becomes LCP
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative rounded-xl overflow-hidden shadow-lg aspect-video"
    >
      {showVideo ? (
        <HeroVideo />
      ) : (
        <img
          src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
          alt="FitAnywhere introduction"
          className="w-full h-full object-cover pointer-events-none"
          width={1280}
          height={720}
          loading="eager"
          fetchpriority="high"
        />
      )}
    </div>
  );
});

OptimizedHeroVideo.displayName = 'OptimizedHeroVideo';
export default OptimizedHeroVideo;

