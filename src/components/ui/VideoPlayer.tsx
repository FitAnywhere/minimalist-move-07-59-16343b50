
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
  playMode?: 'always' | 'onView';
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
      
      // If we were previously visible and now we're not, pause the video
      if (wasVisible && !entry.isIntersecting && isPlaying) {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
          onPause?.();
        }
      }
      
      // If we're becoming visible and user has scrolled but not played yet,
      // AND the user has previously interacted (by scroll or click),
      // then we should play the video
      if (!wasVisible && entry.isIntersecting && userInteracted && !isPlaying) {
        if (videoRef.current) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
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
  }, [isVisible, isPlaying, onPlay, onPause, userInteracted]);

  useEffect(() => {
    if ((isVisible || priority) && videoRef.current && !isLoaded) {
      if (preload !== 'none') {
        videoRef.current.load();
      }
      setIsLoaded(true);
    }
  }, [isVisible, priority, isLoaded, preload]);

  // Handle scroll events to play video when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (isVisible && !isPlaying && isLoaded) {
        setUserInteracted(true);
        handlePlayClick();
      }
    };

    // Only add the scroll listener if we're in onView mode
    if (playMode === 'onView') {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (playMode === 'onView') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isVisible, isPlaying, isLoaded, playMode]);

  const handlePlayClick = () => {
    if (!videoRef.current) return;

    if (!isLoaded) {
      videoRef.current.load();
      setIsLoaded(true);
    }

    setUserInteracted(true);

    try {
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
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    
    // Show volume slider when unmuting
    if (!newMutedState) {
      setShowVolumeSlider(true);
      
      // Auto-hide volume slider after a delay
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
    
    // If volume is set to 0, mute the video
    if (volumeValue === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      // If volume is being adjusted and video is muted, unmute it
      videoRef.current.muted = false;
      setIsMuted(false);
    }
    
    // Reset the auto-hide timer
    if (volumeControlTimeoutRef.current) {
      clearTimeout(volumeControlTimeoutRef.current);
    }
    
    volumeControlTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 3000);
  };
  
  const showVolumeControls = () => {
    setShowVolumeSlider(true);
    
    // Auto-hide volume slider after a delay
    if (volumeControlTimeoutRef.current) {
      clearTimeout(volumeControlTimeoutRef.current);
    }
    
    volumeControlTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 3000);
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

  // Cleanup volume control timeout
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
        onLoadedMetadata={(event) => {
          setIsLoaded(true);
          onLoadedMetadata?.(event);
        }}
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
            aria-label="Play video"
            type="button"
          >
            <Play className="w-8 h-8 text-black ml-1" />
          </button>
        </div>
      )}

      {showVolumeControl && isPlaying && (
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          {showVolumeSlider && (
            <div className="bg-black/50 rounded-full px-3 py-1">
              <Slider
                defaultValue={[volume]}
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24 h-2"
              />
            </div>
          )}
          
          <button
            onClick={toggleMute}
            onMouseEnter={showVolumeControls}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            type="button"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
