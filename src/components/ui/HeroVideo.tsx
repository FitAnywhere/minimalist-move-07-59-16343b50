
import { useRef, memo } from 'react';
import { cn } from '@/lib/utils';
import VideoPlayer from './VideoPlayer';

// Memoized component to prevent unnecessary re-renders
const HeroVideo = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const LOCAL_VIDEO_URL = '/fitanywhere intro.mp4';
  const VIMEO_VIDEO_ID = 1067255623;
  const VIMEO_HASH = '45e88fd96b';
  
  return (
    <div ref={containerRef} className="relative w-full h-full">
      <VideoPlayer
        localVideoUrl={LOCAL_VIDEO_URL}
        vimeoId={VIMEO_VIDEO_ID}
        vimeoHash={VIMEO_HASH}
        aspectRatio="video"
        timeoutMs={5000}
        className="w-full h-full object-cover"
      />
    </div>
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
