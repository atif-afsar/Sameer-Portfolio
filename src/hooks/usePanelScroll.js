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

    // TOUCH: rely on the browser's native scrolling (with momentum) for the
    // panel body instead of the JS rAF animation. The custom path made the
    // final panel feel stuck on phones. We only watch the top edge: a clear
    // downward pull while already at the top sends the user to the previous
    // panel.
    let pullAccum = 0;

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      stopWheelAnimation();
      touchStartYRef.current = event.touches[0].clientY;
      pullAccum = 0;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length !== 1) return;

      const currentY = event.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY; // >0 scroll down, <0 pull down
      touchStartYRef.current = currentY;

      if (element.scrollTop <= 0 && deltaY < 0) {
        pullAccum += -deltaY;
        if (pullAccum > 52) {
          triggerStart();
        }
      } else if (deltaY > 0) {
        pullAccum = 0;
      }
      // No preventDefault: native scroll + momentum stay intact.
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

  const scrollToTop = useCallback((smooth = true) => {
    scrollApiRef.current.scrollToTop(smooth);
  }, []);

  return { scrollRef, scrollToTop };
}
