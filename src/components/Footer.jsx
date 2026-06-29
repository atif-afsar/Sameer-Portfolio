import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const socialLinks = [
  { name: "Instagram", url: "https://instagram.com/thesameer06" },
  { name: "YouTube", url: "https://youtube.com" },
  { name: "Threads", url: "https://threads.net/@thesameer06" },
  { name: "LinkedIn", url: "https://linkedin.com" },
];

const ease = [0.16, 1, 0.3, 1];

function Reveal({
  children,
  className = "",
  delay = 0,
  y = 36,
  scrollRoot,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay, ease }}
      viewport={{
        once: true,
        amount: 0.35,
        ...(scrollRoot ? { root: scrollRoot } : {}),
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Footer({
  id = "footer",
  scrollRoot,
  onBackToTop,
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBackToTop = () => {
    if (scrollRoot?.current) {
      scrollRoot.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (onBackToTop) {
      window.setTimeout(() => onBackToTop(), scrollRoot?.current ? 420 : 0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      id={id}
      className="relative w-full overflow-x-hidden bg-[#0a0a0a] pt-20 pb-16 selection:bg-[#FFD400] selection:text-black sm:pt-24 sm:pb-20"
    >
      <div className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-y-0">
          <div className="lg:col-span-6">
            <Reveal scrollRoot={scrollRoot}>
              <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/30 sm:text-[10px] sm:tracking-[0.4em]">
                Get in touch
              </span>
              <h2
                className="mt-5 max-w-full text-[clamp(2rem,9.5vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-white sm:mt-6 lg:text-[clamp(2.75rem,6vw,7rem)]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Let&apos;s create{" "}
                <span className="block sm:inline">
                  something{" "}
                  <span className="text-white/25 italic">iconic.</span>
                </span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:col-span-5 lg:col-start-8">
            <Reveal scrollRoot={scrollRoot} delay={0.08}>
              <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.24em] text-white/30 sm:mb-6 sm:text-[10px] sm:tracking-[0.3em]">
                Socials
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {socialLinks.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.12 + i * 0.07, ease }}
                    viewport={{
                      once: true,
                      amount: 0.5,
                      ...(scrollRoot ? { root: scrollRoot } : {}),
                    }}
                  >
                    <a
                      href={link.url}
                      className="group flex items-center gap-2 text-base text-white/60 transition-colors hover:text-white sm:text-lg"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-4" />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </Reveal>

            <Reveal scrollRoot={scrollRoot} delay={0.14}>
              <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.24em] text-white/30 sm:mb-6 sm:text-[10px] sm:tracking-[0.3em]">
                Location
              </p>
              <div
                className="text-base leading-snug text-white/60 sm:text-lg"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Aligarh, India
                <br />
                <span className="text-sm tracking-widest text-white/25">{time} IST</span>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="mt-8 sm:mt-10"
              >
                <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 sm:text-[11px] sm:tracking-widest">
                    Available for hire
                  </span>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>

        <div className="relative mt-20 border-t border-white/5 pt-10 sm:mt-28 sm:pt-12 lg:mt-36">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease }}
            viewport={{
              once: true,
              amount: 0.25,
              ...(scrollRoot ? { root: scrollRoot } : {}),
            }}
            className="pointer-events-none mb-8 w-full text-center text-[clamp(2rem,11vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-white/[0.06] sm:mb-10 sm:text-[clamp(2.5rem,14vw,9rem)]"
            style={{ fontFamily: "'Syne', sans-serif" }}
            aria-hidden="true"
          >
            <span className="block uppercase">Sameer</span>
            <span className="block uppercase">Shameem</span>
          </motion.p>

          <Reveal
            scrollRoot={scrollRoot}
            delay={0.05}
            y={20}
            className="relative z-10"
          >
            <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:gap-6 md:text-left">
              <div className="flex flex-wrap justify-center gap-4 text-[9px] uppercase tracking-[0.18em] text-white/30 sm:gap-8 sm:text-[10px] sm:tracking-[0.2em] md:justify-start">
                <p>© 2026</p>
                <p>Designed by me</p>
              </div>

              <motion.button
                type="button"
                onClick={handleBackToTop}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group flex flex-col items-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all duration-500 group-hover:border-white group-hover:bg-white">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="rotate-180 transform transition-colors group-hover:text-black"
                  >
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span className="text-[9px] uppercase tracking-[0.28em] text-white/25 transition-colors group-hover:text-white">
                  Back to top
                </span>
              </motion.button>

              <div className="text-[9px] uppercase tracking-[0.18em] text-white/30 sm:text-[10px] sm:tracking-[0.2em]">
                Personal Portfolio v2.0
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
