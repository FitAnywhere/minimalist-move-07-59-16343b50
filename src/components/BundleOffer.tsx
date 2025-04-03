import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Gift, ArrowDown, Plus } from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
interface GiftItem {
  name: string;
  image: string;
}
const giftItems: GiftItem[] = [{
  name: "TRAINING LIBRARY",
  image: "https://i.imgur.com/dZZFMFQ.png"
}, {
  name: "SHIPPING",
  image: "https://i.imgur.com/Qyrbb1H.png"
}];
const boxfunImages = ["https://i.imgur.com/mTSCOf7.png", "https://i.imgur.com/4OsWHfq.png", "https://i.imgur.com/eWOENUF.png", "https://i.imgur.com/OrVS6HH.png"];
const BundleOffer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/00g8wWgbP7uc5by7sC', '_blank');
  };
  const handleGetBoxFunFree = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/00g8wWgbP7uc5by7sC', '_blank');
  };
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const originalPrice = 1650;
  const currentPrice = 990;
  const discountPercentage = 40;
  return <section id="bundle" ref={sectionRef} className="relative overflow-hidden py-16 bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-1000 transform mb-10", isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              LAST GYM YOU WILL EVER NEED
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          {isMobile ? <div className="space-y-8">
              <div className={cn("mb-8 transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
                <div className="max-w-2xl mx-auto">
                  <div className={cn("rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg", "h-full relative bg-white", "hover:translate-y-[-5px]", "shadow border border-gray-200")}>
                    <div className="relative z-10">
                      <div className="h-72 md:h-80 flex items-center justify-center p-4 group">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img src="https://i.imgur.com/coJB2up.png" alt="FitAnywhere" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 relative z-10" />
                        </div>
                      </div>
                      <div className="p-6 pt-0 text-center relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          
                          
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={cn("mb-6 transition-all duration-1000 delay-300", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-black flex items-center justify-center gap-2 my-[31px]">
                    <Gift className="h-5 w-5 text-green-600" />
                    GIFTS
                  </h3>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <div className="rounded-lg bg-white p-6 border border-[#13613A] flex flex-col items-center">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-2 flex-shrink-0 overflow-hidden">
                          <img src={giftItems[0].image} alt={giftItems[0].name} className="w-full h-full object-contain transition-all duration-300 hover:scale-110" />
                        </div>
                        <h4 className="font-bold text-sm text-center">{giftItems[0].name}</h4>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <Plus className="h-5 w-5 text-gray-600" />
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-2 flex-shrink-0 overflow-hidden">
                          <img src={giftItems[1].image} alt={giftItems[1].name} className="w-full h-full object-contain transition-all duration-300 hover:scale-110" />
                        </div>
                        <h4 className="font-bold text-sm text-center">{giftItems[1].name}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={cn("mb-8 transition-all duration-1000 delay-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="flex flex-col items-center justify-center my-0">
                  <span className="text-xl text-gray-700 line-through mb-1">
                    {isVisible ? <>
                        €<CountUp start={0} end={originalPrice} duration={2} separator="," />
                      </> : `€${originalPrice}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      €{isVisible ? <CountUp start={0} end={currentPrice} duration={2} separator="," /> : currentPrice}
                    </span>
                    <div className="bg-green-600 px-3 py-1 rounded-full text-white font-bold">
                      {isVisible ? <CountUp start={0} end={discountPercentage} duration={2} suffix="% OFF" /> : `${discountPercentage}% OFF`}
                    </div>
                  </div>
                </div>
              </div>
            </div> : <div className="mb-10 transition-all duration-1000">
              <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center">
                    <img src="https://i.imgur.com/coJB2up.png" alt="FitAnywhere" className="max-h-96 object-contain mb-6" />
                    <div className="flex items-center gap-2">
                      
                      
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="mb-8">
                      <div className="flex flex-col items-center">
                        <h3 className="text-2xl font-bold text-black flex items-center gap-2 mb-4">
                          <Gift className="h-6 w-6 text-green-600" />
                          GIFTS
                        </h3>
                        <ArrowDown className="h-6 w-6 text-gray-600 my-2 animate-bounce" />
                      </div>
                      
                      <div className="rounded-lg bg-white p-6 border border-[#13613A]">
                        <div className="flex items-center justify-center gap-6">
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-24 mb-3 flex-shrink-0 overflow-hidden">
                              <img src={giftItems[0].image} alt={giftItems[0].name} className="w-full h-full object-contain" />
                            </div>
                            <h4 className="font-bold text-sm text-center">{giftItems[0].name}</h4>
                          </div>
                          
                          <div className="flex items-center justify-center">
                            <Plus className="h-6 w-6 text-gray-600" />
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-24 mb-3 flex-shrink-0 overflow-hidden">
                              <img src={giftItems[1].image} alt={giftItems[1].name} className="w-full h-full object-contain" />
                            </div>
                            <h4 className="font-bold text-sm text-center">{giftItems[1].name}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center gap-3 justify-center">
                        <span className="text-xl text-gray-700 line-through">
                          €{originalPrice}
                        </span>
                        <div className="bg-green-600 px-3 py-1 rounded-full text-white text-xs font-bold">
                          {discountPercentage}% OFF
                        </div>
                      </div>
                      
                      <div className="text-3xl font-bold text-green-600 text-center mt-2">
                        €{currentPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          
          <div className={cn("text-center py-6 max-w-3xl mx-auto transition-all duration-300 mb-8", isVisible ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-4")}>
            <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed px-4 mb-6 mx-[16px] my-[34px]">
              Would you rather keep paying for the gym or...?
            </p>
            
            <div className="flex justify-center">
              <Button size="lg" className={cn("bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105 button-glow", "flex items-center gap-2")} onClick={handleCheckout}>
                OWN FITANYWHERE NOW
              </Button>
            </div>
            
            <div className="mt-24">
              <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 relative inline-block">
                LIMITED OFFER
                <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto font-medium">Enjoy a free BoxFun when you order FitAnywhere today!</p>
              
              <div className="max-w-md mx-auto mb-8">
                <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center">
                    <Carousel className="w-full max-w-xs mb-4">
                      <CarouselContent>
                        {boxfunImages.map((image, index) => <CarouselItem key={index}>
                            <div className="flex items-center justify-center p-2">
                              <img src={image} alt={`BoxFun Offer ${index + 1}`} className={isMobile ? "h-52 object-contain" : "h-64 object-contain"} />
                            </div>
                          </CarouselItem>)}
                      </CarouselContent>
                      <CarouselPrevious className="left-1" />
                      <CarouselNext className="right-1" />
                    </Carousel>
                    <h3 className="font-bold text-xl text-center mb-2">BOXFUN - 50X GIVEAWAY</h3>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto font-medium">When your energy glows, everyone will feel it.</p>
              
              <div className="flex justify-center">
                <Button size="lg" variant="yellow" className={cn("text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105 button-glow", "flex items-center gap-2")} onClick={handleGetBoxFunFree}>
                  <Gift className="h-5 w-5" />
                  SECURE YOURS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default BundleOffer;