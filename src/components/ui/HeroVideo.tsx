
import { memo } from 'react';
import OptimizedVideo from './OptimizedVideo';

const HeroVideo = memo(() => {
  return (
    <OptimizedVideo
      vimeoId="1073662161"
      hash="9f083a1471"
      title="FitAnywhere introduction video"
      autoplay={true} // Enable autoplay for better user experience
      loop={true}     // Enable looping for continuous engagement
      muted={true}    // Keep muted for better user experience and autoplay policy
      controls={false}
      background={true}
      responsive={true}
      className="w-full h-full transform-only-animation"
      aspectRatio="16:9"
      placeholderImage="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
      onLoad={() => console.log('Hero video loaded successfully')}
      onError={() => console.log('Hero video failed to load')}
    />
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
