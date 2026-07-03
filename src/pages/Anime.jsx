import { useRef, useEffect } from "react";
import Footer from "../components/Footer";
import { usePanelScroll } from "../hooks/usePanelScroll";

// Easing: cubic ease-in-out
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function WaterFillText({
  text,
  delay = 0,
  trigger,
  className = "",
  fontSize = "clamp(42px, 15vw, 120px)",
}) {
  const containerRef = useRef(null);
  const fillTextRef = useRef(null);
  const rafRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1800;
    const waveAmplitude = 8;
    let startTime = null;

    const fillText = fillTextRef.current;
    if (!fillText) return;

    const timer = setTimeout(() => {
      function frame(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(t);
        const phase = elapsed * 0.003;

        const waveOffset = Math.sin(phase) * waveAmplitude * (1 - eased * 0.8);
        const fillPercent = 100 - eased * 100;

        fillText.style.clipPath = `inset(${fillPercent - waveOffset}% 0 0 0)`;

        const blurAmount = 5 * (1 - eased);
        fillText.style.filter = `blur(${blurAmount}px)`;

        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          fillText.style.clipPath = "inset(0% 0 0 0)";
          fillText.style.filter = "blur(0px)";
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger, delay]);

  const sharedTextStyle = {
    fontFamily: "'Barlow Condensed', 'Arial Black', sans-serif",
    fontWeight: 900,
    fontSize,
    letterSpacing: "-0.01em",
    textTransform: "uppercase",
    lineHeight: 0.94,
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full max-w-full text-center ${className}`}
    >
      <span
        className="block w-full max-w-full select-none"
        style={{
          ...sharedTextStyle,
          color: "transparent",
          WebkitTextStroke: "clamp(1px, 0.25vw, 1.5px) rgba(255,255,255,0.18)",
        }}
      >
        {text}
      </span>

      <span
        ref={fillTextRef}
        className="absolute top-0 left-0 block w-full max-w-full select-none pointer-events-none"
        style={{
          ...sharedTextStyle,
          color: "#ffffff",
          willChange: "clip-path, filter",
          filter: "blur(5px)",
          clipPath: "inset(100% 0 0 0)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default function Anime({
  isActive = true,
  onReachStart,
}) {
  const { scrollRef, scrollToTop } = usePanelScroll({ isActive, onReachStart });

  return (
    <section
      id="anime"
      ref={scrollRef}
      className="panel-scroll h-screen w-full overflow-y-auto overflow-x-hidden no-scrollbar"
      style={{ touchAction: "pan-y" }}
    >
      <div
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6 sm:py-24"
        style={{ background: "#000000" }}
      >
        <p
          className="mb-6 text-center sm:mb-10"
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
          <WaterFillText
            text="I CREATE CONTENT"
            delay={0}
            trigger={isActive}
            fontSize="clamp(24px, 7.2vw, 110px)"
          />
          <WaterFillText
            text="THAT CONVERT"
            delay={300}
            trigger={isActive}
            fontSize="clamp(28px, 8.5vw, 120px)"
          />
        </div>

        <p
          className="mt-8 max-w-full text-center sm:mt-12"
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
          className="absolute pointer-events-none"
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

      <Footer
        id="footer"
        scrollRoot={scrollRef}
        scrollToTop={scrollToTop}
      />
    </section>
  );
}
