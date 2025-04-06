import { useRef, useState, useEffect, memo, useCallback } from 'react';
import { Volume2, VolumeX, Volume1, Volume, Play, Loader, RefreshCw } from 'lucide-react';
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
  const [loadError, setLoadError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);
  const volumeControlRef = useRef<HTMLDivElement>(null);
  const wasInViewRef = useRef(isInView);
  const messageHandlerRef = useRef<(event: MessageEvent) => void>();
  const audioOnRef = useRef(audioOn);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
      autoplay: '1',
      muted: '1'
    });
    
    if (priority) {
      params.append('preload', 'auto');
    }
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }, [videoId, playerId, priority]);

  const loadFallbackVideo = useCallback(() => {
    if (!fallbackVideoUrl) return;
    
    console.log(`Loading fallback video: ${fallbackVideoUrl}`);
    setIsLoading(true);
    setUsingFallback(true);
    
    if (player) {
      player.pause().catch(() => {});
      player.destroy();
      setPlayer(null);
    }
    
    if (fallbackVideoRef.current) {
      const video = fallbackVideoRef.current;
      
      video.muted = !audioOnRef.current;
      video.volume = audioOnRef.current ? volume : 0;
      
      const handleCanPlay = () => {
        setIsLoading(false);
        setVideoVisible(true);
        setIsPlayerReady(true);
        
        if (isInView) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn("Fallback video autoplay prevented:", error);
            });
          }
        }
      };
      
      const handleError = (e: Event) => {
        console.error("Fallback video error:", e);
        setLoadError(true);
        setIsLoading(false);
        if (onVideoLoadError) onVideoLoadError();
      };
      
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      video.load();
    }
  }, [fallbackVideoUrl, player, audioOnRef, volume, isInView, onVideoLoadError]);

  const retryVideoLoad = useCallback(() => {
    if (retryAttempts >= 3 && !enableRetries) {
      if (fallbackVideoUrl) {
        loadFallbackVideo();
        return;
      }
      return;
    }
    
    setIsLoading(true);
    setLoadError(false);
    setRetryAttempts(prev => prev + 1);
    
    if (player) {
      player.pause().catch(() => {});
      player.destroy();
      setPlayer(null);
    }
    
    if (iframeRef.current) {
      iframeRef.current.remove();
      
      const newIframe = document.createElement('iframe');
      newIframe.src = buildIframeSrc();
      newIframe.style.position = 'absolute';
      newIframe.style.top = '0';
      newIframe.style.left = '0';
      newIframe.style.width = '100%';
      newIframe.style.height = '100%';
      newIframe.style.border = 'none';
      newIframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media';
      newIframe.title = `Vimeo Player ${videoId}`;
      newIframe.loading = priority ? 'eager' : 'lazy';
      
      iframeRef.current = newIframe;
      
      setTimeout(() => {
        initializePlayer();
      }, 300);
    }
  }, [player, buildIframeSrc, priority, retryAttempts, enableRetries, videoId, fallbackVideoUrl, loadFallbackVideo]);

  const initializePlayer = useCallback(() => {
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
    
    if (fallbackVideoUrl && priority) {
      fallbackTimeoutRef.current = setTimeout(() => {
        if (isLoading && !isPlayerReady && !usingFallback) {
          console.log("Vimeo loading timeout, switching to fallback");
          loadFallbackVideo();
        }
      }, 800);
    }
    
    if (!window.Vimeo || !iframeRef.current) {
      if (retryAttempts < 3) {
        setTimeout(() => {
          initializePlayer();
        }, 1000);
      } else {
        if (fallbackVideoUrl) {
          loadFallbackVideo();
        } else {
          setLoadError(true);
          setIsLoading(false);
          if (onVideoLoadError) onVideoLoadError();
        }
      }
      return;
    }
    
    try {
      const vimeoPlayer = new window.Vimeo.Player(iframeRef.current);
      setPlayer(vimeoPlayer);
      
      vimeoPlayer.setVolume(audioOnRef.current ? volume : 0)
        .catch((err: any) => console.warn("Could not set volume:", err));
      
      vimeoPlayer.setMuted(!audioOnRef.current)
        .catch((err: any) => console.warn("Could not set muted:", err));
      
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
      
      vimeoPlayer.on('loaded', () => {
        setVideoVisible(true);
        setIsPlayerReady(true);
        setIsLoading(false);
        setLoadError(false);
        
        if (fallbackTimeoutRef.current) {
          clearTimeout(fallbackTimeoutRef.current);
          fallbackTimeoutRef.current = null;
        }
        
        vimeoPlayer.play().catch((error: any) => {
          console.log("Auto-play prevented, waiting for user interaction:", error);
        });
      });
      
      vimeoPlayer.on('error', (error: any) => {
        console.error("Vimeo player error:", error);
        
        if (fallbackVideoUrl) {
          loadFallbackVideo();
        } else if (retryAttempts < 3) {
          setTimeout(() => {
            retryVideoLoad();
          }, 1000 * (retryAttempts + 1));
        } else {
          setLoadError(true);
          setIsLoading(false);
          if (onVideoLoadError) onVideoLoadError();
        }
      });
      
      vimeoPlayer.on('ended', () => {
        setIsPlaying(false);
        vimeoPlayer.setCurrentTime(0.1).then(() => {
          vimeoPlayer.pause();
        }).catch(() => {});
      });
      
      vimeoPlayer.setCurrentTime(0.1).then(() => {
        setIsPlayerReady(true);
        setIsLoading(false);
        setVideoVisible(true);
      }).catch((error: any) => {
        console.error("Could not set current time:", error);
      });
    } catch (error) {
      console.error("Error initializing Vimeo player:", error);
      
      if (fallbackVideoUrl) {
        loadFallbackVideo();
      } else {
        setLoadError(true);
        setIsLoading(false);
        if (onVideoLoadError) onVideoLoadError();
      }
    }
  }, [volume, retryAttempts, onVideoLoadError, retryVideoLoad, fallbackVideoUrl, loadFallbackVideo, isLoading, isPlayerReady, usingFallback, priority]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;
      
      try {
        const data = typeof event.data === 'object' ? event.data : JSON.parse(event.data);
        
        if (data.event === "ready" && iframeRef.current) {
          initializePlayer();
        }
      } catch (e) {
        console.error("Error handling Vimeo message:", e);
      }
    };

    messageHandlerRef.current = handleMessage;
    window.addEventListener('message', handleMessage);
    
    return () => {
      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
      }
      
      if (fallbackTimeoutRef.current) {
        clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }
    };
  }, [initializePlayer]);

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
        
        const playPromise = fallbackVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch((error) => {
            console.error("Failed to play fallback video:", error);
            setIsLoading(false);
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
      
      player.play().catch((error: any) => {
        console.error("Failed to play video:", error);
        setIsLoading(false);
      });
    }
  }, [player, isPlaying, volume, usingFallback]);

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

  useEffect(() => {
    if (usingFallback && fallbackVideoRef.current) {
      const viewStateChanged = wasInViewRef.current !== isInView;
      wasInViewRef.current = isInView;
      
      if (viewStateChanged) {
        if (!isInView && isPlaying) {
          fallbackVideoRef.current.pause();
          setIsPlaying(false);
        } else if (isInView && isPlayerReady && !isPlaying) {
          const playPromise = fallbackVideoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
            }).catch(() => {});
          }
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
      } else if (isInView && isPlayerReady && !isPlaying) {
        player.play().catch(() => {});
      }
    }
  }, [isInView, player, isPlaying, isPlayerReady, usingFallback]);

  useEffect(() => {
    if (priority && !usingFallback && !player && !isPlayerReady) {
      initializePlayer();
    }
  }, [priority, usingFallback, player, isPlayerReady, initializePlayer]);

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

  const handleToggleAudio = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (toggleAudio) {
      toggleAudio(e);
    }
  }, [toggleAudio]);

  const handleVolumeIconHover = useCallback(() => {
    setShowVolumeSlider(true);
  }, []);

  const getVolumeIcon = useCallback(() => {
    if (!audioOn) return <VolumeX size={20} className="text-white" />;
    
    if (volume >= 0.7) return <Volume2 size={20} className="text-white" />;
    if (volume >= 0.3) return <Volume1 size={20} className="text-white" />;
    return <Volume size={20} className="text-white" />;
  }, [volume, audioOn]);

  useEffect(() => {
    if (priority && videoVisible && isPlayerReady && !isLoading) {
      const event = new Event('heroVideoReady');
      window.dispatchEvent(event);
      console.log("Hero video ready event dispatched");
    }
  }, [priority, videoVisible, isPlayerReady, isLoading]);

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
        
        {loadError && !usingFallback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 rounded-lg">
            <p className="text-white mb-4">Video could not be loaded</p>
            <button 
              onClick={retryVideoLoad}
              className="flex items-center gap-2 bg-yellow text-black px-3 py-2 rounded-full text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Video
            </button>
          </div>
        )}
        
        {fallbackVideoUrl && (
          <video 
            ref={fallbackVideoRef}
            src={fallbackVideoUrl}
            className={`absolute inset-0 w-full h-full object-cover ${usingFallback && videoVisible && !isLoading ? 'opacity-100' : 'opacity-0'}`}
            playsInline
            muted={!audioOn}
            loop
            style={{
              opacity: usingFallback && videoVisible && !isLoading ? 1 : 0,
              transition: 'opacity 0.3s ease-in',
              zIndex: usingFallback ? 5 : 0
            }}
          />
        )}
        
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: videoVisible && !loadError && !usingFallback ? 1 : 0,
            transition: 'opacity 0.3s ease-in',
            zIndex: !usingFallback ? 5 : 0
          }}
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
        
        {isPlayerReady && !isPlaying && !loadError && !isLoading && (
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
