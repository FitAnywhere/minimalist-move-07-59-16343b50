import { useState, useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
interface BundleItem {
  name: string;
  price: string;
  description: string;
  included: boolean;
}
const bundleItems: BundleItem[] = [{
  name: "PowerTower Portable Gym",
  price: "€1299.99",
  description: "The core of your home fitness experience",
  included: true
}, {
  name: "BoxFun Boxing Cap Attachment",
  price: "€69.99",
  description: "Transform your workout with boxing training",
  included: true
}, {
  name: "Premium Elastic Resistance Set",
  price: "€69.99",
  description: "Complete your training arsenal",
  included: true
}, {
  name: "Exclusive Video Tutorial Library",
  price: "Value: €240/year",
  description: "Professional guidance at your fingertips",
  included: true
}, {
  name: "Free Shipping",
  price: "Value: €30",
  description: "Within Amsterdam & Utrecht",
  included: true
}];
const BundleOffer = () => {
  const [showSavings, setShowSavings] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  return <section id="bundle" ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className={cn("text-center transition-all duration-700", isInView ? "opacity-100" : "opacity-0 translate-y-8")}>
            <h2 className="text-black">PRICELESS PORTABLE GYM EXPERIENCE</h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              A complete fitness system designed for the modern minimalist lifestyle
            </p>
          </div>
          
          <div className={cn("mt-12 bg-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-500", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="p-8">
              <div className="space-y-6">
                {bundleItems.map((item, index) => <div key={index} className={cn("flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl transition-all duration-300", "hover:bg-white hover:shadow-sm")} style={{
                animationDelay: `${(index + 1) * 100}ms`
              }}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 rounded-full bg-yellow flex items-center justify-center">
                          <Check className="w-3 h-3 text-black" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 text-right">
                      <span className="font-semibold text-xl">{item.price}</span>
                    </div>
                  </div>)}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className={cn("relative overflow-hidden transition-all duration-500", showSavings ? "max-h-[500px]" : "max-h-0")}>
                  <div className="space-y-4 p-6 bg-white rounded-xl mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Retail Value:</span>
                      <span className="font-semibold">€1709.97</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Your Savings:</span>
                      <span className="font-semibold text-green-600">€710.97</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="text-lg font-medium">Discount:</span>
                      <span className="font-semibold text-green-600">42% OFF</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <button onClick={() => setShowSavings(!showSavings)} className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors mb-4 sm:mb-0">
                    {showSavings ? <>Hide Savings Details <ChevronUp className="ml-1 w-4 h-4" /></> : <>View Savings <ChevronDown className="ml-1 w-4 h-4" /></>}
                  </button>
                  
                  <div className="text-right">
                    <div className="text-xl font-medium text-gray-500 line-through">€1709.97</div>
                    <div className="text-3xl font-bold">€999</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 p-8 text-center">
              <a href="#order" className="inline-flex items-center bg-yellow text-black hover:bg-yellow-dark px-8 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-1 button-glow">
                GET THE COMPLETE BUNDLE NOW
              </a>
              <p className="mt-4 text-sm text-gray-400">Limited stock available for 2025 launch</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default BundleOffer;