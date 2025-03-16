
import { useState, useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronDown, Briefcase, Clock, Dumbbell } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

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
  answer: "We ship weekly from Slovenia to the Netherlands. Order now for the next batch!"
}, {
  question: "Are the resistance bands suitable for beginners?",
  answer: "Perfect for all levels. Supportive for beginners, resistance for constant gains."
}];

const TargetAndFAQ = () => {
  const [activeAudience, setActiveAudience] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  const toggleAudience = (index: number) => {
    setActiveAudience(activeAudience === index ? null : index);
  };

  return <section id="faq" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Target Audience */}
          <div className={cn("text-center mb-20 transition-all duration-1000", isInView ? "opacity-100" : "opacity-0 translate-y-12")}>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-16 relative">
              <span className="relative inline-block after:content-[''] after:absolute after:w-full after:h-1 after:bg-yellow after:bottom-0 after:left-0">
                WHO WE BUILT THIS FOR?
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {targetAudiences.map((audience, index) => <div key={index} className={cn("rounded-2xl p-8 text-center group cursor-pointer transition-all duration-500", "bg-white border-2 border-gray-100 hover:border-yellow hover:shadow-xl", "transform hover:-translate-y-2", isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12", activeAudience === index ? "border-yellow shadow-xl shadow-yellow/20" : "")} onClick={() => toggleAudience(index)} style={{
              transitionDelay: `${index * 150}ms`
            }}>
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow transition-all duration-500 transform group-hover:scale-110">
                    <audience.icon className="w-10 h-10 text-black group-hover:text-black transition-all duration-500" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-black">{audience.title}</h3>
                  
                  <p className="text-gray-700 transition-all duration-500 text-base md:text-lg">
                    {audience.description}
                  </p>
                </div>)}
            </div>
          </div>
          
          {/* FAQ Accordion */}
          <div>
            <h2 className={cn("text-3xl md:text-4xl font-bold text-black text-center mb-12 relative")}>
              <span className="relative inline-block">
                FREQUENTLY ASKED QUESTIONS
                <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
                  isInView ? "scale-x-100" : "scale-x-0")}></span>
              </span>
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className={cn(
                      "mb-4 border-b border-gray-100 pb-2",
                      "transition-all duration-300",
                      isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <AccordionTrigger 
                      className="py-4 text-lg font-medium hover:no-underline flex justify-between items-center"
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-1 pb-3">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default TargetAndFAQ;
