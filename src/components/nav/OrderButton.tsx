
interface OrderButtonProps {
  className?: string;
}

export const OrderButton = ({ className = "" }: OrderButtonProps) => {
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/eVa28y4t7cOw33qeVa', '_blank');
  };

  return (
    <a
      href="https://buy.stripe.com/eVa28y4t7cOw33qeVa"
      className={`bg-black text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-black/90 transition-all hover-lift ${className}`}
      onClick={handleCheckout}
    >
      ORDER NOW
    </a>
  );
};
