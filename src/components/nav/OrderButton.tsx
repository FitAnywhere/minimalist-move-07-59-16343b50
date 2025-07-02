
import { useLocation } from 'react-router-dom';
import { scrollToElement } from '@/utils/scrollUtils';

interface OrderButtonProps {
  className?: string;
  onMenuClose?: () => void;
}

export const OrderButton = ({ className = "", onMenuClose }: OrderButtonProps) => {
  const location = useLocation();
  
  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Close mobile menu first if callback provided
    if (onMenuClose) {
      onMenuClose();
    }
    
    // Wait a bit for menu to close, then scroll to pricing carousel
    setTimeout(() => {
      // Look for the pricing component specifically within the bundle section
      const pricingElement = document.querySelector('#bundle .max-w-3xl') || 
                           document.querySelector('[class*="pricing"]') ||
                           document.querySelector('#bundle');
      
      if (pricingElement) {
        // Calculate offset to land on the carousel, not section top
        const elementRect = pricingElement.getBoundingClientRect();
        const offsetTop = elementRect.top + window.scrollY - 100; // Less offset to show carousel
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      } else {
        // Fallback to bundle section with adjusted offset
        scrollToElement('#bundle', 50);
      }
    }, 100);
  };

  return (
    <a
      href="#"
      className={`bg-black text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-black/90 transition-all hover-lift ${className}`}
      onClick={handleOrderClick}
    >
      ORDER NOW
    </a>
  );
};
