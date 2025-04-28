
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatPrice } from '@/utils/formatters';
import { ShoppingCart } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const carouselImages = [
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745826261/284_PRIVATE_GYM_hcnapt.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745826265/284_SUPPORT_LEVELS_qeezxf.png",
  "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745826265/284_TRAINING_GUIDE_becvwh.png"
];

const BundleOffer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const originalPrice = 1650;
  const currentPrice = 990;
  const discountPercentage = 40;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/dR65kKbVz15O5bybIZ', '_blank');
  };

  return (
    <section 
      id="bundle-offer" 
      ref={sectionRef} 
      className="bundle-target relative overflow-hidden py-16 bg-black scroll-mt-[60px] md:scroll-mt-[80px]"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto md:px-[115px] md:py-[14px]">
          <div className={cn(
            "text-center transition-all duration-1000 transform mb-10",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white relative inline-block">
              GET YOURS
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000",
                isVisible ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
            <p className="mt-4 text-white py-[13px] font-semibold text-lg">3 in 1</p>
          </div>

          {/* Carousel Section */}
          <div className="max-w-[375px] mx-auto mb-8">
            <Carousel>
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={index} className={cn(
                    "transition-opacity duration-500",
                    currentSlide === index ? "opacity-100" : "opacity-0"
                  )}>
                    <img
                      src={image}
                      alt={`Product slide ${index + 1}`}
                      className="w-full h-auto aspect-[1080/1280] object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Price and CTA Section */}
          <div className={cn(
            "text-center transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              <div className="bg-green-600 px-3 py-1 rounded-full text-white text-xs font-bold">
                {`${discountPercentage}% OFF`}
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                className={cn(
                  "bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide",
                  "transition-all duration-300 hover:shadow-md hover:scale-105",
                  "flex items-center gap-2"
                )} 
                onClick={handleCheckout}
              >
                <ShoppingCart className="w-5 h-5" /> BUY {formatPrice(currentPrice)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleOffer;
