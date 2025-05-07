import { useRef } from 'react';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';
import VideoPlayer from "@/components/ui/VideoPlayer";
const GymVideoSection = () => {
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const isVideoInView = useInView(videoSectionRef, {
    threshold: 0.3
  });
  return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={videoSectionRef} className={cn("transition-all duration-700", isVideoInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
            <h3 className="text-center text-xl md:text-2xl font-medium text-gray-800 mb-6">IT'S SIMPLER THAN YOU THINK</h3>
            <div className="w-full md:w-[65%] mx-auto">
              <div className="aspect-video overflow-hidden rounded-xl shadow-md">
                <VideoPlayer src="/Results.mp4" poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1746587883/readyy_j46izj.png" aspectRatio="video" autoPlay={isVideoInView} muted={true} loop={true} controls={false} preload="metadata" playMode="onView" showHeroVolumeControl={false} className="w-full" />
              </div>
            </div>
            
            <h3 className="text-center text-xl md:text-2xl font-medium text-gray-800 mt-8">YOU ONLY NEED TO CHOOSE ONCE</h3>
          </div>
        </div>
      </div>
    </section>;
};
export default GymVideoSection;