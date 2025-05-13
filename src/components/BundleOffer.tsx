import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatPrice } from '@/utils/formatters';
import { ShoppingCart } from 'lucide-react';
import CheatSystemSection from './CheatSystemSection';

// New carousel content - a video and an image
const carouselContent = [{
  type: 'video',
  src: '/Fitanyprodcut.mp4',
  label: 'PRIVATE STRENGTH STATION'
}, {
  type: 'image',
  src: 'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746741696/PRIVATE_GYM_4_o02rth.png',
  label: 'PROGRESSIVE SUPPORT (15–120KG)'
}];
const BundleOffer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const finalPrice = 990;
  const originalPrice = 1650;
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/00gaF43p38yg0Vi7sM', '_blank');
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % carouselContent.length);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Video control based on carousel visibility and active slide
  useEffect(() => {
    // Get the current video element if the current slide is a video
    if (currentSlide === 0 && videoRef.current) {
      // Reset video to beginning and play when it's the active slide
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.log("Video autoplay prevented:", err));
    }
  }, [currentSlide]);

  // Handle intersection observer to manage video playback
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
        // Only trigger when 60% visible
        // Try to play video if it's the current slide
        if (currentSlide === 0 && videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(err => console.log("Video autoplay prevented:", err));
        }
      } else {
        // Pause video when section is not in view
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    }, {
      threshold: 0.6 // Trigger when 60% of the element is visible
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [currentSlide]);
  return <>
      <section id="bundle-offer" ref={sectionRef} className="relative overflow-hidden scroll-mt-[60px] md:scroll-mt-[80px] py-0 bg-white">
        <div className={cn("container mx-auto relative z-10", isMobile ? "px-0 py-[60px]" : "px-4 py-[60px]")}>
          <div className="max-w-5xl mx-auto px-4 md:px-4 md:py-[14px] space-y-6">
            <div className={cn("text-center transition-all duration-1000 transform", isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block py-0 my-[27px]">
                YOUR NEW GYM
                <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
              </h2>
            </div>

            <div className={cn(isMobile ? "flex flex-col items-center" : "flex flex-row-reverse items-center justify-center gap-8")}>
              {!isMobile && <div className="flex flex-col items-center space-y-2 mt-[-20px]">
                  {/* Desktop: Display text content - desktop remains unchanged but moved higher */}
                  <div className="text-center mb-6">
                    <span className="text-gray-900 px-0 mx-0 my-0 text-center text-2xl font-semibold">You are not lazy. You just never tried it ydidn'tet.</span>
                  </div>
                  
                  {/* Desktop: Price tags - displayed below text */}
                  <div className="flex items-center gap-2 justify-center mb-4 py-[3px]">
                    <span className="text-2xl text-gray-500 line-through">
                      €{originalPrice}
                    </span>
                    <a href="https://buy.stripe.com/00gaF43p38yg0Vi7sM" onClick={handleCheckout} className="px-4 py-1 rounded-full text-white bg-[rgba(22,163,74,255)]">
                      <span className="text-2xl text-white">
                        €{finalPrice}
                      </span>
                    </a>
                  </div>

                  <Button size="lg" className={cn("bg-yellow hover:bg-yellow-dark text-black px-8 py-5 rounded-full text-xl font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105", "flex items-center gap-2")} onClick={handleCheckout}>
                    <ShoppingCart className="w-6 h-6" /> CLAIM THIS DEAL
                  </Button>
                  
                  <p className="text-xs text-gray-400/80 mt-1">(40% OFF this month only in the Netherlands)</p>
                </div>}

              {/* Mobile: Move the "Beginners just like you..." text ABOVE the carousel */}
              {isMobile && <div className="w-full mb-3 text-center">
                  <div className="text-center mb-5">
                    
                  </div>
                </div>}

              {/* Fixed carousel container with consistent media dimensions */}
              <div className={cn("relative overflow-hidden", isMobile ? "w-full" : "w-full max-w-[500px] h-[530px]")}>
                {carouselContent.map((item, index) => <div key={index} className={cn("flex flex-col items-center", index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 absolute", isMobile ? "w-full" : "absolute top-0 left-0 w-full h-full")}>
                    <div className={cn("flex justify-center items-center", isMobile ? "w-full h-[300px]" : "h-[75%]" // Fixed height for mobile media to ensure consistency
                )}>
                      {item.type === 'video' ? <video ref={index === 0 ? videoRef : null} src={item.src} className={cn("object-contain rounded-lg", isMobile ? "w-auto h-full" : "w-full max-w-[115%] h-auto max-h-full" // Set consistent dimensions on mobile
                  )} muted playsInline loop preload="metadata" /> : <img src={item.src} alt="Product image" className={cn("object-contain rounded-lg", isMobile ? "w-auto h-full" : "w-full max-w-[115%] h-auto max-h-full",
                  // Set consistent dimensions on mobile
                  // Adding zoom animation for images
                  "transition-transform duration-3000 ease-in-out", index === currentSlide ? "scale-110" : "scale-100")} loading="eager" />}
                    </div>
                    
                    {/* Only show label below on desktop - desktop remains unchanged */}
                    {!isMobile && <div className="mt-4 text-center">
                        <p className="font-semibold text-gray-800">{item.label}</p>
                      </div>}
                  </div>)}
              </div>
              
              {/* Mobile: Add the carousel-linked text BELOW the carousel */}
              {isMobile && <div className="w-full mt-3 text-center py-[7px] my-[18px]">
                  <p className="font-semibold text-gray-800 mb-3">
                    {carouselContent[currentSlide].label}
                  </p>
                </div>}

              {/* Mobile: display content with adjusted spacing - price and button section */}
              {isMobile && <div className="flex flex-col items-center space-y-3">                
                  {/* Mobile: Price tags */}
                  <div className="flex items-center gap-2 justify-center mb-1">
                    <span className="text-2xl text-gray-500 line-through">
                      €{originalPrice}
                    </span>
                    <a href="https://buy.stripe.com/00gaF43p38yg0Vi7sM" onClick={handleCheckout} className="px-4 py-1 rounded-full text-white bg-[rgba(22,163,74,255)]">
                      <span className="text-2xl text-white">
                        €{finalPrice}
                      </span>
                    </a>
                  </div>
                  
                  <Button size="lg" className={cn("bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105", "flex items-center gap-2")} onClick={handleCheckout}>
                    <ShoppingCart className="w-5 h-5" /> CLAIM THIS DEAL
                  </Button>
                  
                  <p className="text-xs text-gray-400/80 mt-0">(40% OFF this month only in the Netherlands)</p>
                </div>}
            </div>
            
            {!isMobile}
          </div>
        </div>
      </section>
      
      {/* Add the new CheatSystemSection below the bundle offer */}
      <CheatSystemSection />
    </>;
};
export default BundleOffer;