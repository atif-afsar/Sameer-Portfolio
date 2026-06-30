import { memo, useEffect, useMemo, useRef, useState } from "react";
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

// MOBILE FIX: scroll budget is now responsive instead of one fixed value.
// Desktop keeps the original feel (2600 / 640 split). Mobile gets ~60% of
// that distance (per request), and the morph breakpoint scales down with it
// so the circle->arc morph still happens at the same relative ~25% point
// instead of eating a bigger share of the now-shorter mobile scroll.
const DESKTOP_MAX_SCROLL = 2600;
const DESKTOP_MORPH_BREAKPOINT = 640;
const MOBILE_MAX_SCROLL = Math.round(DESKTOP_MAX_SCROLL * 0.6); // ~1560
const MOBILE_MORPH_BREAKPOINT = Math.round(DESKTOP_MORPH_BREAKPOINT * 0.6); // ~384

// MOBILE FIX: clamp how much a single touchmove/wheel tick can move the
// virtual scroll. Fast flicks on touch devices can fire one touchmove event
// with a large deltaY, which previously caused cards to visibly pop/snap to
// a new position in a single frame. Capping this keeps motion smooth without
// changing how a normal swipe feels.
const MAX_SCROLL_STEP = 120;

const lerp = (start, end, amount) => start * (1 - amount) + end * amount;

const CARD_WIDTH = { base: 54, sm: 62, lg: 70 };
const CARD_HEIGHT = { base: 76, sm: 86, lg: 98 };
const RING_TEXT_GAP = 16;

function getCardDimensions(viewportWidth) {
  if (viewportWidth >= 1024) {
    return { width: CARD_WIDTH.lg, height: CARD_HEIGHT.lg };
  }
  if (viewportWidth >= 640) {
    return { width: CARD_WIDTH.sm, height: CARD_HEIGHT.sm };
  }
  return { width: CARD_WIDTH.base, height: CARD_HEIGHT.base };
}

function getCircleRadius(viewportWidth, viewportHeight) {
  const isMobile = viewportWidth < 768;
  const minDimension = Math.min(viewportWidth || 360, viewportHeight || 640);

  return isMobile
    ? Math.min((viewportWidth || 360) * 0.38, 150)
    : Math.min(minDimension * 0.32, 320);
}

function getOrbitTextBounds(viewportWidth, viewportHeight) {
  const circleRadius = getCircleRadius(viewportWidth, viewportHeight);
  const { width: cardWidth, height: cardHeight } = getCardDimensions(viewportWidth);

  return {
    circleRadius,
    cardWidth,
    cardHeight,
    isMobile: viewportWidth < 768,
    safeInnerWidth: Math.max(
      96,
      Math.floor(2 * (circleRadius - cardWidth / 2 - RING_TEXT_GAP))
    ),
    safeInnerHeight: Math.max(
      80,
      Math.floor(2 * (circleRadius - cardHeight / 2 - RING_TEXT_GAP))
    ),
  };
}

function fitFontSize(text, maxWidth, { max, min, charWidthRatio }) {
  const length = Math.max(text.length, 1);
  const fitted = maxWidth / (length * charWidthRatio);

  return Math.min(max, Math.max(min, fitted));
}

function getIntroRoleFontSizes(displayText, activeRole, bounds) {
  const { safeInnerWidth, safeInnerHeight, isMobile } = bounds;
  const roleText = displayText || activeRole;
  const introMax = isMobile ? 22 : 30;
  const introMin = isMobile ? 14 : 17;
  const roleMax = isMobile ? 28 : 52;
  const roleMin = isMobile ? 12 : 18;

  let roleSize = fitFontSize(roleText, safeInnerWidth, {
    max: roleMax,
    min: roleMin,
    charWidthRatio: 0.56,
  });
  let introSize = fitFontSize("Hi, I'm", safeInnerWidth, {
    max: introMax,
    min: introMin,
    charWidthRatio: 0.62,
  });

  const lineGap = isMobile ? 8 : 10;
  const blockHeight = introSize * 1.2 + lineGap + roleSize * 1.05;

  if (blockHeight > safeInnerHeight) {
    const scale = safeInnerHeight / blockHeight;
    roleSize = Math.max(roleMin, roleSize * scale);
    introSize = Math.max(introMin, introSize * scale);
  }

  return {
    introFontSize: `${introSize}px`,
    roleFontSize: `${roleSize}px`,
  };
}

