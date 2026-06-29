import { useMemo } from "react";
import { motion, useTransform } from "framer-motion";
import { MinimalExperienceCounter } from "../components/LiveExperienceCounter";
import { CAREER_START } from "../data/experienceData";
import { useSectionScroll } from "../hooks/useSectionScroll";

const panelBackground = (
  <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(80,126,255,0.12),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(245,168,62,0.1),transparent_36%),linear-gradient(180deg,#f7f5ef_0%,#ebe7dc_100%)]" />
    <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/10 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#f7f5ef] to-transparent" />
  </>
);

export default function ExperienceSection({
  isActive = true,
  onReachStart,
  onReachEnd,
}) {
  const { sectionRef, introProgress, trackProgress } = useSectionScroll({
    isActive,
    onReachStart,
    onReachEnd,
  });

  const bubbleOpacity = useTransform(introProgress, [0, 0.15, 0.75, 1], [1, 1, 0.35, 0]);
  const headingScale = useTransform(introProgress, [0, 0.35, 0.72, 1], [1, 1, 1.22, 1.42]);
  const headingOpacity = useTransform(introProgress, [0, 0.3, 0.68, 1], [1, 1, 0.4, 0]);
  const headingBlur = useTransform(introProgress, [0, 0.5, 1], [0, 0, 12]);
  const headingFilter = useTransform(headingBlur, (blur) => `blur(${blur}px)`);
  const introHintOpacity = useTransform(introProgress, [0, 0.12, 0.55, 0.85], [0, 1, 0.55, 0]);

  const counterOpacity = useTransform(trackProgress, [0, 0.22, 0.42, 1], [0, 0, 1, 1]);
  const counterScale = useTransform(trackProgress, [0, 0.22, 0.5, 1], [0.94, 0.94, 1, 1]);
  const counterY = useTransform(trackProgress, [0, 0.22, 0.55, 1], [28, 28, 0, 0]);
  const introLayerVisibility = useTransform(trackProgress, (value) =>
    value > 0.35 ? "hidden" : "visible"
  );

  const bubbles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index,
        size: 28 + (index % 4) * 16,
        left: `${10 + ((index * 27) % 80)}%`,
        top: `${12 + ((index * 33) % 72)}%`,
        delay: index * 0.4,
        duration: 5 + (index % 3),
      })),
    []
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-scroll-target relative h-screen w-full overflow-hidden bg-[#f7f5ef] text-[#111111]"
    >
      {panelBackground}

      {/* Counter — full viewport, centered */}
      <motion.div
        style={{
          opacity: counterOpacity,
          scale: counterScale,
          y: counterY,
        }}
        className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6"
      >
        <MinimalExperienceCounter startDate={CAREER_START} />
      </motion.div>

      {/* Intro heading */}
      <motion.div
        style={{ visibility: introLayerVisibility }}
        className="pointer-events-none absolute inset-0 z-30"
      >
        <motion.div
          style={{ opacity: bubbleOpacity }}
          className="absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          {bubbles.map((bubble) => (
            <motion.span
              key={bubble.id}
              className="absolute rounded-full border border-white/40 bg-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
              style={{
                width: bubble.size,
                height: bubble.size,
                left: bubble.left,
                top: bubble.top,
              }}
              animate={
                isActive
                  ? {
                      y: [0, -14, 0],
                      opacity: [0.2, 0.38, 0.2],
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
                  Experience
                </span>

                <h2
                  className="mt-7 text-[clamp(2.2rem,8vw,4.25rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[#111111]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  <span className="block">Every second</span>
                  <span
                    className="mt-1 block text-[clamp(2rem,7.5vw,4rem)] font-normal italic leading-[0.95] text-[#1a1a1a]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    counts
                  </span>
                </h2>

                <div className="mx-auto mt-6 h-px w-14 bg-linear-to-r from-transparent via-black/20 to-transparent" />

                <p className="mx-auto mt-6 max-w-[380px] text-[14px] font-medium leading-[1.7] text-[#2a2a2a] sm:text-[15px]">
                  Scroll to reveal the live clock.
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
