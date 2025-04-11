
import { memo } from 'react';
import OptimizedVideo from './OptimizedVideo';

const HeroVideo = memo(() => {
  return (
    <OptimizedVideo
      vimeoId="1074680489"
      hash="a0b733db13"
      title="Intro Video Optt"
      autoplay={false} // Changed to false to ensure it only plays after user interaction
      loop={false}
      muted={true}
      controls={false}
      background={true}
      responsive={true}
      className="w-full h-full"
      aspectRatio="16:9"
      placeholderImage="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
    />
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
