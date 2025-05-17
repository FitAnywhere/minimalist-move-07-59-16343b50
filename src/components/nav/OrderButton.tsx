
import { useLocation } from 'react-router-dom';

interface OrderButtonProps {
  className?: string;
}

export const OrderButton = ({ className = "" }: OrderButtonProps) => {
  const location = useLocation();
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Updated to use the new URL for both routes
    const url = location.pathname === '/box' 
      ? 'https://buy.stripe.com/14AcN53hpdPBgmT0Ns6Na0l' // Updated for BOX page
      : 'https://buy.stripe.com/14AcN53hpdPBgmT0Ns6Na0l'; // Updated for GYM page
    window.open(url, '_blank');
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
