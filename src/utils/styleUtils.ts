
/**
 * Utility for managing dynamic styles
 */

// Standard keyframes and animations to be applied to the document
export const addScaleKeyframes = (): void => {
  if (typeof document === 'undefined' || document.querySelector('#scale-keyframes')) {
    return; // Don't add if already exists or not in browser
  }
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'scale-keyframes';
  styleSheet.textContent = `
    @keyframes scale {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    
    .scale-animation {
      animation: scale 8s ease-in-out infinite;
    }
    
    @keyframes pulse-yellow {
      0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
    }
    
    .button-retry-pulse {
      animation: pulse-yellow 2s infinite;
    }
    
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
    
    @keyframes slide-down {
      from { max-height: 0; opacity: 0; }
      to { max-height: 1000px; opacity: 1; }
    }
    
    .animate-slide-down {
      animation: slide-down 0.4s ease-out forwards;
      overflow: hidden;
    }
  `;
  
  // Use requestIdleCallback to add styles when browser is idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      document.head.appendChild(styleSheet);
    });
  } else {
    // Fallback for browsers not supporting requestIdleCallback
    setTimeout(() => {
      document.head.appendChild(styleSheet);
    }, 100);
  }
};

// Target section image styling
export const addTargetSectionStyles = (): void => {
  if (typeof document === 'undefined' || document.querySelector('#target-section-styles')) {
    return; // Don't add if already exists or not in browser
  }
  
  const styleEl = document.createElement('style');
  styleEl.id = 'target-section-styles';
  styleEl.textContent = `
    @media (min-width: 768px) {
      #target-section .user-image-container img {
        height: 330px !important;
        width: auto !important;
      }
    }
    
    @media (max-width: 767px) {
      #target-section .user-image-container img {
        height: 240px !important;
        width: auto !important;
      }
    }
    
    /* Testimonial Styles for improved positioning */
    #testimonials-third .testimonial-dots {
      margin-top: 0.5rem !important;
    }
    
    /* Change active dot color to yellow */
    #testimonials-third .bg-black.rounded-full,
    #reviews .testimonial-dots .active-dot {
      background-color: #FFD700 !important;
    }
  `;
  
  // Use requestIdleCallback to add styles when browser is idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      document.head.appendChild(styleEl);
    });
  } else {
    // Fallback for browsers not supporting requestIdleCallback
    setTimeout(() => {
      document.head.appendChild(styleEl);
    }, 200);
  }
};

// Initialize all styles
export const initStyles = (): void => {
  if (typeof window === 'undefined') return;
  
  // Add styles during idle time or after initial render
  if (document.readyState === 'complete') {
    setTimeout(() => {
      addScaleKeyframes();
      addTargetSectionStyles();
    }, 300);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        addScaleKeyframes();
        addTargetSectionStyles();
      }, 300);
    });
  }
};
