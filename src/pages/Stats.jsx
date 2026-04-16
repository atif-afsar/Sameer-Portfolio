import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

const stats = [
  { value: "40M+", label: "Total Reach" },
  { value: "120+", label: "Projects Completed" },
  { value: "4Y", label: "Experience" },
  { value: "95%", label: "Client Satisfaction" },
];

export default function Stats() {
  return (
    <section id="stats" className="min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        <motion.p
          {...fadeUp(0.1)}
          className="text-white/55 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] font-medium text-center"
        >
          Impact in Numbers
        </motion.p>
        <motion.h2
          {...fadeUp(0.2)}
          className="mt-4 sm:mt-6 text-white leading-[0.95] sm:leading-[0.98] tracking-[-0.03em] font-medium text-center"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(42px, 10vw, 92px)",
          }}
        >
          Proven Results
        </motion.h2>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              {...fadeUp(0.1 + index * 0.1)}
              className="text-center"
            >
              <p
                className="text-white text-[48px] sm:text-[64px] lg:text-[80px] leading-none tracking-[-0.03em]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {stat.value}
              </p>
              <p className="mt-3 sm:mt-4 text-white/50 text-[10px] sm:text-[11px] uppercase tracking-[0.22em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
