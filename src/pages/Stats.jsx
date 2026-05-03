import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

// Professional easing for high-end feel
const ease = [0.16, 1, 0.3, 1];

const Counter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Parse numeric value and suffix (e.g., "40M+" -> 40, "M+")
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericValue);
    }
  }, [isInView, motionValue, numericValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const stats = [
  { value: "40M+", label: "Total Reach" },
  { value: "120+", label: "Projects Completed" },
  { value: "4Y", label: "Experience" },
  { value: "95%", label: "Client Satisfaction" },
];

export default function Stats() {
  return (
    <section id="stats" className="min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center relative">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24 relative z-10">
        
        <header className="flex flex-col items-center mb-20">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.24em" }}
            transition={{ duration: 1, ease }}
            viewport={{ once: true }}
            className="text-white/40 text-[10px] sm:text-[11px] uppercase font-bold text-center"
          >
            Impact in Numbers
          </motion.p>
          
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2, ease }}
              viewport={{ once: true }}
              className="mt-4 text-white leading-[0.9] tracking-[-0.04em] font-bold text-center"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(48px, 12vw, 110px)",
              }}
            >
              Proven Results
            </motion.h2>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-white/10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease }}
              viewport={{ once: true }}
              className="group py-12 md:py-16 px-4 flex flex-col items-center justify-center border-b border-white/10 lg:border-b-0 lg:border-r last:border-r-0 border-white/10 transition-colors duration-500 hover:bg-white/[0.02]"
            >
              <div
                className="text-white text-[60px] sm:text-[80px] lg:text-[90px] leading-none font-bold tracking-[-0.05em] mb-4"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <Counter value={stat.value} />
              </div>
              
              <div className="relative overflow-hidden h-4">
                <motion.p 
                  className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] group-hover:-translate-y-full transition-transform duration-500"
                >
                  {stat.label}
                </motion.p>
                <motion.p 
                  className="absolute inset-0 text-white text-[10px] sm:text-[11px] uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                >
                  {stat.label}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}