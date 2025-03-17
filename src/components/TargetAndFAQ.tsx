
import { useState, useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronDown, Briefcase, Clock, Dumbbell } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FAQItem {
  question: string;
  answer: string;
}

interface TargetAudience {
  icon: React.ElementType;
  title: string;
  description: string;
}

const targetAudiences: TargetAudience[] = [{
  icon: Briefcase,
  title: "DRIVEN ACHIEVERS",
  description: "For tight schedules and high standards."
}, {
  icon: Clock,
  title: "CITY HUSTLERS",
  description: "For those who appreciate compact and quick setup."
}, {
  icon: Dumbbell,
  title: "WELLNESS SEEKERS",
  description: "For those who see fitness as a lifelong asset."
}];

const faqItems: FAQItem[] = [{
  question: "How easy is the PowerTower to set up?",
  answer: "Unfold and lock in place. Done in under 2 minutes. No tools, no drilling."
}, {
  question: "Is the BoxFun effective for training?",
  answer: "Yes! Great for warm ups, cardio, and full body movement."
}, {
  question: "When will my FitAnywhere bundle be delivered?",
  answer: "We ship to the Netherlands on a weekly basis. Place your order now to be included in the next scheduled shipment."
}, {
  question: "Is the PowerTower suitable for beginners?",
  answer: "Absolutely. Combined with TRX and BANDS, it offers scalable resistance and support, making it ideal for all fitness levels."
}];

const TargetAndFAQ = () => {
  const [activeAudience, setActiveAudience] = useState<number | null>(null);
  const targetSectionRef = useRef<HTMLElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const isTargetInView = useInView(targetSectionRef);
  const isFaqInView = useInView(faqSectionRef);
  
  const toggleAudience = (index: number) => {
    setActiveAudience(activeAudience === index ? null : index);
  };
  
  return (
    <>
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
                {targetAudiences.map((audience, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "rounded-2xl p-8 text-center group cursor-pointer transition-all duration-500",
                      "bg-white border-2 border-gray-100 hover:border-yellow hover:shadow-xl", 
                      "transform hover:-translate-y-2", 
                      isTargetInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12",
                      activeAudience === index ? "border-yellow shadow-xl shadow-yellow/20" : ""
                    )} 
                    onClick={() => toggleAudience(index)} 
                    style={{
                      transitionDelay: `${index * 150}ms`,
                      minHeight: activeAudience === index ? 'auto' : '230px'
                    }}
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow transition-all duration-500 transform group-hover:scale-110">
                      <audience.icon className="w-10 h-10 text-black group-hover:text-black transition-all duration-500" />
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-black">{audience.title}</h3>
                    
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-500",
                        activeAudience === index ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
                      )}
                    >
                      <p className="text-gray-700 transition-all duration-500 text-base md:text-lg">
                        {audience.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - Now with a proper ID directly on the section element */}
      <section id="faq" ref={faqSectionRef} className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center mb-12 relative inline-block">
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
    </>
  );
};

export default TargetAndFAQ;
