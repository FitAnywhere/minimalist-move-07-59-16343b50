
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Volume, VolumeX } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isInView = useInView(heroRef, {}, false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const scrollToOwnBoth = (e: React.MouseEvent) => {
    e.preventDefault();
    const productSection = document.getElementById('product');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return <section ref={heroRef} className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {isMobile && <div className="text-center order-1 w-full space-y-6">
              <h1 ref={headlineRef} className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <span className="relative inline-block">
                  ALL YOU NEED
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                </span>
              </h1>
              
              <div className={cn("w-full transition-all duration-1000 delay-300", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <div className="relative w-full h-full">
                    <video ref={videoRef} src="/fitanywhere intro.mp4" className="w-full h-auto object-contain" loop playsInline muted autoPlay />
                    <button 
                      onClick={toggleSound}
                      className="absolute bottom-3 right-3 bg-black/40 hover:bg-black/60 rounded-full p-2 transition-all duration-300"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <p ref={subheadlineRef} className={cn("text-xl text-gray-800 transition-all duration-1000 delay-400", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                Portable gym that adapts to your lifestyle
              </p>
              
              <div ref={ctaRef} className={cn("transition-all duration-1000 delay-600", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <button 
                  onClick={scrollToOwnBoth}
                  className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-6 py-3 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow"
                >
                  EXPLORE
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="mt-4 text-sm text-gray-600">
                  Launching Spring 2025
                </p>
              </div>
            </div>}
          
          {!isMobile && <>
              <div className="text-center md:text-left order-2 md:order-1">
                <h1 ref={headlineRef} className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <span className="relative inline-block">
                    ALL YOU NEED
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                  </span>
                </h1>
                
                <p ref={subheadlineRef} className={cn("mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>Portable gym that adapts to your lifestyle</p>
                
                <div ref={ctaRef} className={cn("mt-10 transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <button 
                    onClick={scrollToOwnBoth}
                    className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow"
                  >
                    EXPLORE
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <p className="mt-4 text-sm text-gray-600">
                    Launching Spring 2025
                  </p>
                </div>
              </div>
              
              <div className={cn("order-1 md:order-2 transition-all duration-1000 delay-300 w-full", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="relative rounded-xl overflow-hidden shadow-lg flex justify-center">
                  <div className="w-full max-w-[95%] mx-auto">
                    <video ref={videoRef} src="/fitanywhere intro.mp4" className="w-full h-auto object-contain" loop playsInline muted autoPlay />
                    <button 
                      onClick={toggleSound}
                      className="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 rounded-full p-2 transition-all duration-300"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>}
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-black/30 flex items-start justify-center">
          <div className="w-1.5 h-3 bg-black/30 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>;
};

export default HeroSection;
