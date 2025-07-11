import { Button } from "@/components/ui/button";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useRef } from "react";

interface PricingFeature {
  text: string;
  included: boolean;
}
interface PricingTier {
  name: string;
  subtitle: string;
  price: string;
  ctaText: string;
  features: PricingFeature[];
  popular?: boolean;
}

function FitAnywherePricing({
  tiers
}: {
  tiers: PricingTier[];
}) {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with Essential (index 1)
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && currentIndex < tiers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const goToNext = () => {
    if (currentIndex < tiers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCheckout = (tierName: string) => {
    let checkoutUrl = '';
    
    switch (tierName) {
      case 'BASIC':
        checkoutUrl = 'https://buy.stripe.com/eVq9ATcRZdPB5IfeEi6Na0q';
        break;
      case 'UPGRADE':
        checkoutUrl = 'https://buy.stripe.com/00w5kD3hp3aX4Eb0Ns6Na0o';
        break;
      case 'LOCKED IN':
        checkoutUrl = 'https://buy.stripe.com/7sY3cvg4beTFeeL0Ns6Na0p';
        break;
      default:
        console.error('Unknown tier:', tierName);
        return;
    }
    
    window.open(checkoutUrl, '_blank');
  };

  return <div className="w-full max-w-3xl mx-auto md:py-20 py-[67px] my-0 px-0">
            <div className="relative">
                {/* Desktop Navigation Arrows - positioned very close to carousel */}
                <button onClick={goToPrevious} disabled={currentIndex === 0} className={cn("hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20", "w-8 h-8 items-center justify-center rounded-full", "bg-yellow-400 text-black border-2 border-black", "shadow-[2px_2px_0px_0px] shadow-black", "hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px] disabled:hover:translate-x-0 disabled:hover:translate-y-0")}>
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <button onClick={goToNext} disabled={currentIndex === tiers.length - 1} className={cn("hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20", "w-8 h-8 items-center justify-center rounded-full", "bg-yellow-400 text-black border-2 border-black", "shadow-[2px_2px_0px_0px] shadow-black", "hover:shadow-[4px_4px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px]", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px] disabled:hover:translate-x-0 disabled:hover:translate-y-0")}>
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Mobile Navigation Arrows - unchanged */}
                <button onClick={goToPrevious} disabled={currentIndex === 0} className={cn("md:hidden absolute -left-4 top-1/2 -translate-y-1/2 z-20", "w-6 h-6 flex items-center justify-center rounded-full", "bg-yellow-400 text-black border-2 border-black", "shadow-[2px_2px_0px_0px] shadow-black", "active:shadow-[1px_1px_0px_0px] active:translate-x-[1px] active:translate-y-[1px]", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed")}>
                    <ChevronLeft className="w-3 h-3" />
                </button>

                <button onClick={goToNext} disabled={currentIndex === tiers.length - 1} className={cn("md:hidden absolute -right-4 top-1/2 -translate-y-1/2 z-20", "w-6 h-6 flex items-center justify-center rounded-full", "bg-yellow-400 text-black border-2 border-black", "shadow-[2px_2px_0px_0px] shadow-black", "active:shadow-[1px_1px_0px_0px] active:translate-x-[1px] active:translate-y-[1px]", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed")}>
                    <ChevronRight className="w-3 h-3" />
                </button>

                {/* Carousel Container */}
                <div ref={carouselRef} className="overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                    <div className="flex transition-transform duration-300 ease-in-out" style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}>
                        {tiers.map((tier, index) => <div key={tier.name} className="w-full flex-shrink-0 px-4">
                                <div className={cn("relative flex flex-col p-5 rounded-lg border-2", "bg-white shadow-lg max-w-xs mx-auto", "border-yellow-400 shadow-yellow-400/50", "transition-all duration-300 ease-in-out")}>
                                    {tier.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide shadow-md border-2 border-black z-10 whitespace-nowrap my-[12px]">
                                            Most Popular
                                        </div>}

                                    <div className="mb-6 text-center pt-4 py-0">
                                        <h3 className="text-2xl font-extrabold text-foreground mb-2 py-0 my-[11px]">
                                            {tier.name} ({tier.price})
                                        </h3>
                                    </div>

                                    <div className="flex-grow space-y-2 mb-4">
                                        {tier.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center gap-2">
                                                <div className="flex items-center justify-center flex-shrink-0">
                                                    {feature.included ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                                                </div>
                                                <span className="text-foreground text-base">
                                                    {feature.text}
                                                </span>
                                            </div>)}
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <Button 
                                            onClick={() => handleCheckout(tier.name)}
                                            className={cn("w-full h-12 text-lg font-bold mb-2", "bg-yellow-400 text-foreground", "hover:bg-yellow-500", "active:bg-yellow-400", "border-2 border-foreground", "shadow-[4px_4px_0px_0px] shadow-foreground", "hover:shadow-[6px_6px_0px_0px]", "hover:translate-x-[-2px] hover:translate-y-[-2px]", "transition-all duration-200")}
                                        >
                                            {tier.ctaText}
                                        </Button>
                                        <span className="text-gray-400 text-sm opacity-70">
                                            Free Shipping Included
                                        </span>
                                    </div>
                                </div>
                            </div>)}
                    </div>
                </div>

                {/* Mobile Dots Indicator */}
                <div className="flex justify-center mt-4 md:hidden">
                    {tiers.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={cn("w-3 h-3 rounded-full mx-1 transition-all duration-200", index === currentIndex ? "bg-yellow-400 border-2 border-black" : "bg-gray-300 border-2 border-gray-400")} />)}
                </div>

                {/* Desktop Dots Indicator */}
                <div className="hidden md:flex justify-center mt-4">
                    {tiers.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={cn("w-3 h-3 rounded-full mx-1 transition-all duration-200", index === currentIndex ? "bg-yellow-400 border-2 border-black" : "bg-gray-300 border-2 border-gray-400")} />)}
                </div>
            </div>
        </div>;
}

const sampleFitAnywhereTiers: PricingTier[] = [{
  name: "BASIC",
  subtitle: "",
  price: "€599 + VAT",
  ctaText: "BUY NOW",
  features: [{
    text: "Home Gym",
    included: true
  }, {
    text: "4 Elastic Bands (15–120kg)",
    included: false
  }, {
    text: "15-Min Workouts",
    included: false
  }, {
    text: "Personal Coach Access",
    included: false
  }]
}, {
  name: "UPGRADE",
  subtitle: "",
  price: "€699 + VAT",
  ctaText: "BUY NOW",
  features: [{
    text: "Home Gym",
    included: true
  }, {
    text: "4 Elastic Bands (15–120kg)",
    included: true
  }, {
    text: "15-Min Workouts",
    included: false
  }, {
    text: "Personal Coach Access",
    included: false
  }],
  popular: true
}, {
  name: "LOCKED IN",
  subtitle: "",
  price: "€799 + VAT",
  ctaText: "BUY NOW",
  features: [{
    text: "Home Gym",
    included: true
  }, {
    text: "4 Elastic Bands (15–120kg)",
    included: true
  }, {
    text: "15-Min Workouts",
    included: true
  }, {
    text: "Personal Coach Access",
    included: true
  }]
}];
function FitAnywherePricingDemo() {
  return <FitAnywherePricing tiers={sampleFitAnywhereTiers} />;
}
export default FitAnywherePricingDemo;