const roles = [
  "Digital Marketer",
  "Content Creator",
  "Performance Marketer",
  "Growth Strategist",
  "Copy Writer",
];

// PERF: card geometry is computed off the React render path. This pure helper
// takes the live spring values (morph / rotate / parallax) plus the entrance
// progress values and returns the final transform for a single card. It is
// only ever called inside `useTransform`, so framer-motion applies the result
// straight to the DOM without triggering a React re-render.
function computeCardState(index, [morph, rotate, parallax, eLine, eCircle], g) {
  const total = g.total;
  const scatter = g.scatter[index] || { x: 0, y: 0, rotation: 0 };

  const lineTotalWidth = total * g.lineSpacing;
  const lineX = index * g.lineSpacing - lineTotalWidth / 2;
  const lineY = g.lineY;

  const circleAngle = (index / total) * 360;
  const circleRad = (circleAngle * Math.PI) / 180;
  const circleX = Math.cos(circleRad) * g.circleRadius;
  const circleY = Math.sin(circleRad) * g.circleRadius + (g.isMobile ? 16 : 26);
  const circleRot = circleAngle + 90;

  const arcRadius = Math.min(g.width, g.height * 1.45) * (g.isMobile ? 1.5 : 1.12);
  const arcApexY = g.height * (g.isMobile ? 0.45 : 0.34);
  const arcCenterY = arcApexY + arcRadius;
  const spreadAngle = g.isMobile ? 106 : 138;
  const startAngle = -90 - spreadAngle / 2;
  const step = spreadAngle / (total - 1);
  const scrollProgress = Math.min(Math.max(rotate / 360, 0), 1);
  const boundedRotation = -scrollProgress * spreadAngle * 0.78;
  const currentArcAngle = startAngle + index * step + boundedRotation;
  const arcRad = (currentArcAngle * Math.PI) / 180;
  const arcX = Math.cos(arcRad) * arcRadius + parallax;
  const arcY = Math.sin(arcRad) * arcRadius + arcCenterY;
  const arcRot = currentArcAngle + 90;
  const arcScale = g.isMobile ? 1.26 : 1.62;

  const caX = lerp(circleX, arcX, morph);
  const caY = lerp(circleY, arcY, morph);
  const caRot = lerp(circleRot, arcRot, morph);
  const caScale = lerp(1, arcScale, morph);

  const p1x = lerp(scatter.x, lineX, eLine);
  const p1y = lerp(scatter.y, lineY, eLine);
  const p1rot = lerp(scatter.rotation, 0, eLine);
  const p1scale = lerp(0.55, 1, eLine);

  return {
    x: lerp(p1x, caX, eCircle),
    y: lerp(p1y, caY, eCircle),
    rot: lerp(p1rot, caRot, eCircle),
    scale: lerp(p1scale, caScale, eCircle),
    opacity: eLine,
  };
}

