
import { memo, useCallback } from 'react';
import EnhancedVimeoPlayer from './EnhancedVimeoPlayer';

const HeroVideo = memo(() => {
  const handleVideoLoad = useCallback(() => {
    console.log('Hero video loaded successfully');
  }, []);

  const handleVideoError = useCallback(() => {
    console.log('Hero video error occurred, will retry automatically');
  }, []);

  return (
    <EnhancedVimeoPlayer
      vimeoId="1073662161"
      hash="9f083a1471"
      title="Intro video optimized"
      autoplay={true}
      loop={true}
      muted={true}
      controls={false}
      background={true}
      responsive={true}
      className="w-full h-full"
      aspectRatio="16:9"
      onLoad={handleVideoLoad}
      onError={handleVideoError}
      placeholderImage="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
    />
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
