
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const LimitedOfferSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          LIMITED OFFER
        </h2>
        
        <p className="text-center text-lg mb-8">
          Enjoy a free BoxFun when you order FitAnywhere today!
        </p>
        
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border p-6 relative">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/5674e2d3-4555-44c0-9678-d8979c00db0f.png" 
              alt="BoxFun with red cap and tennis ball" 
              className="w-full max-w-[256px] h-auto"
            />
          </div>
          
          <h3 className="text-center font-bold text-xl mb-6">
            BOXFUN - 50X GIVEAWAY
          </h3>
          
          <button className="absolute top-1/2 -translate-y-1/2 -left-4 bg-yellow text-black rounded-full p-1">
            <ChevronLeft size={24} />
          </button>
          <button className="absolute top-1/2 -translate-y-1/2 -right-4 bg-yellow text-black rounded-full p-1">
            <ChevronRight size={24} />
          </button>
        </div>
        
        <p className="text-center mt-6 mb-4">
          Secure yours, before we sell out
        </p>
        
        <div className="flex justify-center">
          <Button 
            variant="yellow" 
            size="lg"
            className="font-bold rounded-full"
          >
            €990 + FREE BoxFun!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LimitedOfferSection;
