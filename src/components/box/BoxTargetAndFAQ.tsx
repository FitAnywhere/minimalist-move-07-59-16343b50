
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
interface TargetAudience {
  imageUrl: string;
  title: string;
  description: string;
}
const targetAudiences: TargetAudience[] = [{
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745074773/dee_sszbgx.png",
  title: "TOTAL BEGINNERS",
  description: "Elastics make it possible for everyone."
}, {
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745078482/nik_v2extf.jpg",
  title: "PRIVACY LOVERS",
  description: "For those uncomfortable exercising in public."
}, {
  imageUrl: "https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1745074862/spa_qpav0e.png",
  title: "SPACE-SAVING FANS",
  description: "For anyone looking to maximize workouts in small spaces."
}];
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
  const targetSectionRef = useRef<HTMLElement>(null);
  const perfectIfSectionRef = useRef<HTMLDivElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const isTargetInView = useInView(targetSectionRef);
  const isPerfectIfInView = useInView(perfectIfSectionRef);
  const isFaqInView = useInView(faqSectionRef);
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
  return <>
    {/* Target Audience Section */}
    <section id="target" ref={targetSectionRef} className="py-24 bg-inherit">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center mb-20 transition-all duration-1000", isTargetInView ? "opacity-100" : "opacity-0 translate-y-12")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 relative inline-block">
              WHAT IS A PRIVATE GYM?
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isTargetInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            {/* Video Player */}
            <div ref={videoContainerRef} className="max-w-4xl mx-auto mb-8">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-xl">
                <VideoPlayer src="/452025 Akcija.mp4" poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746366944/poster_dgzet0.jpg" autoPlay={isVisible} muted={true} loop={true} playMode="onView" aspectRatio="video" className="w-full" />
              </div>
            </div>
            
            {/* Added text below video */}
            <p className="text-lg md:text-xl font-medium text-gray-800 mt-6 mb-8">
              Where beginners do what once felt impossible
            </p>

            <div className="flex justify-center mt-8">
              <a href="#" onClick={handleCTAClick} className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 py-[15px]">
                DISCOVER MORE
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Perfect If Section - Created as a separate section from the testimonials */}
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
              {/* Fixed video container - remove extra space */}
              <div className="relative w-3/5 mx-auto overflow-hidden shadow-md rounded-md">
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
                    className="w-full h-full" 
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
              <h3 className="text-3xl font-bold text-black mb-8 self-center">
                IT'S PERFECT IF...
              </h3>
              
              <ul className="space-y-6 px-[86px]">
                {["You hate boring workouts", "You struggle with motivation", "You want to feel good while moving"].map((point, index) => <li key={index} className="flex items-center space-x-4 text-gray-800 text-xl font-medium">
                    <span className="text-yellow-400 text-2xl flex-shrink-0">•</span>
                    <span>{point}</span>
                  </li>)}
              </ul>
            </div>
            
            <div className="w-full h-full flex items-center justify-center">
              {/* Fixed video container - remove extra space */}
              <div className="relative w-3/5 overflow-hidden shadow-md rounded-sm">
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
                    className="w-full h-full" 
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
    
    {/* FAQ Section */}
    <section id="faq" ref={faqSectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center relative inline-block mb-12">
              FREQUENTLY ASKED QUESTIONS
              <span className={cn("absolute bottom-0 left-0 right-0 mx-auto h-1 bg-yellow-400 transform transition-transform duration-1000", isFaqInView ? "scale-x-100" : "scale-x-0")} style={{
                width: '100%'
              }}></span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => <AccordionItem key={index} value={`item-${index}`} className={cn("mb-4 transition-all duration-300 rounded-lg overflow-hidden", isFaqInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")} style={{
                transitionDelay: `${index * 100}ms`
              }}>
                  <div className="border border-transparent hover:bg-gray-50/50 transition-all duration-300 rounded-lg
                  data-[state=open]:border-yellow data-[state=open]:border-[1.5px] data-[state=open]:bg-white">
                    <AccordionTrigger className="py-4 px-5 text-lg font-medium hover:no-underline flex justify-between items-center transition-all duration-300">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 px-5 pb-5 font-normal transition-all duration-300">
                      {item.answer}
                    </AccordionContent>
                  </div>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  </>;
};
export default BoxTargetAndFAQ;
