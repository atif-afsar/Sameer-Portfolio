import { useCallback, useEffect, useRef } from "react";

const BOUNDARY_COOLDOWN_MS = 520;
const SCROLL_EASE = 0.11;
const WHEEL_MULTIPLIER = 0.9;

export function usePanelScroll({ isActive, onReachStart, resetOnActivate = true }) {
  const scrollRef = useRef(null);
  const startTriggeredRef = useRef(false);
  const boundaryCooldownRef = useRef(false);
  const wasActiveRef = useRef(false);
  const touchStartYRef = useRef(0);
  const targetScrollRef = useRef(0);
  const rafRef = useRef(null);
  const wheelScrollingRef = useRef(false);
  const scrollApiRef = useRef({ scrollToTop: () => {} });

  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      startTriggeredRef.current = false;
      boundaryCooldownRef.current = false;

      if (resetOnActivate && scrollRef.current) {
        scrollRef.current.scrollTop = 0;
        targetScrollRef.current = 0;
      }
    }

    if (isActive && scrollRef.current) {
      targetScrollRef.current = scrollRef.current.scrollTop;
    }

    wasActiveRef.current = isActive;
  }, [isActive, resetOnActivate]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !isActive) return undefined;

    const getMaxScroll = () =>
      Math.max(element.scrollHeight - element.clientHeight, 0);

    const syncTarget = () => {
      if (!wheelScrollingRef.current) {
        targetScrollRef.current = element.scrollTop;
      }
    };

    const stopWheelAnimation = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      wheelScrollingRef.current = false;
    };

    const animateScroll = () => {
      const maxScroll = getMaxScroll();
      const current = element.scrollTop;
      const target = Math.min(Math.max(targetScrollRef.current, 0), maxScroll);
      const diff = target - current;

      if (Math.abs(diff) < 0.4) {
        element.scrollTop = target;
        stopWheelAnimation();
        return;
      }

      element.scrollTop = current + diff * SCROLL_EASE;
      rafRef.current = requestAnimationFrame(animateScroll);
    };

    const startWheelAnimation = () => {
      if (rafRef.current) return;
      wheelScrollingRef.current = true;
      rafRef.current = requestAnimationFrame(animateScroll);
    };

    const triggerStart = () => {
      if (boundaryCooldownRef.current || startTriggeredRef.current || !onReachStart) return;

      startTriggeredRef.current = true;
      boundaryCooldownRef.current = true;
      stopWheelAnimation();
      onReachStart();

      window.setTimeout(() => {
        boundaryCooldownRef.current = false;
      }, BOUNDARY_COOLDOWN_MS);
    };

    const applyScrollDelta = (deltaY) => {
      if (!deltaY) return false;

      const atTop = element.scrollTop <= 1;
      const scrollingUp = deltaY < 0;

      if (atTop && scrollingUp) {
        triggerStart();
        return false;
      }

      if (!atTop) {
        startTriggeredRef.current = false;
      }

      if (!wheelScrollingRef.current) {
        targetScrollRef.current = element.scrollTop;
      }

      const maxScroll = getMaxScroll();
      targetScrollRef.current = Math.min(
        Math.max(targetScrollRef.current + deltaY * WHEEL_MULTIPLIER, 0),
        maxScroll
      );

      startWheelAnimation();
      return true;
    };

    scrollApiRef.current.scrollToTop = (smooth = true) => {
      if (!smooth) {
        element.scrollTop = 0;
        targetScrollRef.current = 0;
        stopWheelAnimation();
        return;
      }

      targetScrollRef.current = 0;
      startWheelAnimation();
    };

    const handleWheel = (event) => {
      const consumed = applyScrollDelta(event.deltaY);
      if (consumed || (element.scrollTop <= 1 && event.deltaY < 0)) {
        event.preventDefault();
      }
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

      stopWheelAnimation();
      touchStartYRef.current = event.touches[0].clientY;
      targetScrollRef.current = element.scrollTop;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length !== 1) return;

      const deltaY = touchStartYRef.current - event.touches[0].clientY;
      touchStartYRef.current = event.touches[0].clientY;

      if (applyScrollDelta(deltaY)) {
        event.preventDefault();
      }
    };

    const handleScroll = () => {
      syncTarget();
    };

    const touchOptions = { passive: false };

    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, touchOptions);
    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      stopWheelAnimation();
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("scroll", handleScroll);
    };
  }, [isActive, onReachStart]);

  const scrollToTop = useCallback((smooth = true) => {
    scrollApiRef.current.scrollToTop(smooth);
  }, []);

  return { scrollRef, scrollToTop };
}
