
import { useState } from 'react';
import { Mail, Copy, Check, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
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
  
  const openContactDialog = () => {
    setDialogOpen(true);
  };
  
  return (
    <footer className="bg-gray-50 py-4">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <button 
                onClick={openContactDialog}
                className="flex items-center hover:text-yellow transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </button>
              <a 
                href="https://www.facebook.com/FitAnywhereandBoxFun/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-[#1877F2] transition-colors ml-2"
              >
                <Facebook className="w-4 h-4" />
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
    </footer>
  );
};

export default Footer;
