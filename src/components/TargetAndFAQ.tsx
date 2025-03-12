
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
    title: "High-Earning Professionals",
    description: "Perfect for busy professionals who value quality, aesthetics, and efficiency in their fitness routine."
  },
  {
    icon: Clock,
    title: "Busy Urbanites",
    description: "Designed for city dwellers with limited space who refuse to compromise on workout quality."
  },
  {
    icon: Dumbbell,
    title: "Fitness Enthusiasts",
    description: "Ideal for committed fitness enthusiasts seeking professional-grade equipment with a minimalist footprint."
  }
];

const faqItems: FAQItem[] = [
  {
    question: "How easy is the PowerTower to set up?",
    answer: "The PowerTower features a revolutionary tool-free setup process. Simply unfold, lock the stabilizing mechanisms, and you're ready to begin your workout. The entire process takes less than 5 minutes, making it perfect for urban living spaces where convenience is essential."
  },
  {
    question: "Is the BoxFun attachment effective for real boxing training?",
    answer: "Absolutely. The BoxFun attachment was developed in collaboration with professional boxing coaches to deliver an authentic boxing experience. It provides proper resistance and feedback, allowing for effective technique development, cardiovascular conditioning, and stress relief—all the benefits of boxing training without the need for a partner or gym membership."
  },
  {
    question: "When will my FitAnywhere Bundle be delivered?",
    answer: "Pre-orders for the Spring 2025 launch will begin shipping in March 2025. Early adopters who purchase during our launch phase will receive priority shipping. For customers in Amsterdam and Utrecht, we offer free white-glove delivery service, while other locations will have standard shipping options available at checkout."
  },
  {
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
    <section 
      id="faq" 
      ref={sectionRef}
      className="py-24 bg-white"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Target Audience */}
          <div 
            className={cn(
              "text-center mb-20 transition-all duration-700",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            <h2 className="text-black mb-12">Who Is This For?</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {targetAudiences.map((audience, index) => (
                <div 
                  key={index}
                  className={cn(
                    "bg-gray-50 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-lg",
                    activeAudience === index ? "bg-white shadow-lg" : ""
                  )}
                  onClick={() => toggleAudience(index)}
                >
                  <div className="w-16 h-16 rounded-full bg-yellow flex items-center justify-center mx-auto mb-6">
                    <audience.icon className="w-8 h-8 text-black" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{audience.title}</h3>
                  
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      activeAudience === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-gray-600">{audience.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ Accordion */}
          <div>
            <h2 className="text-black text-center mb-12">Frequently Asked Questions</h2>
            
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
                    <div 
                      className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300",
                        openFAQ === index ? "bg-yellow transform rotate-180" : ""
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      openFAQ === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
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
