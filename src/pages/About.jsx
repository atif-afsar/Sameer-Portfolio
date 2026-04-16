import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

export default function About() {
  return (
    <section id="about" className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <motion.p
            {...fadeUp(0.12)}
            className="text-white/55 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] lg:tracking-[0.26em] font-medium"
          >
            About the Creator
          </motion.p>
          <motion.h2
            {...fadeUp(0.2)}
            className="mt-4 sm:mt-6 text-white leading-[0.95] sm:leading-[0.98] tracking-[-0.03em] font-medium"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(42px, 12vw, 102px)",
            }}
          >
            Editorial
            <br />
            Visionary
          </motion.h2>
          <motion.p
            {...fadeUp(0.28)}
            className="mt-5 sm:mt-7 lg:mt-8 text-white/70 text-[14px] sm:text-[16px] lg:text-[18px] leading-[1.6] sm:leading-[1.65] max-w-[560px]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            I create calm, high-impact visual stories for fashion,
            <span className="hidden sm:inline">
              <br />
            </span>
            lifestyle, and personal-brand campaigns. Every frame is
            <span className="hidden sm:inline">
              <br />
            </span>
            designed to feel cinematic, minimal, and emotionally sharp.
          </motion.p>
          <motion.div
            {...fadeUp(0.34)}
            className="mt-8 sm:mt-10 lg:mt-12 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-[560px]"
          >
            <div>
              <p
                className="text-white text-[30px] sm:text-[38px] lg:text-[44px] leading-none tracking-[-0.03em]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                120+
              </p>
              <p className="mt-2 text-white/50 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]">
                Projects
              </p>
            </div>
            <div>
              <p
                className="text-white text-[30px] sm:text-[38px] lg:text-[44px] leading-none tracking-[-0.03em]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                4Y
              </p>
              <p className="mt-2 text-white/50 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]">
                Experience
              </p>
            </div>
            <div>
              <p
                className="text-white text-[30px] sm:text-[38px] lg:text-[44px] leading-none tracking-[-0.03em]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                40M
              </p>
              <p className="mt-2 text-white/50 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em]">
                Reach
              </p>
            </div>
          </motion.div>
          <motion.p
            {...fadeUp(0.42)}
            className="mt-8 sm:mt-10 lg:mt-12 text-white/60 text-[9px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.24em] lg:tracking-[0.26em] font-medium"
          >
            Based in Aligarh · Working Worldwide
          </motion.p>
        </div>

        <div className="relative overflow-hidden min-h-[56vh] sm:min-h-[64vh] lg:min-h-[72vh] order-1 lg:order-2">
          <div className="absolute right-[-25%] sm:right-[-20%] bottom-[-20%] h-[92%] w-[85%] sm:w-[90%] rounded-full bg-white/10 blur-[50px] sm:blur-[58px]" />
          <motion.img
            {...fadeUp(0.1)}
            src="/images/image2.png"
            alt="About portrait"
            className="absolute inset-0 z-10 h-full w-full object-contain object-right sm:object-center lg:object-right grayscale"
            style={{
              filter:
                "grayscale(100%) brightness(0.9) contrast(1.12) drop-shadow(-20px 14px 44px rgba(0,0,0,0.25))",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-l from-[#0a0a0a]/56 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[18%] sm:h-[20%] bg-linear-to-t from-[#0a0a0a]/62 via-[#0a0a0a]/30 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 80% at 82% 58%, transparent 72%, rgba(10,10,10,0.2) 90%, rgba(10,10,10,0.38) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}