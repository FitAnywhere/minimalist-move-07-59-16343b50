
import React, { useRef, memo } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Loader, RefreshCw } from 'lucide-react';
import { useVideoPlayer } from '@/utils/videoLoader';

interface VideoPlayerProps {
  localVideoUrl: string;
  vimeoId: string | number;
  vimeoHash?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | number;
  timeoutMs?: number;
}

// Memoized component to prevent unnecessary re-renders
const VideoPlayer = memo(({
  localVideoUrl,
  vimeoId,
  vimeoHash,
  className,
  aspectRatio = "video",
  timeoutMs = 5000
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const vimeoContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    isLoading,
    isPlaying,
    isMuted,
    hasError,
    useVimeoFallback,
    showControls,
    togglePlayPause,
    toggleMute,
    handleMouseEnter,
    handleMouseLeave,
    handleRetry
  } = useVideoPlayer(videoRef, vimeoContainerRef, localVideoUrl, vimeoId, {
    timeoutMs,
    vimeoHash,
    vimeoOptions: {
      responsive: true,
      loop: false,
      background: false
    }
  });
  
  // Calculate aspect ratio padding
  const getAspectRatioPadding = () => {
    if (typeof aspectRatio === 'number') {
      return `${(1 / aspectRatio) * 100}%`;
    }
    
    switch (aspectRatio) {
      case 'square':
        return '100%';
      case 'video':
        return '56.25%'; // 16:9
      case 'portrait':
        return '177.78%'; // 9:16
      default:
        return '56.25%';
    }
  };
  
  return (
    <div 
      className={cn("relative w-full", className)}
      style={{ paddingBottom: getAspectRatioPadding() }}
    >
      <div 
        className="absolute inset-0 w-full h-full"
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
          src={localVideoUrl}
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
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
