import { useState, useRef, useEffect, memo } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from './slider';
import { useVolumeSlider } from '@/hooks/use-volume-slider';

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
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onLoadedMetadata?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  showHeroVolumeControl?: boolean;
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
  onPlay,
  onPause,
  onEnded,
  onLoadedMetadata,
  showHeroVolumeControl = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay && playMode === 'always');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { 
    showVolumeSlider, 
    handleVolumeToggle, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useVolumeSlider();

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
      setIsVisible(entry.isIntersecting);
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);
    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if ((isVisible || priority) && videoRef.current && !isLoaded) {
      if (preload !== 'none') {
        videoRef.current.load();
      }
      setIsLoaded(true);
    }
  }, [isVisible, priority, isLoaded, preload]);

  useEffect(() => {
    if (!videoRef.current || !isLoaded) return;

    if (playMode === 'always' && autoPlay) {
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              onPlay?.();
            })
            .catch(error => {
              if (process.env.NODE_ENV === 'development') {
                console.error('Auto-play failed:', error);
              }
            });
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error during auto-play:', error);
        }
      }
    } else if (playMode === 'onView') {
      if (isVisible && autoPlay) {
        try {
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
        } catch (error) {
          console.error('Error playing video on view:', error);
        }
      } else if (!isVisible && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      }
    }
  }, [isVisible, isLoaded, autoPlay, playMode, isPlaying, onPlay, onPause]);

  const handlePlayClick = () => {
    if (!videoRef.current) return;

    if (!isLoaded) {
      videoRef.current.load();
      setIsLoaded(true);
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              onPlay?.();
            })
            .catch(error => {
              if (process.env.NODE_ENV === 'development') {
                console.error('Play failed:', error);
              }
            });
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error playing video:', error);
        }
      }
    }
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

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0];
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    videoRef.current.muted = newMutedState;
  };

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
        className="w-full h-full object-cover cursor-pointer"
        aria-label="Video player"
        width={width}
        height={height}
        fetchpriority={fetchpriority}
        onClick={handlePlayClick}
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

      {showHeroVolumeControl && (
        <div 
          className="absolute bottom-4 right-4 flex flex-col items-end"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className={cn(
              "bg-black/50 px-3 py-4 rounded-lg mb-2 transition-opacity duration-150",
              showVolumeSlider ? "opacity-100 visible" : "opacity-0 invisible"
            )}
          >
            <Slider
              defaultValue={[volume]}
              max={1}
              step={0.1}
              orientation="vertical"
              className="h-24"
              onValueChange={handleVolumeChange}
            />
          </div>
          <button
            onClick={() => {
              toggleMute();
              handleVolumeToggle();
            }}
            className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
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
