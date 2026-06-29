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

const DATE_UNITS = [
  { key: "years", label: "years" },
  { key: "months", label: "months" },
  { key: "days", label: "days" },
];

const TIME_UNITS = [
  { key: "hours", label: "hours" },
  { key: "minutes", label: "minutes" },
  { key: "seconds", label: "seconds", accent: true },
];

const UnitCell = memo(function UnitCell({ value, label, accent = false, large = false }) {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <motion.span
        key={value}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`tabular-nums font-semibold leading-none tracking-[-0.03em] ${
          accent ? "text-[#507eff]" : "text-[#111111]"
        } ${large ? "text-[clamp(2.25rem,8vw,3.5rem)]" : "text-[clamp(2rem,7vw,3rem)]"}`}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {pad(value)}
      </motion.span>
      <span
        className="text-[14px] font-normal text-black/58 sm:text-[16px]"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
});

const Dot = memo(function Dot() {
  return (
    <span className="pb-5 text-xl font-light text-black/20 sm:pb-6 sm:text-2xl" aria-hidden="true">
      ·
    </span>
  );
});

function UnitRow({ units, live, largeFirst = false }) {
  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr_auto_1fr] items-center justify-items-center gap-x-2 sm:gap-x-4">
      {units.map((unit, index) => (
        <div key={unit.key} className="contents">
          {index > 0 && <Dot />}
          <UnitCell
            value={live[unit.key]}
            label={unit.label}
            accent={unit.accent}
            large={largeFirst && index === 0}
          />
        </div>
      ))}
    </div>
  );
}

export function MinimalExperienceCounter({ startDate }) {
  const live = useLiveExperience(startDate);

  return (
    <div className="w-full max-w-[min(94vw,600px)] px-2 text-center sm:max-w-[640px]">
      <p
        className="mb-7 text-[12px] font-medium uppercase tracking-[0.2em] text-black/42 sm:mb-8 sm:text-[14px]"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        Experience in the craft
      </p>

      <div className="flex flex-col items-center gap-6 sm:gap-8">
        <UnitRow units={DATE_UNITS} live={live} largeFirst />
        <div className="h-px w-10 bg-black/10 sm:w-12" aria-hidden="true" />
        <UnitRow units={TIME_UNITS} live={live} />
      </div>
    </div>
  );
}

export default MinimalExperienceCounter;
