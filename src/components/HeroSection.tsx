
import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/utils/animations';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(heroRef, {}, false);
  
  // Parallax effect for background
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const heroElement = heroRef.current;
      const videoElement = heroElement.querySelector('.hero-bg') as HTMLElement;
      
      if (videoElement) {
        // Move the background slower than the scroll rate
        videoElement.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background Video/Image */}
      <div className="hero-bg absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        {/* Placeholder for video - in real implementation you'd use an actual video */}
        <img 
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" 
          alt="Minimalist fitness background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content Container */}
      <div className="container relative z-20 px-6 py-20 mx-auto text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 
            ref={headlineRef}
            className={cn(
              "transition-all duration-1000 font-bold",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            The Ultimate Minimalist Fitness Solution
          </h1>
          
          <p 
            ref={subheadlineRef}
            className={cn(
              "mt-6 text-xl md:text-2xl transition-all duration-1000 delay-200",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Train Smarter. Live Better. Elevate Your Lifestyle.
          </p>
          
          <div 
            ref={ctaRef}
            className={cn(
              "mt-12 transition-all duration-1000 delay-500",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <a 
              href="#order"
              className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow"
            >
              GET THE COMPLETE BUNDLE NOW
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <p className="mt-4 text-sm text-white/80">
              Launching Spring 2025
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center">
          <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
