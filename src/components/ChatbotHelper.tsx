
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { rafThrottle } from '@/utils/eventOptimizers';

const ChatbotHelper = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [chatbotLoaded, setChatbotLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Only schedule popup after at least 20 seconds of engagement
    const schedulePopup = () => {
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
    
    // Wait for idle callback to schedule non-critical initialization
    if (window.requestIdleCallback) {
      requestIdleCallback(() => schedulePopup(), { timeout: 5000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(schedulePopup, 5000);
    }
    
    // Setup intersection observer for viewport detection
    const observer = new IntersectionObserver(
      rafThrottle(entries => {
        const [entry] = entries;
        if (entry.isIntersecting && !chatbotLoaded) {
          loadChatbot();
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px 300px 0px' }
    );
    
    // Observe the document body to detect when we're near the bottom
    observer.observe(document.body);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      observer.disconnect();
    };
  }, [chatbotLoaded]);
  
  // Load the chatbot only when needed
  const loadChatbot = () => {
    if (chatbotLoaded) return;
    setChatbotLoaded(true);
    
    // Check if Voiceflow script is already loaded in index.html
    if (window.voiceflow && window.voiceflow.chat) return;
    
    // Otherwise, load it manually
    (function(d, t) {
      const v = d.createElement(t) as HTMLScriptElement; // Fix: Cast to HTMLScriptElement
      const s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        if (window.voiceflow && window.voiceflow.chat) {
          window.voiceflow.chat.load({
            verify: { projectID: '67eb8f96dd5fb1db6bcdae42' },
            url: "https://general-runtime.voiceflow.com",
            versionID: "production",
            voice: {
              url: "https://runtime-api.voiceflow.com"
            }
          });
        }
      };
      v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; 
      v.type = "text/javascript"; 
      s.parentNode.insertBefore(v, s);
    })(document, 'script');
  };

  const handleAskClick = () => {
    // Load chatbot if not already loaded
    if (!chatbotLoaded) {
      loadChatbot();
    }
    
    // Add small delay to ensure widget is initialized
    setTimeout(() => {
      if (window.voiceflow && window.voiceflow.chat && typeof window.voiceflow.chat.open === 'function') {
        window.voiceflow.chat.open();
      }
    }, 300);
    
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
          aria-label="Close help prompt"
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
