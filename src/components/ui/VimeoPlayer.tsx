
import { useRef, useState, useEffect, memo, useCallback } from 'react';
import { Volume2, VolumeX, Volume1, Volume, Play, Loader } from 'lucide-react';
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
  forcedLoad?: boolean; // Added this prop to force loading regardless of view state
}

const VimeoPlayer = memo(({
  videoId,
  playerId,
  className = "",
  isInView,
  audioOn,
  toggleAudio,
  priority = false,
  forcedLoad = false
}: VimeoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoVisible, setVideoVisible] = useState(false);
  const [volume, setVolume] = useState(1); // 0 to 1
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const wasInViewRef = useRef(isInView);
  const messageHandlerRef = useRef<(event: MessageEvent) => void>();
  const audioOnRef = useRef(audioOn);
  const loadAttemptsRef = useRef(0);
  const maxLoadAttempts = 3;
  const [loadError, setLoadError] = useState(false);
  
  // Determine if we should show the video based on view state or forcedLoad prop
  const shouldLoad = forcedLoad || isInView;
  
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
  
  // Ensure Vimeo API is loaded before attempting to use it
  useEffect(() => {
    // If window.Vimeo exists, the API is already loaded
    if (!window.Vimeo && !window.vimeoApiLoading) {
      window.vimeoApiLoading = true;
      
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = false;
      script.onload = () => {
        window.vimeoApiLoaded = true;
        window.vimeoApiLoading = false;
        console.log('Vimeo API loaded from VimeoPlayer component');
      };
      
      // Add script to head if it doesn't already exist
      if (!document.getElementById('vimeo-api')) {
        script.id = 'vimeo-api';
        document.head.appendChild(script);
      }
    }
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
      autoplay: '1',
      muted: '1'
    });
    
    // Use stronger preloading for higher priority videos
    if (priority || forcedLoad) {
      params.append('preload', 'auto');
    }
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }, [videoId, playerId, priority, forcedLoad]);

  // Initialize player setup 
  useEffect(() => {
    // Only set up if we should load the video
    if (!shouldLoad) return;
    
    setLoadError(false);
    
    const setupPlayer = () => {
      setIsLoading(true);
      
      // Try to create a player once the iframe loads
      const initPlayer = () => {
        if (!iframeRef.current || !window.Vimeo?.Player) {
          // If max attempts reached, show error
          if (loadAttemptsRef.current >= maxLoadAttempts) {
            console.error('Failed to load Vimeo player after multiple attempts');
            setLoadError(true);
            setIsLoading(false);
            return;
          }
          
          // Retry after delay
          loadAttemptsRef.current += 1;
          setTimeout(initPlayer, 1000);
          return;
        }
        
        try {
          const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
          setPlayer(vimeoPlayer);
          
          vimeoPlayer.ready().then(() => {
            console.log(`Vimeo player ready for video ${videoId}`);
            setIsPlayerReady(true);
            setIsLoading(false);
            setVideoVisible(true);
            
            // Set audio state
            vimeoPlayer.setVolume(audioOnRef.current ? volume : 0);
            vimeoPlayer.setMuted(!audioOnRef.current);
            
            // Try to play
            vimeoPlayer.play().catch(err => {
              console.log('Auto-play prevented, waiting for user interaction', err);
            });
          }).catch(err => {
            console.error('Error during player ready:', err);
            setLoadError(true);
            setIsLoading(false);
          });
          
          // Set up event listeners
          vimeoPlayer.on('play', () => {
            setIsPlaying(true);
            setVideoVisible(true);
            setIsLoading(false);
          });
          
          vimeoPlayer.on('pause', () => {
            setIsPlaying(false);
          });
          
          vimeoPlayer.on('bufferstart', () => {
            setIsLoading(true);
          });
          
          vimeoPlayer.on('bufferend', () => {
            setIsLoading(false);
          });
          
          vimeoPlayer.on('ended', () => {
            setIsPlaying(false);
            vimeoPlayer.setCurrentTime(0.1).then(() => {
              vimeoPlayer.pause();
            });
          });
          
          vimeoPlayer.on('error', (err: any) => {
            console.error('Vimeo player error:', err);
            setLoadError(true);
            setIsLoading(false);
          });
          
        } catch (error) {
          console.error('Error initializing Vimeo player:', error);
          setLoadError(true);
          setIsLoading(false);
        }
      };
      
      // Start initialization when Vimeo API is loaded
      if (window.Vimeo?.Player) {
        initPlayer();
      } else {
        // Wait for API to load
        const checkVimeoInterval = setInterval(() => {
          if (window.Vimeo?.Player) {
            clearInterval(checkVimeoInterval);
            initPlayer();
          }
        }, 200);
        
        // Set a timeout to clear the interval if it takes too long
        setTimeout(() => {
          clearInterval(checkVimeoInterval);
          if (!window.Vimeo?.Player) {
            console.error('Vimeo API failed to load in time');
            setLoadError(true);
            setIsLoading(false);
          }
        }, 5000);
      }
    };
    
    setupPlayer();
    
    return () => {
      // Clean up player on unmount
      if (player) {
        player.unload().catch(() => {});
        player.destroy().catch(() => {});
      }
    };
  }, [shouldLoad, videoId, volume]);

  // Handle view state changes
  useEffect(() => {
    if (!player) return;
    
    const viewStateChanged = wasInViewRef.current !== isInView;
    wasInViewRef.current = isInView;
    
    if (viewStateChanged) {
      if (!isInView && isPlaying && !forcedLoad) {
        player.pause().catch(() => {});
      } else if ((isInView || forcedLoad) && isPlayerReady && !isPlaying) {
        player.setVolume(audioOnRef.current ? volume : 0).catch(() => {});
        player.setMuted(!audioOnRef.current).catch(() => {});
        player.play().catch(() => {});
      }
    }
  }, [isInView, player, isPlaying, isPlayerReady, volume, forcedLoad]);

  // Manual play button handler
  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!player) return;
    
    if (isPlaying) {
      player.pause().catch(() => {});
    } else {
      player.setVolume(audioOnRef.current ? volume : 0).catch(() => {});
      player.setMuted(!audioOnRef.current).catch(() => {});
      
      player.play().catch((error: any) => {
        console.error("Failed to play video:", error);
        setIsLoading(false);
      });
    }
  }, [player, isPlaying, volume]);

  // Update volume and mute state when audioOn changes
  useEffect(() => {
    if (!player) return;
    
    player.setVolume(audioOn ? volume : 0).catch(() => {});
    player.setMuted(!audioOn).catch(() => {});
  }, [player, audioOn, volume]);

  // Volume slider control
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (player && audioOn) {
      player.setVolume(newVolume).catch(() => {});
    }
  }, [player, audioOn]);

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

  // Volume icon selector
  const getVolumeIcon = useCallback(() => {
    if (!audioOn) return <VolumeX size={20} className="text-white" />;
    
    if (volume >= 0.7) return <Volume2 size={20} className="text-white" />;
    if (volume >= 0.3) return <Volume1 size={20} className="text-white" />;
    return <Volume size={20} className="text-white" />;
  }, [volume, audioOn]);

  // Fallback content for error state
  const renderFallbackContent = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="text-center p-4">
        <p className="text-white mb-2">Video unavailable</p>
        <button 
          onClick={() => {
            setLoadError(false);
            setIsLoading(true);
            loadAttemptsRef.current = 0;
            // Force reload iframe
            if (iframeRef.current) {
              const src = iframeRef.current.src;
              iframeRef.current.src = '';
              setTimeout(() => {
                if (iframeRef.current) iframeRef.current.src = src;
              }, 100);
            }
          }}
          className="px-4 py-2 bg-yellow text-black rounded hover:bg-yellow-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
        {isLoading && !loadError && (
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
        
        {loadError && renderFallbackContent()}
        
        {shouldLoad && (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ 
              opacity: videoVisible && !loadError ? 1 : 0,
              transition: 'opacity 0.3s ease-in',
              zIndex: 5
            }}
          >
            <iframe 
              ref={iframeRef}
              src={buildIframeSrc()}
              style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'}} 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
              title={`Vimeo video ${videoId}`}
              loading={priority || forcedLoad ? "eager" : "lazy"}
              fetchpriority={priority || forcedLoad ? "high" : "auto"}
              importance={priority || forcedLoad ? "high" : "auto"}
            ></iframe>
          </div>
        )}
        
        {isPlayerReady && !isPlaying && !isLoading && !loadError && (
          <button 
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-200 z-20"
            aria-label="Play video"
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-yellow/90 transition-colors duration-300 group">
              <Play size={28} className="text-black ml-1 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </button>
        )}
      </div>
      
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
