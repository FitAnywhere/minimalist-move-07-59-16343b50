
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ChatbotHelper = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Hide popup after 13 seconds (3s delay + 10s visibility)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 13000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleAskClick = () => {
    if (window.voiceflow && window.voiceflow.chat && typeof window.voiceflow.chat.open === 'function') {
      window.voiceflow.chat.open();
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-8 z-50 max-w-[220px] animate-fade-in">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 relative">
        <div className="text-center">
          <h4 className="font-bold mb-2">Need help?</h4>
          <Button 
            onClick={handleAskClick}
            className="bg-yellow hover:bg-yellow/90 text-black text-sm w-full mb-1"
          >
            Ask me anything
          </Button>
        </div>
        
        {/* Arrow pointing down to the chatbot widget */}
        <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        <div className="absolute -bottom-[14px] right-[31px] w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-200"></div>
      </div>
    </div>
  );
};

export default ChatbotHelper;
