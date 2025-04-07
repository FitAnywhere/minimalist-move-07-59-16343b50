
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Safe Vimeo type handling
type SafeVimeo = {
  Player: any;
};

interface VimeoPlayerOptions {
  id?: number;
  width?: number | string;
  height?: number | string;
  autopause?: boolean;
  autoplay?: boolean;
  background?: boolean;
  controls?: boolean;
  dnt?: boolean;
  keyboard?: boolean;
  loop?: boolean;
  muted?: boolean;
  pip?: boolean;
  playsinline?: boolean;
  responsive?: boolean;
  speed?: boolean;
  texttrack?: string;
  title?: boolean;
  transparent?: boolean;
  quality?: string;
  url?: string;
}

interface VimeoPlayer {
  destroy: () => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback: (data: any) => void) => void;
  pause: () => Promise<void>;
  play: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  ready: () => Promise<void>;
  loadVideo: (id: number | string) => Promise<void>;
  getVideoTitle: () => Promise<string>;
}

// Safe accessor function
function getVimeoPlayer(): SafeVimeo["Player"] | null {
  if (typeof window !== "undefined" && window.Vimeo && window.Vimeo.Player) {
    return window.Vimeo.Player;
  }
  return null;
}

const HeroVideo = memo(() => {
  // Core state variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [useVimeoFallback, setUseVimeoFallback] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [vimeoLoaded, setVimeoLoaded] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const vimeoContainerRef = useRef<HTMLDivElement>(null);
  const vimeoPlayerRef = useRef<VimeoPlayer | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const LOCAL_VIDEO_URL = '/fitanywhere intro.mp4';
  const VIMEO_VIDEO_ID = '1067255623';
  const MP4_TIMEOUT = 2500; // 2.5 seconds timeout for MP4 loading

  // Load Vimeo script
  const loadVimeoScript = useCallback(() => {
    if (document.getElementById('vimeo-player-script')) return Promise.resolve();
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'vimeo-player-script';
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }, []);

  // Initialize Vimeo player
  const initVimeoPlayer = useCallback(async () => {
    if (!vimeoContainerRef.current) return;
    
    try {
      await loadVimeoScript();
      const VimeoPlayer = getVimeoPlayer();
      
      if (!VimeoPlayer) {
        console.error('Vimeo Player API failed to load');
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      if (vimeoPlayerRef.current) {
        vimeoPlayerRef.current.destroy();
      }
      
      const options: VimeoPlayerOptions = {
        id: VIMEO_VIDEO_ID,
        width: '100%',
        height: '100%',
        loop: false,
        autoplay: false,
        muted: isMuted,
        controls: false,
        responsive: true,
        dnt: true,
        background: false,
        transparent: true,
      };
      
      const player = new VimeoPlayer(vimeoContainerRef.current, options) as VimeoPlayer;
      vimeoPlayerRef.current = player;
      
      // Event handlers
      const handleReady = () => {
        setVimeoLoaded(true);
        setIsLoading(false);
        console.log('Vimeo player ready');
      };
      
      const handlePlay = () => {
        setIsPlaying(true);
        // Auto-hide controls after playback starts
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          if (!isHovering) {
            setShowControls(false);
          }
        }, 2000);
      };
      
      const handlePause = () => {
        setIsPlaying(false);
        setShowControls(true);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setShowControls(true);
        player.pause().catch(err => console.error('Error pausing vimeo after end:', err));
      };
      
      const handleError = (error: any) => {
        console.error('Vimeo player error:', error);
        setHasError(true);
        setIsLoading(false);
      };
      
      player.on('ready', handleReady);
      player.on('play', handlePlay);
      player.on('pause', handlePause);
      player.on('ended', handleEnded);
      player.on('error', handleError);
      
      return () => {
        player.off('ready', handleReady);
        player.off('play', handlePlay);
        player.off('pause', handlePause);
        player.off('ended', handleEnded);
        player.off('error', handleError);
      };
    } catch (error) {
      console.error('Error initializing Vimeo player:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [isMuted, loadVimeoScript]);

  // Main initialization effect
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Try to load the local MP4 first
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleCanPlayThrough = () => {
        if (!useVimeoFallback) {
          setIsLoading(false);
          console.log('MP4 video loaded successfully');
          
          // Clear the timeout since video loaded successfully
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      };
      
      const handleError = () => {
        console.error('MP4 video failed to load, switching to Vimeo fallback');
        setUseVimeoFallback(true);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setShowControls(true);
        if (video) {
          video.currentTime = 0;
        }
      };
      
      // Set up event listeners
      video.addEventListener('canplaythrough', handleCanPlayThrough);
      video.addEventListener('error', handleError);
      video.addEventListener('ended', handleEnded);
      
      // Set a timeout for MP4 loading - if it takes too long, switch to Vimeo
      timeoutRef.current = setTimeout(() => {
        if (!video.readyState >= 4) {
          console.log('MP4 video taking too long to load, switching to Vimeo fallback');
          setUseVimeoFallback(true);
        }
      }, MP4_TIMEOUT);
      
      return () => {
        // Clean up event listeners
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('error', handleError);
        video.removeEventListener('ended', handleEnded);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, []);

  // Initialize Vimeo player when needed
  useEffect(() => {
    if (useVimeoFallback && !vimeoLoaded) {
      const cleanupFn = initVimeoPlayer();
      
      return () => {
        // Clean up Vimeo player
        if (cleanupFn && typeof cleanupFn === 'function') {
          cleanupFn();
        }
        
        if (vimeoPlayerRef.current) {
          vimeoPlayerRef.current.destroy();
          vimeoPlayerRef.current = null;
        }
      };
    }
  }, [useVimeoFallback, vimeoLoaded, initVimeoPlayer]);

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    if (isLoading) return;
    
    if (useVimeoFallback && vimeoPlayerRef.current) {
      if (isPlaying) {
        vimeoPlayerRef.current.pause().catch(err => console.error('Error pausing Vimeo:', err));
      } else {
        vimeoPlayerRef.current.play().catch(err => console.error('Error playing Vimeo:', err));
      }
    } else if (videoRef.current) {
      const video = videoRef.current;
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
        setShowControls(true);
      } else {
        video.play().then(() => {
          setIsPlaying(true);
          // Auto-hide controls after playback starts
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
          controlsTimeoutRef.current = setTimeout(() => {
            if (!isHovering) {
              setShowControls(false);
            }
          }, 2000);
        }).catch(err => console.error('Error playing MP4:', err));
      }
    }
  }, [isPlaying, isLoading, useVimeoFallback, isHovering]);

  // Handle mute/unmute
  const toggleMute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (useVimeoFallback && vimeoPlayerRef.current) {
      vimeoPlayerRef.current.setMuted(newMutedState).catch(err => console.error('Error setting Vimeo mute state:', err));
    } else if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
  }, [isMuted, useVimeoFallback]);

  // Handle hover state for controls
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    
    if (isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  }, [isPlaying]);

  // Retry when both sources fail
  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setUseVimeoFallback(false);
    
    // Retry with MP4 first
    if (videoRef.current) {
      const video = videoRef.current;
      video.load();
      
      // Set timeout to switch to Vimeo if MP4 fails again
      timeoutRef.current = setTimeout(() => {
        if (!video.readyState >= 4) {
          setUseVimeoFallback(true);
        }
      }, MP4_TIMEOUT);
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clean up timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      // Clean up Vimeo player
      if (vimeoPlayerRef.current) {
        vimeoPlayerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={togglePlayPause}
    >
      {/* MP4 Video */}
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
          useVimeoFallback ? "opacity-0" : "opacity-100"
        )}
        src={LOCAL_VIDEO_URL}
        playsInline
        muted={isMuted}
        preload="metadata"
        style={{ display: useVimeoFallback ? 'none' : 'block' }}
      />
      
      {/* Vimeo Fallback */}
      <div 
        ref={vimeoContainerRef}
        className={cn(
          "absolute inset-0 w-full h-full transition-opacity duration-300",
          useVimeoFallback ? "opacity-100" : "opacity-0"
        )}
        style={{ display: useVimeoFallback ? 'block' : 'none' }}
      />
      
      {/* Play/Pause Button */}
      {showControls && !isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-black" />
            ) : (
              <Play className="h-8 w-8 text-black ml-1" />
            )}
          </button>
        </div>
      )}
      
      {/* Mute/Unmute Button */}
      {showControls && !isLoading && !hasError && (
        <div className="absolute bottom-3 right-3">
          <button
            className="bg-black/60 hover:bg-black/80 p-2 rounded-full transition-colors duration-300 focus:outline-none"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      )}
      
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-yellow/30 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="h-8 w-8 text-yellow animate-spin" />
            </div>
          </div>
        </div>
      )}
      
      {/* Error UI */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
          <p className="text-lg font-semibold mb-4">Video failed to load</p>
          <button
            className="bg-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-full flex items-center"
            onClick={handleRetry}
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
