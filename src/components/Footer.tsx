
import { useState, useEffect } from 'react';
import { Mail, ArrowUp } from 'lucide-react';

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
    <footer className="bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center">
              <a href="mailto:be@fitanywhere.today" className="flex items-center hover:text-yellow transition-colors">
                <Mail className="w-4 h-4 mr-2" />
                be@fitanywhere.today
              </a>
            </div>
          </div>
          
          <div className="flex justify-center items-center text-sm text-gray-500">
            <div>© 2025 FitAnywhere. All rights reserved.</div>
            <div className="ml-6">
              <a href="#" className="hover:text-yellow transition-colors">Terms of Service</a>
            </div>
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
