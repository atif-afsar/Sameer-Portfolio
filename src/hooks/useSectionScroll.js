import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

export const INTRO_PHASE_END = 0.34;
const BOUNDARY_COOLDOWN_MS = 520;

function getInputConfig() {
  const isMobile =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 767px)").matches;

  // Lower multipliers + smaller per-event cap = the intro and the card track
  // advance gradually instead of flashing past in a single swipe/flick. Mobile
  // keeps a slightly higher feel so a normal swipe still makes clear progress.
  // Tuned slower so each section/card has time to render fully while scrolling.
  // MOBILE PERF: the previous per-event cap (0.028) let a single touchmove jump
  // ~3% of the whole section, which the spring then chased in a burst -> the
  // "content moves too fast / frames drop" feel. Smaller cap = smoother, evenly
  // paced motion that stays on the compositor.
  return isMobile
    ? { scrollMultiplier: 0.00105, maxScrollStep: 0.017, touchMultiplier: 0.9 }
    : { scrollMultiplier: 0.00062, maxScrollStep: 0.016, touchMultiplier: 0.85 };
}

export function useSectionScroll({
  isActive,
  onReachStart,
  onReachEnd,
  introPhaseEnd = INTRO_PHASE_END,
}) {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const progress = useMotionValue(0);
  // Responsive yet glassy: higher stiffness removes the initial lag ("delay"),
  // while the damping/mass keep it from overshooting so cards don't snap past.
  const smoothProgress = useSpring(progress, {
    stiffness: isMobileSpring() ? 70 : 58,
    damping: isMobileSpring() ? 28 : 26,
    mass: 0.6,
    restDelta: 0.0004,
  });

  const startTriggeredRef = useRef(false);
  const endTriggeredRef = useRef(false);
  const boundaryCooldownRef = useRef(false);
  const wasActiveRef = useRef(false);

  const introProgress = useTransform(smoothProgress, [0, introPhaseEnd], [0, 1]);
  const trackProgress = useTransform(smoothProgress, [introPhaseEnd, 1], [0, 1]);

  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      progressRef.current = 0;
      progress.set(0);
      startTriggeredRef.current = false;
      endTriggeredRef.current = false;
      boundaryCooldownRef.current = false;
    }
    wasActiveRef.current = isActive;
  }, [isActive, progress]);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || !isActive) return undefined;

    const inputConfig = getInputConfig();

    const triggerBoundary = (direction) => {
      if (boundaryCooldownRef.current) return;

      if (direction === "start") {
        if (startTriggeredRef.current || !onReachStart) return;
        startTriggeredRef.current = true;
      } else {
        if (endTriggeredRef.current || !onReachEnd) return;
        endTriggeredRef.current = true;
      }

      boundaryCooldownRef.current = true;
      window.setTimeout(() => {
        boundaryCooldownRef.current = false;
      }, BOUNDARY_COOLDOWN_MS);

      if (direction === "start") {
        onReachStart?.();
      } else {
        onReachEnd?.();
      }
    };

    const applyScroll = (deltaY) => {
      if (!deltaY) return false;

      const { scrollMultiplier, maxScrollStep } = inputConfig;
      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;
      const atMax = progressRef.current >= 0.996;
      const atMin = progressRef.current <= 0.004;

      if (scrollingUp && atMin) {
        triggerBoundary("start");
        return false;
      }

      if (scrollingDown && atMax) {
        triggerBoundary("end");
        return false;
      }

      if (!atMin) startTriggeredRef.current = false;
      if (!atMax) endTriggeredRef.current = false;

      const clampedDelta = Math.max(
        Math.min(deltaY * scrollMultiplier, maxScrollStep),
        -maxScrollStep
      );
      const nextProgress = Math.min(Math.max(progressRef.current + clampedDelta, 0), 1);

      if (Math.abs(nextProgress - progressRef.current) < 0.0001) {
        return false;
      }

      progressRef.current = nextProgress;
      progress.set(nextProgress);

      return true;
    };

    const handleWheel = (event) => {
      if (applyScroll(event.deltaY)) {
        event.preventDefault();
      }
    };

    let touchStartY = 0;
    let touchTracking = false;

    const handleTouchMove = (event) => {
      if (!touchTracking || event.touches.length !== 1) return;

      const { touchMultiplier } = inputConfig;
      const currentY = event.touches[0].clientY;
      const deltaY = (touchStartY - currentY) * touchMultiplier;
      touchStartY = currentY;

      if (applyScroll(deltaY)) {
        event.preventDefault();
      }
    };

    const stopTouchTracking = () => {
      touchTracking = false;
      document.removeEventListener("touchmove", handleTouchMove, touchOptions);
      document.removeEventListener("touchend", stopTouchTracking, passiveCapture);
      document.removeEventListener("touchcancel", stopTouchTracking, passiveCapture);
    };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;

      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("a, button, input, textarea, select, [data-scroll-lock]")
      ) {
        return;
      }

      touchTracking = true;
      touchStartY = event.touches[0].clientY;
      document.addEventListener("touchmove", handleTouchMove, touchOptions);
      document.addEventListener("touchend", stopTouchTracking, passiveCapture);
      document.addEventListener("touchcancel", stopTouchTracking, passiveCapture);
    };

    const touchOptions = { passive: false, capture: true };
    const passiveCapture = { passive: true, capture: true };

    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("touchstart", handleTouchStart, passiveCapture);

    return () => {
      stopTouchTracking();
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("touchstart", handleTouchStart, passiveCapture);
    };
  }, [isActive, onReachStart, onReachEnd, progress]);

  return {
    sectionRef,
    progressRef,
    smoothProgress,
    introProgress,
    trackProgress,
  };
}

