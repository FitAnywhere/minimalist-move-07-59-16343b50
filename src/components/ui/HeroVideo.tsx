
import { memo, useState, useRef, useEffect } from 'react';
import OptimizedVideo from './OptimizedVideo';
import { rafThrottle } from '@/utils/eventOptimizers';

const HeroVideo = memo(() => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!videoRef.current) return;
    
    // Set up intersection observer to detect when video is in viewport
    const observer = new IntersectionObserver(
      rafThrottle(entries => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          // Disconnect once we've triggered the load
          observer.disconnect();
        }
      }),
      { 
        rootMargin: '200px 0px', // Start loading when video is 200px from viewport
        threshold: 0.1 // Trigger when 10% visible
      }
    );
    
    observer.observe(videoRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  const handleClick = () => {
    if (!shouldLoad) {
      setShouldLoad(true);
    }
  };
  
  return (
    <div 
      ref={videoRef} 
      onClick={handleClick}
      className="w-full h-full transform-only-animation cursor-pointer"
    >
      {shouldLoad ? (
        <OptimizedVideo
          vimeoId="1073662161"
          hash="9f083a1471"
          title="FitAnywhere introduction video"
          autoplay={true}    // Only autoplay after user interaction or in-view
          loop={true}        // Keep looping for continuous engagement
          muted={true}       // Keep muted for better user experience and autoplay policy
          controls={false}
          background={true}
          responsive={true}
          className="w-full h-full transform-only-animation"
          aspectRatio="16:9"
          placeholderImage="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
          onLoad={() => console.log('Hero video loaded successfully')}
          onError={() => console.log('Hero video failed to load')}
        />
      ) : (
        <div className="w-full h-full rounded-xl overflow-hidden bg-black">
          <img 
            src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
            alt="FitAnywhere introduction video thumbnail"
            loading="eager"
            fetchpriority="high"
            className="w-full h-full object-cover"
            width="1280"
            height="720"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-yellow/90 text-black rounded-full p-4 shadow-lg transform hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
