import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { ArrowRight, Clock, Banknote, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CountUp from 'react-countup';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const TimeAndCostCalculator = () => {
  const [timeWastedPerVisit, setTimeWastedPerVisit] = useState(0); // Default 0 minutes
  const [gymMonthlyCost, setGymMonthlyCost] = useState(0); // Default €0/month
  const [previousTimeWasted, setPreviousTimeWasted] = useState(0);
  const [previousMoneyCost, setPreviousMoneyCost] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const isInView = useInView(sectionRef, {
    threshold: 0.3
  });

  // Constants for calculations
  const VISITS_PER_WEEK = 4;
  const WEEKS_PER_YEAR = 52;
  const YEARS_PROJECTION = 20;
  const FITANYWHERE_COST = 990; // Cost of FitAnywhere in euros

  // Calculate time wasted in 20 years (in hours)
  const timeWastedInYears = Math.round(timeWastedPerVisit * VISITS_PER_WEEK * WEEKS_PER_YEAR * YEARS_PROJECTION / 60);

  // Calculate money spent in 20 years (in euros)
  const moneySpentInYears = gymMonthlyCost * 12 * YEARS_PROJECTION;

  // Calculate annual savings - new calculation for Y
  const annualSavings = gymMonthlyCost * 12;

  // Calculate payoff timeframe
  const getPayoffTimeframe = (monthlyCost: number): number => {
    if (monthlyCost >= 85) return 1;
    if (monthlyCost >= 45) return 2;
    if (monthlyCost >= 30) return 3;
    if (monthlyCost >= 25) return 4;
    if (monthlyCost >= 20) return 5;
    if (monthlyCost >= 15) return 6;
    if (monthlyCost >= 10) return 9;
    if (monthlyCost >= 5) return 17;
    return 0; // For values less than 5
  };
  const payoffTimeframe = getPayoffTimeframe(gymMonthlyCost);

  // Trigger animation when component comes into view
  useEffect(() => {
    if (isInView && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [isInView]);

  // Update previous values for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviousTimeWasted(timeWastedInYears);
      setPreviousMoneyCost(moneySpentInYears);
    }, 1200); // Slightly longer than the CountUp duration

    return () => clearTimeout(timer);
  }, [timeWastedInYears, moneySpentInYears]);

  // Handle CTA button click - updated to open Stripe checkout
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/dR600qaRv29ScE05kt', '_blank');
  };

  // Format cost input
  const handleCostInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, '') || '0');
    setGymMonthlyCost(Math.min(Math.max(value, 0), 150)); // Clamp between 0-150
  };

  return <section id="calculator" ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className={cn("transition-all duration-1000", isInView ? "opacity-100" : "opacity-0 translate-y-10")}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 relative inline-block">
                YOUR LIFETIME INVESTMENT
                <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", isInView ? "scale-x-100" : "scale-x-0")}></span>
              </h2>
              
              <div className={cn("mt-4 flex justify-center items-center", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5")}>
                <div className="flex items-center gap-3 text-yellow-400">
                  
                  
                </div>
              </div>
              
            </div>
            
            {/* Main content area */}
            <div className={cn("transition-all duration-1000 delay-300", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
              {/* Desktop & Mobile Layout */}
              <div className="flex flex-col gap-8">
                {/* Money Cost Box - Moved to the top */}
                <Card className="rounded-xl shadow-md border-2 border-black overflow-hidden w-full">
                  <CardContent className="p-0">
                    {/* For mobile: stack vertically, for desktop: horizontal layout */}
                    <div className="flex flex-col md:flex-row">
                      {/* Input section - Left side on desktop, top on mobile */}
                      <div className="bg-white p-6 md:p-8 md:w-1/2">
                        <p className="mb-3 text-left font-bold text-sm">How much is your gym membership?</p>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">€0</span>
                          <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
                            <span className="px-2 py-1 bg-gray-200 text-gray-800">€</span>
                            <Input type="text" value={gymMonthlyCost} onChange={handleCostInputChange} className="w-16 text-center border-0 bg-transparent" />
                          </div>
                          <span className="text-gray-600">€150</span>
                        </div>
                        
                        <div className="py-4 md:py-6">
                          <Slider value={[gymMonthlyCost]} min={0} max={150} step={5} className="w-full" onValueChange={value => setGymMonthlyCost(value[0])} />
                        </div>
                      </div>
                      
                      {/* Money Result - Right side on desktop, bottom on mobile */}
                      <div className="bg-gray-50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100 md:w-1/2 flex flex-col justify-center">
                        <div className="flex items-center justify-center mb-2">
                          <Banknote className="w-5 h-5 text-yellow mr-2" />
                          <h3 className="text-lg font-bold">MONEY SPENT - 20 YEARS</h3>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-yellow pulse-glow text-center">
                          {shouldAnimate ? <CountUp start={previousMoneyCost} end={moneySpentInYears} duration={1} separator="," prefix="€" suffix="+" useEasing /> : "€0+"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Payoff Timeframe Display - Added more padding/margin */}
                {gymMonthlyCost >= 5 && <div className="bg-yellow-50 border-2 border-yellow rounded-xl p-6 text-center my-10">
                    <p className="text-xl font-bold text-black">
                      In less than {payoffTimeframe} {payoffTimeframe === 1 ? 'year' : 'years'} own FitAnywhere for free while saving €{annualSavings} every year.
                    </p>
                  </div>}
                
                {/* Time Cost Box - Moved below */}
                <Card className="rounded-xl shadow-md border-2 border-black overflow-hidden w-full">
                  <CardContent className="p-0">
                    {/* For mobile: stack vertically, for desktop: horizontal layout */}
                    <div className="flex flex-col md:flex-row">
                      {/* Input section - Left side on desktop, top on mobile */}
                      <div className="bg-white p-6 md:p-8 md:w-1/2">
                        <p className="mb-3 text-left font-bold text-sm">How much time do you spend going to the gym and back?</p>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">0 min</span>
                          <span className="text-lg font-bold bg-gray-100 px-3 py-1 rounded-md">
                            {timeWastedPerVisit} min
                          </span>
                          <span className="text-gray-600">120 min</span>
                        </div>
                        
                        <div className="py-4 md:py-6">
                          <Slider value={[timeWastedPerVisit]} min={0} max={120} step={5} className="w-full" onValueChange={value => setTimeWastedPerVisit(value[0])} />
                        </div>
                      </div>
                      
                      {/* Time Result - Right side on desktop, bottom on mobile */}
                      <div className="bg-gray-50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100 md:w-1/2 flex flex-col justify-center">
                        <div className="flex items-center justify-center mb-2">
                          <Clock className="w-5 h-5 text-yellow mr-2" />
                          <h3 className="text-lg font-bold"> TIME WASTED - 20 YEARS</h3>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-yellow pulse-glow text-center">
                          {shouldAnimate ? <CountUp start={previousTimeWasted} end={timeWastedInYears} duration={1} separator="," suffix=" hours" useEasing /> : "0 hours"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* "What could you do" text and CTA - centered for both mobile and desktop */}
              <div className="mt-12 text-center">
                <p className="text-lg font-medium mb-8">What can you do with that extra time and money?</p>
                
                {/* New CTA button */}
                <div className="flex justify-center mb-8">
                  <Button 
                    variant="yellow" 
                    size="lg" 
                    className="bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-bold tracking-wide transition-all duration-300 hover:shadow-md hover:scale-105 button-glow animate-[pulse_6s_ease-in-out_infinite]"
                    onClick={handleCTAClick}
                  >
                    🛒 BREAK FREE NOW!
                  </Button>
                </div>
                
                <div className={cn("transition-all duration-1000 delay-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default TimeAndCostCalculator;
