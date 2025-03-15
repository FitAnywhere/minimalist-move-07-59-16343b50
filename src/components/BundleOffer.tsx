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
  name: "Professional TRX",
  price: "€129.99",
  description: "Professional TRX-style trainer",
  isBonus: false
}, {
  name: "Full Bands Set",
  price: "€69.99",
  description: "Activate every muscle",
  isBonus: false
}, {
  name: "Video Training Library",
  price: "€240/year",
  description: "Your personal trainer, on-demand",
  isBonus: false
}, {
  name: "BoxFun",
  price: "€69.99",
  description: "Transform fitness into fun",
  isBonus: true
}, {
  name: "Shipping",
  price: "€30",
  description: "Straight to your door",
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
  return <section id="bundle" ref={sectionRef} className="relative overflow-hidden py-0 mx-0 my-0 bg-zinc-200">
      {/* Parallax Background */}
      <div ref={parallaxRef} style={{
      background: "radial-gradient(circle at 50% 50%, #f8f8f8, #f1f1f1, #eaeaea)"
    }} className="absolute inset-0 w-full h-full z-0 overflow-hidden py-[47px] px-0 bg-transparent">
        {/* Floating Particles */}
        {Array.from({
        length: 15
      }).map((_, i) => <div key={i} className="absolute rounded-full bg-yellow/10 blur-md" style={{
        width: `${Math.random() * 40 + 20}px`,
        height: `${Math.random() * 40 + 20}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 15 + 15}s linear infinite`,
        transform: `translateY(${Math.random() * 100}px)`,
        opacity: Math.random() * 0.5 + 0.1
      }} />)}
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Headline outside the card */}
          <div className={cn("text-center transition-all duration-1000 transform mb-6", isInView ? "opacity-100 translate-y-0 animate-[bounce_0.5s_ease-out]" : "opacity-0 -translate-y-8")}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 text-black">
              LAST GYM YOU WILL EVER NEED
            </h2>
            <p className="mt-2 text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
              What if you could <span className="font-semibold">OWN</span> the gym, the trainer, and the motivation forever?
            </p>
          </div>
          
          {/* Bundle Offer Card */}
          <div ref={cardRef} className={cn("bg-white rounded-lg overflow-hidden shadow-lg border border-gray-100 transition-all duration-1000", "shadow-md rounded-lg transform", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          borderRadius: "8px"
        }}>
            <div className="p-4">
              {/* Headline directly in the offer container */}
              <div className="text-center mb-4">
                
              </div>
              
              <div className="mt-2 max-w-3xl mx-auto text-left text-gray-700">
                <p className="mb-3 text-lg leading-tight text-center text-blue-600">No memberships. No excuses. Just results.</p>
              </div>
              
              {/* What You Get Section */}
              <h3 className="text-xl font-bold mb-2">HERE'S WHAT YOU GET:</h3>
              
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
              
              {/* Exclusive Bonuses Section with Collapsible */}
              <div className="mt-3">
                <Collapsible open={bonusSectionOpen} onOpenChange={setBonusSectionOpen} className="p-2 rounded-lg border border-yellow-100 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">EXCLUSIVE BONUSES:</h3>
                    <CollapsibleTrigger className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                      {bonusSectionOpen ? 'Show Less ' : 'Show More '}
                      {bonusSectionOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="mt-2 space-y-1.5 transition-all duration-300 ease-in-out">
                    {bundleItems.filter(item => item.isBonus).map((item, index) => <div key={index} className="flex items-center justify-between p-1.5 rounded-lg bg-white transition-all hover:shadow-sm border border-yellow-50">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 text-yellow-500 flex items-center justify-center">
                              <Gift className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-base">FREE {item.name}</h4>
                            <p className="text-xs text-gray-600">{item.description}</p>
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
              
              {/* Value Breakdown with Counter - Also Collapsible */}
              <div className="mt-3">
                <Collapsible open={valueSectionOpen} onOpenChange={setValueSectionOpen} className="p-2 bg-gray-50 rounded-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">VALUE BREAKDOWN:</h3>
                    <CollapsibleTrigger className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                      {valueSectionOpen ? 'Show Less ' : 'Show More '}
                      {valueSectionOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="mt-2 space-y-1.5 transition-all duration-300 ease-in-out">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Value:</span>
                      <span className="font-semibold text-lg line-through text-gray-500">
                        {isInView ? <CountUp start={0} end={totalValue} duration={2.5} decimals={2} prefix="€" separator="," /> : "€1,839.96"}
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
                        {isInView ? <CountUp start={0} end={savings} duration={2.5} decimals={2} prefix="€" separator="," /> : "€849.96"}
                      </span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              {/* Additional Value Proposition */}
              <div className="mt-3 space-y-1.5 text-center">
                <p className="text-base font-medium">Would you rather pay for the gym…or OWN it forever?</p>
                <p className="text-base font-bold tracking-wide">
                  GET IT ALL FOR LESS THAN 3 MONTHS WITH A PERSONAL TRAINER.
                </p>
                
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="bg-gray-900 p-4 text-center">
              <Button size="lg" className={cn("bg-yellow hover:bg-yellow-dark text-black px-6 py-4 rounded-full text-lg font-semibold tracking-wide", "transition-all duration-300 hover:shadow-md hover:scale-105", "w-full sm:w-auto")}>
                SECURE YOUR GYM TODAY <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default BundleOffer;