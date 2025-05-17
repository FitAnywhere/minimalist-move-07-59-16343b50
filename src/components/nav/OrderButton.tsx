
import { useLocation } from 'react-router-dom';

interface OrderButtonProps {
  className?: string;
}

export const OrderButton = ({ className = "" }: OrderButtonProps) => {
  const location = useLocation();
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use the same URL for both routes as requested
    window.open('https://buy.stripe.com/14AcN53hpdPBgmT0Ns6Na0l', '_blank');
  };

  return (
    <a
      href="#"
      className={`bg-black text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-black/90 transition-all hover-lift ${className}`}
      onClick={handleCheckout}
    >
      ORDER NOW
    </a>
  );
};
