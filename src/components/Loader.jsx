import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

const LOADER_VIDEO = '/videos/IMG_4136.mp4';
const EXIT_MS = 700;
const FALLBACK_MS = 3000;

const Loader = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);
  const videoRef = useRef(null);

  const finish = useCallback(() => {
    if (completedRef.current || !onComplete) return;
    completedRef.current = true;
    setIsExiting(true);
    window.setTimeout(onComplete, EXIT_MS);
  }, [onComplete]);

  useEffect(() => {
    document.body.classList.add('loader-active');
    return () => document.body.classList.remove('loader-active');
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fallbackTimer;

    const handleEnded = () => {
      window.clearTimeout(fallbackTimer);
      finish();
    };

    const handleError = () => {
      window.clearTimeout(fallbackTimer);
      finish();
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    video.play().catch(() => {
      fallbackTimer = window.setTimeout(finish, FALLBACK_MS);
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [finish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
      aria-busy="true"
      aria-label="Loading"
    >
      <video
        ref={videoRef}
        src={LOADER_VIDEO}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
      />
    </motion.div>
  );
};

export default Loader;
