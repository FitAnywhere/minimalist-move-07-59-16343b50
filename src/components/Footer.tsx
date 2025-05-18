
import { useState } from 'react';
import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WhatsAppButton } from "@/components/nav/WhatsAppButton";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-4">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <WhatsAppButton showText={true} className="bg-transparent hover:bg-transparent text-gray-700 hover:text-yellow p-0 px-0 py-0" />
              <a 
                href="https://www.instagram.com/fitanywhere.today" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-[#E1306C] transition-colors ml-2"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            
            <div className="text-gray-500 order-last md:order-none">
              © 2025 FitAnywhere. All rights reserved.
            </div>
            
            <Link to="/terms-of-service" className="hover:text-yellow transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
