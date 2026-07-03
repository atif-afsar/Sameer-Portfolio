import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import MetricCounter from "../components/MetricCounter";
import {
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

// MOBILE PERF: fewer infinitely-animating bubbles on phones (desktop unchanged).
const isMobileDevice =
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 767px)").matches);

function FloatingBubbles({ opacity, active = true }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: isMobileDevice ? 6 : 12 }, (_, index) => ({
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
          animate={active ? { y: [0, -12, 0], opacity: [0.22, 0.4, 0.22] } : undefined}
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

const METRICS_COUNTER_START = 0.48;
const METRICS_COUNTER_RESET = 0.38;

export function PerformanceMetricsPanel({ countersActive }) {
  const heroStat = performanceStats.find((s) => s.highlight) ?? performanceStats[0];
  const gridStats = performanceStats.filter((s) => !s.highlight);

  return (
    <div className="performance-metrics-panel w-full max-w-[min(96vw,760px)]">
      <div className="relative rounded-[1.5rem] border border-white/75 bg-white/70 px-4 py-5 shadow-[0_28px_70px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:rounded-[1.85rem] sm:px-7 sm:py-7 lg:rounded-[2rem] lg:px-9 lg:py-8">
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.92),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[rgba(245,168,62,0.14)] blur-3xl" />

        <div className="relative text-center">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#3d3d3d] sm:px-4 sm:py-1.5 sm:text-[10px] sm:tracking-[0.28em]">
            Campaign impact
          </span>

          <p className="font-display-extended mt-4 text-[clamp(2.5rem,12vw,4.75rem)] leading-none tracking-[0.02em] text-[#111111] sm:mt-5 lg:text-[clamp(3rem,8vw,5.25rem)]">
            <MetricCounter value={heroStat.value} active={countersActive} delay={0} />
          </p>
          <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-black/50 sm:mt-2 sm:text-[13px] sm:tracking-[0.22em]">
            {heroStat.label}
          </p>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-2 sm:mt-7 sm:grid-cols-6 sm:gap-3 lg:mt-8">
          {gridStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`rounded-xl border border-black/[0.06] bg-white/80 px-3 py-3 shadow-sm sm:rounded-2xl sm:px-4 sm:py-4 lg:px-5 lg:py-4 ${
                index === gridStats.length - 1 && gridStats.length % 2 !== 0
                  ? "col-span-2"
                  : "col-span-1"
              } sm:col-span-2 ${index === 3 ? "sm:col-start-2" : ""}`}
            >
              <p className="text-[8px] font-semibold uppercase leading-tight tracking-[0.14em] text-black/50 sm:text-[9px] sm:tracking-[0.16em] lg:text-[10px]">
                {stat.label}
              </p>
              <p className="font-display-extended mt-1.5 text-[clamp(1.1rem,4.5vw,1.45rem)] leading-none tracking-[0.02em] text-black sm:mt-2 lg:text-[1.55rem]">
                <MetricCounter
                  value={stat.value}
                  active={countersActive}
                  delay={0.12 + index * 0.1}
                />
              </p>
            </div>
          ))}
        </div>

        <ul className="relative mt-5 flex flex-wrap justify-center gap-1.5 border-t border-black/[0.06] pt-4 sm:mt-6 sm:gap-2 sm:pt-5 lg:mt-7">
          {performanceHighlights.map((item) => (
            <li
              key={item}
              className="max-w-full rounded-full border border-black/8 bg-black/[0.03] px-2.5 py-1 text-center text-[9px] font-medium leading-snug text-black/55 sm:px-3 sm:py-1.5 sm:text-[10px] lg:text-[11px]"
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
  const [countersActive, setCountersActive] = useState(false);

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

  // PERF: halt the infinite bubble animations once the intro is gone so the
  // card zoom / metrics scrolling stays smooth.
  const [introOnScreen, setIntroOnScreen] = useState(true);
  useEffect(() => {
    const update = (value) => setIntroOnScreen(value <= INTRO_PHASE_END + 0.04);
    update(smoothProgress.get());
    return smoothProgress.on("change", update);
  }, [smoothProgress]);

  const cardOpacity = useTransform(trackProgress, [0, 0.1, 0.42, 0.72, 1], [0, 1, 1, 0.25, 0]);
  const cardScale = useTransform(trackProgress, [0, 0.12, 0.5, 0.78, 1], [0.84, 1, 1.32, 1.48, 1.55]);
  const cardBlur = useTransform(trackProgress, [0.45, 0.75, 1], [0, 6, 12]);
  const cardFilter = useTransform(cardBlur, (b) => `blur(${b}px)`);

  const metricsOpacity = useTransform(trackProgress, [0.4, 0.62, 1], [0, 1, 1]);
  const metricsScale = useTransform(trackProgress, [0.4, 0.62, 1], [0.94, 1, 1]);
  const metricsY = useTransform(trackProgress, [0.4, 0.62, 1], [36, 0, 0]);

  const cardHintOpacity = useTransform(trackProgress, [0.14, 0.28, 0.48, 0.65], [0, 1, 0.5, 0]);
  const metricsHintOpacity = useTransform(trackProgress, [0.55, 0.7, 0.92, 1], [0, 1, 0.45, 0]);

  useEffect(() => {
    const syncCounters = (value) => {
      if (value >= METRICS_COUNTER_START) {
        setCountersActive(true);
        return;
      }

      if (value <= METRICS_COUNTER_RESET) {
        setCountersActive(false);
      }
    };

    syncCounters(trackProgress.get());
    return trackProgress.on("change", syncCounters);
  }, [trackProgress]);

  useEffect(() => {
    if (isActive) return;
    setCountersActive(false);
  }, [isActive]);

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
        />

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
        className="performance-metrics-stage absolute inset-0 z-30 flex items-start justify-center overflow-x-hidden overflow-y-auto px-3 pb-8 pt-[4.75rem] sm:px-5 sm:pb-10 sm:pt-[5.25rem] lg:items-center lg:overflow-y-hidden lg:pb-12 lg:pt-16"
      >
        <PerformanceMetricsPanel countersActive={countersActive} />

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
        <FloatingBubbles opacity={bubbleOpacity} active={isActive && introOnScreen} />

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
