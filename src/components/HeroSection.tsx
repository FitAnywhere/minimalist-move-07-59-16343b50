
import { useRef, useState, useCallback, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import VimeoPlayer from './ui/VimeoPlayer';
import ScrollIndicator from './ui/ScrollIndicator';
import HeroContent from './ui/HeroContent';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [audioOn, setAudioOn] = useState(true);
  const [vimeoApiLoaded, setVimeoApiLoaded] = useState(false);
  
  // Use a higher threshold to ensure better video control
  const isInView = useInView(heroRef, { threshold: 0.4 });

  // Ensure Vimeo API is loaded immediately
  useEffect(() => {
    if (!window.Vimeo && !document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.onload = () => setVimeoApiLoaded(true);
      document.head.appendChild(script);
    } else {
      setVimeoApiLoaded(true);
    }
  }, []);

  const scrollToOwnBoth = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const productSection = document.getElementById('product');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const toggleAudio = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setAudioOn(prev => !prev);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {isMobile ? (
            <>
              <div className="text-center order-1 w-full space-y-6">
                <HeroContent isInView={isInView} scrollToOwnBoth={scrollToOwnBoth} />
                
                <div className={`w-full transition-all duration-1000 delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                  <div className="relative rounded-xl overflow-hidden shadow-lg mx-[-1rem]">
                    <VimeoPlayer
                      videoId="1067255623"
                      playerId="hero_video_mobile"
                      isInView={isInView}
                      audioOn={audioOn}
                      toggleAudio={toggleAudio}
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <HeroContent isInView={isInView} scrollToOwnBoth={scrollToOwnBoth} />
              
              <div className={`order-1 md:order-2 transition-all duration-1000 delay-300 w-full ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <div className="relative rounded-xl overflow-hidden shadow-lg flex justify-center">
                  <div className="w-full max-w-[95%] mx-auto">
                    <VimeoPlayer
                      videoId="1067255623"
                      playerId="hero_video_desktop"
                      isInView={isInView}
                      audioOn={audioOn}
                      toggleAudio={toggleAudio}
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
