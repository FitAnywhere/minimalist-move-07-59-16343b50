import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatPrice } from '@/utils/formatters';
import { Plus } from 'lucide-react';
interface GiftItem {
  name: string;
  image: string;
}
const DEFAULT_GIFT_IMAGE = "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744095736/dZZFMFQ_oped40.png";
const giftItems: GiftItem[] = [{
  name: "TRAINING LIBRARY",
  image: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744095736/dZZFMFQ_oped40.png"
}];
const BundleOffer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  const [animatedItem, setAnimatedItem] = useState(0);
  const productItems = ["1X PowerTower", "4X Bands"];
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/5kA28y7FjaGo0ViaES', '_blank');
  };
  const originalPrice = 1650;
  const currentPrice = 990;
  const discountPercentage = 40;
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedItem(prev => (prev + 1) % productItems.length);
    }, 2000); // Change animation every 2 seconds

    return () => clearInterval(interval);
  }, []);
  return <section id="bundle-offer" ref={sectionRef} className="bundle-target relative overflow-hidden py-16 bg-white scroll-mt-[60px] md:scroll-mt-[80px]">
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-5xl px-4 mx-auto md:px-[115px] md:mx-[174px] md:py-[14px]">
        <div className={cn("text-center transition-all duration-1000 transform mb-10", isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
            LAST GYM YOU WILL EVER NEED
            <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
          </h2>
          <p className="mt-4 text-gray-700 py-[13px] font-semibold text-lg">Everything you need for 27+ exercises with guide as a GIFT.</p>
        </div>
        
        {isMobile ? <div className="space-y-8">
            <div className={cn("mb-8 transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
              <div className="max-w-2xl mx-auto">
                <div className={cn("rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg", "h-full relative bg-white", "hover:translate-y-[-5px]", "shadow border border-gray-200")}>
                  <div className="relative z-10">
                    <div className="h-72 md:h-80 flex items-center justify-center p-4 group">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745000028/Izdelek_brez_naslova_-_2025-04-18T201339.666_c9ajaa.png" alt="FitAnywhere" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 relative z-10" loading="lazy" width="400" height="400" srcSet="
                            https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_300/v1745000028/Izdelek_brez_naslova_-_2025-04-18T201339.666_c9ajaa.png 300w,
                            https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_400/v1745000028/Izdelek_brez_naslova_-_2025-04-18T201339.666_c9ajaa.png 400w,
                            https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_600/v1745000028/Izdelek_brez_naslova_-_2025-04-18T201339.666_c9ajaa.png 600w
                          " sizes="(max-width: 768px) 300px, 400px" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full text-center bg-gradient-to-t from-white/90 to-white/20 py-3 px-2">
                      <div className="flex justify-center items-center gap-2">
                        {productItems.map((item, index) => <span key={item} className={cn("font-bold transition-all duration-500", animatedItem === index ? "text-black scale-120" : "text-gray-500 scale-90")}>
                            {item}
                          </span>)}
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
            
            <div className="h-[1px] md:hidden"></div>
              
            <div className={cn("flex items-center justify-center mb-4 transition-all duration-1000 delay-300", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
              <Plus className="h-8 w-8 text-green-600 -mr-2 flex-shrink-0" />
              <div className="max-w-2xl mx-auto">
                <div className="rounded-lg bg-white p-3 border border-green-600 flex flex-col items-center">
                  <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center w-full">
                      <div className="w-20 h-20 mb-1 flex-shrink-0 overflow-hidden">
                        <img src={giftItems[0]?.image || DEFAULT_GIFT_IMAGE} alt={giftItems[0]?.name || "Training Library"} className="w-full h-full object-contain transition-all duration-300 hover:scale-110" loading="lazy" width="80" height="80" srcSet={`
                              ${giftItems[0]?.image.replace('f_auto,q_auto', 'f_auto,q_auto,w_80') || DEFAULT_GIFT_IMAGE} 80w,
                              ${giftItems[0]?.image.replace('f_auto,q_auto', 'f_auto,q_auto,w_160') || DEFAULT_GIFT_IMAGE} 160w
                            `} sizes="80px" onError={e => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.onerror = null;
                        imgElement.src = DEFAULT_GIFT_IMAGE;
                      }} />
                      </div>
                      <h4 className="font-bold text-sm text-center">{giftItems[0]?.name || "TRAINING LIBRARY"}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              
            <div className={cn("mb-8 transition-all duration-1000 delay-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <div className="flex flex-col items-center justify-center my-0">
                <span className="text-xl text-gray-700 line-through mb-1">
                  {formatPrice(originalPrice)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {formatPrice(currentPrice)}
                  </span>
                  <div className="bg-green-600 px-3 py-1 rounded-full text-white font-bold">
                    {`${discountPercentage}% OFF`}
                  </div>
                </div>
              </div>
            </div>
          </div> : <div className="mb-10 transition-all duration-1000">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center">
                  <img src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745000028/Izdelek_brez_naslova_-_2025-04-18T201339.666_c9ajaa.png" alt="FitAnywhere" className="max-h-96 object-contain mb-6" loading="lazy" width="600" height="600" srcSet="
                      https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_400/v1745000028/Izdelek_brez_naslova_-_2025-04-18T201339.666_c9ajaa.png 400w,
                      https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_600/v1745000028/Izdelek_brez_naslova_-_2025-04-18T201339.666_c9ajaa.png 600w,
                      https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_800/v1745000028/Izdelek_brez_naslova_-_2025-04-18T201339.666_c9ajaa.png 800w
                    " sizes="(max-width: 768px) 400px, 600px" />
                  <div className="w-full text-center mb-4">
                    <div className="flex justify-center items-center gap-3">
                      {productItems.map((item, index) => <span key={item} className={cn("font-bold transition-all duration-500", animatedItem === index ? "text-black scale-120 text-xl" : "text-gray-500 scale-95")}>
                          {item}
                        </span>)}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center w-full mb-8">
                    <Plus className="h-12 w-12 text-green-600 mr-4" />
                    <div className="rounded-lg bg-white p-6 border border-green-600">
                      <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="w-40 h-40 mb-3 flex-shrink-0 overflow-hidden">
                            <img src={giftItems[0]?.image || DEFAULT_GIFT_IMAGE} alt={giftItems[0]?.name || "Training Library"} className="w-full h-full object-contain" loading="lazy" width="160" height="160" srcSet={`
                                ${giftItems[0]?.image.replace('f_auto,q_auto', 'f_auto,q_auto,w_160') || DEFAULT_GIFT_IMAGE} 160w,
                                ${giftItems[0]?.image.replace('f_auto,q_auto', 'f_auto,q_auto,w_320') || DEFAULT_GIFT_IMAGE} 320w
                              `} sizes="160px" onError={e => {
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.onerror = null;
                            imgElement.src = DEFAULT_GIFT_IMAGE;
                          }} />
                          </div>
                          <h4 className="font-bold text-lg text-center">{giftItems[0]?.name || "TRAINING LIBRARY"}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-8 mb-8">
              <div className="flex items-center gap-3 justify-center">
                <span className="text-xl text-gray-700 line-through">
                  {formatPrice(originalPrice)}
                </span>
                <div className="bg-green-600 px-3 py-1 rounded-full text-white text-xs font-bold">
                  {`${discountPercentage}% OFF`}
                </div>
              </div>
              
              <div className="text-3xl font-bold text-green-600 text-center mt-2">
                {formatPrice(currentPrice)}
              </div>
            </div>
          </div>}
        
        <div className={cn("text-center py-6 max-w-3xl mx-auto transition-all duration-300 mb-8", isVisible ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-4")}>
          <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed px-4 mb-6 mx-[16px] my-[34px]">
            Would you rather keep paying for the gym or...?
          </p>
          
          <div className="flex justify-center">
            <Button size="lg" className={cn("bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105", "flex items-center gap-2")} onClick={handleCheckout}>
              🛒 BUY FITANYWHERE
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>;
};
export default BundleOffer;