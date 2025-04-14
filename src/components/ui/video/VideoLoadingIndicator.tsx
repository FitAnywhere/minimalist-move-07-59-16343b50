
import { Loader } from 'lucide-react';

interface VideoLoadingIndicatorProps {
  retryCount?: number;
  maxRetries?: number;
}

const VideoLoadingIndicator = ({ retryCount = 0, maxRetries = 3 }: VideoLoadingIndicatorProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-yellow/30 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-8 h-8 text-yellow animate-spin" />
          </div>
        </div>
        <p className="text-white text-sm font-medium">Loading video...</p>
        {retryCount > 0 && (
          <p className="text-yellow-400 text-xs mt-1">
            Retry {retryCount}/{maxRetries}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoLoadingIndicator;
