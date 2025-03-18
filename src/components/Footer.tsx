
import { useState, useEffect } from 'react';
import { Mail, ArrowUp, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
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
  
  const copyEmail = () => {
    navigator.clipboard.writeText('be@fitanywhere.today');
    setCopied(true);
    toast({
      title: "Email copied to clipboard",
      description: "You can now paste it wherever you need",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <footer className="bg-gray-50 py-4">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-6 text-sm">
            <button 
              onClick={() => setDialogOpen(true)}
              className="flex items-center hover:text-yellow transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </button>
            
            <div className="text-gray-500 order-last md:order-none">
              © 2025 FitAnywhere. All rights reserved.
            </div>
            
            <Link to="/terms-of-service" className="hover:text-yellow transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      
      {/* Contact Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Contact Information</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 p-6">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
              <span className="text-lg">be@fitanywhere.today</span>
            </div>
            
            <Button 
              onClick={copyEmail}
              className="flex items-center gap-2 mt-2"
              variant="outline"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy to clipboard
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
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
