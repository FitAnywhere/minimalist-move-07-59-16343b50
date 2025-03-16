import { useState, useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { ChevronDown, Briefcase, Clock, Dumbbell } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface TargetAudience {
  icon: React.ElementType;
  title: string;
  description: string;
}

const targetAudiences: TargetAudience[] = [
  {
    icon: Briefcase,
    title: "DRIVEN ACHIEVERS",
    description: "For tight schedules and high standards."
  }, 
  {
    icon: Clock,
    title: "CITY HUSTLERS",
    description: "For those who appreciate compact and quick setup."
  }, 
  {
    icon: Dumbbell,
    title: "WELLNESS SEEKERS",
    description: "For those who see fitness as a lifelong asset."
  }
];

const faqItems: FAQItem[] = [
  {
    question: "How easy is the PowerTower to set up?",
    answer: "The PowerTower features a revolutionary tool-free setup process. Simply unfold, lock the stabilizing mechanisms, and you're ready to begin your workout. The entire process takes less than 5 minutes, making it perfect for urban living spaces where convenience is essential."
  }, {
    question: "Is the BoxFun attachment effective for real boxing training?",
    answer: "Absolutely. The BoxFun attachment was developed in collaboration with professional boxing coaches to deliver an authentic boxing experience. It provides proper resistance and feedback, allowing for effective technique development, cardiovascular conditioning, and stress relief—all the benefits of boxing training without the need for a partner or gym membership."
  }, {
    question: "When will my FitAnywhere Bundle be delivered?",
    answer: "Pre-orders for the Spring 2025 launch will begin shipping in March 2025. Early adopters who purchase during our launch phase will receive priority shipping. For customers in Amsterdam and Utrecht, we offer free white-glove delivery service, while other locations will have standard shipping options available at checkout."
  }, {
    question: "Are the resistance bands suitable for beginners?",
    answer: "Yes, our Premium Elastic Resistance Set includes bands of varying resistance levels, making them perfect for all fitness levels from beginners to advanced users. Each band is clearly marked with its resistance level, and our exclusive video tutorial library includes specialized beginner workouts to help you master proper form and technique from day one."
  }
];

const TargetAndFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeAudience, setActiveAudience] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const toggleAudience = (index: number) => {
    setActiveAudience(activeAudience === index ? null : index);
  };

  return (
    <section id="faq" ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Target Audience */}
          <div className={cn(
            "text-center mb-20 transition-all duration-1000", 
            isInView ? "opacity-100" : "opacity-0 translate-y-12"
          )}>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-16 relative">
              <span className="relative inline-block after:content-[''] after:absolute after:w-full after:h-1 after:bg-yellow after:bottom-0 after:left-0">
                WHO WE BUILT THIS FOR?
              </span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {targetAudiences.map((audience, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "rounded-2xl p-8 text-center group cursor-pointer transition-all duration-500",
                    "bg-white border-2 border-gray-100 hover:border-yellow hover:shadow-xl",
                    "transform hover:-translate-y-2",
                    isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12",
                    activeAudience === index ? "border-yellow shadow-xl shadow-yellow/20" : ""
                  )}
                  onClick={() => toggleAudience(index)}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow transition-all duration-500 transform group-hover:scale-110">
                    <audience.icon className="w-10 h-10 text-black group-hover:text-black transition-all duration-500" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-black">{audience.title}</h3>
                  
                  <p className="text-gray-700 transition-all duration-500 text-base md:text-lg">
                    {audience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ Accordion */}
          <div>
            <h2 className="text-black text-center mb-12">FREQUENTLY ASKED QUESTIONS</h2>
            
            <div className="max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "mb-4 border-b border-gray-100 pb-4", 
                    "transition-all duration-300", 
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )} 
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <button 
                    onClick={() => toggleFAQ(index)} 
                    className="w-full flex justify-between items-center text-left py-4 focus:outline-none"
                  >
                    <h4 className="text-lg font-medium pr-8">{item.question}</h4>
                    <div className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                      openFAQ === index ? "bg-yellow transform rotate-180" : "bg-gray-100"
                    )}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out", 
                    openFAQ === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}>
                    <div className="pb-4 text-gray-600">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAndFAQ;
