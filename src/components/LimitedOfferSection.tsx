
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const LimitedOfferSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  
  const handleGetBoxFunFree = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/dR600qaRv29ScE05kt', '_blank');
  };
  
  return <section id="limited-offer" ref={sectionRef} className="relative overflow-hidden py-16 bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className={cn("text-center py-6 max-w-3xl mx-auto transition-all duration-300 mb-8", isVisible ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-4")}>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 relative inline-block">
              SPECIAL OFFER
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isVisible ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            <p className="text-gray-700 mb-6 max-w-xl mx-auto font-medium py-[16px] my-[12px] text-xl">FREE BoxFun when you order portable gym!</p>
            
            <div className={isMobile ? "max-w-md mx-auto mb-8" : "max-w-2xl mx-auto mb-8"}>
              <div className="p-6 flex flex-col items-center">
                <img 
                  src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744398860/ChatGPT_Image_11._apr._2025_21_13_45_jkarvs.png" 
                  alt="BoxFun Offer" 
                  className="object-contain w-full" 
                />
                <h3 className="font-bold text-xl text-center mb-2">GIVEAWAY</h3>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto font-medium">The upgrade your lifestyle deserves.</p>
            
            <div className="flex justify-center">
              <Button size="lg" variant="yellow" className={cn("text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105")} onClick={handleGetBoxFunFree}>
                🛒 FitAnywhere + FREE BoxFun!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default LimitedOfferSection;
