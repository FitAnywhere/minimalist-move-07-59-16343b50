
import { memo } from 'react';
import VideoPlayer from './VideoPlayer';

const HeroVideo = memo(() => {
  return (
    <VideoPlayer 
      src="/114 Intor Video Optt.mp4" 
      poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto:eco,w_640/v1744102423/Screenshot_84_oi460p.png"
      priority={true}
      preload="auto"
      width={640}
      height={360}
      fetchpriority="high"
    />
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
