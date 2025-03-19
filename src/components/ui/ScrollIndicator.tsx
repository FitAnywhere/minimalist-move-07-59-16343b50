
import { motion } from "framer-motion";

const ScrollIndicator = () => (
  <motion.div 
    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
    animate={{ y: [0, 10, 0] }}
    transition={{ 
      duration: 1.5, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    <div className="w-6 h-10 rounded-full border-2 border-black/30 flex items-start justify-center">
      <motion.div 
        className="w-1.5 h-3 bg-black/30 rounded-full mt-2"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
  </motion.div>
);

export default ScrollIndicator;
