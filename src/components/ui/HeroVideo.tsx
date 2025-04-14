
import { memo } from 'react';
import VideoPlayer from './VideoPlayer';

const HeroVideo = memo(() => {
  return (
    <VideoPlayer 
      src="/IntroSound.mp4" 
      poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
      priority={true}
      preload="auto"
      width={1280}
      height={720}
      fetchpriority="high"
      showHeroVolumeControl={true}
    />
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
