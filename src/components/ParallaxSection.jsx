import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxSection = ({ background, midground, foreground, className = '', index }) => {
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Different transform values for each layer
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);
  const backgroundBlur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 3]);
  
  const midgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div 
      ref={sectionRef}
      className={`sticky top-0 h-screen w-full overflow-hidden ${className}`}
      style={{ zIndex: index }}
    >
      {/* Background Layer */}
      <motion.div
        style={{ 
          y: backgroundY,
          scale: backgroundScale,
        }}
        className="absolute inset-0 z-0"
      >
        <motion.div 
          style={{ filter: useTransform(backgroundBlur, (v) => `blur(${v}px)`) }}
          className="w-full h-full"
        >
          {background}
        </motion.div>
      </motion.div>

      {/* Midground Layer */}
      <motion.div
        style={{ y: midgroundY }}
        className="absolute inset-0 z-10"
      >
        {midground}
      </motion.div>

      {/* Foreground Layer */}
      <motion.div
        style={{ y: foregroundY }}
        className="absolute inset-0 z-20"
      >
        {foreground}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;
