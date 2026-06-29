import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

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
  return String(Math.round(value)).padStart(2, "0");
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

const DATE_UNITS = [
  {
    key: "years",
    label: "years",
    valueClass: "text-[clamp(6rem,30vw,14rem)] font-semibold",
    labelClass: "text-[18px] sm:text-[24px]",
    colClass: "min-w-[clamp(5.5rem,28vw,12rem)]",
  },
  {
    key: "months",
    label: "months",
    valueClass: "text-[clamp(3.5rem,16vw,7.5rem)] font-semibold",
    labelClass: "text-[16px] sm:text-[22px]",
    colClass: "min-w-[clamp(3.5rem,16vw,7rem)]",
  },
  {
    key: "days",
    label: "days",
    valueClass: "text-[clamp(2.75rem,12vw,5.5rem)] font-medium",
    labelClass: "text-[15px] sm:text-[20px]",
    colClass: "min-w-[clamp(3rem,14vw,5.5rem)]",
  },
];

const TIME_UNITS = [
  {
    key: "hours",
    label: "hours",
    colClass: "min-w-[clamp(3rem,12vw,5.5rem)]",
  },
  {
    key: "minutes",
    label: "minutes",
    colClass: "min-w-[clamp(3rem,12vw,5.5rem)]",
  },
  {
    key: "seconds",
    label: "seconds",
    colClass: "min-w-[clamp(3rem,12vw,5.5rem)]",
    accent: true,
  },
];

const TIME_VALUE_CLASS = "text-[clamp(2.75rem,11vw,5.25rem)] font-medium";
const TIME_LABEL_CLASS = "text-[15px] sm:text-[20px]";

const AnimatedDigit = memo(function AnimatedDigit({
  value,
  className,
  accent = false,
  animateOnView = true,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 42,
    stiffness: 85,
    mass: 0.6,
  });

  useEffect(() => {
    if (!animateOnView || isInView) {
      motionValue.set(value);
    }
  }, [animateOnView, isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (!ref.current) return;
      ref.current.textContent = pad(latest);
    });

    return unsubscribe;
  }, [springValue]);

  return (
    <span
      ref={ref}
      className={`inline-block tabular-nums leading-none tracking-[-0.03em] ${
        accent ? "text-[#507eff]" : "text-[#111111]"
      } ${className}`}
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      00
    </span>
  );
});

const Dot = memo(function Dot() {
  return (
    <span
      className="self-baseline px-0.5 text-[clamp(1.5rem,5vw,2.5rem)] font-light leading-none text-black/18 sm:px-1"
      aria-hidden="true"
    >
      ·
    </span>
  );
});

function UnitBlock({ value, label, valueClass, labelClass, colClass, accent = false }) {
  return (
    <div className={`flex flex-col items-center gap-2 sm:gap-2.5 ${colClass}`}>
      <AnimatedDigit value={value} className={valueClass} accent={accent} />
      <span
        className={`text-center font-normal text-black/58 ${labelClass}`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

function MetricRow({ units, live, getValueClass, getLabelClass }) {
  return (
    <div className="flex items-baseline justify-center gap-x-1 sm:gap-x-2">
      {units.map((unit, index) => (
        <Fragment key={unit.key}>
          {index > 0 && <Dot />}
          <UnitBlock
            value={live[unit.key]}
            label={unit.label}
            valueClass={getValueClass(unit)}
            labelClass={getLabelClass(unit)}
            colClass={unit.colClass}
            accent={unit.accent}
          />
        </Fragment>
      ))}
    </div>
  );
}

function DateRow({ live }) {
  return (
    <MetricRow
      units={DATE_UNITS}
      live={live}
      getValueClass={(unit) => unit.valueClass}
      getLabelClass={(unit) => unit.labelClass}
    />
  );
}

function TimeRow({ live }) {
  return (
    <MetricRow
      units={TIME_UNITS}
      live={live}
      getValueClass={() => TIME_VALUE_CLASS}
      getLabelClass={() => TIME_LABEL_CLASS}
    />
  );
}

export function MinimalExperienceCounter({ startDate }) {
  const live = useLiveExperience(startDate);

  return (
    <div className="w-full max-w-[min(100vw,1100px)] px-1 text-center sm:px-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 inline-flex items-center justify-center sm:mb-12"
      >
        <span className="relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-[#507eff]/25 bg-white/75 px-5 py-2.5 shadow-[0_8px_28px_rgba(80,126,255,0.12)] backdrop-blur-sm sm:gap-3 sm:px-7 sm:py-3">
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(80,126,255,0.14),transparent_65%)]" />
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#507eff] opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#507eff]" />
          </span>
          <span
            className="relative text-[13px] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a] sm:text-[15px]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Experience in the craft
          </span>
        </span>
      </motion.div>

      <div className="flex flex-col items-center gap-10 sm:gap-12">
        <DateRow live={live} />
        <TimeRow live={live} />
      </div>
    </div>
  );
}

export default MinimalExperienceCounter;
