
import { motion } from "framer-motion";

const ScrollIndicator = () => (
  <motion.div 
    className="absolute bottom-10 left-1/2 transform -translate-x-1/2" 
    animate={{
      y: [0, 10, 0]
    }} 
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {/* Simplified indicator for faster initial render */}
  </motion.div>
);

export default ScrollIndicator;
