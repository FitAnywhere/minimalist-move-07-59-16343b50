
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './nav/Logo';
import { NavLinks, NavLink } from './nav/NavLinks';
import { OrderButton } from './nav/OrderButton';
import { MobileMenu } from './nav/MobileMenu';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleNavLinkClick = (href: string, type: string) => {
    setIsOpen(false);

    if (type === 'page') {
      navigate(href);
      return;
    }

    // Only handle section scrolling if we're on the right page
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const navLinks: NavLink[] = [
    { name: "STRENGTH", href: "/", type: "page" },
    { name: "CARDIO", href: "/box", type: "page" },
    { name: "FAQ", href: "#faq", type: "section" }
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo onNavigate={() => setIsOpen(false)} />

        <NavLinks
          links={navLinks}
          onNavLinkClick={handleNavLinkClick}
          className="hidden md:flex items-center space-x-10"
        />

        <div className="hidden md:block">
          <OrderButton />
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