function FlipCard({
  src,
  index,
  smoothMorph,
  smoothScrollRotate,
  smoothMouseX,
  enterLine,
  enterCircle,
  geomVersion,
  geomRef,
}) {
  const state = useTransform(
    [smoothMorph, smoothScrollRotate, smoothMouseX, enterLine, enterCircle, geomVersion],
    (values) => computeCardState(index, values, geomRef.current)
  );
  const transform = useTransform(
    state,
    (s) => `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.rot}deg) scale(${s.scale})`
  );
  const opacity = useTransform(state, (s) => s.opacity);

  return (
    <motion.div
      className="absolute h-[76px] w-[54px] sm:h-[86px] sm:w-[62px] lg:h-[98px] lg:w-[70px] cursor-pointer"
      style={{
        transform,
        opacity,
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
            decoding="async"
            loading={index < 6 ? "eager" : "lazy"}
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

const MemoFlipCard = memo(FlipCard);

export default function Home({ isActive = true, onReachEnd }) {
  const [introPhase, setIntroPhase] = useState("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef(null);
  const scrollRef = useRef(0);
  const virtualScroll = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const activeRole = roles[roleIndex % roles.length];
  const isMobileViewport = containerSize.width < 768;
  const orbitTextBounds = useMemo(
    () => getOrbitTextBounds(containerSize.width, containerSize.height),
    [containerSize.width, containerSize.height]
  );
  const { introFontSize, roleFontSize } = useMemo(
    () => getIntroRoleFontSizes(displayText, activeRole, orbitTextBounds),
    [displayText, activeRole, orbitTextBounds]
  );

  // MOBILE FIX: pick the scroll budget and morph breakpoint based on viewport.
  // Falls back to desktop values until containerSize is measured on first paint.
  const maxScroll = isMobileViewport ? MOBILE_MAX_SCROLL : DESKTOP_MAX_SCROLL;
  const morphBreakpoint = isMobileViewport ? MOBILE_MORPH_BREAKPOINT : DESKTOP_MORPH_BREAKPOINT;

  const morphProgress = useTransform(virtualScroll, [0, morphBreakpoint], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 42, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [morphBreakpoint, maxScroll], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 38, damping: 20 });
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 22 });
  const contentOpacity = useTransform(smoothMorph, [0.72, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.72, 1], [18, 0]);
  const introOpacity = useTransform(smoothMorph, [0, 0.55], [1, 0]);

  // PERF: entrance choreography (scatter -> line -> circle) is driven by two
  // spring motion values instead of per-card `animate` props, so the cards
  // never re-render through React during the intro or while scrolling.
  const enterLineTarget = useMotionValue(0);
  const enterLine = useSpring(enterLineTarget, { stiffness: 70, damping: 18 });
  const enterCircleTarget = useMotionValue(0);
  const enterCircle = useSpring(enterCircleTarget, { stiffness: 52, damping: 18 });

  // PERF: geometry is stored in a ref and a version counter (a motion value).
  // Cards read the latest geometry inside their `useTransform`, and bumping the
  // version forces a single recompute when the viewport size changes.
  const geomVersion = useMotionValue(0);
  const geomRef = useRef({
    total: totalImages,
    isMobile: false,
    circleRadius: 320,
    width: 360,
    height: 640,
    lineSpacing: 68,
    lineY: 0,
    scatter: [],
  });

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

  // PERF: keep card geometry up to date without re-rendering cards.
  useEffect(() => {
    const width = containerSize.width || 360;
    const height = containerSize.height || 640;

    geomRef.current = {
      total: totalImages,
      isMobile: orbitTextBounds.isMobile,
      circleRadius: orbitTextBounds.circleRadius,
      width,
      height,
      lineSpacing: width < 640 ? 48 : 68,
      lineY: width < 640 ? 24 : 0,
      scatter: scatterPositions,
    };
    geomVersion.set(geomVersion.get() + 1);
  }, [
    containerSize.width,
    containerSize.height,
    orbitTextBounds,
    scatterPositions,
    geomVersion,
  ]);

  // PERF: advance the entrance springs as the intro phase changes.
  useEffect(() => {
    if (introPhase === "line") {
      enterLineTarget.set(1);
    } else if (introPhase === "circle") {
      enterLineTarget.set(1);
      enterCircleTarget.set(1);
    }
  }, [introPhase, enterLineTarget, enterCircleTarget]);

  useEffect(() => {
    if (!isActive) return undefined;

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
  }, [activeRole, displayText, isActive, isDeleting]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !isActive) return undefined;

    const endTriggeredRef = { current: false };
    const boundaryCooldownRef = { current: false };
    const BOUNDARY_COOLDOWN_MS = 520;

    const triggerEnd = () => {
      if (boundaryCooldownRef.current || endTriggeredRef.current || !onReachEnd) return;
      endTriggeredRef.current = true;
      boundaryCooldownRef.current = true;
      onReachEnd();
      window.setTimeout(() => {
        boundaryCooldownRef.current = false;
      }, BOUNDARY_COOLDOWN_MS);
    };

    const getTouchMultiplier = () =>
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 767px)").matches
        ? 2.8
        : 1;

    const getMaxStep = () =>
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 767px)").matches
        ? 200
        : MAX_SCROLL_STEP;

    const applyScroll = (deltaY) => {
      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;
      const atMaxBoundary = scrollRef.current >= maxScroll - 1;
      const atMinBoundary = scrollRef.current <= 0;
      const maxStep = getMaxStep();

      if (scrollingDown && atMaxBoundary) {
        triggerEnd();
        return false;
      }

      if (scrollingUp && atMinBoundary) {
        return false;
      }

      if (!atMaxBoundary) {
        endTriggeredRef.current = false;
      }

      const clampedDelta = Math.max(Math.min(deltaY, maxStep), -maxStep);
      const nextScroll = Math.min(Math.max(scrollRef.current + clampedDelta, 0), maxScroll);

      scrollRef.current = nextScroll;
      virtualScroll.set(nextScroll);

      return true;
    };

    const handleWheel = (event) => {
      if (applyScroll(event.deltaY)) {
        event.preventDefault();
      }
    };

    let touchStartY = 0;
    let touchTracking = false;

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      touchTracking = true;
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      if (!touchTracking || event.touches.length !== 1) return;

      const currentY = event.touches[0].clientY;
      const deltaY = (touchStartY - currentY) * getTouchMultiplier();
      touchStartY = currentY;

      if (applyScroll(deltaY)) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      touchTracking = false;
    };

    const touchOptions = { passive: false, capture: true };
    const passiveCapture = { passive: true, capture: true };

    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("touchstart", handleTouchStart, passiveCapture);
    element.addEventListener("touchmove", handleTouchMove, touchOptions);
    element.addEventListener("touchend", handleTouchEnd, passiveCapture);
    element.addEventListener("touchcancel", handleTouchEnd, passiveCapture);

    return () => {
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("touchstart", handleTouchStart, passiveCapture);
      element.removeEventListener("touchmove", handleTouchMove, touchOptions);
      element.removeEventListener("touchend", handleTouchEnd, passiveCapture);
      element.removeEventListener("touchcancel", handleTouchEnd, passiveCapture);
    };
  }, [virtualScroll, maxScroll, isActive, onReachEnd]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !isActive) return undefined;

    let rafId = null;
    let latestNormalizedX = 0;

    const handleMouseMove = (event) => {
      const rect = element.getBoundingClientRect();
      latestNormalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;

      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        mouseX.set(latestNormalizedX * 88);
      });
    };

    const handleMouseLeave = () => mouseX.set(0);

    element.addEventListener("mousemove", handleMouseMove, { passive: true });
    element.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isActive, mouseX]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="section-scroll-target relative h-screen overflow-hidden bg-[#f7f5ef] text-[#111111]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(80,126,255,0.14),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(245,168,62,0.16),transparent_30%),linear-gradient(180deg,#f7f5ef_0%,#ece8dd_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#f7f5ef] to-transparent" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[50%] z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
        style={{
          opacity: introOpacity,
          width: orbitTextBounds.safeInnerWidth,
          maxWidth: orbitTextBounds.safeInnerWidth,
          maxHeight: orbitTextBounds.safeInnerHeight,
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
          className="block w-full whitespace-nowrap font-semibold leading-none tracking-normal text-black/55"
          style={{ fontSize: introFontSize }}
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
          className="mt-2 flex w-full items-center justify-center font-semibold leading-none tracking-normal text-[#151515] sm:mt-2.5"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: roleFontSize,
            maxWidth: orbitTextBounds.safeInnerWidth,
          }}
        >
          <span className="block max-w-full whitespace-nowrap text-center">
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

      <div className="relative z-10 flex h-screen w-full items-center justify-center px-4 pt-20 sm:px-6 lg:px-10">
        <div className="relative flex h-screen w-full max-w-[1320px] items-center justify-center">
          {imageSources.map((src, index) => (
            <MemoFlipCard
              key={`${src}-${index}`}
              src={src}
              index={index}
              smoothMorph={smoothMorph}
              smoothScrollRotate={smoothScrollRotate}
              smoothMouseX={smoothMouseX}
              enterLine={enterLine}
              enterCircle={enterCircle}
              geomVersion={geomVersion}
              geomRef={geomRef}
            />
          ))}
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
          Keep scrolling for reels
        </p>
      </motion.div>
    </section>
  );
}