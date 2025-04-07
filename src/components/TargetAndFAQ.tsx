
import { useState, useRef } from 'react';
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
  imageUrl: "https://i.imgur.com/tscnNiG.jpeg",
  title: "DRIVEN ACHIEVERS",
  description: "For busy schedules and exceptional standards."
}, {
  imageUrl: "https://i.imgur.com/j9K9GFk.jpeg",
  title: "CITY HUSTLERS",
  description: "For those who cherish and honor their space."
}, {
  imageUrl: "https://i.imgur.com/zEAA8nc.jpeg",
  title: "WELLNESS SEEKERS",
  description: "For those who embrace a life of constant positive energy."
}];
const faqItems: FAQItem[] = [{
  question: "How easy is FitAnywhere to set up?",
  answer: "Unfold, lock, and start training. Under two minutes, with no tools or drilling required."
}, {
  question: "Is FitAnywhere suitable for beginners?",
  answer: "Absolutely. Our band system offers adjustable resistance and support, making every workout scalable. It's perfect for all levels."
}, {
  question: "When will my FitAnywhere be delivered?",
  answer: "We dispatch weekly, but if a unit is temporarily out of stock, there may be a short delay until we manufacture more. In a hurry? Don't hesitate to get in touch. We'll always try to make it work."
}, {
  question: "Is it true that your production is limited?",
  answer: "Yes and proudly so. As a family business, we are committed to craftsmanship and lifetime durability over mass production. In 2025, that means 100 units per country."
}, {
  question: "Can I use FitAnywhere inside the apartment with low ceilings?",
  answer: "The height is fully adjustable, making it ideal for apartments with lower ceilings. The exact dimensions are in the product specifications."
}, {
  question: "What's inside the FitAnywhere gym?",
  answer: "Your entire workout system for calisthenics, strength, and cardio.\n- PowerTower\n- TRX\n- 4x Bands\n- Training Library\n- BoxFun"
}, {
  question: "Can BoxFun elastic break?",
  answer: "It never happened. Every piece is handmade from the most premium materials to ensure it lasts a lifetime."
}, {
  question: "Are there any guarantees?",
  answer: "Yes. We don't just sell gear, we stand by it. If you're not satisfied for any reason, we'll take it back without hesitation."
}];
const TargetAndFAQ = () => {
  const [activeAudience, setActiveAudience] = useState<number | null>(null);
  const targetSectionRef = useRef<HTMLElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const isTargetInView = useInView(targetSectionRef);
  const isFaqInView = useInView(faqSectionRef);
  const isMobile = useIsMobile();
  
  const toggleAudience = (index: number) => {
    setActiveAudience(activeAudience === index ? null : index);
  };
  
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/dR600qaRv29ScE05kt', '_blank');
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
                {targetAudiences.map((audience, index) => <div key={index} className={cn("rounded-2xl p-8 text-center group cursor-pointer transition-all duration-500", "bg-white border-2 border-gray-100 hover:border-yellow hover:shadow-xl", "transform hover:-translate-y-2", isTargetInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12", activeAudience === index ? "border-yellow shadow-xl shadow-yellow/20" : "")} onClick={() => toggleAudience(index)} style={{
                transitionDelay: `${index * 150}ms`,
                minHeight: activeAudience === index ? 'auto' : '230px'
              }}>
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-500">
                      <img src={audience.imageUrl} alt={audience.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <h3 className="text-xl md:text-2xl font-bold text-black">{audience.title}</h3>
                      <ChevronRight className={cn("w-5 h-5 text-yellow transition-transform duration-300", activeAudience === index ? "rotate-90" : "")} />
                    </div>
                    
                    <div className={cn("overflow-hidden transition-all duration-500", activeAudience === index ? "opacity-100 max-h-20" : "opacity-0 max-h-0")}>
                      <p className="text-gray-700 transition-all duration-500 text-base md:text-lg">
                        {audience.description}
                      </p>
                    </div>
                  </div>)}
              </div>
              
              <p className={cn("mt-12 text-xl md:text-2xl font-semibold text-gray-700 transition-all duration-1000", isTargetInView ? "opacity-100" : "opacity-0 translate-y-8")}>
                The committed don't do ordinary — they do FitAnywhere.
              </p>
              
              {/* Updated CTA button text */}
              <div className="flex justify-center mt-8">
                <Button 
                  variant="yellow" 
                  size="lg" 
                  className="bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide transition-all duration-300 hover:shadow-md hover:scale-105 button-glow animate-[pulse_2s_ease-in-out_infinite]"
                  onClick={handleCTAClick}
                >
                  🛒 MAKE YOUR MOVE
                </Button>
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
export default TargetAndFAQ;
