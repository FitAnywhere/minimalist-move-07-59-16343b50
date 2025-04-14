import { useState, useRef, useEffect, memo } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from './slider';

interface VideoPlayerProps {
  src: string;
  poster: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  priority?: boolean;
  playMode?: 'always' | 'onView' | 'firstScroll';
  width?: number;
  height?: number;
  fetchpriority?: 'high' | 'low' | 'auto';
  showVolumeControl?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onLoadedMetadata?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
}

const VideoPlayer = memo(({
  src,
  poster,
  className,
  aspectRatio = 'video',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  preload = 'metadata',
  priority = false,
  playMode = 'onView',
  width,
  height,
  fetchpriority,
  showVolumeControl = false,
  onPlay,
  onPause,
  onEnded,
  onLoadedMetadata
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [hasAutoplayedOnce, setHasAutoplayedOnce] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const volumeControlTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'portrait': return 'aspect-[3/4]';
      case 'video':
      default: return 'aspect-video';
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      rootMargin: '100px',
      threshold: 0.1
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const wasVisible = isVisible;
      setIsVisible(entry.isIntersecting);
      
      if (wasVisible && !entry.isIntersecting && isPlaying) {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
          onPause?.();
        }
      }
      
      if (!wasVisible && entry.isIntersecting && !userInteracted && !hasAutoplayedOnce && playMode === 'firstScroll') {
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setHasAutoplayedOnce(true);
                onPlay?.();
              })
              .catch(error => {
                console.error('Play on view failed:', error);
              });
          }
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVisible, isPlaying, onPlay, onPause, userInteracted, hasAutoplayedOnce, playMode]);

  const handlePlayClick = () => {
    if (!videoRef.current) return;

    if (!isLoaded) {
      videoRef.current.load();
      setIsLoaded(true);
    }

    setUserInteracted(true);

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            onPlay?.();
          })
          .catch(error => {
            console.error('Play failed:', error);
          });
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    
    if (!newMutedState) {
      setShowVolumeSlider(true);
      
      if (volumeControlTimeoutRef.current) {
        clearTimeout(volumeControlTimeoutRef.current);
      }
      
      volumeControlTimeoutRef.current = setTimeout(() => {
        setShowVolumeSlider(false);
      }, 3000);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (!videoRef.current) return;
    
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    videoRef.current.volume = volumeValue;
    
    if (volumeValue === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const showVolumeControls = () => {
    setShowVolumeSlider(true);
  };

  const hideVolumeControls = () => {
    setShowVolumeSlider(false);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false);
        onEnded?.();
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [loop, onEnded, onPause]);

  useEffect(() => {
    return () => {
      if (volumeControlTimeoutRef.current) {
        clearTimeout(volumeControlTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", getAspectRatioClass(), className)}
      data-loaded={isLoaded}
      data-playing={isPlaying}
    >
      <video
        ref={videoRef}
        preload={preload}
        muted={isMuted}
        playsInline
        loop={loop}
        controls={controls && isPlaying}
        poster={poster}
        className="w-full h-full object-cover"
        aria-label="Video player"
        width={width}
        height={height}
        fetchpriority={fetchpriority}
        onLoadedMetadata={onLoadedMetadata}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity duration-300"
          onClick={handlePlayClick}
        >
          <button
            className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors"
            aria-label={isPlaying ? "Pause video" : "Play video"}
            type="button"
          >
            <Play className="w-8 h-8 text-black ml-1" />
          </button>
        </div>
      )}

      {showVolumeControl && isPlaying && (
        <div 
          className="absolute bottom-4 right-4 flex items-center space-x-2"
          onMouseEnter={showVolumeControls}
          onMouseLeave={hideVolumeControls}
        >
          {showVolumeSlider && (
            <div className="bg-black/50 rounded-full px-2 py-1 transition-all duration-200">
              <Slider
                defaultValue={[volume]}
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-20 h-1"
                orientation="horizontal"
              />
            </div>
          )}
          
          <button
            onClick={toggleMute}
            className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            type="button"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
