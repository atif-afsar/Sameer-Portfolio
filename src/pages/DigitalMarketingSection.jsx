import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const digitalCards = [
  {
    id: "meta-ads",
    tag: "Paid Social",
    title: "Meta Ads",
    description: "Facebook and Instagram campaigns built for reach, retargeting, and ROAS.",
    image: "/images/meta.png",
    accent: "rgba(80,126,255,0.18)",
    metrics: [
      { label: "Highest Reach", value: "890K" },
      { label: "Impressions", value: "3.2M+" },
    ],
  },
  {
    id: "google-ads",
    tag: "Search & Display",
    title: "Google Ads",
    description: "Search, display, and performance campaigns that capture high-intent demand.",
    image: "/images/googleAds.png",
    accent: "rgba(245,168,62,0.2)",
    metrics: [
      { label: "Click-through Rate", value: "4.8%" },
      { label: "Conversions", value: "12.4K+" },
    ],
  },
  {
    id: "performance",
    tag: "Optimization",
    title: "Performance Marketing",
    description: "Funnel testing, budget allocation, and conversion-focused growth loops.",
    image: "/images/performance.jpeg",
    accent: "rgba(16,16,16,0.08)",
    metrics: [
      { label: "Avg. ROAS", value: "5.2x" },
      { label: "Cost Per Lead", value: "-38%" },
    ],
  },
  {
    id: "social-media",
    tag: "Community",
    title: "Social Media",
    description: "Platform-native content systems that keep brands consistent and visible.",
    image: "/images/insta.png",
    accent: "rgba(225,48,108,0.12)",
    metrics: [
      { label: "Instagram Views", value: "2.4M+" },
      { label: "Highest Reach", value: "620K" },
    ],
  },
  {
    id: "analytics",
    tag: "Insights",
    title: "Analytics & Reporting",
    description: "Clear dashboards and weekly insights that turn data into next-step decisions.",
    image: "/images/sales.jpeg",
    accent: "rgba(80,126,255,0.14)",
    metrics: [
      { label: "Data Sources", value: "8+" },
      { label: "Reports Delivered", value: "240+" },
    ],
  },
  {
    id: "content-strategy",
    tag: "Storytelling",
    title: "Content Strategy",
    description: "Editorial calendars, hooks, and creative direction aligned with business goals.",
    image: "/images/content.png",
    accent: "rgba(245,168,62,0.16)",
    metrics: [
      { label: "Posts Shipped", value: "500+" },
      { label: "Engagement Rate", value: "8.6%" },
    ],
  },
];

const panelBackground = (
  <>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(80,126,255,0.14),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(245,168,62,0.16),transparent_30%),linear-gradient(180deg,#f7f5ef_0%,#ece8dd_100%)]" />
    <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/10 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#f7f5ef] to-transparent" />
  </>
);

const DigitalCard = memo(function DigitalCard({ card, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-white/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:p-5"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 88% 12%, ${card.accent}, transparent 42%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-black/50">
          {card.tag}
        </span>
        <span className="text-[11px] font-semibold tabular-nums text-black/30">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative mt-4 flex items-center gap-3">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f3f1ea] ring-1 ring-black/[0.05] sm:h-[58px] sm:w-[58px]">
          <img
            src={card.image}
            alt=""
            className="h-full w-full object-cover"
            draggable="false"
          />
        </div>
        <h3
          className="min-w-0 flex-1 text-[1.1rem] font-medium leading-tight tracking-[-0.02em] text-black sm:text-[1.2rem]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {card.title}
        </h3>
      </div>

      <p className="relative mt-3 text-[12px] leading-[1.6] text-black/55 sm:text-[13px]">
        {card.description}
      </p>

      <div className="relative mt-4 grid grid-cols-2 gap-2 border-t border-black/[0.06] pt-4">
        {card.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl bg-black/[0.03] px-3 py-2.5 ring-1 ring-black/[0.04]"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-black/45">
              {metric.label}
            </p>
            <p
              className="mt-1 text-[1.05rem] font-medium leading-none tracking-[-0.02em] text-black sm:text-[1.15rem]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </motion.article>
  );
});

export default function DigitalMarketingSection({ isActive = true, onReachStart }) {
  const sectionRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !isActive) return undefined;

    const tryGoBack = () => {
      if (scrollArea.scrollTop <= 0) {
        onReachStart?.();
      }
    };

    const handleWheel = (event) => {
      if (event.deltaY < 0) {
        tryGoBack();
      }
    };

    const handleTouchStart = (event) => {
      touchStartYRef.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      const currentY = event.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY;
      touchStartYRef.current = currentY;

      if (deltaY < 0) {
        tryGoBack();
      }
    };

    scrollArea.addEventListener("wheel", handleWheel, { passive: true });
    scrollArea.addEventListener("touchstart", handleTouchStart, { passive: true });
    scrollArea.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      scrollArea.removeEventListener("wheel", handleWheel);
      scrollArea.removeEventListener("touchstart", handleTouchStart);
      scrollArea.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isActive, onReachStart]);

  return (
    <section
      id="digital"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#f7f5ef] text-[#111111]"
    >
      {panelBackground}

      <div className="relative z-10 grid h-full min-h-0 grid-cols-1 grid-rows-[auto_1fr] gap-4 px-5 pb-5 pt-16 sm:px-8 sm:pb-6 sm:pt-20 lg:grid-cols-[minmax(240px,30%)_1fr] lg:grid-rows-1 lg:items-stretch lg:gap-10 lg:px-10 lg:pb-8 xl:px-12">
        <header className="flex shrink-0 flex-col justify-start lg:h-full lg:justify-center lg:pr-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-black/45">
            Expertise
          </p>
          <h2
            className="mt-3 text-[clamp(28px,5.5vw,46px)] font-medium leading-[0.95] tracking-normal text-black"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Digital Marketing
            <br />
            Specialist
          </h2>
          <p className="mt-3 max-w-[320px] text-[13px] leading-[1.65] text-black/55 sm:text-[14px]">
            Data-driven campaigns, paid media, and growth strategy — with results you can measure.
          </p>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.24em] text-black/35">
            Scroll to explore metrics
          </p>
        </header>

        <div
          ref={scrollAreaRef}
          className="digital-cards-scroll min-h-0 overflow-y-auto overscroll-y-contain pb-2 pr-1 no-scrollbar"
        >
          <div className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 sm:gap-4 lg:pb-6">
            {digitalCards.map((card, index) => (
              <DigitalCard key={card.id} card={card} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
