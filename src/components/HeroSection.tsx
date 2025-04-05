
import { useRef, useState, useCallback, useEffect, memo } from 'react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import VimeoPlayer from './ui/VimeoPlayer';
import ScrollIndicator from './ui/ScrollIndicator';
import HeroContent from './ui/HeroContent';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Memoize the HeroSection component to prevent unnecessary rerenders
const HeroSection = memo(() => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [audioOn, setAudioOn] = useState(true);
  const [vimeoApiLoaded, setVimeoApiLoaded] = useState(false);
  const [videoLoadFailed, setVideoLoadFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Use a higher threshold to ensure better video control
  const isInView = useInView(heroRef, {
    threshold: 0.4
  });

  // Preload hero video as soon as page loads (not waiting for intersection)
  useEffect(() => {
    // Preload hero video
    const preloadHeroVideo = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'fetch';
      link.href = 'https://player.vimeo.com/video/1067255623?h=d77ee52644';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };
    
    preloadHeroVideo();
  }, []);

  // Use a more optimized approach for loading the Vimeo API
  useEffect(() => {
    // Check if the script is already in the DOM before adding it
    if (!window.Vimeo && !document.getElementById('vimeo-api')) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.id = 'vimeo-api';
      script.async = true;
      script.onload = () => {
        setVimeoApiLoaded(true);
        console.log("Vimeo API loaded successfully");
      };
      script.onerror = () => {
        console.error("Failed to load Vimeo API");
        // Retry loading the script if it fails (up to 3 times)
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            const failedScript = document.getElementById('vimeo-api');
            if (failedScript) failedScript.remove();
            
            const newScript = document.createElement('script');
            newScript.src = 'https://player.vimeo.com/api/player.js';
            newScript.id = 'vimeo-api';
            newScript.async = true;
            newScript.onload = () => setVimeoApiLoaded(true);
            document.head.appendChild(newScript);
          }, 1000 * (retryCount + 1)); // Exponential backoff
        } else {
          setVideoLoadFailed(true);
        }
      };
      document.head.appendChild(script);
    } else {
      setVimeoApiLoaded(true);
    }
    
    return () => {
      // Only remove if we added it
      const script = document.getElementById('vimeo-api');
      if (script && script.dataset.added === 'true') {
        script.remove();
      }
    };
  }, [retryCount]);

  // Memoize event handlers
  const scrollToOwnBoth = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const productSection = document.getElementById('product');
    if (productSection) {
      productSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, []);
  
  const toggleAudio = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setAudioOn(prev => !prev);
  }, []);
  
  const retryVideoLoad = useCallback(() => {
    setVideoLoadFailed(false);
    setVimeoApiLoaded(false);
    setRetryCount(0);
    
    // Force reload Vimeo API
    const script = document.getElementById('vimeo-api');
    if (script) script.remove();
    
    const newScript = document.createElement('script');
    newScript.src = 'https://player.vimeo.com/api/player.js';
    newScript.id = 'vimeo-api';
    newScript.async = true;
    newScript.onload = () => setVimeoApiLoaded(true);
    document.head.appendChild(newScript);
  }, []);

  return <section ref={heroRef} className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {isMobile ? <>
              <div className="text-center order-1 w-full space-y-6">
                {/* Mobile layout with specific order */}
                <HeroContent isInView={isInView} scrollToOwnBoth={scrollToOwnBoth} isMobile={true} />
                
                {/* Video placed between text and button */}
                <div className={`w-full transition-all duration-1000 delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    {videoLoadFailed ? (
                      <div className="bg-black w-full aspect-video flex flex-col items-center justify-center">
                        <p className="text-white mb-4">Video could not be loaded</p>
                        <button 
                          onClick={retryVideoLoad}
                          className="flex items-center gap-2 bg-yellow text-black px-3 py-2 rounded-full text-sm"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retry Video
                        </button>
                      </div>
                    ) : (
                      <VimeoPlayer 
                        videoId="1067255623" 
                        playerId="hero_video_mobile" 
                        isInView={isInView} 
                        audioOn={audioOn} 
                        toggleAudio={toggleAudio} 
                        priority={true}
                        onVideoLoadError={() => setVideoLoadFailed(true)}
                        enableRetries={true}
                      />
                    )}
                  </div>
                </div>
                
                {/* CTA Button placed after video */}
                <div className={cn("mt-4 transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <button onClick={scrollToOwnBoth} className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow">
                    STOP SUBSCRIBING
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  
                  <div className="mt-4 space-y-1">
                    <p className="text-gray-700 text-base font-semibold">On average, gym users lose:</p>
                    <p className="text-gray-700 my-[9px] text-base font-semibold">€12,052 in fees + 883 hours in traffic
                </p>
                    
                  </div>
                  
                  
                </div>
              </div>
            </> : <>
              <HeroContent isInView={isInView} scrollToOwnBoth={scrollToOwnBoth} />
              
              <div className={`order-1 md:order-2 transition-all duration-1000 delay-300 w-full ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <div className="relative rounded-xl overflow-hidden shadow-lg flex justify-center">
                  <div className="w-full max-w-[95%] mx-auto">
                    {videoLoadFailed ? (
                      <div className="bg-black w-full aspect-video flex flex-col items-center justify-center">
                        <p className="text-white mb-4">Video could not be loaded</p>
                        <button 
                          onClick={retryVideoLoad}
                          className="flex items-center gap-2 bg-yellow text-black px-3 py-2 rounded-full text-sm"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Retry Video
                        </button>
                      </div>
                    ) : (
                      <VimeoPlayer 
                        videoId="1067255623" 
                        playerId="hero_video_desktop" 
                        isInView={isInView} 
                        audioOn={audioOn} 
                        toggleAudio={toggleAudio} 
                        priority={true}
                        onVideoLoadError={() => setVideoLoadFailed(true)}
                        enableRetries={true}
                      />
                    )}
                    <p className="mt-3 text-sm text-gray-600 ml-1 text-center my-[6px] mx-[30px]">Launching Spring 2025. Reserve before we sell out.</p>
                  </div>
                </div>
              </div>
            </>}
        </div>
      </div>
      
      <ScrollIndicator />
    </section>;
});
HeroSection.displayName = 'HeroSection';
export default HeroSection;
