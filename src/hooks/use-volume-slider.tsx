
import { useState, useRef, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

export function useVolumeSlider() {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleVolumeToggle = () => {
    setShowVolumeSlider(true);
    
    if (isMobile) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setShowVolumeSlider(false);
      }, 1000);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowVolumeSlider(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowVolumeSlider(false);
    }
  };

  return {
    showVolumeSlider,
    handleVolumeToggle,
    handleMouseEnter,
    handleMouseLeave
  };
}
