import { memo, useEffect, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";

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

export default memo(function MetricCounter({
  value,
  className,
  style,
  active = false,
  delay = 0,
}) {
  const ref = useRef(null);
  const parsed = parseMetricValue(value);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const updateDisplay = (latest) => {
      if (!ref.current) return;

      ref.current.textContent = formatMetric({
        prefix: parsed.prefix,
        numeric: latest,
        suffix: parsed.suffix,
        decimals: parsed.decimals,
      });
    };

    updateDisplay(motionValue.get());
    return motionValue.on("change", updateDisplay);
  }, [motionValue, parsed.prefix, parsed.suffix, parsed.decimals]);

  useEffect(() => {
    if (!active) {
      motionValue.stop();
      motionValue.set(0);
      return undefined;
    }

    motionValue.set(0);

    let controls;
    const timeoutId = window.setTimeout(() => {
      controls = animate(motionValue, parsed.numeric, {
        duration: 1.65,
        ease: [0.22, 1, 0.36, 1],
      });
    }, delay * 1000);

    return () => {
      window.clearTimeout(timeoutId);
      controls?.stop();
      motionValue.stop();
    };
  }, [active, delay, motionValue, parsed.numeric]);

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
