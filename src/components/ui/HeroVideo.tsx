
import { memo } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroVideo = memo(() => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    const handleVideoEnd = () => {
      setIsPlaying(false);
    };
    
    videoElement.addEventListener('ended', handleVideoEnd);
    
    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, []);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        preload="metadata"
        muted
        playsInline
        className="w-full h-full object-cover"
        poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
      >
        <source src="/114 Intor Video Optt.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={handlePlayClick}
        >
          <button 
            className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
            aria-label="Play video"
          >
            <Play className="w-8 h-8 text-black ml-1" />
          </button>
        </div>
      )}
    </div>
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
