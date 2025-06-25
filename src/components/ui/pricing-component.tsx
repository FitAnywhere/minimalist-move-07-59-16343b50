import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
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
  return <div className="w-full max-w-sm mx-auto px-2 py-4 md:py-6">
            <div className="relative">
                {/* Desktop Navigation Arrows */}
                <button onClick={goToPrevious} disabled={currentIndex === 0} className={cn("hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20", "w-8 h-8 items-center justify-center rounded-full", "bg-yellow text-black border-2 border-black", "shadow-[2px_2px_0px_0px] shadow-black", "hover:shadow-[3px_3px_0px_0px] hover:translate-x-[-1px] hover:translate-y-[-1px]", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px] disabled:hover:translate-x-0 disabled:hover:translate-y-0")}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <button onClick={goToNext} disabled={currentIndex === tiers.length - 1} className={cn("hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20", "w-8 h-8 items-center justify-center rounded-full", "bg-yellow text-black border-2 border-black", "shadow-[2px_2px_0px_0px] shadow-black", "hover:shadow-[3px_3px_0px_0px] hover:translate-x-[-1px] hover:translate-y-[-1px]", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px] disabled:hover:translate-x-0 disabled:hover:translate-y-0")}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                {/* Mobile Navigation Arrows */}
                <button onClick={goToPrevious} disabled={currentIndex === 0} className={cn("md:hidden absolute -left-1 top-1/2 -translate-y-1/2 z-20", "w-7 h-7 flex items-center justify-center rounded-full", "bg-yellow text-black border-2 border-black", "shadow-[2px_2px_0px_0px] shadow-black", "active:shadow-[1px_1px_0px_0px] active:translate-x-[1px] active:translate-y-[1px]", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed")}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <button onClick={goToNext} disabled={currentIndex === tiers.length - 1} className={cn("md:hidden absolute -right-1 top-1/2 -translate-y-1/2 z-20", "w-7 h-7 flex items-center justify-center rounded-full", "bg-yellow text-black border-2 border-black", "shadow-[2px_2px_0px_0px] shadow-black", "active:shadow-[1px_1px_0px_0px] active:translate-x-[1px] active:translate-y-[1px]", "transition-all duration-200", "disabled:opacity-50 disabled:cursor-not-allowed")}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                {/* Carousel Container */}
                <div ref={carouselRef} className="overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                    <div className="flex transition-transform duration-300 ease-in-out" style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}>
                        {tiers.map((tier, index) => <div key={tier.name} className="w-full flex-shrink-0 px-2">
                                <div className={cn("relative flex flex-col p-4 rounded-lg border-2 border-black", "bg-white shadow-lg max-w-xs mx-auto", tier.popular && "border-yellow shadow-yellow/50", "transition-all duration-300 ease-in-out")}>
                                    {tier.popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow text-black font-bold px-2 rounded-full text-xs uppercase tracking-wide shadow-md border-2 border-black z-10 whitespace-nowrap py-0 my-[10px]">
                                            Most Popular
                                        </div>}

                                    <div className="mb-3 text-center pt-2">
                                        <h3 className="text-xl md:text-2xl font-bold text-black mb-1">
                                            {tier.name}
                                        </h3>
                                    </div>

                                    <div className="mb-3 text-center">
                                        <span className="text-2xl md:text-3xl font-extrabold text-black">
                                            {tier.price}
                                        </span>
                                    </div>

                                    <div className="flex-grow space-y-1 mb-4 min-h-[120px]">
                                        {tier.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center gap-2">
                                                <div className="flex items-center justify-center flex-shrink-0">
                                                    {feature.included ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-red-600" />}
                                                </div>
                                                <span className="text-black text-sm">
                                                    {feature.text}
                                                </span>
                                            </div>)}
                                    </div>

                                    <Button className={cn("w-full h-10 text-sm font-bold", "bg-yellow text-black", "hover:bg-yellow-dark", "active:bg-yellow", "border-2 border-black", "shadow-[3px_3px_0px_0px] shadow-black", "hover:shadow-[4px_4px_0px_0px]", "hover:translate-x-[-1px] hover:translate-y-[-1px]", "transition-all duration-200")}>
                                        {tier.ctaText}
                                    </Button>
                                </div>
                            </div>)}
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-3">
                    {tiers.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={cn("w-2 h-2 rounded-full mx-1 transition-all duration-200", index === currentIndex ? "bg-yellow border-2 border-black" : "bg-gray-300 border-2 border-gray-400")} />)}
                </div>
            </div>
        </div>;
}
const sampleFitAnywhereTiers: PricingTier[] = [{
  name: "Starter",
  subtitle: "",
  price: "€599 + VAT",
  ctaText: "GET STARTED",
  features: [{
    text: "Power Station",
    included: true
  }, {
    text: "Free Shipping",
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
  name: "Essential",
  subtitle: "",
  price: "€699 + VAT",
  ctaText: "LEVEL UP",
  features: [{
    text: "Power Station",
    included: true
  }, {
    text: "Free Shipping",
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
  name: "Complete",
  subtitle: "",
  price: "€799 + VAT",
  ctaText: "I WANT IT ALL",
  features: [{
    text: "Power Station",
    included: true
  }, {
    text: "Free Shipping",
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