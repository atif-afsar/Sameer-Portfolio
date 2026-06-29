import { useMemo, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import MetricCounter from "../components/MetricCounter";
import {
  // performanceHero,
  performanceHighlights,
  performanceStats,
} from "../data/performanceData";
import { INTRO_PHASE_END, useSectionScroll } from "../hooks/useSectionScroll";

const panelBackground = (
  <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(80,126,255,0.14),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(245,168,62,0.16),transparent_30%),linear-gradient(180deg,#f7f5ef_0%,#ece8dd_100%)]" />
    <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/10 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#f7f5ef] to-transparent" />
  </>
);

function FloatingBubbles({ opacity }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        id: index,
        size: 32 + (index % 5) * 18,
        left: `${8 + ((index * 23) % 84)}%`,
        top: `${10 + ((index * 31) % 76)}%`,
        delay: index * 0.35,
        duration: 4.5 + (index % 3),
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
          className="absolute rounded-full border border-white/50 bg-white/30 shadow-[0_8px_28px_rgba(0,0,0,0.05)]"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            top: bubble.top,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.22, 0.4, 0.22] }}
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

// function PerformanceHeroCard() {
//   const card = performanceHero;

//   return (
//     <article className="performance-hero-card expertise-track-card relative w-full max-w-[min(92vw,420px)] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white/90 p-5 shadow-[0_24px_56px_rgba(0,0,0,0.1)] backdrop-blur-sm sm:rounded-[1.65rem] sm:p-6 lg:max-w-[440px] lg:p-7">
//       <div
//         className="pointer-events-none absolute inset-0 opacity-85"
//         style={{
//           background: `radial-gradient(circle at 88% 12%, ${card.accent}, transparent 42%)`,
//         }}
//       />

//       <div className="relative flex items-start justify-between gap-3">
//         <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-black/55">
//           {card.tag}
//         </span>
//         <span className="text-[11px] font-semibold tabular-nums text-black/30">01</span>
//       </div>

//       <div className="relative mt-4 flex items-center gap-3">
//         <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3f1ea] ring-1 ring-black/[0.05] sm:h-[68px] sm:w-[68px]">
//           <img src={card.image} alt="" className="h-full w-full object-cover" draggable="false" />
//         </div>
//         <h3
//           className="min-w-0 flex-1 text-[1.25rem] font-medium leading-tight tracking-[-0.02em] text-black sm:text-[1.45rem]"
//           style={{ fontFamily: "'Syne', sans-serif" }}
//         >
//           {card.title}
//         </h3>
//       </div>

//       <p className="relative mt-4 text-[13px] leading-[1.65] text-black/62 sm:text-[14px]">
//         {card.description}
//       </p>
//     </article>
//   );
// }

