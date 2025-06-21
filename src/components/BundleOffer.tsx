
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Check } from 'lucide-react';
import CheatSystemSection from './CheatSystemSection';

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
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/14AcN53hpdPBgmT0Ns6Na0l', '_blank');
  };

  // Auto-rotate carousel with different timing for video vs image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => {
        const nextSlide = (prevSlide + 1) % carouselContent.length;
        return nextSlide;
      });
    }, currentSlide === 0 ? 4000 : 2000); // Video shows for 4000ms, image shows for 2000ms (2x longer)

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Video control based on carousel visibility and active slide
  useEffect(() => {
    if (currentSlide === 0 && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.log("Video autoplay prevented:", err));
    }
  }, [currentSlide]);

  // Handle intersection observer to manage video playback
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
        if (currentSlide === 0 && videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(err => console.log("Video autoplay prevented:", err));
        }
      } else {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    }, {
      threshold: 0.6
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [currentSlide]);

  const valueBreakdownItems = [
    'Power Station',
    '4 Elastic Bands (15–120kg)',
    '15-Min Workouts',
    'Personal Coach Access',
    'Free Shipping'
  ];

  return (
    <section id="bundle-offer" ref={sectionRef} className="relative overflow-hidden scroll-mt-[60px] md:scroll-mt-[80px] py-0" style={{ backgroundColor: '#ffffff' }}>
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
            {!isMobile && <div className="flex flex-col items-center space-y-6 mt-[-20px]">
                {/* Desktop: UPDATED PRICE LINE with yellow text and black background */}
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 bg-black rounded-lg">
                    <p className="text-2xl font-bold text-yellow">
                      €830 + VAT
                    </p>
                  </div>
                </div>
                
                {/* Desktop: VALUE BREAKDOWN - moved more to the right */}
                <div className="w-full max-w-sm mb-4 ml-8">
                  <div className="space-y-2">
                    {valueBreakdownItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className={cn(
                    "bg-yellow hover:bg-yellow-dark text-black px-8 py-5 rounded-full text-xl font-bold tracking-wide w-full",
                    "transition-all duration-300 hover:shadow-md hover:scale-105"
                  )} 
                  onClick={handleCheckout}
                >
                  I WANT THIS GEAR
                </Button>

                {/* New text below CTA button with more spacing, bigger size, bold, italic, and animated arrow */}
                <div className="text-center mt-8">
                  <p className="text-gray-600 text-lg font-bold italic">
                    Still not sure? Don't take our word for it, take theirs.
                  </p>
                  {/* Animated yellow downward arrow */}
                  <div className="flex justify-center mt-4">
                    <div className="animate-bounce">
                      <svg 
                        className="w-6 h-6 text-yellow" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>}

            {/* Fixed carousel container with consistent media dimensions - lowered on desktop */}
            <div className={cn("relative overflow-hidden", isMobile ? "w-full" : "w-full max-w-[500px] h-[530px] mt-12")}>
              {carouselContent.map((item, index) => 
                <div key={index} className={cn(
                  "flex flex-col items-center",
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 absolute",
                  isMobile ? "w-full" : "absolute top-0 left-0 w-full h-full"
                )}>
                  <div className={cn(
                    "flex justify-center items-center",
                    isMobile ? "w-full h-[300px]" : "h-[75%]"
                  )}>
                    {item.type === 'video' ? 
                      <video 
                        ref={index === 0 ? videoRef : null} 
                        src={item.src} 
                        className={cn(
                          "object-contain rounded-lg",
                          isMobile ? "w-auto h-full" : "w-full max-w-[115%] h-auto max-h-full"
                        )} 
                        muted 
                        playsInline 
                        loop 
                        preload="metadata" 
                      /> : 
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
                    }
                  </div>
                </div>
              )}
              
              {/* Unified caption under entire carousel */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 opacity-70 text-sm">
                  Your home gym | Adjustable support
                </p>
              </div>
            </div>

            {/* Mobile: Content with adjusted spacing */}
            {isMobile && <div className="flex flex-col items-center space-y-6 w-full mt-6 pb-20">                
                {/* Mobile: UPDATED PRICE LINE with yellow text and black background */}
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-black rounded-lg">
                    <p className="text-xl font-bold text-yellow">
                      €830 + VAT
                    </p>
                  </div>
                </div>
                
                {/* Mobile: VALUE BREAKDOWN - moved more to the right */}
                <div className="w-full max-w-sm ml-6">
                  <div className="space-y-2">
                    {valueBreakdownItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </div>
      
      {/* Mobile: Sticky CTA Button */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200">
          <Button 
            size="lg" 
            className={cn(
              "bg-yellow hover:bg-yellow-dark text-black px-8 py-4 rounded-full text-lg font-bold tracking-wide w-full",
              "transition-all duration-300 hover:shadow-md"
            )} 
            onClick={handleCheckout}
          >
            I WANT THIS GEAR
          </Button>
          {/* New text below mobile CTA button with more spacing, bigger size, bold, italic, and animated arrow */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-base font-bold italic">
              Still not sure? Don't take our word for it, take theirs.
            </p>
            {/* Animated yellow downward arrow */}
            <div className="flex justify-center mt-3">
              <div className="animate-bounce">
                <svg 
                  className="w-5 h-5 text-yellow" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
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
