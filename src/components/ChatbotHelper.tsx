
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatbotHelper = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [chatbotReady, setChatbotReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Check if Voiceflow is loaded
    const checkVoiceflowLoaded = () => {
      if (window.voiceflow && window.voiceflow.chat) {
        setChatbotReady(true);
        return true;
      }
      return false;
    };
    
    // If Voiceflow isn't immediately available, set up a checker
    if (!checkVoiceflowLoaded()) {
      const voiceflowChecker = setInterval(() => {
        if (checkVoiceflowLoaded()) {
          clearInterval(voiceflowChecker);
        }
      }, 1000);
      
      // Clean up interval
      return () => clearInterval(voiceflowChecker);
    }
    
    return undefined;
  }, []);
  
  useEffect(() => {
    // Only schedule popup if chatbot is ready
    if (!chatbotReady) return undefined;
    
    // Use requestIdleCallback to schedule non-critical initialization
    const schedulePopup = () => {
      // Show popup after 20 seconds (when user has had time to engage with the page)
      timerRef.current = setTimeout(() => {
        // Only show if the user hasn't scrolled to the bottom yet
        if (window.scrollY < document.body.scrollHeight - window.innerHeight * 1.5) {
          setIsVisible(true);
        }
        
        // Hide popup after 6 seconds
        timerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 6000);
      }, 20000);
    };
    
    if (window.requestIdleCallback) {
      requestIdleCallback(() => schedulePopup(), { timeout: 5000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(schedulePopup, 2000);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [chatbotReady]);

  const handleAskClick = () => {
    if (chatbotReady && window.voiceflow && window.voiceflow.chat && typeof window.voiceflow.chat.open === 'function') {
      window.voiceflow.chat.open();
    }
    setIsVisible(false);
    
    // Clear any pending timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    
    // Clear any pending timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-8 z-50 max-w-[200px] animate-fade-in">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 relative">
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 rounded-full p-1"
        >
          <X className="w-3 h-3" />
        </button>
        
        <div className="text-center">
          <h4 className="font-bold mb-1 text-sm">Need help?</h4>
          <Button 
            onClick={handleAskClick}
            className="bg-yellow hover:bg-yellow/90 text-black text-xs w-full mb-1"
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
