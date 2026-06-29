import { useEffect, useRef } from "react";

const BOUNDARY_COOLDOWN_MS = 520;
const SCROLL_EASE = 0.11;
const WHEEL_MULTIPLIER = 0.9;

export function usePanelScroll({ isActive, onReachStart }) {
  const scrollRef = useRef(null);
  const startTriggeredRef = useRef(false);
  const boundaryCooldownRef = useRef(false);
  const wasActiveRef = useRef(false);
  const touchStartYRef = useRef(0);
  const targetScrollRef = useRef(0);
  const rafRef = useRef(null);
  const wheelScrollingRef = useRef(false);

  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      startTriggeredRef.current = false;
      boundaryCooldownRef.current = false;
    }

    if (isActive && scrollRef.current) {
      targetScrollRef.current = scrollRef.current.scrollTop;
    }

    wasActiveRef.current = isActive;
  }, [isActive]);

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

    const handleWheel = (event) => {
      const atTop = element.scrollTop <= 1;

      if (atTop && event.deltaY < 0) {
        event.preventDefault();
        triggerStart();
        return;
      }

      if (!atTop) {
        startTriggeredRef.current = false;
      }

      event.preventDefault();

      if (!wheelScrollingRef.current) {
        targetScrollRef.current = element.scrollTop;
      }

      const maxScroll = getMaxScroll();
      targetScrollRef.current = Math.min(
        Math.max(targetScrollRef.current + event.deltaY * WHEEL_MULTIPLIER, 0),
        maxScroll
      );

      startWheelAnimation();
    };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      stopWheelAnimation();
      touchStartYRef.current = event.touches[0].clientY;
      targetScrollRef.current = element.scrollTop;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length !== 1) return;

      const atTop = element.scrollTop <= 1;
      const deltaY = touchStartYRef.current - event.touches[0].clientY;

      if (atTop && deltaY < -12) {
        triggerStart();
      }

      if (!atTop) {
        startTriggeredRef.current = false;
      }

      touchStartYRef.current = event.touches[0].clientY;
    };

    const handleScroll = () => {
      syncTarget();
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      stopWheelAnimation();
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("scroll", handleScroll);
    };
  }, [isActive, onReachStart]);

  return scrollRef;
}
