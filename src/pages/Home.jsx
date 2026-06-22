import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const imageSources = [
  "/images/premier.png",
  "/images/content.png",
  "/images/facebook.png",
  "/images/image1.png",
  "/images/gmail.png",
  "/images/image2.png",
  "/images/googleAds.png",
  "/images/image3.png",
  "/images/insta.png",
  "/images/image4.png",
  "/images/meta.png",
  "/images/performance.jpeg",
  "/images/sameer1.png",
  "/images/sales.jpeg",
  "/images/x.png",
  "/images/youtube.png",
];

const totalImages = imageSources.length;
const maxScroll = 2600;
const lerp = (start, end, amount) => start * (1 - amount) + end * amount;

const roles = [
  "Digital Marketer",
  "Content Creator",
  "Performance Marketer",
  "Growth Strategist",
  "Copy Writer",
];

function FlipCard({ src, index, target }) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 42, damping: 16 }}
      className="absolute h-[76px] w-[54px] sm:h-[86px] sm:w-[62px] lg:h-[98px] lg:w-[70px] cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        willChange: "transform, opacity",
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.55, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-[8px] bg-zinc-200 shadow-[0_18px_38px_rgba(0,0,0,0.22)] ring-1 ring-black/10"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={src}
            alt={`Portfolio visual ${index + 1}`}
            className="h-full w-full object-cover transition duration-500"
            draggable="false"
          />
        </div>

        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[8px] border border-white/10 bg-[#101010] p-3 text-center shadow-[0_18px_38px_rgba(0,0,0,0.25)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#8fb7ff]">
            Visual
          </p>
          <p className="mt-1 text-[11px] font-medium leading-none text-white">
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [introPhase, setIntroPhase] = useState("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef(null);
  const scrollRef = useRef(0);
  const lastPageScrollRef = useRef(0);
  const virtualScroll = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const activeRole = roles[roleIndex % roles.length];
  const isMobileViewport = containerSize.width < 768;
  const safeTextWidth = Math.min(
    isMobileViewport ? 210 : 430,
    Math.max(160, (containerSize.width || 360) * (isMobileViewport ? 0.5 : 0.33))
  );
  const roleFontSize =
    activeRole.length > 18
      ? "clamp(22px, 5.2vw, 44px)"
      : "clamp(28px, 6.6vw, 58px)";

  const morphProgress = useTransform(virtualScroll, [0, 640], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 42, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [640, maxScroll], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 38, damping: 20 });
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 22 });
  const contentOpacity = useTransform(smoothMorph, [0.72, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.72, 1], [18, 0]);
  const introOpacity = useTransform(smoothMorph, [0, 0.55], [1, 0]);

  const scatterPositions = useMemo(
    () =>
      imageSources.map((_, index) => {
        const angle = (index / totalImages) * Math.PI * 2;
        const radius = 520 + (index % 4) * 120;

        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * (radius * 0.58),
          rotation: ((index % 5) - 2) * 22,
          scale: 0.55,
          opacity: 0,
        };
      }),
    []
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    setContainerSize({
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timerOne = window.setTimeout(() => setIntroPhase("line"), 450);
    const timerTwo = window.setTimeout(() => setIntroPhase("circle"), 1900);

    return () => {
      window.clearTimeout(timerOne);
      window.clearTimeout(timerTwo);
    };
  }, []);

  useEffect(() => {
    lastPageScrollRef.current = window.scrollY;

    const resetHeroProgress = () => {
      scrollRef.current = 0;
      virtualScroll.set(0);
      setIntroPhase("circle");
    };

    const handlePageScroll = () => {
      const currentScroll = window.scrollY;
      const isReturningToHome = currentScroll < lastPageScrollRef.current;
      const isNearHome = currentScroll <= window.innerHeight * 1.15;

      if (isReturningToHome && isNearHome && scrollRef.current > 640) {
        resetHeroProgress();
      }

      if (currentScroll <= 4 && scrollRef.current > 0) {
        resetHeroProgress();
      }

      lastPageScrollRef.current = currentScroll;
    };

    window.addEventListener("scroll", handlePageScroll, { passive: true });

    return () => window.removeEventListener("scroll", handlePageScroll);
  }, [virtualScroll]);

  useEffect(() => {
    const typeSpeed = 75;
    const deleteSpeed = 42;
    const pauseTime = 850;

    const timer = window.setTimeout(() => {
      setDisplayText((previousText) => {
        if (isDeleting) {
          return activeRole.substring(0, previousText.length - 1);
        }

        return activeRole.substring(0, previousText.length + 1);
      });

      if (!isDeleting && displayText === activeRole) {
        setIsDeleting(true);
      }

      if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setRoleIndex((prevIndex) => prevIndex + 1);
      }
    }, isDeleting ? deleteSpeed : displayText === activeRole ? pauseTime : typeSpeed);

    return () => window.clearTimeout(timer);
  }, [activeRole, displayText, isDeleting]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const applyScroll = (deltaY) => {
      const nextScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), maxScroll);
      const consumed = nextScroll !== scrollRef.current;

      scrollRef.current = nextScroll;
      virtualScroll.set(nextScroll);

      return consumed;
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

      if (applyScroll(deltaY)) {
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
  }, [virtualScroll]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const handleMouseMove = (event) => {
      const rect = element.getBoundingClientRect();
      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      mouseX.set(normalizedX * 88);
    };

    const handleMouseLeave = () => mouseX.set(0);

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX]);

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
    const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
    const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);

    return () => {
      unsubscribeMorph();
      unsubscribeRotate();
      unsubscribeParallax();
    };
  }, [smoothMorph, smoothMouseX, smoothScrollRotate]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#f7f5ef] text-[#111111]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(80,126,255,0.14),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(245,168,62,0.16),transparent_30%),linear-gradient(180deg,#f7f5ef_0%,#ece8dd_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#f7f5ef] to-transparent" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[50%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center pt-8 text-center sm:top-[50%] sm:pt-10 lg:pt-12"
        style={{
          opacity: introOpacity,
          width: safeTextWidth,
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={
            introPhase === "circle"
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 14, filter: "blur(8px)" }
          }
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(18px,4vw,30px)] font-semibold tracking-normal text-black/55"
        >
          Hi, I'm
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={
            introPhase === "circle"
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 18, filter: "blur(10px)" }
            }
          transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 flex min-h-[86px] w-full items-center justify-center overflow-hidden text-balance font-semibold leading-[0.96] tracking-normal text-[#151515] sm:min-h-[104px] lg:min-h-[112px]"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: roleFontSize,
          }}
        >
          <span className="block max-w-full whitespace-normal break-normal text-center">
            {displayText}
            <span className="ml-1 inline-block h-[0.85em] w-[0.09em] translate-y-[0.08em] animate-pulse rounded-sm bg-black" />
          </span>
        </motion.h1>
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="pointer-events-none absolute left-1/2 top-[13%] z-20 flex w-full max-w-[760px] -translate-x-1/2 flex-col items-center px-5 text-center sm:top-[12%]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
          Creator Portfolio
        </p>
        <h2
          className="mt-3 text-[clamp(34px,8vw,78px)] font-medium leading-[0.95] tracking-normal text-black"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Stories shaped for attention.
        </h2>
        <p className="mt-4 max-w-[560px] text-[14px] leading-[1.6] text-black/60 sm:text-[16px]">
          Social-first visuals, brand campaigns, and digital growth work presented as a living editorial reel.
        </p>
      </motion.div>

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 pt-20 sm:px-6 lg:px-10">
        <div className="relative flex h-screen w-full max-w-[1320px] items-center justify-center">
          {imageSources.map((src, index) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[index];
            } else if (introPhase === "line") {
              const lineSpacing = containerSize.width < 640 ? 48 : 68;
              const lineTotalWidth = totalImages * lineSpacing;
              const lineX = index * lineSpacing - lineTotalWidth / 2;

              target = {
                x: lineX,
                y: containerSize.width < 640 ? 24 : 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
              };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width || 1, containerSize.height || 1);
              const circleRadius = Math.min(minDimension * (isMobile ? 0.34 : 0.32), 320);
              const circleAngle = (index / totalImages) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius + (isMobile ? 16 : 26),
                rotation: circleAngle + 90,
              };
              const arcRadius =
                Math.min(containerSize.width || 1, (containerSize.height || 1) * 1.45) *
                (isMobile ? 1.5 : 1.12);
              const arcApexY = (containerSize.height || 1) * (isMobile ? 0.45 : 0.34);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 106 : 138;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (totalImages - 1);
              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const boundedRotation = -scrollProgress * spreadAngle * 0.78;
              const currentArcAngle = startAngle + index * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;
              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.26 : 1.62,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return <FlipCard key={`${src}-${index}`} src={src} index={index} target={target} />;
          })}
        </div>
      </div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="pointer-events-none absolute bottom-6 left-0 right-0 z-20 mx-auto flex w-full max-w-[1320px] items-end justify-between gap-4 px-4 text-black/55 sm:px-6 lg:px-10"
      >
        <p className="max-w-[240px] text-[10px] font-medium uppercase leading-[1.7] tracking-[0.24em]">
          Brand work / Lifestyle / Social growth
        </p>
        <p className="hidden max-w-[250px] text-right text-[10px] font-medium uppercase leading-[1.7] tracking-[0.24em] sm:block">
          Keep scrolling for the full portfolio
        </p>
      </motion.div>
    </section>
  );
}
