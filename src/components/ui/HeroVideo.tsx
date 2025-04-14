
import { memo, useRef, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

const HeroVideo = memo(() => {
  const videoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add preload hint for the hero video
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = '/114 Intor Video Optt.mp4';
    link.type = 'video/mp4';
    link.fetchPriority = 'high';
    document.head.appendChild(link);
    
    return () => {
      // Clean up preload link on unmount
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  
  return (
    <div ref={videoRef}>
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
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
