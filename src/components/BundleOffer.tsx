
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Check } from 'lucide-react';
import CheatSystemSection from './CheatSystemSection';
import FitAnywherePricingDemo from './ui/pricing-component';

// New carousel content - a video and an image
const carouselContent = [{
  type: 'video',
  src: '/Fitanyprodcut.mp4',
  label: 'Power Station'
}, {
  type: 'image',
  src: 'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746741696/PRIVATE_GYM_4_o02rth.png',
  label: 'Progressive Support Bands'
}];

const BundleOffer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [sectionInView, setSectionInView] = useState(false);
  const [carouselVideoError, setCarouselVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/14AcN53hpdPBgmT0Ns6Na0l', '_blank');
  };

  // Play video when conditions are met
  const tryPlayVideo = async () => {
    if (!videoRef.current || !videoLoaded || currentSlide !== 0 || !sectionInView) {
      return;
    }

    try {
      // Reset video to start
      videoRef.current.currentTime = 0;
      await videoRef.current.play();
      console.log('Video playing successfully');
    } catch (error) {
      console.log('Video autoplay failed:', error);
    }
  };

  // Pause video
  const pauseVideo = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      console.log('Video paused');
    }
  };

  // Handle video loaded
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    setCarouselVideoError(false);
    setRetryCount(0);
    console.log('Video loaded and ready');
  };

  // Handle video error and retry
  const handleCarouselVideoError = () => {
    setCarouselVideoError(true);
    console.log('Carousel video error, will retry in 1 second');
    
    // Retry loading video every second
    setTimeout(() => {
      if (videoRef.current && retryCount < 10) { // Limit retries to prevent infinite loop
        setRetryCount(prev => prev + 1);
        videoRef.current.load(); // Reload video
        console.log(`Retrying video load, attempt ${retryCount + 1}`);
      }
    }, 1000);
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => {
        const nextSlide = (prevSlide + 1) % carouselContent.length;
        
        // If leaving video slide, pause it
        if (prevSlide === 0) {
          pauseVideo();
        }
        
        return nextSlide;
      });
    }, currentSlide === 0 ? 4000 : 2000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Try to play video when conditions change
  useEffect(() => {
    if (currentSlide === 0 && videoLoaded && sectionInView) {
      // Small delay to ensure slide transition is complete
      const timer = setTimeout(() => {
        tryPlayVideo();
      }, 300);
      
      return () => clearTimeout(timer);
    } else if (currentSlide !== 0) {
      pauseVideo();
    }
  }, [currentSlide, videoLoaded, sectionInView]);

  // Intersection observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        setSectionInView(isIntersecting);
        
        if (!isIntersecting) {
          pauseVideo();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const valueBreakdownItems = ['Power Station', '4 Elastic Bands (15–120kg)', '15-Min Workouts', 'Personal Coach Access', 'Free Shipping'];

  return (
    <section 
      id="bundle-offer" 
      ref={sectionRef} 
      className="relative overflow-hidden scroll-mt-[60px] md:scroll-mt-[80px] py-0" 
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className={cn("container mx-auto relative z-10", isMobile ? "px-0 py-[60px]" : "px-4 py-[60px]")}>
        <div className="max-w-5xl mx-auto px-4 md:px-4 md:py-[14px] space-y-6">
          <div className={cn("text-center transition-all duration-1000 transform", isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block py-0 my-[27px]">
              NO EXCUSES
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            {/* UPDATED SUBHEADLINE */}
            <p className="text-xl md:text-2xl font-bold text-gray-900 mt-4 mb-6">
              Get fit in 15-min a day without leaving your home
            </p>
          </div>

          <div className={cn(isMobile ? "flex flex-col items-center" : "flex flex-row-reverse items-center justify-center gap-8")}>
            {/* Desktop: Pricing Component in Right Column */}
            {!isMobile && (
              <div className="flex flex-col items-center space-y-6 mt-[-20px]">
                <FitAnywherePricingDemo />
              </div>
            )}

            {/* Enhanced carousel container */}
            <div className={cn("relative overflow-hidden", isMobile ? "w-full" : "w-full max-w-[500px] h-[530px] mt-12")}>
              {carouselContent.map((item, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex flex-col items-center transition-opacity duration-300",
                    index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 absolute",
                    isMobile ? "w-full" : "absolute top-0 left-0 w-full h-full"
                  )}
                >
                  <div className={cn("flex justify-center items-center", isMobile ? "w-full h-[300px]" : "h-[75%]")}>
                    {item.type === 'video' ? (
                      !carouselVideoError ? (
                        <video
                          ref={index === 0 ? videoRef : null}
                          src={item.src}
                          className={cn("object-contain rounded-lg", isMobile ? "w-auto h-full" : "w-full max-w-[115%] h-auto max-h-full")}
                          muted
                          playsInline
                          loop
                          preload="metadata"
                          onLoadedData={handleVideoLoaded}
                          onCanPlay={handleVideoLoaded}
                          onError={handleCarouselVideoError}
                        />
                      ) : (
                        <img
                          src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1751888689/Izdelek_brez_naslova_-_2025-07-07T134427.421_qelihy.png"
                          alt="Workout fallback"
                          className={cn("object-contain rounded-lg", isMobile ? "w-auto h-full" : "w-full max-w-[115%] h-auto max-h-full")}
                        />
                      )
                    ) : (
                      <img
                        src={item.src}
                        alt="Product image"
                        className={cn(
                          "object-contain rounded-lg",
                          isMobile ? "w-auto h-full" : "w-full max-w-[115%] h-auto max-h-full",
                          "transition-transform duration-3000 ease-in-out",
                          index === currentSlide ? "scale-110" : "scale-100"
                        )}
                        loading="eager"
                      />
                    )}
                  </div>
                </div>
              ))}
              
              {/* Unified caption under entire carousel */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 opacity-70 text-sm">
                  Your home gym | Adjustable support
                </p>
              </div>
            </div>

            {/* Mobile: Content with NEW PRICING COMPONENT */}
            {isMobile && (
              <div className="flex flex-col items-center w-full mt-6 pb-24">
                <FitAnywherePricingDemo />
              </div>
            )}
          </div>

          {/* Desktop only: Centered text and arrow under both columns */}
          {!isMobile && (
            <div className="text-center mt-12">
              <p className="text-gray-600 text-lg font-bold italic">
                Still not sure? Don't take our word for it, take theirs.
              </p>
              {/* Animated yellow downward arrow */}
              <div className="flex justify-center mt-4">
                <div className="animate-bounce">
                  <svg className="w-6 h-6 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile: Sticky CTA Button - moved lower to avoid overlap with pricing carousel */}
      {isMobile && (
        <div className="fixed bottom-8 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200">
          {/* Mobile text and arrow in sticky CTA section */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-base font-bold italic">
              Still not sure? Don't take our word for it, take theirs.
            </p>
            {/* Animated yellow downward arrow */}
            <div className="flex justify-center mt-3">
              <div className="animate-bounce">
                <svg className="w-5 h-5 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BundleOffer;
