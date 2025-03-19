
import { useState, useRef } from 'react';
import { useInView } from '@/utils/animations';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

const TimeAndCostCalculator = () => {
  const [timeWastedPerVisit, setTimeWastedPerVisit] = useState(30); // Default 30 minutes
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  
  // Constants for calculations
  const VISITS_PER_WEEK = 4;
  const WEEKS_PER_YEAR = 52;
  const YEARS_PROJECTION = 20;
  const GYM_MONTHLY_COST = 50; // €50/month
  
  // Calculate time wasted in 20 years (in hours)
  const timeWastedInYears = Math.round(
    (timeWastedPerVisit * VISITS_PER_WEEK * WEEKS_PER_YEAR * YEARS_PROJECTION) / 60
  );
  
  // Calculate money spent in 20 years (in euros)
  const moneySpentInYears = GYM_MONTHLY_COST * 12 * YEARS_PROJECTION;
  
  // Format values for display
  const formattedTimeWasted = timeWastedInYears.toLocaleString();
  const formattedMoneySpent = moneySpentInYears.toLocaleString();
  
  // Handle CTA button click
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const orderSection = document.getElementById('order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section id="calculator" ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={cn(
            "transition-all duration-1000", 
            isInView ? "opacity-100" : "opacity-0 translate-y-10"
          )}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-14 relative inline-block">
              SEE HOW MUCH YOU'RE REALLY LOSING
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
                isInView ? "scale-x-100" : "scale-x-0"
              )}></span>
            </h2>
            
            <div className="mt-12 max-w-xl mx-auto">
              <div className={cn(
                "mb-8 transition-all duration-1000 delay-300", 
                isInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <p className="text-xl mb-3 font-medium">
                  How much time do you waste per gym visit?
                </p>
                <p className="text-gray-600 mb-8">
                  (travel, changing, waiting for equipment, etc.)
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">10 min</span>
                  <span className="text-lg font-bold">{timeWastedPerVisit} min</span>
                  <span className="text-gray-600">120 min</span>
                </div>
                
                <div className="py-4">
                  <Slider 
                    defaultValue={[30]} 
                    min={10} 
                    max={120} 
                    step={5}
                    className="w-full"
                    onValueChange={(value) => setTimeWastedPerVisit(value[0])}
                  />
                </div>
              </div>
              
              <div className={cn(
                "bg-gray-50 rounded-2xl p-8 mb-10 transition-all duration-1000 delay-500", 
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Time wasted in 20 years</h3>
                    <p className="text-3xl md:text-4xl font-bold text-yellow">
                      {formattedTimeWasted} hours
                    </p>
                    <p className="text-gray-600 mt-2">lost forever</p>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Money spent in 20 years</h3>
                    <p className="text-3xl md:text-4xl font-bold text-yellow">
                      €{formattedMoneySpent}+
                    </p>
                    <p className="text-gray-600 mt-2">on gym memberships</p>
                  </div>
                </div>
                
                <p className="text-center mt-8 text-xl font-medium">
                  Imagine what you could do with that extra time and money.
                </p>
              </div>
              
              <div className={cn(
                "transition-all duration-1000 delay-700", 
                isInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <Button
                  onClick={handleCTAClick}
                  className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-5 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 button-glow group"
                >
                  OWN YOUR FREEDOM NOW
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeAndCostCalculator;
