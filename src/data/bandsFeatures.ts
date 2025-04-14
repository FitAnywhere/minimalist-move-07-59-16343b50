
import { Flame, Backpack, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface BandsFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const bandsFeatures: BandsFeature[] = [{
  title: "10x MORE EXERCISES",
  description: "Push past plateaus, and keep progressing.",
  icon: Flame
}, {
  title: "SUPPORT WHEN NEEDED",
  description: "Unfold, clip in, and train—whether at home or on the go.",
  icon: Backpack
}, {
  title: "CHALLENGE WHEN READY",
  description: "From first reps to peak performance—bands move with you.",
  icon: Zap
}];
