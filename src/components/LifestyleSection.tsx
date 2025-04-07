
import { useRef, useEffect, useState } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Rocket, ChevronRight, ChevronDown, X, Loader } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

const LifestyleSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-8">
            LIFESTYLE SECTION PLACEHOLDER
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            This section is a placeholder, as the content has been moved to the WorkoutAddictSection component.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
