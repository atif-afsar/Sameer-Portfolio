import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

const DISPLAY_MS = 2200;
const EXIT_MS = 700;

const Loader = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current || !onComplete) return;
    completedRef.current = true;
    setIsExiting(true);
    window.setTimeout(onComplete, EXIT_MS);
  }, [onComplete]);

  useEffect(() => {
    const timer = window.setTimeout(finish, DISPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [finish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      aria-busy="true"
      aria-label="Loading"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-[clamp(2rem,8vw,3.5rem)] font-semibold tracking-[-0.025em] text-white"
      >
        sameer.
      </motion.p>
    </motion.div>
  );
};

export default Loader;
