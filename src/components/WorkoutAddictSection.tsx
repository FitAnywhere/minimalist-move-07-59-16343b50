
import { useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const WorkoutAddictSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });

  const handleBookDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://calendly.com/vojtechbojko/fit', '_blank');
  };

  return (
    <section
      id="workout-addict"
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center mb-12 transition-all duration-1000", 
            isInView ? "opacity-100" : "opacity-0 translate-y-10")}>
            <h2 className="text-4xl md:text-5xl font-bold uppercase mb-4">BECOME WORKOUT ADDICT</h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              BoxFun — training that keeps you moving, smiling, and getting better.
            </p>
            
            <div className="flex justify-center">
              <Button
                onClick={handleBookDemo}
                className="bg-yellow hover:bg-yellow-600 text-black transition-transform hover:translate-y-[-2px] inline-flex items-center group px-6 py-3 rounded-full"
              >
                Book a live demo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          
          <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-200",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            
            {/* Feature Cards */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg hover:shadow-yellow/10 transition-all duration-300 hover:-translate-y-1 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-yellow">Interactive Training</h3>
              <p className="text-gray-300">Engages children through colorful games and intuitive exercises that make fitness feel like play.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg hover:shadow-yellow/10 transition-all duration-300 hover:-translate-y-1 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-yellow">Family-Friendly</h3>
              <p className="text-gray-300">Creates opportunities for the whole family to be active together, building bonds while improving health.</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg hover:shadow-yellow/10 transition-all duration-300 hover:-translate-y-1 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-yellow">Skill Development</h3>
              <p className="text-gray-300">Builds coordination, balance, and fundamental movement skills vital for long-term physical literacy.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkoutAddictSection;
