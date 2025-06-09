
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
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 text-center">
            WHY AVERAGE MEN NEVER START
          </h2>
          
          <div className="space-y-4 text-black leading-relaxed">
            <p>He opens the gym app.</p>
            <p>Closes it.</p>
            <p>Opens a video.</p>
            <p>Scrolls past it.</p>
            <p>He thinks, "Tomorrow."</p>
            
            <br />
            
            <p>He's not lazy.</p>
            <p><strong>He's ashamed.</strong></p>
            
            <br />
            
            <p>Ashamed of the belly.</p>
            <p>The soft arms.</p>
            <p>The idea of walking into a gym and being the weakest man in the room.</p>
            
            <br />
            
            <p>So he waits.</p>
            
            <br />
            
            <p>But here's the truth:</p>
            <p>No one starts strong.</p>
            <p>No one looks good at the beginning.</p>
            <p>And the ones who do?</p>
            <p>They've already trained in silence — day after day — while you were still waiting to feel ready.</p>
            
            <br />
            
            <p><strong>Read this twice:</strong></p>
            
            <br />
            
            <p><em>Average men wait to feel ready.</em></p>
            <p><em>Exceptional men move anyway.</em></p>
            
            <br />
            
            <p>That's the difference.</p>
            <p>Not genetics. Not luck.</p>
            <p><strong>Courage in private.</strong></p>
            
            <br />
            
            <p>You don't need motivation.</p>
            <p>You need a place to begin — without eyes, mirrors, noise, or judgment.</p>
            
            <br />
            
            <p>Build quietly.</p>
            <p>Return loudly.</p>
            <p><strong>Be the man they don't recognize.</strong></p>
            
            <br />
            
            <p>Average men never start.</p>
            <p><strong>That's why you must.</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyAverageMenModal;
