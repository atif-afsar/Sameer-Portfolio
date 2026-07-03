import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useTransform } from "framer-motion";
import MetricCounter from "./MetricCounter";
import {
  INTRO_PHASE_END,
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

// MOBILE PERF: fewer infinitely-animating bubbles on phones (desktop unchanged).
const isMobileDevice =
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 767px)").matches);

function FloatingBubbles({ opacity, active = true }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: isMobileDevice ? 6 : 14 }, (_, index) => ({
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
          className="absolute rounded-full border border-white/50 shadow-[0_8px_28px_rgba(0,0,0,0.06)]"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            top: bubble.top,
            background: bubble.color,
            willChange: "transform, opacity",
          }}
          animate={
            active
              ? {
                  scale: [0.85, 1.04, 0.9, 1.02, 0.88],
                  opacity: [0.28, 0.46, 0.3, 0.4, 0.28],
                  x: [0, bubble.driftX, -bubble.driftX * 0.4, bubble.driftX * 0.5, 0],
                  y: [0, bubble.driftY, bubble.driftY * 0.35, bubble.driftY * 0.65, 0],
                }
              : undefined
          }
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

export const ExpertiseCard = memo(function ExpertiseCard({ card, index, stacked = false }) {
  const cardRef = useRef(null);
  // Lower threshold so a single scroll that brings the card in reveals it AND
  // starts its number counters right away (was 0.45, which needed extra scroll).
  const isCardActive = useInView(cardRef, { once: true, amount: 0.15 });

  return (
    <motion.article
      ref={cardRef}
      initial={
        stacked
          ? { opacity: 0, y: 60, scale: 0.92, rotateX: 12 }
          : { opacity: 0, y: 20 }
      }
      whileInView={
        stacked
          ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
          : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, amount: stacked ? 0.3 : 0.15 }}
      transition={
        stacked
          ? {
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
              delay: (index % 3) * 0.09,
            }
          : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
      }
      whileTap={stacked ? { scale: 0.98 } : undefined}
      style={stacked ? { transformPerspective: 1100 } : undefined}
      className={`expertise-track-card group relative flex shrink-0 flex-col overflow-hidden rounded-[1.35rem] border border-black/[0.07] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.09)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_32px_72px_rgba(0,0,0,0.12)] sm:rounded-[1.65rem] lg:rounded-[1.75rem] ${
        stacked ? "expertise-card--stacked" : ""
      }`}
    >
      {stacked && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          initial={{ x: "-130%" }}
          animate={isCardActive ? { x: "130%" } : { x: "-130%" }}
          transition={{
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.25 + (index % 3) * 0.09,
          }}
          style={{
            background:
              "linear-gradient(105deg, transparent 34%, rgba(255,255,255,0.6) 48%, rgba(255,255,255,0.15) 58%, transparent 72%)",
          }}
        />
      )}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${card.accent}, transparent 48%), radial-gradient(circle at 0% 100%, rgba(255,255,255,0.85), transparent 55%)`,
        }}
      />

      <div className="relative flex flex-1 flex-col justify-center gap-3 p-3.5 sm:gap-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex max-w-[75%] items-center rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-black/55 backdrop-blur-sm sm:px-3 sm:text-[9px] sm:tracking-[0.22em]">
            {card.tag}
          </span>
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-[9px] font-semibold tabular-nums text-black/35 ring-1 ring-black/[0.06] sm:h-8 sm:w-8 sm:text-[11px]"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:h-16 sm:w-16 sm:rounded-2xl lg:h-[72px] lg:w-[72px]">
            <img
              src={card.image}
              alt=""
              className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-105 sm:p-1.5"
              draggable="false"
              decoding="async"
              loading="lazy"
            />
          </div>
          <h3
            className="min-w-0 flex-1 text-[1.02rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[#111111] sm:text-[1.35rem] lg:text-[1.5rem]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {card.title}
          </h3>
        </div>

        <p className="relative line-clamp-3 text-[11.5px] leading-[1.55] text-black/58 sm:line-clamp-none sm:text-[13.5px] lg:text-[14.5px] lg:leading-[1.7]">
          {card.description}
        </p>

        <div className="relative grid grid-cols-2 gap-2 sm:gap-2.5 lg:gap-3">
          {card.metrics.map((metric, metricIndex) => (
            <div
              key={metric.label}
              className={`expertise-metric-tile flex flex-col items-center justify-center rounded-lg px-2.5 py-2.5 text-center sm:rounded-2xl sm:px-3.5 sm:py-3.5 lg:px-4 lg:py-4 ${
                metricIndex === 0 ? "expertise-metric-tile--primary" : ""
              }`}
              style={{
                background: metricIndex === 0
                  ? `linear-gradient(145deg, ${card.accent}, rgba(255,255,255,0.55))`
                  : "rgba(0,0,0,0.03)",
              }}
            >
              <p className="text-[7.5px] font-bold uppercase leading-tight tracking-[0.12em] text-black/48 sm:text-[9px] sm:tracking-[0.16em]">
                {metric.label}
              </p>
              <p
                className="expertise-metric-value mt-1 text-center text-[clamp(1rem,4.2vw,1.4rem)] font-semibold leading-none tracking-[-0.04em] text-[#111111] sm:mt-2 sm:text-[clamp(1.25rem,3.2vw,1.85rem)] lg:text-[1.95rem]"
                style={stacked ? undefined : { fontFamily: "'Syne', sans-serif" }}
              >
                <MetricCounter value={metric.value} active={isCardActive} />
              </p>
            </div>
          ))}
        </div>
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
    smoothProgress,
    introProgress,
    trackProgress,
  } = useSectionScroll({ isActive, onReachStart, onReachEnd });

  const introLayerVisibility = useTransform(smoothProgress, (value) =>
    value > 0.44 ? "hidden" : "visible"
  );

  // PERF: once the user scrolls past the intro (i.e. is browsing the cards) the
  // decorative bubbles are hidden anyway, so stop their infinite animations to
  // free up frames for smooth horizontal card scrolling.
  const [introOnScreen, setIntroOnScreen] = useState(true);
  useEffect(() => {
    const update = (value) => setIntroOnScreen(value <= INTRO_PHASE_END + 0.04);
    update(smoothProgress.get());
    return smoothProgress.on("change", update);
  }, [smoothProgress]);

  const snapRef = useMeasureSnapTrack(trackRef, trackViewportRef, ".expertise-track-card", cards.length);
  const { trackLayerOpacity, trackX, browseHintOpacity } = useSnapTrackMotion(
    trackProgress,
    snapRef
  );

  const bubbleOpacity = useTransform(introProgress, [0, 0.15, 0.75, 1], [1, 1, 0.35, 0]);
  // Driven off smoothProgress so the heading fade overlaps the track fade-in at the
  // phase boundary (~0.34) instead of leaving a long blank/white gap while zooming.
  const headingScale = useTransform(smoothProgress, [0, 0.3], [1, 1.45]);
  const headingOpacity = useTransform(smoothProgress, [0.18, 0.4], [1, 0]);
  const headingBlur = useTransform(smoothProgress, [0.18, 0.4], [0, 10]);
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

      <motion.div
        style={{ visibility: introLayerVisibility }}
        className="pointer-events-none absolute inset-0 z-30"
      >
        <FloatingBubbles opacity={bubbleOpacity} active={isActive && introOnScreen} />

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
      </motion.div>
    </section>
  );
}
