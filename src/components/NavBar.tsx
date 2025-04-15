
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Logo } from './nav/Logo';
import { NavLinks } from './nav/NavLinks';
import { WhatsAppButton } from './nav/WhatsAppButton';
import { OrderButton } from './nav/OrderButton';
import { MobileMenu } from './nav/MobileMenu';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavLinkClick = (href: string) => {
    setIsOpen(false);

    if (isHomePage) {
      const element = document.querySelector(href);
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 100,
            behavior: 'smooth'
          });
          
          history.pushState(null, '', href);
        }, 100);
      }
    } else {
      navigate('/', { 
        state: { 
          fromExternalPage: true,
          targetSection: href.substring(1)
        }
      });
    }
  };

  const navLinks = [
    { name: "GYM", href: "#bundle", section: "LAST GYM YOU WILL EVER NEED" },
    { name: "BOX", href: "#workout-addict", section: "BOXFUN" },
    { name: "FAQ", href: "#faq", section: "FREQUENTLY ASKED QUESTIONS" }
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo isHomePage={isHomePage} onNavigate={() => setIsOpen(false)} />

        <NavLinks
          links={navLinks}
          onNavLinkClick={handleNavLinkClick}
          className="hidden md:flex items-center space-x-10"
        />

        <div className="hidden md:block">
          <div className="flex items-center gap-4">
            <OrderButton />
            <WhatsAppButton />
          </div>
        </div>

        <button 
          className="md:hidden text-black relative z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <MobileMenu
        isOpen={isOpen}
        links={navLinks}
        onNavLinkClick={handleNavLinkClick}
      />
    </nav>
  );
};

export default NavBar;
