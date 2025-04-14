
import { Play } from 'lucide-react';

interface VideoPlayButtonProps {
  onClick: () => void;
  placeholderImage?: string;
  title?: string;
}

const VideoPlayButton = ({ onClick, placeholderImage, title }: VideoPlayButtonProps) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center bg-black z-10 cursor-pointer"
      onClick={onClick}
    >
      {placeholderImage ? (
        <div className="absolute inset-0">
          <img 
            src={placeholderImage} 
            alt={title || "Video thumbnail"}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            width="640" 
            height="360"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button 
              className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 text-black ml-1" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
          aria-label="Play video"
        >
          <Play className="w-8 h-8 text-black ml-1" />
        </button>
      )}
    </div>
  );
};

export default VideoPlayButton;
