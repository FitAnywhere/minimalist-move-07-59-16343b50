
import { useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How do I set up FitAnywhere?",
    answer: "Slide, click, and train. It takes under 2 minutes—no tools or drilling needed."
  },
  {
    question: "I'm a total beginner. Will I really be able to use it?",
    answer: "Yes. The colour‑coded bands lighten your body‑weight, so you can do every move on day one and reduce assistance as you get stronger."
  },
  {
    question: "Will it fit in my flat with low ceilings?",
    answer: "The height is fully adjustable (195-235 cm), making it ideal for apartments with lower ceilings."
  },
  {
    question: "What's inside the box?",
    answer: " • PowerTower frame\n • 4 colour‑coded assistance bands (15–45 kg)\n • Quick‑start setup card\n • Lifetime access to the video Training Library"
  },
  {
    question: "How long does delivery take?",
    answer: "We ship weekly, but if a unit is temporarily out of stock, there may be a short delay until we manufacture more. In a hurry? Don't hesitate to get in touch. We'll always try to make it work."
  },
  {
    question: "Why is production limited?",
    answer: "Every PowerTower is hand‑welded, hand‑powder‑coated, and individually tested. This careful, manual process guarantees top quality—but it also limits how many we can make."
  },
  {
    question: "How much weight can it hold?",
    answer: "Stress‑tested to 200 kg (440 lb)—plenty for weighted calisthenics."
  },
  {
    question: "Will it scratch my floors?",
    answer: "No. The built‑in rubber feet protect hardwood, tile, and laminate—no extra mats needed."
  },
  {
    question: "What if I change my mind?",
    answer: "Try it for 30 days. If it's not the perfect fit, return it for a full refund—no questions asked."
  },
  {
    question: "Is there a warranty?",
    answer: "2‑year warranty on PowerTower and bands."
  },
  {
    question: "What if I want to start but don't have the full budget?",
    answer: "Reach out to us. We're happy to explore flexible payment options or solutions that fit your current situation."
  }
];

const GymFAQ = () => {
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const isFaqInView = useInView(faqSectionRef);

  return (
    <section id="faq" ref={faqSectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center relative inline-block mb-12">
              FREQUENTLY ASKED QUESTIONS
              <span className={cn(
                "absolute bottom-0 left-0 right-0 mx-auto h-1 bg-yellow-400 transform transition-transform duration-1000",
                isFaqInView ? "scale-x-100" : "scale-x-0"
              )} style={{ width: '100%' }}></span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className={cn(
                    "mb-4 transition-all duration-300 rounded-lg overflow-hidden",
                    isFaqInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="border border-transparent hover:bg-gray-50/50 transition-all duration-300 rounded-lg
                    data-[state=open]:border-yellow data-[state=open]:border-[1.5px] data-[state=open]:bg-white">
                    <AccordionTrigger className="py-4 px-5 text-lg font-medium hover:no-underline flex justify-between items-center transition-all duration-300">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 px-5 pb-5 font-normal transition-all duration-300">
                      {item.answer}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GymFAQ;
