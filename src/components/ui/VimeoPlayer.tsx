
import { useRef, useState, useEffect, memo, useCallback } from 'react';
import { Volume2, VolumeX, Volume1, Volume, Play, Pause, Loader } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VimeoPlayerProps {
  videoId: string;
  playerId: string;
  className?: string;
  isInView: boolean;
  audioOn: boolean;
  toggleAudio: (e: React.MouseEvent) => void;
  priority?: boolean;
  onVideoLoadError?: () => void;
  enableRetries?: boolean;
  fallbackVideoUrl?: string;
}

interface VimeoPlayerAPI {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  setCurrentTime: (time: number) => Promise<void>;
  on: (event: string, callback: any) => void;
  off: (event: string, callback: any) => void;
  destroy: () => void;
}

const VimeoPlayer = memo(({
  videoId,
  playerId,
  className = "",
  isInView,
  audioOn,
  toggleAudio,
  priority = false,
  onVideoLoadError,
  enableRetries = false,
  fallbackVideoUrl
}: VimeoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement>(null);
  const [player, setPlayer] = useState<VimeoPlayerAPI | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoVisible, setVideoVisible] = useState(false);
  const [volume, setVolume] = useState(1); // 0 to 1
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const wasInViewRef = useRef(isInView);
  const audioOnRef = useRef(audioOn);
  const raceWinnerDeclaredRef = useRef(false);
  const vimeoLoadStartTimeRef = useRef(0);
  const fallbackLoadStartTimeRef = useRef(0);
  
  // Race strategy tracking refs
  const vimeoReadyRef = useRef(false);
  const fallbackReadyRef = useRef(false);
  
  useEffect(() => {
    audioOnRef.current = audioOn;
  }, [audioOn]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const buildIframeSrc = useCallback(() => {
    const params = new URLSearchParams({
      h: 'd77ee52644',
      title: '0',
      byline: '0',
      portrait: '0',
      badge: '0',
      autopause: '0',
      background: '1',
      loop: '0',
      player_id: playerId,
      app_id: '58479',
      dnt: '1',
      autoplay: '0',
      muted: '1',
      controls: '0'
    });
    
    if (priority) {
      params.append('preload', 'auto');
    }
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }, [videoId, playerId, priority]);

  // Select video source based on race strategy
  const declareRaceWinner = useCallback((winner: 'vimeo' | 'fallback') => {
    if (raceWinnerDeclaredRef.current) return; // Only declare winner once
    
    console.log(`Race winner declared: ${winner}`);
    raceWinnerDeclaredRef.current = true;
    
    if (winner === 'vimeo') {
      setUsingFallback(false);
      vimeoReadyRef.current = true;
      
      // Clean up fallback if it was loading
      if (fallbackVideoRef.current) {
        fallbackVideoRef.current.pause();
        fallbackVideoRef.current.removeAttribute('src');
        fallbackVideoRef.current.load();
      }
      
      setIsLoading(false);
      setVideoVisible(true);
      setIsPlayerReady(true);
      
      // Report video ready
      const loadTime = performance.now() - vimeoLoadStartTimeRef.current;
      console.log(`Vimeo video ready in ${loadTime.toFixed(0)}ms`);
      
      // Dispatch ready event for other parts of the app
      if (priority) {
        const event = new Event('heroVideoReady');
        window.dispatchEvent(event);
      }
    } else {
      setUsingFallback(true);
      fallbackReadyRef.current = true;
      
      // Clean up Vimeo if it was loading
      if (player) {
        player.pause().catch(() => {});
        player.destroy();
        setPlayer(null);
      }
      
      setIsLoading(false);
      setVideoVisible(true);
      setIsPlayerReady(true);
      
      // Report video ready
      const loadTime = performance.now() - fallbackLoadStartTimeRef.current;
      console.log(`Fallback video ready in ${loadTime.toFixed(0)}ms`);
      
      // Dispatch ready event for other parts of the app
      if (priority) {
        const event = new Event('heroVideoReady');
        window.dispatchEvent(event);
      }
    }
  }, [player, priority]);

  // Initialize both video sources in parallel (race strategy)
  useEffect(() => {
    if (!priority) return; // Only auto-start if priority
    
    // Start race timer
    vimeoLoadStartTimeRef.current = performance.now();
    fallbackLoadStartTimeRef.current = performance.now();
    
    // Start loading both sources immediately
    initializeVimeoPlayer();
    initializeFallbackVideo();
    
    // We're starting with clean loading state
    setIsLoading(true);
    setVideoVisible(false);
    setIsPlayerReady(false);
    raceWinnerDeclaredRef.current = false;
    vimeoReadyRef.current = false;
    fallbackReadyRef.current = false;
    
    return () => {
      // Clean up
      if (player) {
        player.pause().catch(() => {});
        player.destroy();
      }
      
      if (fallbackVideoRef.current) {
        fallbackVideoRef.current.pause();
        fallbackVideoRef.current.removeAttribute('src');
        fallbackVideoRef.current.load();
      }
    };
  }, [priority]);

  const initializeVimeoPlayer = useCallback(() => {
    // Skip if no Vimeo API or iframe
    if (!window.Vimeo || !iframeRef.current) {
      return;
    }
    
    try {
      console.log("Initializing Vimeo player...");
      const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
      setPlayer(vimeoPlayer);
      
      vimeoPlayer.setVolume(audioOnRef.current ? volume : 0)
        .catch((err: any) => console.warn("Could not set volume:", err));
      
      vimeoPlayer.setMuted(!audioOnRef.current)
        .catch((err: any) => console.warn("Could not set muted:", err));
      
      vimeoPlayer.on('play', () => {
        setIsPlaying(true);
        setVideoEnded(false);
      });
      
      vimeoPlayer.on('pause', () => {
        setIsPlaying(false);
      });
      
      vimeoPlayer.on('loaded', () => {
        console.log("Vimeo player loaded");
        
        // Set to first frame and pause - don't autoplay
        vimeoPlayer.setCurrentTime(0.1).then(() => {
          vimeoPlayer.pause().catch(() => {});
          
          // Declare as race winner if fallback isn't ready yet
          if (!fallbackReadyRef.current && !raceWinnerDeclaredRef.current) {
            declareRaceWinner('vimeo');
          }
        }).catch(() => {
          console.error("Could not set initial Vimeo time");
        });
      });
      
      vimeoPlayer.on('error', (error: any) => {
        console.error("Vimeo player error:", error);
        
        // If fallback is ready or we haven't declared a winner yet, use fallback
        if ((fallbackReadyRef.current || !raceWinnerDeclaredRef.current) && fallbackVideoUrl) {
          declareRaceWinner('fallback');
        }
      });
      
      vimeoPlayer.on('ended', () => {
        setIsPlaying(false);
        setVideoEnded(true);
        
        // Reset to first frame on end
        vimeoPlayer.setCurrentTime(0.1).then(() => {
          vimeoPlayer.pause().catch(() => {});
        }).catch(() => {});
      });
    } catch (error) {
      console.error("Error initializing Vimeo player:", error);
      
      // If initialization fails, try fallback
      if (fallbackVideoUrl && !raceWinnerDeclaredRef.current) {
        declareRaceWinner('fallback');
      }
    }
  }, [volume, fallbackVideoUrl, declareRaceWinner]);

  const initializeFallbackVideo = useCallback(() => {
    if (!fallbackVideoUrl || !fallbackVideoRef.current) return;
    
    console.log("Initializing fallback video...");
    const video = fallbackVideoRef.current;
    
    video.muted = !audioOnRef.current;
    video.volume = audioOnRef.current ? volume : 0;
    
    const handleCanPlay = () => {
      console.log("Fallback video can play");
      
      // Set to first frame
      video.currentTime = 0.1;
      video.pause();
      
      // Declare as race winner if Vimeo isn't ready yet
      if (!vimeoReadyRef.current && !raceWinnerDeclaredRef.current) {
        declareRaceWinner('fallback');
      }
    };
    
    const handleError = (e: Event) => {
      console.error("Fallback video error:", e);
      
      // If Vimeo is ready or we haven't declared a winner yet, use Vimeo
      if ((vimeoReadyRef.current || !raceWinnerDeclaredRef.current) && player) {
        declareRaceWinner('vimeo');
      } else if (!raceWinnerDeclaredRef.current) {
        // Both failed
        setIsLoading(false);
        if (onVideoLoadError) onVideoLoadError();
      }
    };
    
    const handleEnded = () => {
      // Reset to beginning when video ends
      video.currentTime = 0.1;
      video.pause();
      setIsPlaying(false);
      setVideoEnded(true);
      console.log("Fallback video ended, reset to beginning");
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);
    
    // Start loading fallback
    video.src = fallbackVideoUrl;
    video.load();
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [fallbackVideoUrl, volume, declareRaceWinner, player, onVideoLoadError]);

  // Play/Pause handler
  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (usingFallback && fallbackVideoRef.current) {
      if (isPlaying) {
        fallbackVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        fallbackVideoRef.current.volume = audioOnRef.current ? volume : 0;
        fallbackVideoRef.current.muted = !audioOnRef.current;
        
        // If video ended, reset to beginning before playing
        if (videoEnded) {
          fallbackVideoRef.current.currentTime = 0.1;
          setVideoEnded(false);
        }
        
        const playPromise = fallbackVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch((error) => {
            console.error("Failed to play fallback video:", error);
          });
        }
      }
      return;
    }
    
    if (!player) return;
    
    if (isPlaying) {
      player.pause().catch((error: any) => {
        console.error("Failed to pause video:", error);
      });
    } else {
      player.setVolume(audioOnRef.current ? volume : 0).catch(() => {});
      player.setMuted(!audioOnRef.current).catch(() => {});
      
      // If video ended, reset to beginning before playing
      if (videoEnded) {
        player.setCurrentTime(0.1).then(() => {
          player.play().catch(() => {});
          setVideoEnded(false);
        }).catch(() => {});
      } else {
        player.play().catch((error: any) => {
          console.error("Failed to play video:", error);
        });
      }
    }
  }, [player, isPlaying, volume, usingFallback, videoEnded]);

  // Update audio when audioOn changes
  useEffect(() => {
    if (usingFallback && fallbackVideoRef.current) {
      fallbackVideoRef.current.volume = audioOn ? volume : 0;
      fallbackVideoRef.current.muted = !audioOn;
      return;
    }
    
    if (!player) return;
    
    player.setVolume(audioOn ? volume : 0).catch(() => {});
    player.setMuted(!audioOn).catch(() => {});
  }, [player, audioOn, volume, usingFallback]);

  // Handle visibility changes
  useEffect(() => {
    if (usingFallback && fallbackVideoRef.current) {
      const viewStateChanged = wasInViewRef.current !== isInView;
      wasInViewRef.current = isInView;
      
      if (viewStateChanged) {
        if (!isInView && isPlaying) {
          fallbackVideoRef.current.pause();
          setIsPlaying(false);
        }
      }
      return;
    }
    
    if (!player) return;

    const viewStateChanged = wasInViewRef.current !== isInView;
    wasInViewRef.current = isInView;

    if (viewStateChanged) {
      if (!isInView && isPlaying) {
        player.pause().catch(() => {});
      }
    }
  }, [isInView, player, isPlaying, usingFallback]);

  // Handle volume slider changes
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (usingFallback && fallbackVideoRef.current && audioOn) {
      fallbackVideoRef.current.volume = newVolume;
      return;
    }
    
    if (player && audioOn) {
      player.setVolume(newVolume).catch(() => {});
    }
  }, [player, audioOn, usingFallback]);

  // Audio toggle handler
  const handleToggleAudio = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (toggleAudio) {
      toggleAudio(e);
    }
  }, [toggleAudio]);

  // Volume slider visibility
  const handleVolumeIconHover = useCallback(() => {
    setShowVolumeSlider(true);
  }, []);

  // Choose volume icon based on volume level
  const getVolumeIcon = useCallback(() => {
    if (!audioOn) return <VolumeX size={20} className="text-white" />;
    
    if (volume >= 0.7) return <Volume2 size={20} className="text-white" />;
    if (volume >= 0.3) return <Volume1 size={20} className="text-white" />;
    return <Volume size={20} className="text-white" />;
  }, [volume, audioOn]);

  // Determine play/pause button visibility
  const getPlayPauseButton = useCallback(() => {
    if (isLoading) return null;
    
    if (isPlaying) {
      return (
        <button 
          onClick={handlePlayClick}
          className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/20 transition-all duration-200 z-20 opacity-0 hover:opacity-100"
          aria-label="Pause video"
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-yellow/90 transition-colors duration-300 group">
            <Pause size={28} className="text-black group-hover:scale-110 transition-transform duration-300" />
          </div>
        </button>
      );
    }
    
    return (
      <button 
        onClick={handlePlayClick}
        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-200 z-20"
        aria-label="Play video"
      >
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-yellow/90 transition-colors duration-300 group">
          <Play size={28} className="text-black ml-1 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </button>
    );
  }, [isLoading, isPlaying, handlePlayClick]);

  return (
    <div className={`relative ${className}`}>
      <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 rounded-lg">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-yellow/30 animate-pulse" />
                <div className="absolute inset-0 w-20 h-20 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full border-4 border-yellow/50 animate-pulse animation-delay-200" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="w-8 h-8 text-yellow animate-spin" />
                </div>
              </div>
              
              <div className="text-white font-medium tracking-wide text-center">
                <p>LOADING VIDEO</p>
                <div className="mt-2 h-1 w-32 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Fallback Video */}
        <video 
          ref={fallbackVideoRef}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300", 
            usingFallback && videoVisible && !isLoading ? "opacity-100" : "opacity-0"
          )}
          playsInline
          muted={!audioOn}
          preload="auto"
          style={{ zIndex: usingFallback ? 5 : 0 }}
        />
        
        {/* Vimeo Video */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-300",
            !usingFallback && videoVisible && !isLoading ? "opacity-100" : "opacity-0"
          )}
          style={{ zIndex: !usingFallback ? 5 : 0 }}
        >
          <iframe 
            ref={iframeRef}
            src={buildIframeSrc()}
            style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}} 
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
            title="FitAnywhere"
            loading={priority ? "eager" : "lazy"}
            fetchpriority={priority ? "high" : "auto"}
          ></iframe>
        </div>
        
        {/* Play/Pause button overlay */}
        {isPlayerReady && getPlayPauseButton()}
      </div>
      
      {/* Volume control */}
      <div 
        ref={volumeControlRef}
        className="absolute bottom-3 right-3 z-30"
        onMouseEnter={handleVolumeIconHover}
      >
        <div className={cn(
          "absolute bottom-8 right-1 bg-black/60 rounded-lg px-2 py-2 transition-all duration-300",
          showVolumeSlider && audioOn
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}>
          <Slider
            orientation="vertical"
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="mx-auto"
          />
        </div>
        
        <button 
          onClick={handleToggleAudio}
          className="bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all duration-300"
          aria-label={audioOn ? "Mute audio" : "Unmute audio"}
        >
          {getVolumeIcon()}
        </button>
      </div>
    </div>
  );
});

VimeoPlayer.displayName = 'VimeoPlayer';

export default VimeoPlayer;
