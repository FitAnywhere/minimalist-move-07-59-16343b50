
import { memo } from 'react';

const HeroVideo = memo(() => {
  return (
    <div className="w-full h-full relative aspect-video">
      <video
        className="w-full h-full object-cover"
        preload="metadata"
        poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://github.com/lovable-labs/fitanywhere-videos/raw/main/114-Intor-Video-Optt.webm" type="video/webm" />
        <source src="/114 Intor Video Optt.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
