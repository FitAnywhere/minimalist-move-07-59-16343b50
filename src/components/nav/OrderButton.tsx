
import { useLocation } from 'react-router-dom';

interface OrderButtonProps {
  className?: string;
}

export const OrderButton = ({ className = "" }: OrderButtonProps) => {
  const location = useLocation();
  
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = location.pathname === '/box' 
      ? 'https://buy.stripe.com/7sIdTg8G31b720U14k'
      : 'https://buy.stripe.com/00gaF43p38yg0Vi7sM';
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
