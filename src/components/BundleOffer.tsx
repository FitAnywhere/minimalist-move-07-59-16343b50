
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Gift, ArrowDown, Plus } from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

const BundleOffer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/4gw7sS8Jn5m4dI43ck', '_blank');
  };
  
  const handleGetBoxFunFree = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/dR600qaRv29ScE05kt', '_blank');
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
          
          {isMobile ?
        // Mobile Layout
        <div className="space-y-8">
              {/* Product Card - Mobile - Removed yellow light shadow/background */}
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
                          <h3 className="font-bold text-xl md:text-2xl text-black">FitAnywhere</h3>
                          <Badge className="bg-yellow text-black text-xs font-bold py-1">
                            PREMIUM
                          </Badge>
                        </div>
                        <p className="text-gray-600">€1650</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gift Section - Updated with "GIFTS" title and combined box */}
              <div className={cn("mb-6 transition-all duration-1000 delay-300", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
                <div className="text-center mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-black flex items-center justify-center gap-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    GIFTS
                  </h3>
                </div>
                
                {/* Combined Gift Box */}
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
              
              {/* Price Section */}
              <div className={cn("mb-8 transition-all duration-1000 delay-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                <div className="flex flex-col items-center justify-center">
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
            </div> :
        // Desktop Layout - Redesigned as per the image
        <div className="mb-10 transition-all duration-1000">
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Left Side - Product Image */}
                  <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center">
                    <img src="https://i.imgur.com/coJB2up.png" alt="FitAnywhere" className="max-h-80 object-contain mb-4" />
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-2xl text-black">FitAnywhere</h3>
                      <Badge className="bg-yellow text-black text-xs font-bold py-1">
                        PREMIUM
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Right Side - Product Info with restructured layout */}
                  <div className="w-full md:w-1/2 p-6 flex flex-col">
                    {/* Gift Section moved up */}
                    <div className="mb-6">
                      <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-black flex items-center gap-2 mb-3">
                          <Gift className="h-5 w-5 text-green-600" />
                          GIFTS
                        </h3>
                        <ArrowDown className="h-6 w-6 text-gray-600 my-2 animate-bounce" />
                      </div>
                      
                      {/* Combined Gift Box */}
                      <div className="rounded-lg bg-white p-4 border border-[#13613A]">
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 mb-2 flex-shrink-0 overflow-hidden">
                              <img src={giftItems[0].image} alt={giftItems[0].name} className="w-full h-full object-contain" />
                            </div>
                            <h4 className="font-bold text-sm text-center">{giftItems[0].name}</h4>
                          </div>
                          
                          <div className="flex items-center justify-center">
                            <Plus className="h-5 w-5 text-gray-600" />
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 mb-2 flex-shrink-0 overflow-hidden">
                              <img src={giftItems[1].image} alt={giftItems[1].name} className="w-full h-full object-contain" />
                            </div>
                            <h4 className="font-bold text-sm text-center">{giftItems[1].name}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price section moved below gifts */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 justify-center">
                        <span className="text-xl text-gray-700 line-through">
                          €{originalPrice}
                        </span>
                        <div className="bg-red-600 px-3 py-1 rounded-full text-white text-xs font-bold">
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
            <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed px-4 mb-6">
              Would you rather keep paying for the gym or...?
            </p>
            
            {/* CTA Button - Centered on both mobile and desktop */}
            <div className="flex justify-center">
              <Button size="lg" className={cn("bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105 button-glow", "flex items-center gap-2")} onClick={handleCheckout}>
                OWN YOURS FOREVER
              </Button>
            </div>
            
            {/* LIMITED OFFER Section - Updated styling, content and design */}
            <div className="mt-12">
              <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 relative inline-block">
                LIMITED OFFER
                <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto">
                Order FitAnywhere now to secure one of 50 exclusive BoxFun packages.
              </p>
              
              {/* BoxFun Product Card with Shadow */}
              <div className="max-w-md mx-auto mb-8">
                <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-full md:w-80 h-auto mb-4">
                      <img 
                        src="https://i.imgur.com/r3NAyVd.png" 
                        alt="BoxFun Offer" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-xl text-center mb-2">BOXFUN 50x</h3>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  variant="yellow"
                  className={cn(
                    "text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", 
                    "transition-all duration-300 hover:shadow-md hover:scale-105 button-glow", 
                    "flex items-center gap-2"
                  )} 
                  onClick={handleGetBoxFunFree}
                >
                  <Gift className="h-5 w-5" />
                  GET YOURS FREE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default BundleOffer;
