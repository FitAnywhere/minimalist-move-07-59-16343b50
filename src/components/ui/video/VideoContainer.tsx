
import { useRef } from 'react';

interface VideoContainerProps {
  aspectRatio?: string;
  className?: string;
  children: React.ReactNode;
}

const VideoContainer = ({ aspectRatio = '16:9', className = '', children }: VideoContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle aspect ratio calculation
  const getAspectRatioPadding = () => {
    if (!aspectRatio) return '56.25%'; // Default to 16:9
    
    const [width, height] = aspectRatio.split(':').map(Number);
    if (!width || !height) return '56.25%';
    
    return `${(height / width) * 100}%`;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        style={{ paddingBottom: getAspectRatioPadding() }}
        className="relative w-full"
      >
        <div 
          ref={containerRef} 
          className="absolute inset-0 bg-black overflow-hidden"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
