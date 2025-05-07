import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatPrice } from '@/utils/formatters';
import { ShoppingCart } from 'lucide-react';
const carouselImages = ["https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745834932/PRIVATE_GYM_1_vcyki4.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745828736/2284_training_obtekg.png", "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745828745/2284_supp_bh0dtd.png"];
const BundleOffer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/00gaF43p38yg0Vi7sM', '_blank');
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % carouselImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const originalPrice = 1650;
  return <section id="bundle-offer" ref={sectionRef} className="relative overflow-hidden scroll-mt-[60px] md:scroll-mt-[80px] py-0 bg-gray-50">
      <div className={cn("container mx-auto relative z-10", isMobile ? "px-0 py-[60px]" : "px-[150px] py-[60px]")}>
        <div className="max-w-5xl mx-auto px-4 md:px-[115px] md:py-[14px] space-y-6">
          <div className={cn("text-center transition-all duration-1000 transform", isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              GET YOURS
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            <p className="mt-2 text-gray-700 font-semibold text-xl py-[28px]">OWN THE STRENGTH AND FREEDOM YOU DESERVE

          </p>
          </div>

          <div className={cn(isMobile ? "flex flex-col items-center" : "flex flex-row-reverse items-center justify-between gap-0" // Changed gap from 3 to 0
        )}>
            {!isMobile && <div className="flex flex-col items-center space-y-2 ml-8"> {/* Added ml-8 to move closer to carousel */}
                {/* Added GET 3in1 text */}
                <div className="text-center mb-3">
                  <span className="font-bold text-xl text-gray-900">GET 3 in 1</span>
                </div>
                
                <div className="flex items-center gap-3 justify-center px-[97px] py-[4px]">
                  <span className="text-2xl text-gray-700 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <div className="bg-green-600 px-4 py-1 rounded-full text-white font-bold text-lg">
                    40% OFF
                  </div>
                </div>

                <Button size="lg" className={cn("bg-yellow hover:bg-yellow-dark text-black px-8 py-5 rounded-full text-xl font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105", "flex items-center gap-2")} onClick={handleCheckout}>
                  <ShoppingCart className="w-6 h-6" /> NOW €990
                </Button>
              </div>}

            <div className="w-full max-w-[350px] relative" style={{
            height: isMobile ? "300px" : "320px"
          }}>
              {carouselImages.map((src, index) => <div key={index} className={cn("absolute top-0 left-0 transition-opacity duration-1000 w-full flex justify-center", index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0")}>
                  <img src={src} alt={`Product image ${index + 1}`} className="w-full h-auto object-contain max-w-[250px] md:max-w-[340px] rounded-lg" loading="eager" />
                </div>)}
            </div>

            {isMobile && <div className="flex flex-col items-center space-y-4 mt-8 mx-[8px] px-0 py-[29px] my-[64px]">
                {/* Added GET 3in1 text for mobile */}
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
                
                
              </div>}
          </div>
          
          {/* Added centered tagline for desktop view with increased margin-top */}
          {!isMobile}
        </div>
      </div>
    </section>;
};
export default BundleOffer;