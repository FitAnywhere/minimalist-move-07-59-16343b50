
import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp, Rocket } from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';

interface BundleItem {
  name: string;
  price: string;
  description: string;
  isBonus?: boolean;
}

const bundleItems: BundleItem[] = [
  {
    name: "PowerTower Portable Gym",
    price: "€1,299.99",
    description: "All-in-one bodyweight strength trainer",
    isBonus: false
  },
  {
    name: "Pro Suspension Trainer",
    price: "€129.99",
    description: "Professional TRX-style trainer",
    isBonus: false
  },
  {
    name: "Elite Resistance Bands Set",
    price: "€69.99",
    description: "Activate every muscle",
    isBonus: false
  },
  {
    name: "Exclusive Video Training Library",
    price: "€240/year",
    description: "Your personal trainer, on-demand",
    isBonus: false
  },
  {
    name: "BoxFun Boxing Trainer",
    price: "€69.99",
    description: "Transform fitness into fun",
    isBonus: true
  },
  {
    name: "Shipping",
    price: "€30",
    description: "Straight to your door",
    isBonus: true
  }
];

const BundleOffer = () => {
  const [showSavings, setShowSavings] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const bonusSectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });
  const isBonusInView = useInView(bonusSectionRef, { threshold: 0.5 });

  // Parallax effect for background
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      const offset = scrollY * 0.05; // Subtle movement
      parallaxRef.current.style.transform = `translateY(${offset}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate total values
  const totalValue = 1839.96;
  const yourPrice = 990;
  const savings = totalValue - yourPrice;

  return (
    <section id="bundle" ref={sectionRef} className="py-16 relative overflow-hidden">
      {/* Parallax Background */}
      <div 
        ref={parallaxRef} 
        className="absolute inset-0 w-full h-full z-0 overflow-hidden"
        style={{
          background: "radial-gradient(circle at 50% 50%, #ffffff, #f8f8f8, #f1f1f1)"
        }}
      >
        {/* Floating Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-yellow/10 blur-md"
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 15}s linear infinite`,
              transform: `translateY(${Math.random() * 100}px)`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Bundle Offer Card */}
          <div className={cn(
            "bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-1000",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="p-6">
              {/* Headline directly in the offer container */}
              <div className={cn(
                "text-center transition-all duration-1000 transform mb-6",
                isInView ? "opacity-100 translate-y-0 animate-[bounce_0.5s_ease-out]" : "opacity-0 -translate-y-8"
              )}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 text-black">
                  THE LAST GYM YOU'LL EVER NEED.
                </h2>
                <p className="mt-1 text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
                  No memberships. No excuses. Just results.
                </p>
              </div>
              
              <div className="mt-4 max-w-3xl mx-auto text-left text-gray-700">
                <p className="mb-5 text-lg">
                  Ever wondered why thousands are wasted on gym memberships…only to quit?
                  What if you could <span className="font-semibold">OWN</span> the gym, the trainer, and the motivation—forever?
                </p>
              </div>
              
              {/* What You Get Section */}
              <h3 className="text-xl font-bold mb-4">HERE'S WHAT YOU GET:</h3>
              
              <div className="space-y-3">
                {bundleItems.filter(item => !item.isBonus).map((item, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white transition-all duration-500 transform",
                      "hover:shadow-md hover:bg-gray-50",
                      isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                    )}
                    style={{
                      transitionDelay: `${index * 200}ms`
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 text-right">
                      <span 
                        className="font-semibold text-xl transition-all duration-300 hover:text-shadow-yellow"
                      >
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Exclusive Bonuses Section with Spotlight */}
              <div 
                ref={bonusSectionRef}
                className={cn(
                  "mt-6 p-4 rounded-xl border border-yellow-100 transition-all duration-500",
                  isBonusInView ? "bg-yellow/5" : "bg-white"
                )}
              >
                <h3 className={cn(
                  "text-xl font-bold mb-3 flex items-center",
                  isBonusInView ? "animate-[pulse_2s_infinite]" : ""
                )}>
                  🎁 EXCLUSIVE BONUSES:
                </h3>
                
                <div className="space-y-3">
                  {bundleItems.filter(item => item.isBonus).map((item, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white transition-all duration-500 transform",
                        "hover:shadow-md border border-yellow-50",
                        isBonusInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12" 
                      )}
                      style={{
                        transitionDelay: `${index * 200}ms`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">FREE {item.name}</h4>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 text-right">
                        <span 
                          className="font-semibold text-xl text-green-500 transition-all duration-300 hover:text-shadow-yellow"
                        >
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Value Breakdown with Counter */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold mb-3">
                  💰 VALUE BREAKDOWN:
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Value:</span>
                    <span className="font-semibold text-xl">
                      {isInView ? 
                        <CountUp 
                          start={0} 
                          end={totalValue} 
                          duration={2.5} 
                          decimals={2} 
                          prefix="€" 
                          separator="," 
                        /> : 
                        "€1,839.96"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Your Price:</span>
                    <span className="font-bold text-2xl text-green-600">
                      {isInView ? 
                        <CountUp 
                          start={0} 
                          end={yourPrice} 
                          duration={2} 
                          prefix="€" 
                          separator="," 
                        /> : 
                        "€990"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-medium">You Save:</span>
                    <span className="font-bold text-xl text-green-600">
                      {isInView ? 
                        <CountUp 
                          start={0} 
                          end={savings} 
                          duration={2.5} 
                          decimals={2} 
                          prefix="€" 
                          separator="," 
                        /> : 
                        "€849.96"
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Additional Value Proposition */}
              <div className="mt-5 space-y-3 text-center">
                <p className="text-lg font-medium">Would you rather pay for the gym…or OWN it forever?</p>
                <p className="text-lg font-bold tracking-wide">
                  GET IT ALL FOR LESS THAN 3 MONTHS WITH A PERSONAL TRAINER.
                </p>
                <p className="text-gray-700">
                  Train your way. On your schedule. No contracts, just results.
                </p>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="bg-gray-900 p-6 text-center">
              <Button
                size="lg"
                className={cn(
                  "bg-yellow hover:bg-yellow-dark text-black px-8 py-6 rounded-full text-lg font-semibold tracking-wide",
                  "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105",
                  "w-full sm:w-auto"
                )}
              >
                SECURE YOURS BEFORE STOCK RUNS OUT! <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleOffer;
