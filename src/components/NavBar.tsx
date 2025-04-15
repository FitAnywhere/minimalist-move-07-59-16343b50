import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Menu, X, MessageCircle } from 'lucide-react';
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
              className="bg-green-500 text-white px-6 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
              aria-label="Contact us on WhatsApp"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="white"
                className="min-w-5 min-h-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
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
                className="block w-full bg-green-500 text-white text-center px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                aria-label="Contact us on WhatsApp"
              >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="white"
                className="min-w-5 min-h-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
