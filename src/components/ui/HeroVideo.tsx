
import { memo, useState, useEffect, useRef } from 'react';

const HeroVideo = memo(() => {
  const [isInView, setIsInView] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer to detect when video is in viewport
  useEffect(() => {
    // Wait for LCP to complete before loading video (approximately 1-2s after component mount)
    const lcpTimer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 1500);

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // 10% visibility threshold
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      const isVisible = entry.isIntersecting;
      
      setIsInView(isVisible);
      
      // Control video playback based on visibility
      if (videoRef.current) {
        if (isVisible) {
          try {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error('Auto-play failed:', error);
              });
            }
          } catch (error) {
            console.error('Error during auto-play:', error);
          }
        } else {
          videoRef.current.pause();
        }
      }
    }, options);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      clearTimeout(lcpTimer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle loaded metadata event
  const handleLoadedMetadata = () => {
    if (videoRef.current && isInView) {
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Play after metadata loaded failed:', error);
          });
        }
      } catch (error) {
        console.error('Error playing after metadata loaded:', error);
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        preload="none"
        poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744102423/Screenshot_84_oi460p.png"
        autoPlay={isInView}
        muted
        loop
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
      >
        {shouldLoadVideo && (
          <>
            <source src="https://github.com/lovable-labs/fitanywhere-videos/raw/main/114-Intor-Video-Optt.webm" type="video/webm" />
            <source src="/114 Intor Video Optt.mp4" type="video/mp4" />
          </>
        )}
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

HeroVideo.displayName = 'HeroVideo';
export default HeroVideo;
