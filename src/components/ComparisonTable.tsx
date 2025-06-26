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
  
  return (
    <div className="w-full max-w-5xl mx-auto mb-16">
      <div className={`${borderClass} border-black rounded-xl overflow-hidden shadow-md`}>
        {/* Header */}
        <div className="grid grid-cols-2 border-b-2 border-black">
          <div className="py-4 px-6 text-center font-bold bg-gray-700 text-yellow-300">
            CHOOSE US (€699)
          </div>
          <div className="py-4 px-6 text-center font-bold border-l-2 border-black bg-gray-700 text-yellow-300">
            Home Park (€3,500+)
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="divide-y-2 divide-black">
          {/* Beginner Usage Row */}
          <div className="grid grid-cols-2">
            <div className="flex items-center justify-center gap-2 p-4">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-sm md:text-base whitespace-nowrap">Beginner-friendly</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 border-l-2 border-black">
              <X className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-sm md:text-base whitespace-nowrap">Overwhelming</span>
            </div>
          </div>

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

      {/* New bold text below comparison table */}
      <div className="text-center mt-8 mb-4">
        <p className="text-lg md:text-xl font-bold text-gray-900">
          Most people rent their strength. You can buy yours — forever.
        </p>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-12 mb-4">
        <div className="flex justify-center">
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
