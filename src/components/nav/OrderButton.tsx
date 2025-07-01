
import { useLocation } from 'react-router-dom';
import { scrollToElement } from '@/utils/scrollUtils';

interface OrderButtonProps {
  className?: string;
}

export const OrderButton = ({ className = "" }: OrderButtonProps) => {
  const location = useLocation();
  
  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToElement('#bundle', 80);
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
