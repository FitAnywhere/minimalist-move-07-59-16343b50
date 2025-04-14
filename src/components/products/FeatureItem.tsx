
import { cn } from '@/lib/utils';
import { BandsFeature } from '@/data/bandsFeatures';

interface FeatureItemProps {
  feature: BandsFeature;
  index: number;
}

const FeatureItem = ({ feature, index }: FeatureItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <span
        className="text-transparent bg-gradient-to-b from-yellow-dark to-black bg-clip-text font-medium"
        style={{
          letterSpacing: "1px"
        }}
      >
        -
      </span>
      <p
        className="text-gray-800 text-lg font-medium tracking-wide"
        style={{
          letterSpacing: "1.2px",
          color: "#333333"
        }}
      >
        {feature.title}
      </p>
    </div>
  );
};

export default FeatureItem;
