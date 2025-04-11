
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

interface OptimizedVideoProps {
  vimeoId: string;
  hash?: string;
  title: string;
  aspectRatio?: string;
  placeholderImage: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  background?: boolean;
  responsive?: boolean;
}

const OptimizedVideo = ({
  vimeoId,
  hash,
  title,
  aspectRatio = "16:9",
  placeholderImage,
  className,
  autoplay = false,
  loop = false,
  muted = true,
  controls = false,
  background = false,
  responsive = true,
}: OptimizedVideoProps) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLoadVideo = () => {
    setVideoLoaded(true);
  };

  const getAspectRatioStyle = () => {
    if (aspectRatio === "16:9") {
      return { paddingBottom: "56.25%" }; // 16:9 aspect ratio
    } else if (aspectRatio === "4:3") {
      return { paddingBottom: "75%" }; // 4:3 aspect ratio
    } else if (aspectRatio === "1:1") {
      return { paddingBottom: "100%" }; // Square aspect ratio
    } else if (aspectRatio === "3:4") {
      return { paddingBottom: "133.33%" }; // 3:4 aspect ratio
    }
    return { paddingBottom: "56.25%" }; // Default to 16:9
  };

  return (
    <div 
      ref={containerRef} 
      className={cn("relative w-full overflow-hidden rounded-lg", className)}
      style={getAspectRatioStyle()}
    >
      {!videoLoaded ? (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={placeholderImage} 
            alt={title} 
            loading="lazy" 
            decoding="async"
            className="w-full h-full object-cover" 
            width="640" 
            height="360"
          />
          <button 
            onClick={handleLoadVideo}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-300"
            aria-label="Play video"
          >
            <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
              <Play size={32} className="text-black ml-1" />
            </div>
          </button>
        </div>
      ) : (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}${hash ? `?h=${hash}` : ''}${autoplay ? '&autoplay=1' : ''}${loop ? '&loop=1' : ''}${muted ? '&muted=1' : ''}${controls ? '' : '&controls=0'}&badge=0&autopause=0&player_id=0&app_id=58479${background ? '&background=1' : ''}`}
          allow="autoplay; fullscreen; picture-in-picture" 
          className="absolute inset-0 w-full h-full"
          title={title}
          loading="lazy"
          style={{ border: 'none' }}
        />
      )}
    </div>
  );
};

export default OptimizedVideo;
