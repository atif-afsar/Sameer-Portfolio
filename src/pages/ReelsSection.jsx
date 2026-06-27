import { memo, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const reels = [
  {
    id: "reel-1",
    title: "Reel 01",
    instagramUrl: "https://www.instagram.com/reel/DDG_aewyA_0/",
  },
  {
    id: "reel-2",
    title: "Reel 02",
    instagramUrl: "https://www.instagram.com/reel/DVDUMz5jyFu/",
  },
  {
    id: "reel-3",
    title: "Reel 03",
    instagramUrl: "https://www.instagram.com/reel/DVIxcX_jw8g/",
  },
  {
    id: "reel-4",
    title: "Reel 04",
    instagramUrl: "https://www.instagram.com/reel/DRl03kgkTku/",
  },
  {
    id: "reel-5",
    title: "Reel 05",
    instagramUrl: "https://www.instagram.com/reel/DRTyKglkXLo/",
  },
  {
    id: "album-1",
    title: "Shared Album",
    type: "external",
    externalUrl: "https://photos.app.goo.gl/JYj1iePJpriQtyPGA",
    label: "Google Photos",
  },
];

const REEL_SCROLL_STEP = 0.0018;
const MAX_REEL_SCROLL_STEP = 0.06;

const homeBackground = (
  <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(80,126,255,0.14),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(245,168,62,0.16),transparent_30%),linear-gradient(180deg,#f7f5ef_0%,#ece8dd_100%)]" />
    <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/10 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#f7f5ef] to-transparent" />
  </>
);

function getReelShortcode(url) {
  const match = url.match(/instagram\.com\/(?:reel|reels|p)\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

const ReelCard = memo(function ReelCard({ reel }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loadEmbed, setLoadEmbed] = useState(false);
  const isExternal = reel.type === "external";
  const shortcode = reel.instagramUrl ? getReelShortcode(reel.instagramUrl) : null;
  const useNativeVideo = Boolean(reel.videoSrc);

  useEffect(() => {
    if (isExternal) return undefined;

    const card = cardRef.current;
    if (!card) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
        setIsVisible(visible);
        if (entry.isIntersecting) {
          setLoadEmbed(true);
        }
      },
      { threshold: [0, 0.4], rootMargin: "60px" }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [isExternal]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !useNativeVideo) return undefined;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    return undefined;
  }, [isVisible, useNativeVideo]);

  const footerLabel = isExternal ? reel.label : "Instagram Reel";

  return (
    <article ref={cardRef} className="reel-card shrink-0">
      <div className="reel-card-inner">
        {isExternal ? (
          <a
            href={reel.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#151515] px-5 text-center transition hover:bg-[#1a1a1a]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06)_0%,transparent_42%,rgba(0,0,0,0.18)_100%)]" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.04]">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white/75" aria-hidden="true">
                <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14l-4-2.5L12 19l-4-2.5L4 19V5z" />
              </svg>
            </span>
            <p className="relative text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Open album
            </p>
          </a>
        ) : useNativeVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={reel.videoSrc}
            poster={reel.poster}
            muted
            loop
            playsInline
            preload="none"
          />
        ) : loadEmbed && shortcode ? (
          <iframe
            title={reel.title}
            src={`https://www.instagram.com/reel/${shortcode}/embed/`}
            className="h-full w-full border-0 bg-black"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#151515] px-4">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06)_0%,transparent_42%,rgba(0,0,0,0.18)_100%)]" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.04]">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white/75" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <p className="relative text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
              Loading reel
            </p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent px-4 pb-4 pt-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
            {footerLabel}
          </p>
          <p className="mt-1 text-sm font-medium text-white">{reel.title}</p>
        </div>
      </div>
    </article>
  );
});

export default function ReelsSection({ isActive = true, onReachStart, onReachEnd }) {
  const sectionRef = useRef(null);
  const trackViewportRef = useRef(null);
  const trackRef = useRef(null);
  const trackRangeRef = useRef({ start: 0, end: -600 });
  const progressRef = useRef(0);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 52, damping: 22, mass: 0.75 });

  const hintOpacity = useTransform(smoothProgress, [0, 0.08, 0.85, 1], [1, 0.45, 0.45, 0]);
  const trackX = useTransform(smoothProgress, (value) => {
    const { start, end } = trackRangeRef.current;
    return start + (end - start) * value;
  });

  useEffect(() => {
    const measureTrack = () => {
      const track = trackRef.current;
      const viewport = trackViewportRef.current;
      if (!track || !viewport) return;

      const viewportWidth = viewport.clientWidth;
      const start = 0;
      const overflow = track.scrollWidth - viewportWidth + 16;
      const end = overflow > 0 ? -overflow : 0;

      trackRangeRef.current = { start, end };
    };

    measureTrack();
    window.addEventListener("resize", measureTrack, { passive: true });
    return () => window.removeEventListener("resize", measureTrack);
  }, []);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || !isActive) return undefined;

    const applyScroll = (deltaY) => {
      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;
      const atMax = progressRef.current >= 1;
      const atMin = progressRef.current <= 0;

      if (scrollingDown && atMax) {
        onReachEnd?.();
        return false;
      }

      if (scrollingUp && atMin) {
        onReachStart?.();
        return false;
      }

      const clampedDelta = Math.max(
        Math.min(deltaY * REEL_SCROLL_STEP, MAX_REEL_SCROLL_STEP),
        -MAX_REEL_SCROLL_STEP
      );
      const nextProgress = Math.min(Math.max(progressRef.current + clampedDelta, 0), 1);

      progressRef.current = nextProgress;
      progress.set(nextProgress);

      return true;
    };

    const handleWheel = (event) => {
      if (applyScroll(event.deltaY)) {
        event.preventDefault();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (event) => {
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      const currentY = event.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;

      if (applyScroll(deltaY * 2.4)) {
        event.preventDefault();
      }
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isActive, onReachStart, onReachEnd, progress]);

  return (
    <section
      id="reels"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#f7f5ef] text-[#111111]"
    >
      {homeBackground}

      <div className="relative flex h-full flex-col justify-center gap-5 pt-16 sm:gap-6 sm:pt-20 md:flex-row md:items-center md:gap-8">
        <div className="relative z-20 shrink-0 px-5 sm:px-8 md:w-[34%] md:max-w-[360px] md:px-10 lg:w-[32%] lg:max-w-[400px] lg:pl-12 lg:pr-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Instagram Reels
            </p>
            <h2
              className="mt-3 text-[clamp(32px,7vw,56px)] font-medium leading-[0.95] tracking-normal text-black"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Content
              <br />
              creation
            </h2>
            <p className="mt-4 max-w-[280px] text-[13px] leading-[1.65] text-black/55 sm:text-[14px]">
              Scroll through short-form work, campaign clips, and a shared album.
            </p>
          </div>

          <motion.p
            style={{ opacity: hintOpacity }}
            className="hidden text-[10px] font-medium uppercase tracking-[0.24em] text-black/40 md:block"
          >
            Scroll to browse reels
          </motion.p>
        </div>

        <div
          ref={trackViewportRef}
          className="relative min-h-0 min-w-0 flex-1 overflow-hidden py-1 md:py-0"
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-linear-to-l from-[#f7f5ef] to-transparent sm:w-10 lg:w-14" />

          <motion.div
            ref={trackRef}
            style={{ x: trackX, translateZ: 0 }}
            className="reel-track relative z-0 flex items-center gap-2 sm:gap-3"
          >
            {reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </motion.div>
        </div>

        <motion.p
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-8 left-0 right-0 z-20 text-center text-[10px] font-medium uppercase tracking-[0.24em] text-black/40 md:hidden"
        >
          Scroll to browse reels
        </motion.p>
      </div>
    </section>
  );
}
