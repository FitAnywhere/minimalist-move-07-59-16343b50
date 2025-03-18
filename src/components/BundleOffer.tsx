import { useState, useRef, useEffect } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp, Rocket, Gift } from 'lucide-react';
import CountUp from 'react-countup';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BundleItem {
  name: string;
  price: string;
  description: string;
  isBonus?: boolean;
}

const bundleItems: BundleItem[] = [{
  name: "PowerTower",
  price: "€1,299.99",
  description: "All-in-one bodyweight strength trainer",
  isBonus: false
}, {
  name: "TRX",
  price: "€129.99",
  description: "Professional TRX-style trainer",
  isBonus: false
}, {
  name: "BANDS",
  price: "€129.99",
  description: "Activate every muscle",
  isBonus: false
}, {
  name: "FREE Training Library",
  price: "€240/year",
  description: "Your personal trainer, on-demand",
  isBonus: true
}, {
  name: "FREE BoxFun",
  price: "€69.99",
  description: "",
  isBonus: true
}, {
  name: "FREE Shipping",
  price: "€30",
  description: "",
  isBonus: true
}];

const BundleOffer = () => {
  const [bonusSectionOpen, setBonusSectionOpen] = useState(false);
  const [valueSectionOpen, setValueSectionOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    threshold: 0.1
  });
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      const offset = scrollY * 0.05;
      parallaxRef.current.style.transform = `translateY(${offset}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const totalValue = 1899.95;
  const yourPrice = 990;
  const savingsPercentage = 47.89;
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/test_dR602t4zDdk5gBa144', '_blank');
  };
  
  return (
    <section id="bundle" ref={sectionRef} className="relative overflow-hidden py-0 mx-0 my-0 bg-inherit">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-1000 transform mb-6", isInView ? "opacity-100 translate-y-0 animate-[bounce_0.5s_ease-out]" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black relative inline-block">
              LAST GYM YOU WILL EVER NEED
              <span className={cn("absolute bottom-0 left-0 w-full h-1 bg-yellow-400 transform transition-transform duration-1000", 
                isInView ? "scale-x-100" : "scale-x-0")}></span>
            </h2>
          </div>
          
          <div ref={cardRef} className={cn("bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 transition-all duration-1000", "shadow-md rounded-lg transform", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          borderRadius: "8px"
        }}>
            <div className="p-4">
              <div className="text-center mb-4">
                
              </div>
              
              <div className="mt-2 max-w-3xl mx-auto text-left text-gray-700">
                
              </div>
              
              <h3 className="text-xl font-bold mb-2">WHAT YOU GET:</h3>
              
              <div className="space-y-1">
                {bundleItems.filter(item => !item.isBonus).map((item, index) => <div key={index} className={cn("flex items-center justify-between p-1.5 rounded-lg bg-white transition-all duration-500 transform", "hover:bg-gray-50", isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12")} style={{
                transitionDelay: `${index * 200}ms`
              }}>
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-base">{item.name}</h4>
                        
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-lg line-through text-gray-500">
                        {item.price}
                      </span>
                    </div>
                  </div>)}
              </div>
              
              <div className="mt-3">
                <Collapsible open={bonusSectionOpen} onOpenChange={setBonusSectionOpen} 
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    bonusSectionOpen ? "border border-green-500" : "border-0"
                  )}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">BONUSES:</h3>
                    <CollapsibleTrigger className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                      {bonusSectionOpen ? 'Show Less ' : 'Show More '}
                      {bonusSectionOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="mt-2 space-y-3 transition-all duration-300 ease-in-out">
                    {bundleItems.filter(item => item.isBonus).map((item, index) => <div key={index} className="flex items-center justify-between p-1.5 transition-all">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 text-green-500 flex items-center justify-center">
                              <Gift className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-base">{item.name}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-lg line-through text-gray-500">
                            {item.price}
                          </span>
                        </div>
                      </div>)}
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              <div className="mt-3">
                <Collapsible open={valueSectionOpen} onOpenChange={setValueSectionOpen} className="p-2 bg-gray-50 rounded-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">BREAKDOWN:</h3>
                    <CollapsibleTrigger className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                      {valueSectionOpen ? 'Show Less ' : 'Show More '}
                      {valueSectionOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="mt-2 space-y-1.5 transition-all duration-300 ease-in-out">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Value:</span>
                      <span className="font-semibold text-lg line-through text-gray-500">
                        {isInView ? <CountUp start={0} end={totalValue} duration={2.5} decimals={2} prefix="€" separator="," /> : "€1,899.95"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Your Price:</span>
                      <span className="font-bold text-xl text-green-600">
                        {isInView ? <CountUp start={0} end={yourPrice} duration={2} prefix="€" separator="," /> : "€990"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-medium">You Save:</span>
                      <span className="font-bold text-lg text-green-600">
                        {isInView ? <CountUp start={0} end={savingsPercentage} duration={2} decimals={2} suffix="%" /> : "47.89%"}
                      </span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              <div className="mt-3 space-y-1.5 text-center">
                
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 text-center flex flex-col items-center">
              <Button 
                size="lg" 
                className={cn("bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-semibold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105", "w-full sm:w-auto")}
                onClick={handleCheckout}
              >
                APPLY TODAY <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className={cn("text-center py-10 max-w-3xl mx-auto transition-all duration-300", 
              isInView ? "opacity-100 translate-y-0 animate-fade-in" : "opacity-0 translate-y-4")}>
            <p className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed px-4">
              Would you rather pay for the gym…or OWN it forever?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleOffer;
