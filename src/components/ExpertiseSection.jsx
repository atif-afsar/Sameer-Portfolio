import { memo, useMemo, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import MetricCounter from "./MetricCounter";
import {
  useMeasureSnapTrack,
  useSectionScroll,
  useSnapTrackMotion,
} from "../hooks/useSectionScroll";

const panelBackground = (
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
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        size: 34 + (index % 6) * 20,
        left: `${5 + ((index * 21) % 90)}%`,
        top: `${6 + ((index * 29) % 82)}%`,
        color: bubblePalette[index % bubblePalette.length],
        delay: index * 0.32,
        duration: 4.2 + (index % 4) * 1.1,
        driftX: index % 2 === 0 ? 12 : -10,
        driftY: -14 - (index % 3) * 7,
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
          animate={{
            scale: [0.85, 1.04, 0.9, 1.02, 0.88],
            opacity: [0.28, 0.46, 0.3, 0.4, 0.28],
            x: [0, bubble.driftX, -bubble.driftX * 0.4, bubble.driftX * 0.5, 0],
            y: [0, bubble.driftY, bubble.driftY * 0.35, bubble.driftY * 0.65, 0],
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

const ExpertiseCard = memo(function ExpertiseCard({ card, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: 0.55,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="expertise-track-card group relative shrink-0 overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white/90 p-5 shadow-[0_20px_48px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:rounded-[1.65rem] sm:p-6 lg:p-7"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 88% 12%, ${card.accent}, transparent 42%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-black/55">
          {card.tag}
        </span>
        <span className="text-[11px] font-semibold tabular-nums text-black/30">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative mt-4 flex items-center gap-3">
        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3f1ea] ring-1 ring-black/[0.05] sm:h-[68px] sm:w-[68px]">
          <img
            src={card.image}
            alt=""
            className="h-full w-full object-cover"
            draggable="false"
          />
        </div>
        <h3
          className="min-w-0 flex-1 text-[1.25rem] font-medium leading-tight tracking-[-0.02em] text-black sm:text-[1.45rem] lg:text-[1.55rem]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {card.title}
        </h3>
      </div>

      <p className="relative mt-4 text-[13px] leading-[1.65] text-black/62 sm:text-[14px] lg:text-[15px]">
        {card.description}
      </p>

      <div className="relative mt-5 grid grid-cols-2 gap-2.5 border-t border-black/[0.06] pt-5 sm:gap-3">
        {card.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl bg-black/[0.03] px-3.5 py-3 ring-1 ring-black/[0.04] sm:px-4"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/50">
              {metric.label}
            </p>
            <p
              className="mt-1.5 text-[1.15rem] font-medium leading-none tracking-[-0.02em] text-black sm:text-[1.3rem]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <MetricCounter value={metric.value} />
            </p>
          </div>
        ))}
      </div>
    </motion.article>
  );
});

export default function ExpertiseSection({
  id,
  eyebrow,
  titleLine1,
  titleLine2,
  description,
  scrollHint,
  cards,
  isActive = true,
  onReachStart,
  onReachEnd,
}) {
  const trackViewportRef = useRef(null);
  const trackRef = useRef(null);

  const {
    sectionRef,
    introProgress,
    trackProgress,
  } = useSectionScroll({ isActive, onReachStart, onReachEnd });

  const snapRef = useMeasureSnapTrack(trackRef, trackViewportRef, ".expertise-track-card", cards.length);
  const { trackLayerOpacity, trackX, browseHintOpacity } = useSnapTrackMotion(
    trackProgress,
    snapRef
  );

  const bubbleOpacity = useTransform(introProgress, [0, 0.15, 0.75, 1], [1, 1, 0.35, 0]);
  const headingScale = useTransform(introProgress, [0, 0.35, 0.72, 1], [1, 1, 1.26, 1.5]);
  const headingOpacity = useTransform(introProgress, [0, 0.3, 0.68, 1], [1, 1, 0.45, 0]);
  const headingBlur = useTransform(introProgress, [0, 0.5, 1], [0, 0, 10]);
  const headingFilter = useTransform(headingBlur, (blur) => `blur(${blur}px)`);
  const introHintOpacity = useTransform(introProgress, [0, 0.12, 0.55, 0.85], [0, 1, 0.55, 0]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="section-scroll-target relative h-screen w-full overflow-hidden bg-[#f7f5ef] text-[#111111]"
    >
      {panelBackground}

      <motion.div
        style={{ opacity: trackLayerOpacity }}
        className="absolute inset-0 z-20 flex items-center pt-14 sm:pt-16"
      >
        <div ref={trackViewportRef} className="section-track-viewport relative h-full min-h-0 w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-linear-to-r from-[#f7f5ef] to-transparent sm:w-6" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-[#f7f5ef] to-transparent sm:w-12 lg:w-16" />

          <motion.div
            ref={trackRef}
            style={{ x: trackX, translateZ: 0 }}
            className="expertise-track expertise-track--snap absolute left-0 top-1/2 z-0 flex -translate-y-1/2 items-stretch"
          >
            {cards.map((card, index) => (
              <ExpertiseCard key={card.id} card={card} index={index} />
            ))}
          </motion.div>
        </div>

        <motion.p
          style={{ opacity: browseHintOpacity }}
          className="pointer-events-none absolute bottom-8 left-0 right-0 z-30 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#333333]"
        >
          {scrollHint}
        </motion.p>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-30">
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
                  {eyebrow}
                </span>

                <h2
                  className="mt-7 text-[clamp(2.2rem,8vw,4.25rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[#111111]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="block">{titleLine1}</span>
                  <span
                    className="mt-1 block text-[clamp(2rem,7.5vw,4rem)] font-normal italic leading-[0.95] text-[#1a1a1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {titleLine2}
                  </span>
                </h2>

                <div className="mx-auto mt-6 h-px w-14 bg-linear-to-r from-transparent via-black/20 to-transparent" />

                <p className="mx-auto mt-6 max-w-[400px] text-[14px] font-medium leading-[1.7] tracking-[0.01em] text-[#2a2a2a] sm:text-[15px]">
                  {description}
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
      </div>
    </section>
  );
}
