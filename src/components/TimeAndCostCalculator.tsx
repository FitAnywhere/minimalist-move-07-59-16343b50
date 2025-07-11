import { useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { SavingsCalculator } from '@/components/ui/SavingsCalculator';
import ComparisonTable from '@/components/ComparisonTable';
const TimeAndCostCalculator = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    threshold: 0.2
  }, false);
  return <section ref={sectionRef} className="relative overflow-hidden bg-white" id="calculator">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {Array.from({
        length: 15
      }).map((_, i) => <div key={i} className="absolute rounded-full bg-yellow/10 blur-md" style={{
        width: `${Math.random() * 25 + 10}px`,
        height: `${Math.random() * 25 + 10}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 8 + 12}s linear infinite`,
        transform: `translateY(${Math.random() * 100}px)`,
        opacity: Math.random() * 0.4 + 0.1
      }} />)}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className={cn("mt-16 py-[89px]", "transition-all duration-1000 transform", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
          {/* Section Title with Subtitle */}
          <div className="text-center mb-16">
            <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-black mb-2 inline-block">
              STOP RENTING
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-400 rounded-full"></div>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mt-4 font-bold my-[36px] py-0">
              Look at all this wasted money
            </p>
          </div>

          {/* Calculator Component */}
          <div className="mb-24">
            <SavingsCalculator />
          </div>

          {/* Bold text above comparison table */}
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">STOP OVERPAYING TO LOSE YOUR SPACE</h3>
          </div>

          {/* Comparison Table */}
          <ComparisonTable />

          {/* Italic text below comparison table */}
          <div className="text-center mt-4">
            
          </div>
        </div>
      </div>
    </section>;
};
export default TimeAndCostCalculator;