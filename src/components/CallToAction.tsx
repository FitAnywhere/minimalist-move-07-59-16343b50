
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  
  return (
    <section id="order" ref={sectionRef} className="py-20 bg-white overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-8 relative inline-block">
            LAST GYM YOU WILL EVER NEED
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform scale-x-100"></span>
          </h2>
          
          <div className={cn(
            "mb-10 transition-all duration-700 delay-300",
            isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              You're not just buying equipment. You're investing in a lifestyle upgrade—mobility, strength, and confidence in one transformative package.
            </p>
          </div>
          
          <div className={cn(
            "transition-all duration-700 delay-500",
            isInView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <a 
              href="#order" 
              className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-xl font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group button-glow"
            >
              GET YOUR BUNDLE NOW
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            
            <p className="mt-4 text-sm text-gray-600">
              Limited stock available. Free shipping to EU.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
