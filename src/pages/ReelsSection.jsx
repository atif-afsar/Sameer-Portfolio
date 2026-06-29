import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import {
  INTRO_PHASE_END,
  useMeasureSnapTrack,
  useSectionScroll,
  useSnapTrackMotion,
} from "../hooks/useSectionScroll";

const reels = [
  { id: "reel-2", title: "Reel 02", videoSrc: "/videos/Video-70.mp4" },
  { id: "reel-3", title: "Reel 03", videoSrc: "/videos/Video-513.mp4" },
  { id: "reel-4", title: "Reel 04", videoSrc: "/videos/Video-976.mp4" },
  { id: "reel-5", title: "Reel 05", videoSrc: "/videos/e6cf69b4-0c14-46ad-8416-674ea5906a7e.mp4" },
  { id: "reel-1", title: "Reel 01", videoSrc: "/videos/Video-9.mp4" },

  {
    id: "reel-8",
    title: "Reel 08",
    videoSrc: "/videos/copy_CC2B8722-8D54-4847-A68E-F9B082ABF3F8.mov",
  },
];

const homeBackground = (
  <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(80,126,255,0.14),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(245,168,62,0.16),transparent_30%),linear-gradient(180deg,#f7f5ef_0%,#ece8dd_100%)]" />
    <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/10 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#f7f5ef] to-transparent" />
  </>
);

const bubblePalette = [
  "rgba(80,126,255,0.14)",
  "rgba(245,168,62,0.12)",
  "rgba(255,255,255,0.35)",
  "rgba(80,126,255,0.08)",
  "rgba(245,168,62,0.1)",
];

