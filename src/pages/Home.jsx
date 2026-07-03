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

// Descriptive, keyword-aware alt text for each ring visual (helps image SEO
// without keyword stuffing). Falls back to a generic portfolio description.
const imageAltMap = {
  "/images/premier.png": "Adobe Premiere Pro — video editing for content creation",
  "/images/content.png": "Content creation workflow by Sameer Shameem",
  "/images/facebook.png": "Facebook Ads for performance marketing campaigns",
  "/images/gmail.png": "Email marketing outreach",
  "/images/googleAds.png": "Google Ads performance marketing in Aligarh",
  "/images/insta.png": "Instagram content and influencer marketing",
  "/images/meta.png": "Meta Ads management for brand growth",
  "/images/performance.jpeg": "Performance marketing results and analytics",
  "/images/sameer1.png": "Sameer Shameem, content creator and performance marketer from Aligarh",
  "/images/sales.jpeg": "Sales and conversion growth from marketing campaigns",
  "/images/x.png": "X (Twitter) social media marketing",
  "/images/youtube.png": "YouTube content creation and video marketing",
  "/images/image1.png": "Sameer Shameem content creator lifestyle visual",
  "/images/image2.png": "Sameer Shameem brand campaign visual",
  "/images/image3.png": "Sameer Shameem content creator portfolio visual",
  "/images/image4.png": "Sameer Shameem digital marketing portfolio visual",
};

function getImageAlt(src, index) {
  return imageAltMap[src] || `Sameer Shameem portfolio visual ${index + 1}`;
}

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
const HEADLINE_TEXT = "Stories shaped for attention.";

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

function getLongestWord(text) {
  return text
    .split(" ")
    .reduce((longest, word) => (word.length > longest.length ? word : longest), "");
}

function getCenterRoleFontSizes(displayText, activeRole, bounds) {
  const { safeInnerWidth, safeInnerHeight, isMobile } = bounds;
  const iamMax = isMobile ? 15 : 18;
  const iamMin = isMobile ? 11 : 13;
  const roleMax = isMobile ? 26 : 44;
  const roleMin = isMobile ? 13 : 18;

  const longestWord = getLongestWord(activeRole || displayText || "");

  let roleSize = fitFontSize(longestWord, safeInnerWidth, {
    max: roleMax,
    min: roleMin,
    charWidthRatio: 0.58,
  });
  let iamSize = fitFontSize("I am", safeInnerWidth, {
    max: iamMax,
    min: iamMin,
    charWidthRatio: 0.62,
  });

  const helloSize = isMobile ? 40 : 52;
  const lineGap = isMobile ? 4 : 6;
  const roleLineCount = 2;
  const blockHeight =
    helloSize + lineGap + iamSize * 1.2 + lineGap + roleSize * 1.1 * roleLineCount;

  if (blockHeight > safeInnerHeight) {
    const scale = safeInnerHeight / blockHeight;
    roleSize = Math.max(roleMin, roleSize * scale);
    iamSize = Math.max(iamMin, iamSize * scale);
  }

  return {
    iamFontSize: `${iamSize}px`,
    roleFontSize: `${roleSize}px`,
  };
}

const roles = [
  "Content Creator",
  "Digital Marketing Specialist",
  "Performance Marketer",
  "Growth Strategist",
  "Copy Writer",
];

// MOBILE PERF: the hover flip (back face + 3D context) can never trigger on a
// touch device, so on phones we render a lighter front-only card. That removes
// 16 offscreen back-face layers and 16 preserve-3d contexts from the compositor
// while looking identical to a mobile user. Desktop keeps the full flip.
const isMobileDevice =
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 767px)").matches);

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

  if (isMobileDevice) {
    return (
      <motion.div
        className="absolute h-[76px] w-[54px] sm:h-[86px] sm:w-[62px] lg:h-[98px] lg:w-[70px]"
        style={{ transform, opacity, willChange: "transform, opacity" }}
      >
        <div className="h-full w-full overflow-hidden rounded-[8px] bg-zinc-200 shadow-[0_18px_38px_rgba(0,0,0,0.22)] ring-1 ring-black/10">
          <img
            src={src}
            alt={getImageAlt(src, index)}
            className="h-full w-full object-cover"
            draggable="false"
            decoding="async"
            loading="eager"
          />
        </div>
      </motion.div>
    );
  }

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
            alt={getImageAlt(src, index)}
            className="h-full w-full object-cover transition duration-500"
            draggable="false"
            decoding="async"
            loading="eager"
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

