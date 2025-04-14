
import { RefreshCw } from 'lucide-react';

interface VideoErrorStateProps {
  onRetry: () => void;
}

const VideoErrorState = ({ onRetry }: VideoErrorStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
      <div className="flex flex-col items-center justify-center space-y-3">
        <p className="text-white text-center">Video could not be loaded</p>
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-yellow text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors"
          aria-label="Retry loading video"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Video</span>
        </button>
      </div>
    </div>
  );
};

export default VideoErrorState;