function FloatingBubbles({ opacity }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        size: 36 + (index % 6) * 22,
        left: `${6 + ((index * 19) % 88)}%`,
        top: `${8 + ((index * 27) % 78)}%`,
        color: bubblePalette[index % bubblePalette.length],
        delay: index * 0.35,
        duration: 4.5 + (index % 4) * 1.2,
        driftX: index % 2 === 0 ? 14 : -12,
        driftY: -16 - (index % 3) * 8,
      })),
    []
  );

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      {bubbles.map((bubble) => (
        <motion.span
          key={bubble.id}
          className="absolute rounded-full border border-white/50 shadow-[0_8px_28px_rgba(0,0,0,0.06)] backdrop-blur-[2px]"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            top: bubble.top,
            background: bubble.color,
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{
            scale: [0.85, 1.05, 0.92, 1.02, 0.88],
            opacity: [0.28, 0.48, 0.32, 0.42, 0.3],
            x: [0, bubble.driftX, -bubble.driftX * 0.4, bubble.driftX * 0.6, 0],
            y: [0, bubble.driftY, bubble.driftY * 0.35, bubble.driftY * 0.7, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

const ReelCard = memo(function ReelCard({ reel }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        setIsVisible(visible);
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      { threshold: [0, 0.35, 0.6], rootMargin: "80px" }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    return undefined;
  }, [isVisible]);

  return (
    <article ref={cardRef} className="reel-card shrink-0 snap-start">
      <div className="reel-card-inner">
        {shouldLoad ? (
          <video
            ref={videoRef}
            className="reel-card-video"
            src={reel.videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#101010]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04]">
              <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-white/70" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/25 to-transparent px-4 pb-4 pt-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
            Video reel
          </p>
          <p className="mt-1 text-sm font-medium text-white">{reel.title}</p>
        </div>
      </div>
    </article>
  );
});

export default function ReelsSection({ isActive = true, onReachStart, onReachEnd }) {
  const trackViewportRef = useRef(null);
  const trackRef = useRef(null);

  const {
    sectionRef,
    smoothProgress,
    introProgress,
    trackProgress,
  } = useSectionScroll({ isActive, onReachStart, onReachEnd });

  const snapRef = useMeasureSnapTrack(trackRef, trackViewportRef, ".reel-card", reels.length);
  const { trackLayerOpacity, trackX, browseHintOpacity } = useSnapTrackMotion(
    trackProgress,
    snapRef
  );

  const introLayerVisibility = useTransform(smoothProgress, (value) =>
    value > INTRO_PHASE_END + 0.02 ? "hidden" : "visible"
  );

  const bubbleOpacity = useTransform(introProgress, [0, 0.15, 0.75, 1], [1, 1, 0.35, 0]);
  const headingScale = useTransform(introProgress, [0, 0.35, 0.72, 1], [1, 1, 1.28, 1.55]);
  const headingOpacity = useTransform(introProgress, [0, 0.3, 0.68, 1], [1, 1, 0.45, 0]);
  const headingBlur = useTransform(introProgress, [0, 0.5, 1], [0, 0, 12]);
  const headingFilter = useTransform(headingBlur, (blur) => `blur(${blur}px)`);
  const introHintOpacity = useTransform(introProgress, [0, 0.12, 0.55, 0.85], [0, 1, 0.55, 0]);

  return (
    <section
      id="reels"
      ref={sectionRef}
      className="section-scroll-target relative h-screen w-full overflow-hidden bg-[#f7f5ef] text-[#111111]"
    >
      {homeBackground}

      <motion.div
        style={{ opacity: trackLayerOpacity }}
        className="absolute inset-0 z-20 flex items-center pt-14 sm:pt-16"
      >
        <div
          ref={trackViewportRef}
          className="section-track-viewport relative h-full min-h-0 w-full overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-linear-to-r from-[#f7f5ef] to-transparent sm:w-6" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-[#f7f5ef] to-transparent sm:w-12 lg:w-16" />

          <motion.div
            ref={trackRef}
            style={{ x: trackX, translateZ: 0 }}
            className="reel-track reel-track--snap absolute left-0 top-1/2 z-0 flex -translate-y-1/2 items-center"
          >
            {reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </motion.div>
        </div>

        <motion.p
          style={{ opacity: browseHintOpacity }}
          className="pointer-events-none absolute bottom-8 left-0 right-0 z-30 text-center text-[10px] font-medium uppercase tracking-[0.24em] text-black/40"
        >
          Scroll to browse reels
        </motion.p>
      </motion.div>

      <motion.div
        style={{ visibility: introLayerVisibility }}
        className="pointer-events-none absolute inset-0 z-30"
      >
        <FloatingBubbles opacity={bubbleOpacity} />

        <div className="flex h-full items-center justify-center px-5 pt-14 sm:px-8 sm:pt-16">
          <motion.div
            style={{
              scale: headingScale,
              opacity: headingOpacity,
              filter: headingFilter,
            }}
            className="relative z-20 w-full max-w-[580px] px-2 sm:px-0"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/55 px-7 py-9 shadow-[0_28px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:rounded-[2rem] sm:px-10 sm:py-11">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.85),transparent_58%)]" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[rgba(80,126,255,0.12)] blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-[rgba(245,168,62,0.14)] blur-2xl" />

              <div className="relative text-center">
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#3d3d3d] shadow-sm">
                  Video Reels
                </span>

                <h2
                  className="mt-7 text-[clamp(2.5rem,9vw,4.75rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[#111111]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="block">Content</span>
                  <span
                    className="mt-1 block text-[clamp(2.35rem,8.5vw,4.5rem)] font-normal italic leading-[0.95] text-[#1a1a1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    creation
                  </span>
                </h2>

                <div className="mx-auto mt-6 h-px w-14 bg-linear-to-r from-transparent via-black/20 to-transparent" />

                <p className="mx-auto mt-6 max-w-[380px] text-[14px] font-medium leading-[1.7] tracking-[0.01em] text-[#2a2a2a] sm:text-[15px]">
                  Scroll through short-form campaign clips and brand reels.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.p
          style={{ opacity: introHintOpacity }}
          className="absolute bottom-8 left-0 right-0 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#333333]"
        >
          Scroll to begin
        </motion.p>
      </motion.div>
    </section>
  );
}