export default function Home({
  isActive = true,
  onReachEnd,
  variant = "horizontal",
  scrollProgress,
}) {
  // In "vertical" mode Home is a sticky hero inside a tall wrapper and its morph
  // is driven by native page scroll (via `scrollProgress`) instead of hijacking
  // wheel/touch. This keeps the exact same hero animation while letting the rest
  // of the page scroll normally underneath it on mobile.
  const isVertical = variant === "vertical";
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
  const { iamFontSize, roleFontSize } = useMemo(
    () => getCenterRoleFontSizes(displayText, activeRole, orbitTextBounds),
    [displayText, activeRole, orbitTextBounds]
  );
  const roleWords = displayText.length > 0 ? displayText.split(" ") : [""];

  // MOBILE FIX: pick the scroll budget and morph breakpoint based on viewport.
  // Falls back to desktop values until containerSize is measured on first paint.
  const maxScroll = isMobileViewport ? MOBILE_MAX_SCROLL : DESKTOP_MAX_SCROLL;
  const morphBreakpoint = isMobileViewport ? MOBILE_MORPH_BREAKPOINT : DESKTOP_MORPH_BREAKPOINT;

  const morphProgress = useTransform(virtualScroll, [0, morphBreakpoint], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 80, damping: 26, mass: 0.5 });
  const scrollRotate = useTransform(virtualScroll, [morphBreakpoint, maxScroll], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 72, damping: 24, mass: 0.5 });
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 22 });
  // Reveal the headline block earlier so scrolling never feels like a blank page.
  const contentOpacity = useTransform(smoothMorph, [0.42, 0.72], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.42, 0.72], [18, 0]);
  const introOpacity = useTransform(smoothMorph, [0, 0.62], [1, 0]);
  // Desktop: fade in later and sit lower so "Lets Have a Glance" never collides
  // with the top headline block. Mobile keeps the earlier, centered timing.
  const glanceOpacity = useTransform(smoothMorph, (value) => {
    if (isMobileViewport) {
      if (value <= 0.5) return 0;
      if (value >= 0.9) return 0.8;
      if (value <= 0.66) return (value - 0.5) / 0.16;
      return 1;
    }
    if (value <= 0.58) return 0;
    if (value >= 0.92) return 0.8;
    if (value <= 0.76) return (value - 0.58) / 0.18;
    return 1;
  });
  const glanceY = useTransform(smoothMorph, (value) => {
    const start = isMobileViewport ? 0.5 : 0.58;
    const end = isMobileViewport ? 0.66 : 0.76;
    if (value <= start) return isMobileViewport ? 14 : 20;
    if (value >= end) return 0;
    const t = (value - start) / (end - start);
    return (isMobileViewport ? 14 : 20) * (1 - t);
  });
  const glanceScale = useTransform(smoothMorph, (value) => {
    const start = isMobileViewport ? 0.5 : 0.58;
    const end = isMobileViewport ? 0.66 : 0.76;
    if (value <= start) return 0.96;
    if (value >= end) return 1;
    const t = (value - start) / (end - start);
    return 0.96 + t * 0.04;
  });

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

  // PERF: decode every ring image up front (while the loader is still on screen)
  // so the first scroll doesn't trigger synchronous image decodes on the main
  // thread, which is the main source of the stutter right after a refresh.
  useEffect(() => {
    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
    });
  }, []);

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

  // VERTICAL MODE: drive the virtual scroll from native page scroll progress so
  // the hero morph plays as the user scrolls the page (no gesture hijacking).
  useEffect(() => {
    if (!isVertical || !scrollProgress) return undefined;

    const apply = (value) => {
      const clamped = Math.min(Math.max(value, 0), 1);
      const next = clamped * maxScroll;
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    apply(scrollProgress.get());
    return scrollProgress.on("change", apply);
  }, [isVertical, scrollProgress, maxScroll, virtualScroll]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !isActive || isVertical) return undefined;

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

    // MOBILE PERF: 2.8x multiplier + 200px per-event cap made a light swipe fling
    // the whole hero morph in one or two frames (looked "too fast" and dropped
    // frames as the springs snapped). A gentler multiplier and smaller cap give
    // an evenly paced, smooth morph that the springs can keep up with.
    const getTouchMultiplier = () =>
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 767px)").matches
        ? 1.6
        : 1;

    const getMaxStep = () =>
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 767px)").matches
        ? 95
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
  }, [virtualScroll, maxScroll, isActive, onReachEnd, isVertical]);

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
      className={`relative h-screen overflow-hidden bg-[#f7f5ef] text-[#111111] ${
        isVertical ? "sticky top-0" : "section-scroll-target"
      }`}
    >
      {/* SEO: real, crawlable text content. Visually hidden but present in the
          DOM so search engines reliably index the name, role, location and
          services even though the hero text is animated. */}
      <div className="sr-only">
        <h1>
          Sameer Shameem — Content Creator &amp; Performance Marketer from Aligarh
        </h1>
        <p>
          Sameer Shameem is a content creator and performance marketer based in
          Aligarh, Uttar Pradesh, India. He helps brands grow through
          performance marketing on Meta Ads and Google Ads, influencer
          marketing, social media content creation, and data-driven digital
          marketing campaigns. Looking for a content creator in Aligarh or a
          performance marketer in Aligarh? Sameer partners with brands across
          India and worldwide to turn attention into measurable growth.
        </p>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(80,126,255,0.14),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(245,168,62,0.16),transparent_30%),linear-gradient(180deg,#f7f5ef_0%,#ece8dd_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#f7f5ef] to-transparent" />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="pointer-events-none absolute left-1/2 top-[13%] z-20 flex w-full max-w-[760px] -translate-x-1/2 flex-col items-center px-5 text-center sm:top-[12%] lg:max-w-[680px]"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/45">
          Creator Portfolio
        </p>
        <h2
          className="mt-3 text-[clamp(34px,8vw,78px)] font-medium leading-[0.95] tracking-normal text-black"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {HEADLINE_TEXT}
        </h2>
        <p className="mt-4 max-w-[560px] text-[14px] leading-[1.6] text-black/60 sm:text-[16px]">
          Social-first visuals, brand campaigns, and digital growth work presented as a living editorial reel.
        </p>
      </motion.div>

      <div className="relative z-10 flex h-screen w-full items-center justify-center px-4 pt-20 sm:px-6 lg:px-10">
        <div className="relative flex h-screen w-full max-w-[1320px] items-center justify-center">
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
            style={{
              opacity: introOpacity,
              width: orbitTextBounds.safeInnerWidth,
              maxWidth: orbitTextBounds.safeInnerWidth,
              maxHeight: orbitTextBounds.safeInnerHeight,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={
                introPhase === "circle"
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 10, filter: "blur(8px)" }
              }
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="pt-4 text-[clamp(2.5rem,10vw,4.25rem)] font-bold leading-none tracking-[-0.03em] text-[#111111] sm:pt-5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Hello
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={
                introPhase === "circle"
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 10, filter: "blur(6px)" }
              }
              transition={{ duration: 0.8, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 font-medium leading-none tracking-[0.08em] text-black/50"
              style={{ fontSize: iamFontSize, fontFamily: "'Outfit', sans-serif" }}
            >
              I am
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={
                introPhase === "circle"
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 12, filter: "blur(8px)" }
              }
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 flex w-full flex-col items-center justify-center font-semibold leading-[1.05] tracking-normal text-[#151515]"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: roleFontSize,
                maxWidth: orbitTextBounds.safeInnerWidth,
              }}
            >
              {roleWords.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="block max-w-full whitespace-nowrap text-center"
                >
                  {word}
                  {wordIndex === roleWords.length - 1 && (
                    <span className="ml-1 inline-block h-[0.85em] w-[0.09em] translate-y-[0.08em] animate-pulse rounded-sm bg-black" />
                  )}
                </span>
              ))}
            </motion.p>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex w-full max-w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center px-4 text-center sm:px-6 lg:top-[63%] lg:max-w-[480px] lg:-translate-y-0 xl:top-[64%]"
            style={{
              opacity: glanceOpacity,
              y: glanceY,
              scale: glanceScale,
            }}
          >
            <p
              className="text-[clamp(1.65rem,7.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#111111] lg:text-[clamp(1.85rem,3.2vw,2.75rem)]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span className="block">Lets Have a</span>
              <span
                className="mt-1 block text-[clamp(1.85rem,8vw,3.75rem)] font-normal italic leading-[0.95] text-[#1a1a1a] sm:mt-1.5 lg:mt-1 lg:text-[clamp(2rem,3.5vw,3rem)]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Glance
              </span>
            </p>

            <motion.svg
              viewBox="0 0 24 24"
              className="mt-5 h-6 w-6 text-[#111111] sm:mt-6 sm:h-7 sm:w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </motion.svg>
          </motion.div>

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