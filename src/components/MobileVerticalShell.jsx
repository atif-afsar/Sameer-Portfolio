import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useInView, useScroll } from "framer-motion";
import Home from "../pages/Home";
import { ReelCard, reels } from "../pages/ReelsSection";
import { PerformanceMetricsPanel } from "../pages/PerformanceSection";
import { ExpertiseCard } from "./ExpertiseSection";
import { WaterFillText } from "../pages/Anime";
import MinimalExperienceCounter from "./LiveExperienceCounter";
import Footer from "./Footer";
import Seo from "./Seo";
import { expertiseSections } from "../data/expertiseData";
import { CAREER_START } from "../data/experienceData";
import { PANEL_NAV_EVENT } from "../data/panelNavigation";

const sectionBackground = (
  <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(80,126,255,0.14),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(245,168,62,0.16),transparent_30%),linear-gradient(180deg,#f7f5ef_0%,#ece8dd_100%)]" />
  </>
);

function IntroHeading({ eyebrow, line1, line2, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-[560px] px-2"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/55 px-7 py-9 shadow-[0_28px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.85),transparent_58%)]" />
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[rgba(80,126,255,0.12)] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-[rgba(245,168,62,0.14)] blur-2xl" />

        <div className="relative text-center">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#3d3d3d] shadow-sm">
            {eyebrow}
          </span>

          <h2
            className="mt-7 text-[clamp(2.5rem,10vw,3.5rem)] font-semibold leading-[0.92] tracking-[-0.03em] text-[#111111]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span className="block">{line1}</span>
            <span
              className="mt-1 block text-[clamp(2.35rem,9vw,3.25rem)] font-normal italic leading-[0.95] text-[#1a1a1a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {line2}
            </span>
          </h2>

          <div className="mx-auto mt-6 h-px w-14 bg-linear-to-r from-transparent via-black/20 to-transparent" />

          <p className="mx-auto mt-6 max-w-[380px] text-[14px] font-medium leading-[1.7] tracking-[0.01em] text-[#2a2a2a]">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ReelMarquee() {
  const marqueeRef = useRef(null);
  const inView = useInView(marqueeRef, { amount: 0.15 });
  // Duplicate the reel list so the CSS marquee can loop seamlessly (-50%).
  const marqueeReels = [...reels, ...reels];

  return (
    <div ref={marqueeRef} className="mobile-reel-marquee relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-[#f7f5ef] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-[#f7f5ef] to-transparent" />

      <div
        className="mobile-reel-marquee__track"
        style={{ animationPlayState: inView ? "running" : "paused" }}
      >
        {marqueeReels.map((reel, index) => (
          <ReelCard key={`${reel.id}-${index}`} reel={reel} />
        ))}
      </div>
    </div>
  );
}

function AnimeHeadline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden px-4 py-24"
      style={{ background: "#000000" }}
    >
      <p
        className="mb-6 text-center"
        style={{
          fontFamily: "sans-serif",
          fontSize: "clamp(9px, 2.6vw, 11px)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Content Creator
      </p>

      <div className="flex w-full max-w-[1180px] flex-col items-center gap-1 px-2 text-center">
        <WaterFillText text="I CREATE CONTENT" delay={0} trigger={inView} fontSize="clamp(24px, 7.2vw, 110px)" />
        <WaterFillText text="THAT CONVERT" delay={300} trigger={inView} fontSize="clamp(28px, 8.5vw, 120px)" />
      </div>

      <p
        className="mt-8 max-w-full text-center"
        style={{
          fontFamily: "sans-serif",
          fontSize: "clamp(9px, 2.6vw, 11px)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        Sameer · @thesameer06
      </p>

      <div
        className="pointer-events-none absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
          height: "40%",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}

function ExperienceCounterBlock() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="flex min-h-[70vh] w-full items-center justify-center px-4">
      {inView ? <MinimalExperienceCounter startDate={CAREER_START} /> : null}
    </div>
  );
}

export default function MobileVerticalShell() {
  const location = useLocation();
  const homeWrapperRef = useRef(null);
  const [countersActive, setCountersActive] = useState(false);
  const metricsRef = useRef(null);
  const metricsInView = useInView(metricsRef, { once: true, amount: 0.3 });

  const { scrollYProgress: homeProgress } = useScroll({
    target: homeWrapperRef,
    offset: ["start start", "end end"],
  });

  // The base html/body is locked to `overflow: hidden` (for the desktop shell).
  // Re-enable native document scrolling only while this vertical shell is mounted.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("mobile-vertical-active");
    root.classList.remove("horizontal-shell-active");

    return () => {
      root.classList.remove("mobile-vertical-active");
    };
  }, []);

  useEffect(() => {
    if (metricsInView) setCountersActive(true);
  }, [metricsInView]);

  // Navbar / deep links dispatch panel navigation events. In the vertical layout
  // each section carries the same id, so we just smooth-scroll to it.
  useEffect(() => {
    const scrollToPanel = (panelId) => {
      if (!panelId) return;
      const target = document.getElementById(panelId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const handleNavigate = (event) => scrollToPanel(event.detail?.panelId);
    window.addEventListener(PANEL_NAV_EVENT, handleNavigate);

    if (location.state?.panelId) {
      window.setTimeout(() => scrollToPanel(location.state.panelId), 120);
    }

    return () => window.removeEventListener(PANEL_NAV_EVENT, handleNavigate);
  }, [location.state]);

  return (
    <div className="mobile-vertical-root relative w-full bg-[#f7f5ef] text-[#111111]">
      <Seo
        title="Sameer Shameem | Content Creator & Performance Marketer in Aligarh"
        description="Sameer Shameem is a content creator and performance marketer in Aligarh, India, helping brands grow with Meta & Google Ads, influencer marketing, and digital storytelling."
        path="/"
      />

      {/* HOME — same scroll-driven hero morph, now driven by native page scroll */}
      <div ref={homeWrapperRef} className="relative h-[240vh]">
        <Home variant="vertical" scrollProgress={homeProgress} isActive />
      </div>

      {/* CONTENT CREATION intro */}
      <section
        id="reels"
        className="relative flex min-h-[92vh] scroll-mt-16 flex-col items-center justify-center overflow-hidden px-5 py-20"
      >
        {sectionBackground}
        <IntroHeading
          eyebrow="Video Reels"
          line1="Content"
          line2="creation"
          description="Short-form campaign clips and brand reels, crafted to stop the scroll."
        />
      </section>

      {/* REEL MARQUEE */}
      <section className="relative w-full overflow-hidden py-6">
        {sectionBackground}
        <div className="relative">
          <ReelMarquee />
        </div>
      </section>

      {/* PERFORMANCE — intro + metrics */}
      <section
        id="performance"
        className="relative flex min-h-[92vh] scroll-mt-16 flex-col items-center justify-center overflow-hidden px-5 py-20"
      >
        {sectionBackground}
        <IntroHeading
          eyebrow="Expertise"
          line1="Performance"
          line2="marketing"
          description="Spend, ROAS, and results from campaigns built to grow brands profitably."
        />
      </section>

      <section
        ref={metricsRef}
        className="relative flex w-full scroll-mt-16 flex-col items-center justify-center overflow-hidden px-3 py-16"
      >
        {sectionBackground}
        <div className="relative flex w-full justify-center">
          <PerformanceMetricsPanel countersActive={countersActive} />
        </div>
      </section>

      {/* EXPERTISE — cards stacked vertically per category */}
      {expertiseSections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="relative w-full scroll-mt-16 overflow-hidden px-5 py-16"
        >
          {sectionBackground}
          <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center">
            <IntroHeading
              eyebrow={section.eyebrow}
              line1={section.titleLine1}
              line2={section.titleLine2}
              description={section.description}
            />

            <div className="mt-10 grid w-full grid-cols-2 gap-3">
              {section.cards.map((card, index) => (
                <ExpertiseCard key={card.id} card={card} index={index} stacked />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* EXPERIENCE — live counter */}
      <section
        id="experience"
        className="relative w-full scroll-mt-16 overflow-hidden py-20"
      >
        {sectionBackground}
        <div className="relative">
          <ExperienceCounterBlock />
        </div>
      </section>

      {/* ANIME + FOOTER */}
      <section id="anime" className="relative w-full">
        <AnimeHeadline />
        <Footer id="footer" />
      </section>
    </div>
  );
}
