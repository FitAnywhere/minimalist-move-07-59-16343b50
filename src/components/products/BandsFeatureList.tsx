
import { useRef } from 'react';
import { useInView } from '@/utils/animations';
import { bandsFeatures } from '@/data/bandsFeatures';
import FeatureItem from './FeatureItem';

interface BandsFeatureListProps {
  isMobile: boolean;
}

const BandsFeatureList = ({ isMobile }: BandsFeatureListProps) => {
  const bandsTextRef = useRef<HTMLDivElement>(null);
  const isBandsTextInView = useInView(bandsTextRef, {
    threshold: 0.2
  });

  return (
    <div className={`space-y-6 ${isMobile ? "order-2" : "order-1"}`}>
      <div ref={bandsTextRef} className="relative space-y-2 mb-6">
        <h3 className="text-xl md:text-2xl font-bold mb-6 leading-tight tracking-wider" style={{
          background: 'linear-gradient(to bottom, #E6B800, #000000)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          letterSpacing: "1.5px"
        }}>
          ADAPTIVE FOR EVERY LEVEL
        </h3>
      </div>
      
      <div className="space-y-8 mb-6 relative z-10 my-[69px] py-[35px] px-0 mx-0">
        {bandsFeatures.map((feature, index) => (
          <FeatureItem key={index} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
};

export default BandsFeatureList;
