
import { memo } from 'react';
import EnhancedVimeoPlayer from './EnhancedVimeoPlayer';

const HeroVideo = memo(() => {
  return (
    <EnhancedVimeoPlayer
      vimeoId="1073680510"
      hash="006a5ccf10"
      title="Bands trx optimized"
      autoplay={true}
      loop={true}
      muted={true}
      controls={false}
      background={true}
      responsive={true}
      className="w-full h-full"
      aspectRatio="4:3"
      placeholderImage="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744097749/Screenshot_68_ytnjfg.png"
    />
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
