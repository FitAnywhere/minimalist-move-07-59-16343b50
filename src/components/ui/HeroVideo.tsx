
import { memo } from 'react';
import EnhancedVimeoPlayer from './EnhancedVimeoPlayer';

const HeroVideo = memo(() => {
  return (
    <EnhancedVimeoPlayer
      vimeoId="1073662161"
      hash="9f083a1471"
      title="intor video optt"
      autoplay={true}
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
