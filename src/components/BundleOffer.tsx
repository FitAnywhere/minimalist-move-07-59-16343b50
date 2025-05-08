
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatPrice } from '@/utils/formatters';
import { ShoppingCart } from 'lucide-react';

// New carousel content - a video and an image
const carouselContent = [{
  type: 'video',
  src: '/Fitanyprodcut.mp4',
  label: 'PRIVATE STRENGTH STATION'
}, {
  type: 'image',
  src: 'https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746739187/PRIVATE_GYM_2_vknutu.png',
  label: 'PROGRESSIVE SUPPORT (15–120KG)'
}];
const BundleOffer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(1650);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
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

  // Handle intersection observer to manage video playback and price animation
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
        // Only trigger when 60% visible
        if (!animationStarted) {
          setAnimationStarted(true);
          setAnimationComplete(false); // Reset animation state
          setCurrentPrice(originalPrice); // Reset price

          // Try to play video if it's the current slide
          if (currentSlide === 0 && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(err => console.log("Video autoplay prevented:", err));
          }

          // Start the animation immediately when section is 60% in view
          const animationDuration = 3300; // 15-20% faster than before (was 3500ms, which was already 10-15% faster than original 4000ms)
          const steps = 660; // Increased steps to show more numbers in the countdown
          const stepDuration = animationDuration / steps;
          const priceDecrement = (originalPrice - finalPrice) / steps;
          let step = 0;
          const animationInterval = setInterval(() => {
            step++;
            setCurrentPrice(prev => {
              const newPrice = originalPrice - priceDecrement * step;
              // Ensure we don't go below the final price
              return newPrice > finalPrice ? Math.round(newPrice) : finalPrice;
            });

            // When we reach the final price, clear the interval and set animation complete
            if (step >= steps) {
              clearInterval(animationInterval);
              setAnimationComplete(true);
            }
          }, stepDuration);
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
  }, [animationStarted, currentSlide, originalPrice, finalPrice]);
  return <section id="bundle-offer" ref={sectionRef} className="relative overflow-hidden scroll-mt-[60px] md:scroll-mt-[80px] py-0 bg-white">
      <div className={cn("container mx-auto relative z-10", isMobile ? "px-0 py-[60px]" : "px-[150px] py-[60px]")}>
        <div className="max-w-5xl mx-auto px-4 md:px-[115px] md:py-[14px] space-y-6">
          <div className={cn("text-center transition-all duration-1000 transform", isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              YOUR GYM → YOUR RULES
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            {/* Price counter with background */}
            <div className="flex items-center gap-3 justify-center mt-4">
              <a href="https://buy.stripe.com/00gaF43p38yg0Vi7sM" onClick={handleCheckout} className={cn("px-4 py-1 rounded-full text-white transition-all duration-500 cursor-pointer", animationComplete ? "bg-[rgba(22,163,74,255)]" : "bg-red-500" // Changed to rgba green color
            )}>
                <span className={cn("text-2xl text-white transition-all duration-300",
              // Always show line-through until animation is complete
              animationComplete ? "" : "line-through")}>
                  €{currentPrice}
                </span>
              </a>
            </div>
          </div>

          <div className={cn(isMobile ? "flex flex-col items-center" : "flex flex-row-reverse items-center justify-between gap-0")}>
            {!isMobile && <div className="flex flex-col items-center space-y-2 ml-8">
                <div className="text-center mb-3">
                  <span className="font-bold text-xl text-gray-900">GET 3 in 1</span>
                </div>

                <Button size="lg" className={cn("bg-yellow hover:bg-yellow-dark text-black px-8 py-5 rounded-full text-xl font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105", "flex items-center gap-2")} onClick={handleCheckout}>
                  <ShoppingCart className="w-6 h-6" /> NOW €990
                </Button>
                
                <p className="text-xs text-gray-400/80 mt-1">
                  (Only 37 left in The Netherlands)
                </p>
              </div>}

            {/* Updated Video/Image Carousel - 20-25% bigger */}
            <div className="w-full max-w-[425px] relative" style={{
            height: isMobile ? "360px" : "400px"
          }}>
              {carouselContent.map((item, index) => (
                <div key={index} className={cn("absolute top-0 left-0 transition-opacity duration-1000 w-full h-full flex flex-col justify-center", index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0")}>
                  <div className="flex justify-center">
                    {item.type === 'video' ? (
                      <video 
                        ref={index === 0 ? videoRef : null} 
                        src={item.src} 
                        className="w-full h-full object-contain max-w-[300px] md:max-w-[425px] rounded-lg" 
                        muted 
                        playsInline 
                        loop 
                        preload="metadata" 
                      />
                    ) : (
                      <img 
                        src={item.src} 
                        alt="Product image" 
                        className="w-full h-full object-contain max-w-[300px] md:max-w-[425px] rounded-lg" 
                        loading="eager" 
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="font-semibold text-gray-800">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {isMobile && <div className="flex flex-col items-center space-y-4 mt-8 mx-[8px] px-0 py-[29px] my-[64px]">
                <div className="text-center mb-2">
                  <span className="font-bold text-lg text-gray-900">GET 3 in 1</span>
                </div>
                
                <div className="flex items-center gap-3 justify-center">
                  <span className="text-xl text-gray-700 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <div className="bg-green-600 px-3 py-1 rounded-full text-white font-bold text-sm">
                    40% OFF
                  </div>
                </div>

                <Button size="lg" className={cn("bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105", "flex items-center gap-2")} onClick={handleCheckout}>
                  <ShoppingCart className="w-5 h-5" /> NOW €990
                </Button>
                
                <p className="text-xs text-gray-400/80 mt-1">
                  (Only 37 left in The Netherlands)
                </p>
              </div>}
          </div>
          
          {!isMobile}
        </div>
      </div>
    </section>;
};
export default BundleOffer;
