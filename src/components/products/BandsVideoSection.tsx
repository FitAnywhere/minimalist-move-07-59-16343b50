
import { useRef } from 'react';
import { useInView } from '@/utils/animations';
import VideoPlayer from '@/components/ui/VideoPlayer';

interface BandsVideoSectionProps {
  isMobile: boolean;
}

const BandsVideoSection = ({ isMobile }: BandsVideoSectionProps) => {
  const bandsVideoRef = useRef<HTMLDivElement>(null);
  const isBandsVideoInView = useInView(bandsVideoRef, {
    threshold: 0.3
  });

  return (
    <div ref={bandsVideoRef} className={`transition-all duration-700 ${isMobile ? "order-1" : "order-2"}`}>
      <div className="w-full h-full overflow-hidden relative" style={{
        maxWidth: '80%',
        margin: '0 auto'
      }}>
        <div className="rounded-2xl overflow-hidden">
          <VideoPlayer 
            src="/114 Trxbands 11044.mp4"
            poster="https://res.cloudinary.com/dxjlvlcao/image/upload/f_auto,q_auto/v1744112763/bandds_u9bzkl.png"
            aspectRatio="portrait"
            autoPlay={isBandsVideoInView}
            muted={true}
            loop={true}
            playMode="onView"
            width={400}
            height={720}
            preload="none"
          />
        </div>
      </div>
    </div>
  );
};

export default BandsVideoSection;
