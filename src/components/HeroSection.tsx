
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
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

  // Auto-play video when it becomes visible
  return <section ref={heroRef} className="relative min-h-[700px] w-full overflow-hidden py-20 md:py-24 lg:py-28 bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      {/* Content Container */}
      <div className="container relative z-20 px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Mobile Layout (Stack: Headline > Video > Subheadline > CTA) */}
          {isMobile && <div className="text-center order-1 w-full space-y-6">
              {/* Headline with animated underline */}
              <h1 ref={headlineRef} className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <span className="relative inline-block">
                  ALL YOU NEED
                  <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                </span>
              </h1>
              
              {/* Video Container (Between headline and subheadline) */}
              <div className={cn("w-full transition-all duration-1000 delay-300", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  {/* Auto-playing Video */}
                  <div className="relative w-full h-full">
                    <video ref={videoRef} src="Anastazija-banner.mp4" className="w-full h-auto object-contain" loop playsInline muted autoPlay />
                  </div>
                </div>
              </div>
              
              {/* Subheadline */}
              <p ref={subheadlineRef} className={cn("text-xl text-gray-800 transition-all duration-1000 delay-400", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>Portable gym that adapts to your lifestyle</p>
              
              {/* CTA Button */}
              <div ref={ctaRef} className={cn("transition-all duration-1000 delay-600", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <a href="#order" className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-6 py-3 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow">
                  GET THE COMPLETE BUNDLE NOW
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <p className="mt-4 text-sm text-gray-600">
                  Launching Spring 2025
                </p>
              </div>
            </div>}
          
          {/* Desktop Layout (Left: Text, Right: Video) */}
          {!isMobile && <>
              {/* Left Column - Text */}
              <div className="text-center md:text-left order-2 md:order-1">
                {/* Headline with animated underline */}
                <h1 ref={headlineRef} className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-black transition-all duration-1000", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <span className="relative inline-block">
                    ALL YOU NEED
                    <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
                  </span>
                </h1>
                
                <p ref={subheadlineRef} className={cn("mt-6 text-xl md:text-2xl text-gray-800 transition-all duration-1000 delay-200", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>Portable gym that adapts to your lifestyle</p>
                
                <div ref={ctaRef} className={cn("mt-10 transition-all duration-1000 delay-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                  <a href="#order" className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow">
                    GET THE COMPLETE BUNDLE NOW
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <p className="mt-4 text-sm text-gray-600">
                    Launching Spring 2025
                  </p>
                </div>
              </div>
              
              {/* Right Column - Single Video */}
              <div className={cn("order-1 md:order-2 transition-all duration-1000 delay-300 w-full", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="relative rounded-xl overflow-hidden shadow-lg flex justify-center">
                  {/* Video Player */}
                  <div className="w-full max-w-[95%] mx-auto">
                    <video ref={videoRef} src="Anastazija-banner.mp4" className="w-full h-auto object-contain" loop playsInline muted autoPlay />
                  </div>
                </div>
              </div>
            </>}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-black/30 flex items-start justify-center">
          <div className="w-1.5 h-3 bg-black/30 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>;
};

export default HeroSection;
