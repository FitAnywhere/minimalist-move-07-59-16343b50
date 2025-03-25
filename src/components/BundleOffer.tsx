
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Gift, ArrowLeft, ArrowRight, Percent, Euro, Sparkles } from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Product {
  name: string;
  image: string;
  description: string;
  badge?: string;
  gradient?: string;
}

interface GiftItem {
  name: string;
  image: string;
  price: string;
}

const products: Product[] = [
  {
    name: "PowerTower (PRO)",
    image: "https://i.imgur.com/5FJtwsb.png",
    description: "1299,99€",
    badge: "PREMIUM",
    gradient: "from-yellow-50/10 to-white/5"
  },
  {
    name: "TRAINING LIBRARY",
    image: "https://i.imgur.com/U7zShaF.png",
    description: "190,99€",
    gradient: "from-yellow-50/10 to-white/5"
  },
  {
    name: "TRX (PRO)",
    image: "https://i.imgur.com/ZgLzS1m.png",
    description: "129,99€",
    gradient: "from-yellow-50/10 to-white/5"
  },
  {
    name: "BANDS (8x)",
    image: "https://i.imgur.com/s7xD4II.png",
    description: "129,99€",
    gradient: "from-yellow-50/10 to-white/5"
  }
];

const giftItems: GiftItem[] = [
  {
    name: "BOXFUN",
    image: "https://i.imgur.com/q51dPwQ.png",
    price: "69,99€"
  },
  {
    name: "SHIPPING",
    image: "https://i.imgur.com/Qyrbb1H.png",
    price: "60€"
  }
];

const BundleOffer = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, startIndex: 0, align: 'start' });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(25);
  const sectionRef = useRef<HTMLElement>(null);
  
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/4gw7sS8Jn5m4dI43ck', '_blank');
  };
  
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
    };
    
    const onScroll = () => {
      const progress = emblaApi.scrollProgress();
      setScrollProgress(25 + (progress * 75));
    };
    
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    
    onScroll();
    onSelect();
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScroll);
    };
  }, [emblaApi]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const originalPrice = 1880.95;
  const currentPrice = 818;
  const discountPercentage = 56.5;
  
  return (
    <section id="bundle" ref={sectionRef} className="relative overflow-hidden py-16 bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "text-center transition-all duration-1000 transform mb-10", 
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              LAST GYM YOU WILL EVER NEED
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
                isVisible ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
          </div>
          
          <div className={cn(
            "mb-10 transition-all duration-1000", 
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {products.map((product, index) => (
                    <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_66.66%] lg:flex-[0_0_50%] px-2 sm:px-4">
                      <div className={cn(
                        "rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg",
                        "h-full bg-gradient-to-br relative",
                        "bg-gradient-to-br from-yellow-50/10 to-white/5",
                        "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIiB6PjxwYXRoIGQ9Ik0wIDBhNyA3IDAgMDEwIDE0QTcgNyAwIDAxMCAwWiIgZmlsbD0iI2YxZjFmMSIgZmlsbC1vcGFjaXR5PSIwLjIiPjwvcGF0aD48L3N2Zz4=')] before:opacity-10",
                        "after:absolute after:inset-0 after:bg-yellow-50/10 after:backdrop-blur-[1px]",
                        "hover:translate-y-[-5px] hover:shadow-xl",
                        "shadow-[0_15px_50px_rgba(255,215,0,0.4)]"
                      )}>
                        <div className="relative z-10">
                          <div className="h-72 md:h-80 flex items-center justify-center p-4 group">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative w-full h-full flex items-center justify-center">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 relative z-10 drop-shadow-md"
                              />
                            </div>
                          </div>
                          <div className="p-6 pt-0 text-center relative z-10">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <h3 className="font-bold text-xl md:text-2xl text-black">{product.name}</h3>
                              {product.badge && (
                                <Badge className="bg-yellow text-black text-xs font-bold py-1">
                                  {product.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 line-through">{product.description}</p>
                          </div>
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
            
            <div className="mt-4 max-w-xl mx-auto px-4">
              <Progress 
                value={scrollProgress} 
                className="h-1.5 bg-gray-200 rounded-full" 
              />
            </div>
          </div>
          
          <div className={cn(
            "mb-10 transition-all duration-1000 delay-300", 
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-black flex items-center justify-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                INCLUDED GIFTS
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {giftItems.map((item, index) => (
                <div key={index} className="rounded-lg bg-white p-4 border border-[#13613A]">
                  <div className="flex items-center">
                    <div className="w-20 h-20 flex-shrink-0 mr-4 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain transition-all duration-300 hover:scale-110"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-gray-600 line-through">{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={cn(
            "mb-8 transition-all duration-1000 delay-500", 
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            {isMobile ? (
              <div className="flex flex-col items-center justify-center">
                <span className="text-xl text-gray-700 line-through mb-1">
                  {isVisible ? (
                    <>
                      €<CountUp 
                        start={0} 
                        end={originalPrice} 
                        duration={2} 
                        separator="," 
                        decimals={2}
                        decimal="," 
                      />
                    </>
                  ) : `€${originalPrice}`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    €{isVisible ? (
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
                    {isVisible ? (
                      <CountUp 
                        start={0} 
                        end={discountPercentage} 
                        duration={2} 
                        decimals={1}
                        decimal="," 
                        suffix="% OFF" 
                      />
                    ) : `${discountPercentage.toString().replace('.', ',')}% OFF`}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl text-gray-700 line-through">
                    {isVisible ? (
                      <>
                        €<CountUp 
                          start={0} 
                          end={originalPrice} 
                          duration={2} 
                          separator="," 
                          decimals={2}
                          decimal="," 
                        />
                      </>
                    ) : `€${originalPrice}`}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-2xl md:text-3xl font-bold">
                    €{isVisible ? (
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
                  {isVisible ? (
                    <CountUp 
                      start={0} 
                      end={discountPercentage} 
                      duration={2} 
                      decimals={1}
                      decimal="," 
                      suffix="% OFF" 
                    />
                  ) : `${discountPercentage.toString().replace('.', ',')}% OFF`}
                </div>
              </div>
            )}
          </div>
          
          <div className={cn(
            "text-center py-6 max-w-3xl mx-auto transition-all duration-300 mb-8", 
            isVisible ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-4"
          )}>
            <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed px-4">
              Would you rather pay for the gym or... <span className="font-bold">OWN it forever?</span>
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <Button 
              size="lg" 
              className={cn(
                "bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-semibold tracking-wide", 
                "transition-all duration-300 hover:shadow-md hover:scale-105 button-glow",
                "flex items-center gap-2"
              )}
              onClick={handleCheckout}
            >
              <Sparkles className="h-5 w-5 animate-pulse" />
              OWN YOURS FOREVER
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleOffer;
