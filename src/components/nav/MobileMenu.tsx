
import { NavLinks } from './NavLinks';
import { WhatsAppButton } from './WhatsAppButton';
import { OrderButton } from './OrderButton';

interface MobileMenuProps {
  isOpen: boolean;
  links: Array<{ name: string; href: string; section: string; }>;
  onNavLinkClick: (href: string) => void;
}

export const MobileMenu = ({ isOpen, links, onNavLinkClick }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 pt-[73px] bg-white z-40 md:hidden"
      style={{ 
        backgroundColor: "white",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: "100vh",
        overflowY: "auto"
      }}
    >
      <div className="flex flex-col space-y-4 px-6 py-8">
        <NavLinks
          links={links}
          onNavLinkClick={onNavLinkClick}
          className="flex flex-col space-y-6 items-center text-lg"
        />
        <div className="pt-4 space-y-4">
          <OrderButton className="block w-full text-center" />
          <WhatsAppButton showText className="w-full" />
        </div>
      </div>
    </div>
  );
};
