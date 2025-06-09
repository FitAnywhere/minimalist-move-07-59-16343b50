import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhyAverageMenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhyAverageMenModal = ({ isOpen, onClose }: WhyAverageMenModalProps) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto",
          "w-full max-w-2xl mx-4",
          "md:mx-8"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-600 hover:text-yellow" />
        </button>

        {/* Modal content */}
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 text-center uppercase">
            THE REALITY
          </h2>
          
          <div className="space-y-4 text-black leading-relaxed">
            <br /><br />
            
            <p>Here's the truth:</p>
            <br />
            <p>No one starts strong.</p>
            <br />
            <p>No one looks good at the beginning.</p>
            <br />
            <p>And the ones who do?</p>
            <br />
            <p>They've already trained in silence — day after day — while you were still waiting to feel ready.</p>
            
            <br /><br />
            
            <p>Read this twice:</p>
            
            <br /><br />
            
            <p><em>Average men wait to feel ready.</em></p>
            <br />
            <p><em>Exceptional men move anyway.</em></p>
            
            <br /><br />
            
            <p>That's the difference.</p>
            <br />
            <p>Not genetics. Not luck.</p>
            
            <br /><br /><br />
            
            <p>You don't need motivation.</p>
            <br />
            <p>You need a place to begin — without eyes, mirrors, noise, or judgment.</p>
            
            <br /><br />
            
            <p>Build quietly.</p>
            <br />
            <p>Return loudly.</p>
            <br />
            <p><strong>Be the man they don't recognize.</strong></p>
            
            <br /><br />
            
            <p>Average men never start.</p>
            <br />
            <p><strong>That's why you must.</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyAverageMenModal;