function isMobileSpring() {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 767px)").matches)
  );
}

function interpolateSnapOffsets(offsets, scrollPortion) {
  if (!offsets.length) return 0;

  const maxIndex = Math.max(offsets.length - 1, 0);
  const floatIndex = scrollPortion * maxIndex;
  const lowerIndex = Math.floor(floatIndex);
  const upperIndex = Math.min(lowerIndex + 1, maxIndex);
  const t = floatIndex - lowerIndex;

  return offsets[lowerIndex] + (offsets[upperIndex] - offsets[lowerIndex]) * t;
}

export function useSnapTrackMotion(trackProgress, snapRef, { enterEnd = 0.2 } = {}) {
  // Ramp the track in immediately at the phase boundary so it crossfades with the
  // fading intro heading — otherwise there is a long blank/white gap between the
  // zoomed heading disappearing and the cards appearing.
  const trackLayerOpacity = useTransform(trackProgress, [0, 0.1], [0, 1]);
  const trackEnterX = useTransform(trackProgress, [0, enterEnd, 1], [72, 0, 0]);
  const trackScrollX = useTransform(trackProgress, (value) => {
    const { offsets } = snapRef.current;
    if (!offsets?.length) return 0;

    if (value <= enterEnd) return offsets[0];

    const scrollPortion = (value - enterEnd) / (1 - enterEnd);
    return interpolateSnapOffsets(offsets, scrollPortion);
  });
  const trackX = useTransform([trackEnterX, trackScrollX], ([enter, scroll]) => enter + scroll);
  const browseHintOpacity = useTransform(trackProgress, [0.22, 0.38, 0.9, 1], [0, 1, 0.55, 0]);

  return { trackLayerOpacity, trackX, browseHintOpacity };
}

export function useMeasureSnapTrack(
  trackRef,
  viewportRef,
  cardSelector = ".expertise-track-card",
  remeasureKey = 0
) {
  const snapRef = useRef({ offsets: [0], cardCount: 0 });

  useEffect(() => {
    const measureTrack = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      const cards = track.querySelectorAll(cardSelector);
      if (!cards.length) return;

      const viewportCenter = viewport.clientWidth / 2;
      const offsets = Array.from(cards).map((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        return viewportCenter - cardCenter;
      });

      snapRef.current = { offsets, cardCount: cards.length };
    };

    measureTrack();

    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(measureTrack)
      : null;

    if (observer && trackRef.current) {
      observer.observe(trackRef.current);
    }
    if (observer && viewportRef.current) {
      observer.observe(viewportRef.current);
    }

    window.addEventListener("resize", measureTrack, { passive: true });
    const measureTimerOne = window.setTimeout(measureTrack, 120);
    const measureTimerTwo = window.setTimeout(measureTrack, 500);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureTrack);
      window.clearTimeout(measureTimerOne);
      window.clearTimeout(measureTimerTwo);
    };
  }, [trackRef, viewportRef, cardSelector, remeasureKey]);

  return snapRef;
}
