
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
  fallbackVideoUrl?: string;
}

const VimeoPlayer = memo(({
  videoId,
  playerId,
  className = "",
  isInView,
  audioOn,
  toggleAudio,
  priority = false,
  fallbackVideoUrl
}: VimeoPlayerProps) => {
  // Element refs
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement>(null);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  
  // Player states
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  // Race strategy - track which player wins
  const raceWinnerDeclared = useRef(false);
  const vimeoLoadStartTime = useRef(0);
  const fallbackLoadStartTime = useRef(0);
  
  // Build the Vimeo iframe source URL
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
      autoplay: '0', // Never autoplay
      muted: '1',
      controls: '0',
      preload: priority ? 'auto' : 'metadata'
    });
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }, [videoId, playerId, priority]);
  
  // Declare the race winner - which video source to use
  const declareRaceWinner = useCallback((winner: 'vimeo' | 'fallback') => {
    if (raceWinnerDeclared.current) return;
    raceWinnerDeclared.current = true;
    
    console.log(`Race winner declared: ${winner}`);
    
    if (winner === 'vimeo') {
      setUsingFallback(false);
      
      // Clean up fallback if it exists
      if (fallbackVideoRef.current) {
        fallbackVideoRef.current.pause();
        fallbackVideoRef.current.removeAttribute('src');
        fallbackVideoRef.current.load();
      }
      
      // Report video ready timing
      const loadTime = performance.now() - vimeoLoadStartTime.current;
      console.log(`Vimeo video ready in ${loadTime.toFixed(0)}ms`);
      
      // Dispatch ready event for other parts of the app
      if (priority) {
        window.dispatchEvent(new Event('heroVideoReady'));
      }
    } else {
      setUsingFallback(true);
      
      // Clean up Vimeo if it exists
      if (player) {
        player.pause().catch(() => {});
        player.destroy();
        setPlayer(null);
      }
      
      // Report video ready timing
      const loadTime = performance.now() - fallbackLoadStartTime.current;
      console.log(`Fallback video ready in ${loadTime.toFixed(0)}ms`);
      
      // Dispatch ready event for other parts of the app
      if (priority) {
        window.dispatchEvent(new Event('heroVideoReady'));
      }
    }
    
    // Always hide loading spinner once we have a winner
    setIsLoading(false);
  }, [player, priority]);
  
  // Initialize both Vimeo and fallback players in parallel
  useEffect(() => {
    // Start race timer
    vimeoLoadStartTime.current = performance.now();
    fallbackLoadStartTime.current = performance.now();
    
    // Reset state for clean initialization
    setIsLoading(true);
    setIsPlaying(false);
    raceWinnerDeclared.current = false;
    
    // Initialize both sources immediately
    initializeVimeoPlayer();
    initializeFallbackVideo();
    
    return () => {
      // Proper cleanup
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
  }, []);
  
  // Volume control click outside handler
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
  
  // Visibility effect - pause when out of view
  useEffect(() => {
    if (!isInView && isPlaying) {
      if (usingFallback && fallbackVideoRef.current) {
        fallbackVideoRef.current.pause();
        setIsPlaying(false);
      } else if (player) {
        player.pause().catch(() => {});
        setIsPlaying(false);
      }
    }
  }, [isInView, isPlaying, player, usingFallback]);
  
  // Update audio when audioOn changes
  useEffect(() => {
    if (usingFallback && fallbackVideoRef.current) {
      fallbackVideoRef.current.volume = audioOn ? volume : 0;
      fallbackVideoRef.current.muted = !audioOn;
    } else if (player) {
      player.setVolume(audioOn ? volume : 0).catch(() => {});
      player.setMuted(!audioOn).catch(() => {});
    }
  }, [player, audioOn, volume, usingFallback]);
  
  // Initialize Vimeo player with clean event handlers
  const initializeVimeoPlayer = useCallback(() => {
    if (!window.Vimeo || !iframeRef.current) return;
    
    try {
      console.log("Initializing Vimeo player...");
      const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
      setPlayer(vimeoPlayer);
      
      // Set initial audio state
      vimeoPlayer.setVolume(audioOn ? volume : 0).catch(() => {});
      vimeoPlayer.setMuted(!audioOn).catch(() => {});
      
      // Listen for player events
      vimeoPlayer.on('loaded', () => {
        console.log("Vimeo player loaded");
        
        // Position at first frame and pause
        vimeoPlayer.setCurrentTime(0.1).then(() => {
          vimeoPlayer.pause().catch(() => {});
          
          // If race not decided yet, declare Vimeo as winner
          if (!raceWinnerDeclared.current) {
            declareRaceWinner('vimeo');
          }
        }).catch(() => {
          console.error("Could not set initial Vimeo time");
        });
      });
      
      vimeoPlayer.on('play', () => {
        setIsPlaying(true);
      });
      
      vimeoPlayer.on('pause', () => {
        setIsPlaying(false);
      });
      
      vimeoPlayer.on('ended', () => {
        // Reset to first frame on end
        vimeoPlayer.setCurrentTime(0.1).then(() => {
          vimeoPlayer.pause().catch(() => {});
          setIsPlaying(false);
        }).catch(() => {});
      });
      
      vimeoPlayer.on('error', (error: any) => {
        console.error("Vimeo player error:", error);
        
        // If race not decided yet, use fallback
        if (!raceWinnerDeclared.current && fallbackVideoUrl) {
          declareRaceWinner('fallback');
        }
      });
    } catch (error) {
      console.error("Error initializing Vimeo player:", error);
      
      // If initialization fails and race not decided, use fallback
      if (fallbackVideoUrl && !raceWinnerDeclared.current) {
        declareRaceWinner('fallback');
      }
    }
  }, [audioOn, volume, declareRaceWinner, fallbackVideoUrl]);
  
  // Initialize fallback video with clean event handlers
  const initializeFallbackVideo = useCallback(() => {
    if (!fallbackVideoUrl || !fallbackVideoRef.current) return;
    
    console.log("Initializing fallback video...");
    // Fixed: We can't reassign the video const, so we'll work with it directly
    const originalVideo = fallbackVideoRef.current;
    
    // Set initial audio state
    originalVideo.muted = !audioOn;
    originalVideo.volume = audioOn ? volume : 0;
    
    // Create a clone of the video element
    const cloneVideo = originalVideo.cloneNode() as HTMLVideoElement;
    
    // Update the ref with the clone before changing parent
    if (originalVideo.parentNode) {
      originalVideo.parentNode.replaceChild(cloneVideo, originalVideo);
    }
    
    // Update the ref to point to our new video element
    fallbackVideoRef.current = cloneVideo;
    
    // Now we work with the cloned video element
    const video = fallbackVideoRef.current;
    
    // Add event listeners
    const handleCanPlay = () => {
      console.log("Fallback video can play");
      
      // Set to first frame and pause
      video.currentTime = 0.1;
      video.pause();
      
      // If race not decided yet, declare fallback as winner
      if (!raceWinnerDeclared.current) {
        declareRaceWinner('fallback');
      }
    };
    
    const handleError = (e: Event) => {
      console.error("Fallback video error:", e);
      
      // If race not decided yet and Vimeo available, use Vimeo
      if (!raceWinnerDeclared.current && player) {
        declareRaceWinner('vimeo');
      }
    };
    
    const handleEnded = () => {
      // Reset to beginning when video ends
      video.currentTime = 0.1;
      video.pause();
      setIsPlaying(false);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    // Start loading fallback
    video.src = fallbackVideoUrl;
    video.load();
    
    return () => {
      // Clean up event listeners
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [fallbackVideoUrl, audioOn, volume, declareRaceWinner, player]);
  
  // Play/Pause handler
  const handlePlayPause = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlaying) {
      // PAUSE logic
      if (usingFallback && fallbackVideoRef.current) {
        fallbackVideoRef.current.pause();
      } else if (player) {
        player.pause().catch(() => {});
      }
    } else {
      // PLAY logic
      if (usingFallback && fallbackVideoRef.current) {
        fallbackVideoRef.current.volume = audioOn ? volume : 0;
        fallbackVideoRef.current.muted = !audioOn;
        fallbackVideoRef.current.play().catch(error => {
          console.error("Failed to play fallback video:", error);
        });
      } else if (player) {
        player.setVolume(audioOn ? volume : 0).catch(() => {});
        player.setMuted(!audioOn).catch(() => {});
        player.play().catch(error => {
          console.error("Failed to play Vimeo video:", error);
        });
      }
    }
  }, [player, isPlaying, volume, audioOn, usingFallback]);
  
  // Volume slider handler
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (usingFallback && fallbackVideoRef.current && audioOn) {
      fallbackVideoRef.current.volume = newVolume;
    } else if (player && audioOn) {
      player.setVolume(newVolume).catch(() => {});
    }
  }, [player, audioOn, usingFallback]);
  
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
  
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
        {/* Loading Spinner - Only shown during initial load */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-30 rounded-lg">
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
            usingFallback ? "opacity-100" : "opacity-0"
          )}
          playsInline
          muted={!audioOn}
          preload="auto"
          style={{ zIndex: usingFallback ? 10 : 0 }}
        />
        
        {/* Vimeo Video */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-300",
            !usingFallback ? "opacity-100" : "opacity-0"
          )}
          style={{ zIndex: !usingFallback ? 10 : 0 }}
        >
          <iframe 
            ref={iframeRef}
            src={buildIframeSrc()}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
            title="FitAnywhere"
            loading={priority ? "eager" : "lazy"}
          ></iframe>
        </div>
        
        {/* Play/Pause Overlay Button */}
        <button 
          onClick={handlePlayPause}
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-200 z-20",
            isPlaying ? "opacity-0 pointer-events-none hover:opacity-100 hover:pointer-events-auto bg-black/5 hover:bg-black/20" : "opacity-100 bg-black/20 hover:bg-black/30"
          )}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-yellow/90 transition-colors duration-300 group">
            {isPlaying ? (
              <Pause size={28} className="text-black group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <Play size={28} className="text-black ml-1 group-hover:scale-110 transition-transform duration-300" />
            )}
          </div>
        </button>
        
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
            onClick={toggleAudio}
            className="bg-black/60 hover:bg-black/80 p-2 rounded-full transition-all duration-300"
            aria-label={audioOn ? "Mute audio" : "Unmute audio"}
          >
            {getVolumeIcon()}
          </button>
        </div>
      </div>
    </div>
  );
});

VimeoPlayer.displayName = 'VimeoPlayer';

export default VimeoPlayer;
