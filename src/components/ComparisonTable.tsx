
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const ComparisonTable = () => {
  const isMobile = useIsMobile();
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/eVa28y4t7cOw33qeVa', '_blank');
  };
  const borderClass = isMobile ? "border-2" : "border";
  
  return <div className="w-full max-w-5xl mx-auto mb-16">
      <div className={`${borderClass} border-black rounded-xl overflow-hidden shadow-md`}>
        {/* Header */}
        <div className="grid grid-cols-2 bg-gray-50 border-b-2 border-black">
          <div className="py-4 px-6 text-center font-bold">
            FitAnywhere (€990)
          </div>
          <div className="py-4 px-6 text-center font-bold border-l-2 border-black">
            Home Park (€5,000+)
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="divide-y-2 divide-black">
          {/* Built For Row */}
          <div className="grid grid-cols-2">
            <div className="flex items-center justify-center gap-2 p-4">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-sm md:text-base whitespace-nowrap">Indoor & Outdoor</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 border-l-2 border-black">
              <X className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-sm md:text-base whitespace-nowrap">Outdoor only</span>
            </div>
          </div>

          {/* Setup Time Row */}
          <div className="grid grid-cols-2">
            <div className="flex items-center justify-center gap-2 p-4">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-sm md:text-base whitespace-nowrap">2-min setup</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 border-l-2 border-black">
              <X className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-sm md:text-base whitespace-nowrap">Days to weeks</span>
            </div>
          </div>

          {/* Space Needed Row */}
          <div className="grid grid-cols-2">
            <div className="flex items-center justify-center gap-2 p-4">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-sm md:text-base whitespace-nowrap">1m² needed</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 border-l-2 border-black">
              <X className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-sm md:text-base whitespace-nowrap">9m²+ needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-12 mb-4">
        <p className="text-gray-700 mb-4 text-lg font-medium">Why make more sense than a gym membership?</p>
        
        <div className="flex justify-center">
          <Button variant="secondary" onClick={handleCTAClick}>
            Learn More
          </Button>
        </div>
      </div>
    </div>;
};
export default ComparisonTable;

