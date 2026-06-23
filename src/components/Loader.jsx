import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Loader = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 2.5 seconds
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2500);

    // Call onComplete after exit animation finishes
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3200); // 2.5s + 0.7s exit animation

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
    >
      {/* Video Background - Full Screen */}
      <motion.video
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/IMG_4136.MOV" type="video/mp4" />
      </motion.video>
    </motion.div>
  );
};

export default Loader;