function PerformanceMetricsPanel() {
  const heroStat = performanceStats.find((s) => s.highlight) ?? performanceStats[0];
  const gridStats = performanceStats.filter((s) => !s.highlight);

  return (
    <div className="performance-metrics-panel w-full max-w-[min(94vw,680px)] px-3 sm:px-4">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/75 bg-white/62 px-6 py-8 shadow-[0_28px_70px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:rounded-[2rem] sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.9),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[rgba(245,168,62,0.14)] blur-3xl" />

        <div className="relative text-center">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#3d3d3d]">
            Campaign impact
          </span>

          <p
            className="mt-6 text-[clamp(3rem,14vw,5.5rem)] font-semibold leading-none tracking-[-0.05em] text-[#111111]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <MetricCounter value={heroStat.value} />
          </p>
          <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.22em] text-black/50 sm:text-[14px]">
            {heroStat.label}
          </p>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4">
          {gridStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-black/[0.05] bg-white/70 px-4 py-4 shadow-sm sm:px-5 sm:py-5"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/50 sm:text-[10px]">
                {stat.label}
              </p>
              <p
                className="mt-2 text-[1.35rem] font-medium leading-none tracking-[-0.02em] text-black sm:text-[1.55rem]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <MetricCounter value={stat.value} />
              </p>
            </div>
          ))}
        </div>

        <ul className="relative mt-8 flex flex-wrap justify-center gap-2 border-t border-black/[0.06] pt-6 sm:mt-9">
          {performanceHighlights.map((item) => (
            <li
              key={item}
              className="rounded-full border border-black/8 bg-black/[0.03] px-3 py-1.5 text-[10px] font-medium text-black/55 sm:text-[11px]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PerformanceSection({
  isActive = true,
  onReachStart,
  onReachEnd,
}) {
  const cardLayerRef = useRef(null);

  const { sectionRef, smoothProgress, introProgress, trackProgress } = useSectionScroll({
    isActive,
    onReachStart,
    onReachEnd,
    introPhaseEnd: 0.3,
  });

  const bubbleOpacity = useTransform(introProgress, [0, 0.15, 0.75, 1], [1, 1, 0.35, 0]);
  const headingScale = useTransform(introProgress, [0, 0.35, 0.72, 1], [1, 1, 1.26, 1.5]);
  const headingOpacity = useTransform(introProgress, [0, 0.3, 0.68, 1], [1, 1, 0.45, 0]);
  const headingBlur = useTransform(introProgress, [0, 0.5, 1], [0, 0, 10]);
  const headingFilter = useTransform(headingBlur, (blur) => `blur(${blur}px)`);
  const introHintOpacity = useTransform(introProgress, [0, 0.12, 0.55, 0.85], [0, 1, 0.55, 0]);
  const introLayerVisibility = useTransform(smoothProgress, (v) =>
    v > INTRO_PHASE_END + 0.02 ? "hidden" : "visible"
  );

  const cardOpacity = useTransform(trackProgress, [0, 0.1, 0.42, 0.72, 1], [0, 1, 1, 0.25, 0]);
  const cardScale = useTransform(trackProgress, [0, 0.12, 0.5, 0.78, 1], [0.84, 1, 1.32, 1.48, 1.55]);
  const cardBlur = useTransform(trackProgress, [0.45, 0.75, 1], [0, 6, 12]);
  const cardFilter = useTransform(cardBlur, (b) => `blur(${b}px)`);

  const metricsOpacity = useTransform(trackProgress, [0.4, 0.62, 1], [0, 1, 1]);
  const metricsScale = useTransform(trackProgress, [0.4, 0.62, 1], [0.94, 1, 1]);
  const metricsY = useTransform(trackProgress, [0.4, 0.62, 1], [36, 0, 0]);

  const cardHintOpacity = useTransform(trackProgress, [0.14, 0.28, 0.48, 0.65], [0, 1, 0.5, 0]);
  const metricsHintOpacity = useTransform(trackProgress, [0.55, 0.7, 0.92, 1], [0, 1, 0.45, 0]);

  return (
    <section
      id="performance"
      ref={sectionRef}
      className="section-scroll-target relative h-screen w-full overflow-hidden bg-[#f7f5ef] text-[#111111]"
    >
      {panelBackground}

      {/* Phase 2 — hero card zoom */}
      <motion.div
        style={{ opacity: cardOpacity }}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 pt-14 sm:pt-16"
      >
        <motion.div
          ref={cardLayerRef}
          style={{
            scale: cardScale,
            filter: cardFilter,
          }}
          className="flex w-full justify-center will-change-transform"
        >
          {/* <PerformanceHeroCard /> */}
        </motion.div>

        <motion.p
          style={{ opacity: cardHintOpacity }}
          className="absolute bottom-8 left-0 right-0 z-30 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#333333]"
        >
          Keep scrolling
        </motion.p>
      </motion.div>

      {/* Phase 3 — metrics dashboard */}
      <motion.div
        style={{
          opacity: metricsOpacity,
          scale: metricsScale,
          y: metricsY,
        }}
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4 pt-14 sm:pt-16"
      >
        <PerformanceMetricsPanel />

        <motion.p
          style={{ opacity: metricsHintOpacity }}
          className="absolute bottom-8 left-0 right-0 z-30 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#333333]"
        >
          Scroll for next section
        </motion.p>
      </motion.div>

      {/* Phase 1 — intro */}
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
            className="relative w-full max-w-[580px] px-2 sm:px-0"
          >
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/55 px-7 py-9 shadow-[0_28px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:rounded-[2rem] sm:px-10 sm:py-11">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.85),transparent_58%)]" />

              <div className="relative text-center">
                <span className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#3d3d3d] shadow-sm">
                  Expertise
                </span>

                <h2
                  className="mt-7 text-[clamp(2.2rem,8vw,4.25rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[#111111]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="block">Performance</span>
                  <span
                    className="mt-1 block text-[clamp(2rem,7.5vw,4rem)] font-normal italic leading-[0.95] text-[#1a1a1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    marketing
                  </span>
                </h2>

                <div className="mx-auto mt-6 h-px w-14 bg-linear-to-r from-transparent via-black/20 to-transparent" />

                <p className="mx-auto mt-6 max-w-[400px] text-[14px] font-medium leading-[1.7] text-[#2a2a2a] sm:text-[15px]">
                  Scroll to open the performance card, then dive into spend, ROAS, and results.
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
