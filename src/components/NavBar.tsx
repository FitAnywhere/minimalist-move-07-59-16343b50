import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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

  const navigateToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      const heroElement = document.querySelector('#hero');
      if (heroElement) {
        window.scrollTo({
          top: heroElement.getBoundingClientRect().top + window.scrollY - 100,
          behavior: 'smooth'
        });
      }
    } else {
      navigate('/', { state: { fromExternalPage: true }});
    }
    setIsOpen(false);
  };

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://buy.stripe.com/dR600qaRv29ScE05kt', '_blank');
  };

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a 
          href="/"
          className="text-2xl font-bold tracking-tighter transition-all relative z-50"
          onClick={navigateToHome}
        >
          <span>Fit</span>
          <span className="text-yellow">Anywhere</span>
        </a>

        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-medium text-sm hover:text-yellow transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-0 after:bg-yellow after:transition-all after:duration-300 hover:after:w-full"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick(link.href);
              }}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-4">
            <a
              href="https://buy.stripe.com/4gw7sS8Jn5m4dI43ck"
              className="bg-black text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-black/90 transition-all hover-lift"
              onClick={handleCheckout}
            >
              ORDER NOW
            </a>
            <a 
              href="https://wa.me/38668154199" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-2.5 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <img 
                src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744737020/Screenshot_2-removebg-preview_1_zqxayk.png"
                alt="Contact us on WhatsApp"
                className="w-6 h-6 object-contain"
              />
            </a>
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

      {isOpen && (
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
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-medium text-lg py-3 border-b border-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick(link.href);
                }}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 space-y-4">
              <a
                href="https://buy.stripe.com/4gw7sS8Jn5m4dI43ck"
                className="block w-full bg-black text-white text-center px-6 py-3 rounded-full font-medium hover:bg-black/90 transition-all"
                onClick={handleCheckout}
              >
                ORDER NOW
              </a>
              <a 
                href="https://wa.me/38668154199" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 text-white text-center px-6 py-3 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <img 
                  src="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744737020/Screenshot_2-removebg-preview_1_zqxayk.png"
                  alt="Contact us on WhatsApp"
                  className="w-6 h-6 object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
