
import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Gift, ArrowLeft, ArrowRight, Percent, Euro, Sparkles } from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Product {
  name: string;
  image: string;
  description: string;
}

interface GiftItem {
  name: string;
  image: string;
}

const products: Product[] = [
  {
    name: "PowerTower (PRO)",
    image: "https://i.imgur.com/etEReYn.png",
    description: "With adjustable height"
  },
  {
    name: "TRAINING LIBRARY",
    image: "https://i.imgur.com/Vb7DqjH.png",
    description: "Your personal trainer, on-demand"
  },
  {
    name: "TRX (PRO)",
    image: "https://i.imgur.com/jGB2ElP.png",
    description: "Expand your training possibilities"
  },
  {
    name: "BANDS (8x)",
    image: "https://i.imgur.com/V459Nuh.png",
    description: "Ideal for every beginner or expert"
  }
];

const giftItems: GiftItem[] = [
  {
    name: "BOXFUN",
    image: "https://i.imgur.com/sRAffrC.png"
  },
  {
    name: "SHIPPING",
    image: "https://i.imgur.com/zQU1L0L.png"
  }
];

const BundleOffer = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, startIndex: 0, align: 'start' });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Fix: Pass the correct arguments to useInView
  const isInView = useInView(sectionRef, { threshold: 0.2 });
  const isMobile = useIsMobile();
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/3cs00q7Fjg0I9rO6oq', '_blank');
  };
  
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
      setScrollProgress(emblaApi.scrollProgress() * 100);
    };
    
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', () => {
      setScrollProgress(emblaApi.scrollProgress() * 100);
    });
    
    onSelect();
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll');
    };
  }, [emblaApi]);
  
  const originalPrice = 1899;
  const currentPrice = 825;
  const discountPercentage = 56.5;
  
  return (
    <section id="bundle" ref={sectionRef} className="relative overflow-hidden py-16 bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "text-center transition-all duration-1000 transform mb-10", 
            isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              COMPLETE PORTABLE GYM
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
                isInView ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
          </div>
          
          <div className={cn(
            "mb-10 transition-all duration-1000", 
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {products.map((product, index) => (
                    <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_66.66%] lg:flex-[0_0_50%] px-2 sm:px-4">
                      <div className={cn(
                        "rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg bg-white",
                        "h-full"
                      )}>
                        <div className="h-72 md:h-80 flex items-center justify-center p-4">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                        <div className="p-6 pt-0">
                          <h3 className="font-bold text-xl md:text-2xl text-black mb-2">{product.name}</h3>
                          <p className="text-gray-600">{product.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => emblaApi?.scrollPrev()} 
                className="absolute -left-5 md:-left-10 top-1/2 transform -translate-y-1/2 bg-white text-black border border-gray-200 rounded-full p-3 shadow-md hidden md:flex items-center justify-center z-10 hover:bg-yellow-400 hover:text-black transition-all duration-300"
                aria-label="Previous slide"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              
              <button 
                onClick={() => emblaApi?.scrollNext()} 
                className="absolute -right-5 md:-right-10 top-1/2 transform -translate-y-1/2 bg-white text-black border border-gray-200 rounded-full p-3 shadow-md hidden md:flex items-center justify-center z-10 hover:bg-yellow-400 hover:text-black transition-all duration-300"
                aria-label="Next slide"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex justify-center gap-4 mt-4 md:hidden">
              <button 
                onClick={() => emblaApi?.scrollPrev()} 
                className="bg-white border border-gray-200 hover:bg-yellow-400 hover:text-black rounded-full p-3 shadow-sm transition-all duration-300"
                aria-label="Previous slide"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => emblaApi?.scrollNext()} 
                className="bg-white border border-gray-200 hover:bg-yellow-400 hover:text-black rounded-full p-3 shadow-sm transition-all duration-300"
                aria-label="Next slide"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-6 px-4">
              <div className="max-w-md mx-auto h-2 bg-white border border-black rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 will-change-transform"
                  style={{ width: `${scrollProgress}%`, transition: 'width 50ms ease-out' }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "mb-10 transition-all duration-1000 delay-300", 
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-black flex items-center justify-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                INCLUDED GIFTS
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {giftItems.map((item, index) => (
                <div key={index} className="border border-green-600 rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md shadow-[0_0_12px_rgba(22,163,74,0.5)]">
                  <div className="flex items-center">
                    <div className="w-20 h-20 flex-shrink-0 mr-4 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain transition-all duration-300 hover:scale-110"
                      />
                    </div>
                    <h4 className="font-bold text-lg">{item.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Updated pricing section for mobile layout */}
          <div className={cn(
            "mb-8 transition-all duration-1000 delay-500", 
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            {isMobile ? (
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center">
                  <div className="flex flex-col items-start">
                    <span className="text-xl text-gray-700 line-through mb-1">
                      €{isInView ? (
                        <CountUp 
                          start={0} 
                          end={originalPrice} 
                          duration={2} 
                          separator="," 
                        />
                      ) : originalPrice}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        €{isInView ? (
                          <CountUp 
                            start={0} 
                            end={currentPrice} 
                            duration={2} 
                            separator="," 
                          />
                        ) : currentPrice}
                        <span className="font-bold">+ VAT</span>
                      </span>
                      <div className="bg-green-600 px-3 py-1 rounded-full text-white font-bold">
                        {isInView ? (
                          <CountUp 
                            start={0} 
                            end={discountPercentage} 
                            duration={2} 
                            decimals={1} 
                            suffix="% OFF" 
                          />
                        ) : `${discountPercentage}% OFF`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl text-gray-700 line-through">
                    €{isInView ? (
                      <CountUp 
                        start={0} 
                        end={originalPrice} 
                        duration={2} 
                        separator="," 
                      />
                    ) : originalPrice}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-2xl md:text-3xl font-bold">
                    €{isInView ? (
                      <CountUp 
                        start={0} 
                        end={currentPrice} 
                        duration={2} 
                        separator="," 
                      />
                    ) : currentPrice}
                    <span className="font-bold ml-1">+ VAT</span>
                  </span>
                </div>
                
                <div className="bg-green-600 px-3 py-1 rounded-full text-white font-bold">
                  {isInView ? (
                    <CountUp 
                      start={0} 
                      end={discountPercentage} 
                      duration={2} 
                      decimals={1} 
                      suffix="% OFF" 
                    />
                  ) : `${discountPercentage}% OFF`}
                </div>
              </div>
            )}
          </div>
          
          <div className={cn(
            "text-center py-6 max-w-3xl mx-auto transition-all duration-300 mb-8", 
            isInView ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-4"
          )}>
            <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed px-4">
              Would you rather pay for the gym…or <span className="font-bold">OWN it forever?</span>
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <Button 
              size="lg" 
              className={cn(
                "bg-yellow-400 hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-semibold tracking-wide", 
                "transition-all duration-300 hover:shadow-md hover:scale-105 button-glow",
                "flex items-center gap-2"
              )}
              onClick={handleCheckout}
            >
              <Sparkles className="h-5 w-5 animate-pulse" />
              SEIZE YOURS NOW
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleOffer;
