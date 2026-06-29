import { memo, useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

function parseMetricValue(value) {
  const str = String(value).trim();
  const prefixMatch = str.match(/^([+\-])/);
  const prefix = prefixMatch ? prefixMatch[1] : "";
  const rest = prefix ? str.slice(1) : str;
  const numericMatch = rest.match(/^[\d.]+/);
  const numericText = numericMatch?.[0] ?? "0";
  const numeric = parseFloat(numericText);
  const suffix = rest.slice(numericText.length);
  const decimals = numericText.includes(".") ? numericText.split(".")[1].length : 0;

  return { prefix, numeric, suffix, decimals };
}

function formatMetric({ prefix, numeric, suffix, decimals }) {
  const formatted =
    decimals > 0 ? numeric.toFixed(decimals) : String(Math.round(numeric));

  return `${prefix}${formatted}${suffix}`;
}

export default memo(function MetricCounter({ value, className, style, active }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const shouldAnimate = active ?? isInView;
  const parsed = parseMetricValue(value);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 55,
    stiffness: 90,
  });

  useEffect(() => {
    if (shouldAnimate) {
      motionValue.set(parsed.numeric);
    }
  }, [shouldAnimate, motionValue, parsed.numeric]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (!ref.current) return;

      ref.current.textContent = formatMetric({
        prefix: parsed.prefix,
        numeric: latest,
        suffix: parsed.suffix,
        decimals: parsed.decimals,
      });
    });

    return unsubscribe;
  }, [springValue, parsed.prefix, parsed.suffix, parsed.decimals]);

  const initialDisplay = formatMetric({
    prefix: parsed.prefix,
    numeric: 0,
    suffix: parsed.suffix,
    decimals: parsed.decimals,
  });

  return (
    <span ref={ref} className={className} style={style}>
      {initialDisplay}
    </span>
  );
});
