import { useRef, useState } from 'react';
import { useInView, useParallax } from '@/utils/animations';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
const BoxCallToAction = () => {
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isFaqInView = useInView(faqSectionRef);
  const isCtaInView = useInView(ctaSectionRef, {
    threshold: 0.3
  });
  const [isFaqExpanded, setIsFaqExpanded] = useState(false);

  // Set up parallax effect
  useParallax(backgroundRef, 0.05);
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/7sIdTg8G31b720U14k', '_blank');
  };
  
  const toggleFaqVisibility = () => {
    setIsFaqExpanded(!isFaqExpanded);
  };

  return <>
      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Collapsible open={isFaqExpanded} onOpenChange={toggleFaqVisibility} className="w-full">
              <div className="flex items-center justify-center">
                <CollapsibleTrigger className="flex items-center justify-center space-x-2 cursor-pointer mb-6 group">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center relative inline-block">
                      FREQUENTLY ASKED QUESTIONS
                      <span className={cn("absolute bottom-0 left-0 right-0 mx-auto h-1 bg-yellow-400 transform transition-transform duration-1000", isFaqInView ? "scale-x-100" : "scale-x-0")} style={{
                        width: '100%'
                      }}></span>
                    </h2>
                  </div>
                  <ChevronDown className={cn("h-6 w-6 transition-transform duration-300", isFaqExpanded ? "rotate-180" : "")} />
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="transition-all duration-300 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                <div ref={faqSectionRef} className="max-w-3xl mx-auto">
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
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="order" ref={ctaSectionRef} className="relative py-8 md:py-12 overflow-hidden min-h-[auto] md:min-h-[40vh] flex items-center" style={{
      background: 'linear-gradient(to bottom, #8A898C 0%, #555555 40%, #333333 70%, #222222 85%, black 100%)'
    }}>
        {/* Parallax Background */}
        <div ref={backgroundRef} className="absolute inset-0 opacity-30">
          {/* Background content if needed */}
        </div>
        
        <div className="container relative z-20 mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="space-y-4 md:space-y-2">
              {/* Promotional text above CTA button */}
              <p className={cn("font-semibold text-lg md:text-xl text-yellow transition-all duration-1000 mb-4", isCtaInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>READY TO GET FIT WHILE HAVING FUN?</p>
              
              {/* CTA Button - reduced spacing */}
              <div className={cn("transition-all duration-1000 mt-4 md:mt-6", isCtaInView ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
                <a href="https://buy.stripe.com/7sIdTg8G31b720U14k" onClick={handleCheckout} className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 py-[15px] my-[26px]">
                  🛒 MAKE YOUR MOVE
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                
                <p className="mt-6 mb-2 text-white/60 text-base font-light">For B2B partnerships and bulk orders, contact us.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>;
};
export default BoxCallToAction;
