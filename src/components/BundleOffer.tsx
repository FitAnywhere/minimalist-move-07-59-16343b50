import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Gift, ArrowLeft, ArrowRight, ShoppingBag, Percent, Euro } from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from 'embla-carousel-react';

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
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 }, true);
  
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
    <section id="bundle" ref={sectionRef} className="relative overflow-hidden py-16 mx-0 my-0 bg-white">
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
              <div className="embla overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex">
                  {products.map((product, index) => (
                    <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] px-4">
                      <Card className={cn(
                        "h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-yellow-400", 
                        "transform group"
                      )}>
                        <div className="aspect-square relative overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <p className="text-gray-600 mt-1">{product.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => emblaApi?.scrollPrev()} 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hidden md:flex items-center justify-center z-10"
                aria-label="Previous slide"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              
              <button 
                onClick={() => emblaApi?.scrollNext()} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hidden md:flex items-center justify-center z-10"
                aria-label="Next slide"
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-4 px-4">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-center gap-2 mt-3 md:hidden">
                <button 
                  onClick={() => emblaApi?.scrollPrev()} 
                  className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => emblaApi?.scrollNext()} 
                  className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                  aria-label="Next slide"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "mb-10 transition-all duration-1000 delay-300", 
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {giftItems.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 z-10">
                    <Gift className="h-3.5 w-3.5" />
                    GIFT
                  </div>
                  <Card className="overflow-hidden border-2 border-green-500 h-full transition-all duration-300 hover:shadow-lg">
                    <div className="aspect-square p-6">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="py-4 text-center bg-green-50">
                      <h3 className="font-bold">{item.name}</h3>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <div className={cn(
            "bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 transition-all duration-1000 delay-500", 
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-500 line-through text-xl">
                    {isInView ? (
                      <CountUp 
                        start={0} 
                        end={originalPrice} 
                        duration={2} 
                        separator="," 
                      />
                    ) : originalPrice}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Euro className="h-6 w-6 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">
                    {isInView ? (
                      <CountUp 
                        start={0} 
                        end={currentPrice} 
                        duration={2.5} 
                        separator="," 
                      />
                    ) : currentPrice}
                    <span className="text-base font-normal ml-1">+ VAT</span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-green-500 text-white py-2 px-4 rounded-full flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  <span className="font-bold">
                    {isInView ? (
                      <CountUp 
                        start={0} 
                        end={discountPercentage} 
                        duration={2.5} 
                        decimals={1} 
                        suffix="% OFF" 
                      />
                    ) : `${discountPercentage}% OFF`}
                  </span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className={cn(
                  "bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-semibold tracking-wide", 
                  "transition-all duration-300 hover:shadow-md hover:scale-105",
                  "flex items-center gap-2"
                )}
                onClick={handleCheckout}
              >
                <ShoppingBag className="h-5 w-5" />
                BUY NOW
              </Button>
            </div>
          </div>
          
          <div className={cn(
            "text-center py-10 max-w-3xl mx-auto transition-all duration-300", 
            isInView ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-4"
          )}>
            <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed px-4">
              Would you rather pay for the gym…or <span className="font-bold">OWN it forever?</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleOffer;
