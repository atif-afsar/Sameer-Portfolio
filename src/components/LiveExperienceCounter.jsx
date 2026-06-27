import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function computeBreakdown(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  let hours = to.getHours() - from.getHours();
  let minutes = to.getMinutes() - from.getMinutes();
  let seconds = to.getSeconds() - from.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export function useLiveExperience(startDate) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return useMemo(() => computeBreakdown(startDate, now), [startDate, now]);
}

const AnimatedValue = memo(function AnimatedValue({
  value,
  className = "",
  accent = false,
}) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.55, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`block tabular-nums leading-none ${accent ? "text-[#507eff]" : "text-[#111111]"} ${className}`}
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      {pad(value)}
    </motion.span>
  );
});

const DateUnit = memo(function DateUnit({ value, label, valueClass, labelClass = "" }) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center sm:gap-3">
      <AnimatedValue value={value} className={valueClass} />
      <span
        className={`text-[13px] font-medium leading-none text-black/68 sm:text-[14px] ${labelClass}`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
});

const ClockSegment = memo(function ClockSegment({ value, label, accent = false }) {
  return (
    <div className="flex min-w-[4.5rem] flex-col items-center gap-2 sm:min-w-[5.5rem]">
      <AnimatedValue
        value={value}
        accent={accent}
        className="text-[clamp(1.75rem,6vw,2.75rem)] font-medium tracking-[-0.03em]"
      />
      <span
        className="text-[12px] font-medium text-black/62 sm:text-[13px]"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
});

export function MinimalExperienceCounter({ startDate }) {
  const live = useLiveExperience(startDate);

  return (
    <div className="relative w-full max-w-[520px] px-1 sm:max-w-[560px]">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/75 bg-white/58 px-6 py-8 shadow-[0_24px_64px_rgba(0,0,0,0.09)] backdrop-blur-xl sm:rounded-[2rem] sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.9),transparent_55%)]" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[rgba(80,126,255,0.1)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-[rgba(245,168,62,0.12)] blur-3xl" />

        <div className="relative">
          <div className="mb-7 flex items-center justify-center gap-2 sm:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#507eff] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#507eff]" />
            </span>
            <span
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/50 sm:text-[12px]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Live experience
            </span>
          </div>

          {/* Years — hero */}
          <div className="border-b border-black/[0.06] pb-7 text-center sm:pb-8">
            <AnimatedValue
              value={live.years}
              className="text-[clamp(4rem,18vw,6.5rem)] font-semibold tracking-[-0.05em]"
            />
            <p
              className="mt-3 text-[15px] font-medium text-black/70 sm:mt-4 sm:text-[16px]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Years
            </p>
          </div>

          {/* Months & Days */}
          <div className="grid grid-cols-2 divide-x divide-black/[0.06] border-b border-black/[0.06] py-6 sm:py-7">
            <DateUnit
              value={live.months}
              label="Months"
              valueClass="text-[clamp(2.25rem,9vw,3.5rem)] font-medium tracking-[-0.04em]"
            />
            <DateUnit
              value={live.days}
              label="Days"
              valueClass="text-[clamp(1.85rem,7vw,2.85rem)] font-medium tracking-[-0.03em]"
            />
          </div>

          {/* Clock strip */}
          <div className="pt-6 sm:pt-7">
            <p
              className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-black/45 sm:mb-5 sm:text-[12px]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Right now
            </p>
            <div className="flex items-start justify-center gap-1 sm:gap-2">
              <ClockSegment value={live.hours} label="Hours" />
              <span
                className="mt-1 text-[clamp(1.5rem,5vw,2.25rem)] font-extralight leading-none text-black/20"
                aria-hidden="true"
              >
                :
              </span>
              <ClockSegment value={live.minutes} label="Minutes" />
              <span
                className="mt-1 text-[clamp(1.5rem,5vw,2.25rem)] font-extralight leading-none text-black/20"
                aria-hidden="true"
              >
                :
              </span>
              <ClockSegment value={live.seconds} label="Seconds" accent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinimalExperienceCounter;
