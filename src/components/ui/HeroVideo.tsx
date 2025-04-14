
import { memo } from 'react';
import VideoPlayer from './VideoPlayer';

const HeroVideo = memo(() => {
  return (
    <VideoPlayer 
      src="/114 Intor Video Optt.mp4" 
      poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
      priority={false} // Set to false to defer actual video loading
      preload="none" // Prevent preloading
      width={1280}
      height={720}
      fetchpriority="low" // Lower priority for actual video content
      // The poster image will still load with high priority (determined by browser)
    />
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
