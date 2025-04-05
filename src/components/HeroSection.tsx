import { useRef, useState, useCallback, useEffect, memo } from 'react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import VimeoPlayer from './ui/VimeoPlayer';
import ScrollIndicator from './ui/ScrollIndicator';
import HeroContent from './ui/HeroContent';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Memoize the HeroSection component to prevent unnecessary rerenders
const HeroSection = memo(() => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [audioOn, setAudioOn] = useState(true);
  const [vimeoApiLoaded, setVimeoApiLoaded] = useState(false);

  // Force isInView to be true for hero section to ensure it always loads
  const isInView = true;

  // Ensure Vimeo API is loaded immediately
  useEffect(() => {
    // Check if global variable exists
    if (window.vimeoApiLoaded) {
      setVimeoApiLoaded(true);
      return;
    }
    
    // Backup loading mechanism in case the preloaded script fails
    const existingScript = document.getElementById('vimeo-api');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.id = 'vimeo-api';
      script.async = false; // Load synchronously for hero section
      script.onload = () => {
        console.log('Vimeo API loaded from component');
        window.vimeoApiLoaded = true;
        setVimeoApiLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setVimeoApiLoaded(true);
    }
  }, []);

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
  return <section ref={heroRef} className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {isMobile ? <>
              <div className="text-center order-1 w-full space-y-6">
                {/* Mobile layout with specific order */}
                <HeroContent isInView={isInView} scrollToOwnBoth={scrollToOwnBoth} isMobile={true} />
                
                {/* Video placed between text and button - Force opacity to 1 initially */}
                <div className="w-full opacity-100 translate-y-0">
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <VimeoPlayer 
                      videoId="1067255623" 
                      playerId="hero_video_mobile" 
                      isInView={isInView} 
                      audioOn={audioOn} 
                      toggleAudio={toggleAudio} 
                      priority={true} 
                      forcedLoad={true}
                    />
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
              
              <div className="order-1 md:order-2 opacity-100 translate-y-0 w-full">
                <div className="relative rounded-xl overflow-hidden shadow-lg flex justify-center">
                  <div className="w-full max-w-[95%] mx-auto">
                    <VimeoPlayer 
                      videoId="1067255623" 
                      playerId="hero_video_desktop" 
                      isInView={isInView} 
                      audioOn={audioOn} 
                      toggleAudio={toggleAudio} 
                      priority={true} 
                      forcedLoad={true}
                    />
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
