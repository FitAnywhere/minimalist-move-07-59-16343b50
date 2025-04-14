import { useState, useRef, useEffect, memo } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [isPlaying, setIsPlaying] = useState(autoPlay && playMode === 'always');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
              console.error('Auto-play failed:', error);
            });
        }
      } catch (error) {
        console.error('Error during auto-play:', error);
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
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (videoRef.current && isVisible && !isPlaying) {
          handlePlayClick();
        }
      }, 150);
    };

    if (playMode === 'onView') {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (playMode === 'onView') {
        window.removeEventListener('scroll', handleScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isVisible, isPlaying, playMode]);

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
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          type="button"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
