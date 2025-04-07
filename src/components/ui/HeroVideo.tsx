
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import videoLoadManager from '@/utils/videoOptimization';

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

// Current playback state tracking
const playbackState = {
  isActive: false,
  timeoutId: null as NodeJS.Timeout | null
};

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
  const [loadRetries, setLoadRetries] = useState(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const vimeoContainerRef = useRef<HTMLDivElement>(null);
  const vimeoPlayerRef = useRef<VimeoPlayer | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(true); // Track component mounted state

  const LOCAL_VIDEO_URL = '/fitanywhere intro.mp4';
  const VIMEO_VIDEO_ID = 1067255623;
  const MP4_TIMEOUT = 2500; // 2.5 seconds timeout for MP4 loading
  const MAX_RETRIES = 5;
  const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff

  // Safe timeout clearing utility
  const clearControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  }, []);

  // Load Vimeo script with enhanced reliability
  const loadVimeoScript = useCallback((): Promise<void> => {
    if (document.getElementById('vimeo-player-script')) {
      return new Promise<void>((resolve) => {
        // Check if Vimeo is already defined
        if (window.Vimeo && window.Vimeo.Player) {
          resolve();
        } else {
          // Wait for the script to finish loading
          const checkVimeo = setInterval(() => {
            if (!mountedRef.current) {
              clearInterval(checkVimeo);
              return;
            }
            
            if (window.Vimeo && window.Vimeo.Player) {
              clearInterval(checkVimeo);
              resolve();
            }
          }, 100);
          
          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkVimeo);
            if (!mountedRef.current) return;
            
            if (!window.Vimeo || !window.Vimeo.Player) {
              console.error('Vimeo Player API loading timed out');
              // Continue anyway, might still work
              resolve();
            }
          }, 10000);
        }
      });
    }
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'vimeo-player-script';
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.defer = true; // Add defer for better performance
      
      script.onload = () => {
        if (!mountedRef.current) return;
        console.log('Vimeo Player API loaded');
        resolve();
      };
      
      script.onerror = (err) => {
        if (!mountedRef.current) return;
        console.error('Failed to load Vimeo Player API:', err);
        reject(err);
      };
      
      document.head.appendChild(script);
    }).catch(error => {
      console.error('Vimeo script loading error:', error);
      // Return a resolved promise so the chain continues
      return Promise.resolve();
    });
  }, []);

  // Initialize Vimeo player with enhanced reliability
  const initVimeoPlayer = useCallback(async () => {
    if (!vimeoContainerRef.current || !mountedRef.current) return;
    
    try {
      // Register with video load manager
      if (vimeoContainerRef.current) {
        videoLoadManager.registerVideo(
          VIMEO_VIDEO_ID.toString(),
          vimeoContainerRef.current
        );
      }
      
      await loadVimeoScript();
      if (!mountedRef.current) return;
      
      const VimeoPlayer = getVimeoPlayer();
      
      if (!VimeoPlayer) {
        console.error('Vimeo Player API failed to load');
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      if (vimeoPlayerRef.current) {
        try {
          vimeoPlayerRef.current.destroy();
        } catch (err) {
          console.error('Error destroying previous Vimeo player:', err);
        }
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
      if (!mountedRef.current) {
        try {
          player.destroy();
        } catch (err) {
          console.error('Error destroying Vimeo player after unmount:', err);
        }
        return;
      }
      
      vimeoPlayerRef.current = player;
      
      // Event handlers
      const handleReady = () => {
        if (!mountedRef.current) return;
        setVimeoLoaded(true);
        setIsLoading(false);
        console.log('Vimeo player ready');
      };
      
      const handlePlay = () => {
        if (!mountedRef.current) return;
        setIsPlaying(true);
        
        // Auto-hide controls after playback starts
        clearControlsTimeout();
        
        if (!isHovering) {
          controlsTimeoutRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            if (!isHovering) {
              setShowControls(false);
            }
          }, 2000);
        }
      };
      
      const handlePause = () => {
        if (!mountedRef.current) return;
        setIsPlaying(false);
        setShowControls(true);
      };
      
      const handleEnded = () => {
        if (!mountedRef.current) return;
        setIsPlaying(false);
        setShowControls(true);
        
        if (player && mountedRef.current) {
          player.pause().catch(err => console.error('Error pausing vimeo after end:', err));
        }
      };
      
      const handleError = (error: any) => {
        if (!mountedRef.current) return;
        console.error('Vimeo player error:', error);
        
        if (loadRetries < MAX_RETRIES) {
          console.log(`Retrying Vimeo player load (${loadRetries + 1}/${MAX_RETRIES})...`);
          
          setTimeout(() => {
            if (!mountedRef.current) return;
            setLoadRetries(prev => prev + 1);
            
            // Clean up before retrying
            if (player) {
              try {
                player.destroy();
                vimeoPlayerRef.current = null;
              } catch (e) {
                console.error('Error destroying player for retry:', e);
              }
            }
            
            // Try again
            initVimeoPlayer();
          }, RETRY_DELAYS[loadRetries] || 3000);
        } else {
          setHasError(true);
          setIsLoading(false);
        }
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
      if (!mountedRef.current) return;
      console.error('Error initializing Vimeo player:', error);
      
      if (loadRetries < MAX_RETRIES) {
        console.log(`Retrying Vimeo player initialization (${loadRetries + 1}/${MAX_RETRIES})...`);
        
        setTimeout(() => {
          if (!mountedRef.current) return;
          setLoadRetries(prev => prev + 1);
          initVimeoPlayer();
        }, RETRY_DELAYS[loadRetries] || 3000);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    }
  }, [isMuted, loadVimeoScript, loadRetries, isHovering, clearControlsTimeout]);

  // Main initialization effect with enhanced reliability
  useEffect(() => {
    mountedRef.current = true;
    setIsLoading(true);
    setHasError(false);
    
    // Try to load the local MP4 first
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleCanPlayThrough = () => {
        if (!mountedRef.current) return;
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
        if (!mountedRef.current) return;
        console.error('MP4 video failed to load, switching to Vimeo fallback');
        setUseVimeoFallback(true);
      };
      
      const handleEnded = () => {
        if (!mountedRef.current) return;
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
      
      // MP4 playback events for controls state management
      video.addEventListener('play', () => {
        if (!mountedRef.current) return;
        setIsPlaying(true);
        
        // Auto-hide controls after playback starts
        clearControlsTimeout();
        
        if (!isHovering) {
          controlsTimeoutRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            if (!isHovering) {
              setShowControls(false);
            }
          }, 2000);
        }
      });
      
      video.addEventListener('pause', () => {
        if (!mountedRef.current) return;
        setIsPlaying(false);
        setShowControls(true);
      });
      
      // Set a timeout for MP4 loading - if it takes too long, switch to Vimeo
      timeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        // Check readyState properly
        if (video.readyState < 4) {
          console.log('MP4 video taking too long to load, switching to Vimeo fallback');
          setUseVimeoFallback(true);
        }
      }, MP4_TIMEOUT);
      
      return () => {
        mountedRef.current = false;
        
        // Clean up event listeners
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('error', handleError);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('play', () => {});
        video.removeEventListener('pause', () => {});
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        clearControlsTimeout();
      };
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [isHovering, clearControlsTimeout]);

  // Initialize Vimeo player when needed
  useEffect(() => {
    if (useVimeoFallback && !vimeoLoaded) {
      initVimeoPlayer();
      
      return () => {
        // Clean up Vimeo player
        if (vimeoPlayerRef.current) {
          try {
            vimeoPlayerRef.current.destroy();
            vimeoPlayerRef.current = null;
          } catch (err) {
            console.error('Error destroying Vimeo player on cleanup:', err);
          }
        }
      };
    }
  }, [useVimeoFallback, vimeoLoaded, initVimeoPlayer]);

  // Handle play/pause with enhanced error handling
  const togglePlayPause = useCallback(() => {
    if (isLoading) return;
    
    // Prevent repeated rapid clicking
    if (playbackState.timeoutId) {
      return;
    }
    
    playbackState.isActive = true;
    playbackState.timeoutId = setTimeout(() => {
      playbackState.isActive = false;
      playbackState.timeoutId = null;
    }, 300); // Debounce period
    
    if (useVimeoFallback && vimeoPlayerRef.current) {
      if (isPlaying) {
        vimeoPlayerRef.current.pause()
          .catch(err => {
            console.error('Error pausing Vimeo:', err);
            // Update UI state anyway to match user intent
            setIsPlaying(false);
          });
      } else {
        vimeoPlayerRef.current.play()
          .catch(err => {
            console.error('Error playing Vimeo:', err);
            // Try again after a short delay
            setTimeout(() => {
              if (!mountedRef.current) return;
              if (vimeoPlayerRef.current) {
                vimeoPlayerRef.current.play()
                  .catch(innerErr => {
                    console.error('Error on second play attempt:', innerErr);
                  });
              }
            }, 500);
          });
      }
    } else if (videoRef.current) {
      const video = videoRef.current;
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
        setShowControls(true);
      } else {
        video.play()
          .then(() => {
            if (!mountedRef.current) return;
            setIsPlaying(true);
            
            // Auto-hide controls after playback starts
            clearControlsTimeout();
            
            if (!isHovering) {
              controlsTimeoutRef.current = setTimeout(() => {
                if (!mountedRef.current) return;
                if (!isHovering) {
                  setShowControls(false);
                }
              }, 2000);
            }
          })
          .catch(err => {
            console.error('Error playing MP4:', err);
            
            // Try again with muted (to work around autoplay restrictions)
            video.muted = true;
            setIsMuted(true);
            
            video.play()
              .then(() => {
                if (!mountedRef.current) return;
                setIsPlaying(true);
                
                // Auto-hide controls after playback starts
                clearControlsTimeout();
                
                if (!isHovering) {
                  controlsTimeoutRef.current = setTimeout(() => {
                    if (!mountedRef.current) return;
                    if (!isHovering) {
                      setShowControls(false);
                    }
                  }, 2000);
                }
              })
              .catch(innerErr => {
                console.error('Error playing muted MP4:', innerErr);
              });
          });
      }
    }
  }, [isPlaying, isLoading, useVimeoFallback, isHovering, clearControlsTimeout]);

  // Handle mute/unmute with enhanced error handling
  const toggleMute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (useVimeoFallback && vimeoPlayerRef.current) {
      vimeoPlayerRef.current.setMuted(newMutedState)
        .catch(err => {
          console.error('Error setting Vimeo mute state:', err);
          // Revert UI state if operation fails
          setIsMuted(!newMutedState);
        });
    } else if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
  }, [isMuted, useVimeoFallback]);

  // Handle hover state for controls with improved timing
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setShowControls(true);
    clearControlsTimeout();
  }, [clearControlsTimeout]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    
    if (isPlaying) {
      clearControlsTimeout();
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        setShowControls(false);
      }, 2000);
    }
  }, [isPlaying, clearControlsTimeout]);

  // Retry when both sources fail with enhanced reliability
  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setLoadRetries(0);
    setUseVimeoFallback(false);
    
    // Retry with MP4 first
    if (videoRef.current) {
      const video = videoRef.current;
      video.load();
      
      // Set timeout to switch to Vimeo if MP4 fails again
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        // Check readyState properly
        if (video.readyState < 4) {
          setUseVimeoFallback(true);
        }
      }, MP4_TIMEOUT);
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      // Clean up timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      clearControlsTimeout();
      
      // Clean up Vimeo player
      if (vimeoPlayerRef.current) {
        try {
          vimeoPlayerRef.current.destroy();
          vimeoPlayerRef.current = null;
        } catch (err) {
          console.error('Error destroying Vimeo player on unmount:', err);
        }
      }
      
      // Clean up global playback state
      if (playbackState.timeoutId) {
        clearTimeout(playbackState.timeoutId);
        playbackState.timeoutId = null;
        playbackState.isActive = false;
      }
    };
  }, [clearControlsTimeout]);

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
      
      {/* Loading Spinner with enhanced visual feedback */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-yellow/30 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="h-8 w-8 text-yellow animate-spin" />
              </div>
            </div>
            <p className="text-white text-sm">Loading video...</p>
            {loadRetries > 0 && (
              <p className="text-yellow text-xs">
                Retry attempt {loadRetries}/{MAX_RETRIES}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Error UI with more detailed feedback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
          <p className="text-lg font-semibold mb-1">Video failed to load</p>
          <p className="text-sm text-gray-300 mb-4">Please try again</p>
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
