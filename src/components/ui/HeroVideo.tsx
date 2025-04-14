
import { memo } from 'react';
import VideoPlayer from './VideoPlayer';

const HeroVideo = memo(() => {
  // Optimize the poster image with responsive parameters
  const optimizedPosterUrl = "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_auto/v1744102423/Screenshot_84_oi460p.png";
  
  return (
    <VideoPlayer 
      src="/114 Intor Video Optt.mp4" 
      poster={optimizedPosterUrl}
      priority={true} // Mark as high priority for LCP
      preload="metadata"
      width={1280}
      height={720}
      deferVideoLoadOnMobile={true} // New prop to defer video loading on mobile
    />
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
