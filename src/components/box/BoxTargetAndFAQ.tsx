
import React, { useState, useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { useVideoOptimization } from '@/hooks/useVideoOptimization';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [{
  question: "How do I claim my €100 bonus?",
  answer: "Just ordered BoxFun? Send us your purchase confirmation on Facebook or WhatsApp, and we'll send you a €100 discount for the portable gym."
}, {
  question: "How do I set it up?",
  answer: "Just adjust the cap size and put it on. That's it — you're ready to play, move, and punch."
}, {
  question: "Do I need boxing experience?",
  answer: "Not at all. BoxFun is made for complete beginners. No gloves, no gym — just fun movement that makes you feel alive."
}, {
  question: "What's included in the package?",
  answer: " • The custom-designed BoxFun cap\n • Premium elastic \n • High-quality rebound ball\n • Guaranteed smiles "
}, {
  question: "Is this an actual workout or just fun?",
  answer: "Both! You'll be sweating and smiling at the same time. It boosts coordination, sharpens reflexes, and burns calories — all without it feeling like exercise."
}, {
  question: "Is it safe to use indoors?",
  answer: "Yes — just make sure there's a little space around you. The elastic is designed for controlled rebound."
}, {
  question: "What ages is BoxFun for?",
  answer: "Teens, adults, even grandparents — as long as you're ready to move and have fun, it's for you. We've seen smiles from ages 12 to 70+."
}, {
  question: "Does it fit all head sizes?",
  answer: "Yes! The cap is adjustable and fits most head shapes comfortably."
}, {
  question: "How long until I get my order?",
  answer: "We ship every week. Most orders arrive within 3–7 business days (depending on your location)."
}, {
  question: "What if I don't like it?",
  answer: "Try it for 30 days. If it doesn't bring you joy or movement, send it back — no hard feelings."
}, {
  question: "Can it help with coordination or focus?",
  answer: "Absolutely. BoxFun sharpens hand-eye coordination and reaction time, making it great for mental focus and reflex development."
}];

const BoxTargetAndFAQ = () => {
  const perfectIfSectionRef = useRef<HTMLDivElement>(null);
  const specialOfferSectionRef = useRef<HTMLDivElement>(null);
  const isPerfectIfInView = useInView(perfectIfSectionRef);
  const isSpecialOfferInView = useInView(specialOfferSectionRef);
  const [videoContainerRef, isVisible, isLoaded] = useVideoOptimization({
    threshold: 0.1,
    rootMargin: '200px',
    lazyLoad: true,
    priorityLoad: false
  });
  const isMobile = useIsMobile();
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://fitanywhere.today/', '_blank');
  };

  const handleStripeCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/00gaF43p38yg0Vi7sM', '_blank');
  };

  return <>
    {/* 3. IT'S PERFECT IF... Section */}
    <section id="perfect-if" ref={perfectIfSectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center mb-12 transition-all duration-1000", isPerfectIfInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              IT'S PERFECT IF...
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isPerfectIfInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          {/* Mobile layout (bullet points + video stacked) */}
          <div className="md:hidden">
            <ul className="max-w-md mx-auto text-left space-y-5 mb-8">
              {["You hate boring workouts", "You struggle with motivation", "You want to feel good while moving"].map((point, index) => <li key={index} className="flex items-center space-x-4 text-gray-800 text-base font-medium">
                  <span className="text-yellow-400 text-2xl flex-shrink-0">•</span>
                  <span className="text-lg font-semibold">{point}</span>
                </li>)}
            </ul>
            
            <div className="max-w-md mx-auto">
              {/* Video container for mobile */}
              <div className="relative w-[80%] mx-auto overflow-hidden shadow-md rounded-md">
                <div className="aspect-[9/16] w-full">
                  <VideoPlayer 
                    src="/Boxfun Opt (720P) (Online-Video-Cutter.Com).mp4" 
                    poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744379740/Screenshot_52_vdjgxp.png" 
                    autoPlay={isVisible} 
                    muted={true} 
                    loop={true} 
                    controls={false} 
                    playMode="onView" 
                    aspectRatio="portrait" 
                    className="w-full h-full object-cover" 
                    width={360} 
                    height={640} 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop layout (two column) */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-8 md:items-start">
            <div className="text-left flex flex-col justify-center h-full">
              <ul className="space-y-6 px-[74px] py-0 my-[16px] mx-0">
                {["You hate boring workouts", "You struggle with motivation", "You want to feel good while moving"].map((point, index) => <li key={index} className="flex items-center space-x-4 text-gray-800 text-xl font-medium">
                    <span className="text-yellow-400 text-2xl flex-shrink-0">•</span>
                    <span className="text-xl font-semibold px-[5px] mx-0 my-[10px] py-[6px]">{point}</span>
                  </li>)}
              </ul>
            </div>
            
            <div className="w-full h-full flex items-center justify-center">
              {/* Fixed video container for desktop - fixing size to match original design */}
              <div className="relative w-[65%] overflow-hidden shadow-md rounded-sm">
                <div className="aspect-[9/16] w-full">
                  <VideoPlayer 
                    src="/Boxfun Opt (720P) (Online-Video-Cutter.Com).mp4" 
                    poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744379740/Screenshot_52_vdjgxp.png" 
                    autoPlay={isVisible} 
                    muted={true} 
                    loop={true} 
                    controls={false} 
                    playMode="onView" 
                    aspectRatio="portrait" 
                    className="w-full h-full object-cover" 
                    width={360} 
                    height={640} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 4. SPECIAL OFFER Section */}
    <section id="special-offer" ref={specialOfferSectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className={cn("text-center py-6 max-w-3xl mx-auto transition-all duration-300 mb-8", isSpecialOfferInView ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-4")}>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-4 relative inline-block">
              SPECIAL OFFER
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isSpecialOfferInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            <p className="text-gray-700 mb-6 max-w-xl mx-auto font-medium py-[16px] my-[12px] text-xl px-[59px]">GET 100€ GIFT FOR YOUR PRIVATE GYM</p>
            
            <div className={isMobile ? "max-w-md mx-auto mb-8" : "max-w-2xl mx-auto mb-8"}>
              <div className="p-6 flex flex-col items-center">
                <img 
                  src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745092806/Screenshot_16_qqtwbf.png" 
                  alt="BoxFun Offer" 
                  className="object-contain w-full rounded-2xl" 
                  loading="lazy" 
                  width="800" 
                  height="600" 
                  srcSet="
                    https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_400/v1745092806/Screenshot_16_qqtwbf.png 400w,
                    https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_800/v1745092806/Screenshot_16_qqtwbf.png 800w,
                    https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto,w_1200/v1745092806/Screenshot_16_qqtwbf.png 1200w
                  " 
                  sizes="(max-width: 768px) 400px, 800px" 
                />
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto font-medium">Big moves deserve big rewards.</p>
            
            <div className="flex justify-center">
              <button 
                className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 rounded-full text-lg font-bold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 py-[15px]"
                onClick={handleStripeCheckout}
              >
                🛒 SECURE YOURS
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>;
};

export default BoxTargetAndFAQ;
