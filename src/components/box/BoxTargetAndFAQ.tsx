import React, { useState, useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

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
  question: "How do I set up FitAnywhere?",
  answer: "Slide, click, and train. It takes under 2 minutes—no tools or drilling needed."
}, {
  question: "I'm a total beginner. Will I really be able to use it?",
  answer: "Yes. The colour‑coded bands lighten your body‑weight, so you can do every move on day one and reduce assistance as you get stronger."
}, {
  question: "Will it fit in my flat with low ceilings?",
  answer: "The height is fully adjustable (195-235 cm), making it ideal for apartments with lower ceilings."
}, {
  question: "What's inside the box?",
  answer: " • PowerTower frame\n • 4 colour‑coded assistance bands (15–45 kg)\n • Quick‑start setup card\n • Lifetime access to the video Training Library"
}, {
  question: "How long does delivery take?",
  answer: "We ship weekly, but if a unit is temporarily out of stock, there may be a short delay until we manufacture more. In a hurry? Don't hesitate to get in touch. We'll always try to make it work."
}, {
  question: "Why is production limited?",
  answer: "Every PowerTower is hand‑welded, hand‑powder‑coated, and individually tested. This careful, manual process guarantees top quality—but it also limits how many we can make."
}, {
  question: "How much weight can it hold?",
  answer: "Stress‑tested to 200 kg (440 lb)—plenty for weighted calisthenics."
}, {
  question: "Will it scratch my floors?",
  answer: "No. The built‑in rubber feet protect hardwood, tile, and laminate—no extra mats needed."
}, {
  question: "What if I change my mind?",
  answer: "Try it for 30 days. If it's not the perfect fit, return it for a full refund—no questions asked."
}, {
  question: "Is there a warranty?",
  answer: "2‑year warranty on PowerTower and bands."
}];

const BoxTargetAndFAQ = () => {
  const [activeAudience, setActiveAudience] = useState<number | null>(null);
  const targetSectionRef = useRef<HTMLElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const isTargetInView = useInView(targetSectionRef);
  const isFaqInView = useInView(faqSectionRef);
  const isMobile = useIsMobile();

  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/dR65kKbVz15O5bybIZ', '_blank');
  };

  return <>
    {/* Target Audience Section */}
    <section id="target" ref={targetSectionRef} className="py-24 bg-inherit">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className={cn("text-center mb-20 transition-all duration-1000", isTargetInView ? "opacity-100" : "opacity-0 translate-y-12")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-16 relative inline-block">
              WHO WE BUILT THIS FOR
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isTargetInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {targetAudiences.map((audience, index) => <div key={index} className={cn("rounded-2xl p-8 text-center group cursor-pointer transition-all duration-500", "bg-white border-2 border-gray-100 hover:border-yellow hover:shadow-xl", "transform hover:-translate-y-2", isTargetInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12")} style={{
                transitionDelay: `${index * 150}ms`
              }}>
                  <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500">
                    <img src={audience.imageUrl} alt={audience.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-black mb-4">{audience.title}</h3>
                  <p className="text-gray-700 text-base md:text-lg">
                    {audience.description}
                  </p>
                </div>)}
            </div>

            <p className="mt-8 text-gray-700 text-center my-[53px] text-base font-bold">Join hundreds building the strength and confidence they only dreamed of.</p>
            
            <div className="flex justify-center mt-8">
              
            </div>
          </div>
        </div>
      </div>
    </section>
    
    {/* FAQ Section - Always visible without dropdown */}
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
