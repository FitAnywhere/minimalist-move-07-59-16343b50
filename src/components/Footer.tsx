
import { useState, useEffect } from 'react';
import { Mail, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-gray-50 py-4">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <a href="mailto:be@fitanywhere.today" className="flex items-center hover:text-yellow transition-colors">
              <Mail className="w-4 h-4 mr-2" />
              be@fitanywhere.today
            </a>
            
            <div className="text-gray-500">
              © 2025 FitAnywhere. All rights reserved.
            </div>
            
            <Link to="/terms-of-service" className="hover:text-yellow transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      <button 
        onClick={scrollToTop} 
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-yellow shadow-lg flex items-center justify-center hover:bg-yellow-dark transition-all z-50 focus:outline-none ${
          showScrollToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`} 
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-black" />
      </button>
    </footer>
  );
};

export default Footer;
