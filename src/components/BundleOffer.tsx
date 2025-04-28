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
    window.open('https://buy.stripe.com/dR65kKbVz15O5bybIZ', '_blank');
  };
  const originalPrice = 1650;
  const currentPrice = 990;
  const discountPercentage = 40;
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedItem(prev => (prev + 1) % productItems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return <section id="bundle-offer" ref={sectionRef} className="bundle-target relative overflow-hidden py-16 bg-white scroll-mt-[60px] md:scroll-mt-[80px]">
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-5xl px-4 mx-auto md:px-[115px] md:mx-[174px] md:py-[14px]">
        <div className={cn("text-center transition-all duration-1000 transform mb-10", isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
            PRIVATE GYM
            <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
          </h2>
          <p className="mt-4 text-gray-700 py-[13px] font-semibold text-lg">OWN THE STRENGHT AND FREEDOM YOU DESERVE</p>
        </div>
        
        {isMobile ? <div className="space-y-8">
            <div className={cn("mb-8 transition-all duration-1000", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
              <div className="max-w-2xl mx-auto">
                
              </div>
            </div>
            
            <div className="h-[1px] md:hidden"></div>
              
            
              
            <div className={cn("mb-8 transition-all duration-1000 delay-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
              <div className="flex flex-col items-center justify-center my-0">
                <span className="text-xl text-gray-700 line-through mb-1">
                  {formatPrice(originalPrice)}
                </span>
                <div className="flex items-center gap-2">
                  
                  <div className="bg-green-600 px-3 py-1 rounded-full text-white font-bold">
                    {`${discountPercentage}% OFF`}
                  </div>
                </div>
              </div>
            </div>
          </div> : <div className="mb-10 transition-all duration-1000">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              
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
              
              
            </div>
          </div>}
        
        <div className={cn("text-center py-6 max-w-3xl mx-auto transition-all duration-300 mb-8", isVisible ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-4")}>
          
          
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