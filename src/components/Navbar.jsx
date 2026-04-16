import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: "Portfolio", href: "#home" },
    { label: "Reels", href: "#reels" },
    { label: "About", href: "#about" },
    { label: "Collabs", href: "#collabs" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center">
      {/* Expanding pill container */}
      <motion.div
        initial={{ width: "120px", borderRadius: "999px", opacity: 0, scaleY: 0.6 }}
        animate={{ width: "100%", borderRadius: "0px", opacity: 1, scaleY: 1 }}
        transition={{
          width: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
          borderRadius: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
          opacity: { duration: 0.3, delay: 0.1 },
          scaleY: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
        }}
        style={{ transformOrigin: "center top", overflow: "hidden" }}
        className="bg-black/70 backdrop-blur-xl border-b border-white/10"
      >
        <div className="w-full px-4 sm:px-6 md:px-12 py-4 md:py-5 flex items-center justify-between">
          {/* Logo */}
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-[20px] sm:text-[23px] font-semibold tracking-[-0.025em] leading-none"
          >
            sameer.
          </motion.span>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 1.0 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-white/60 hover:text-white transition-colors duration-200 text-[10px] uppercase tracking-[0.22em] font-medium"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.a
              href="#contact"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.38, ease: [0.22, 1, 0.36, 1] }}
              className="border border-white/20 bg-white/5 hover:bg-white/12 transition-colors duration-200 text-white text-[10px] uppercase tracking-[0.18em] px-4 py-2 rounded-full"
            >
              Book Shoot
            </motion.a>

            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.46, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/80 hover:text-white transition-colors duration-200 text-[10px] uppercase tracking-[0.24em]"
            >
              Instagram
            </motion.button>
          </div>

          {/* Mobile menu toggle */}
          <motion.button
            onClick={() => setMobileOpen((prev) => !prev)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden inline-flex items-center justify-center text-white/85 hover:text-white text-[10px] uppercase tracking-[0.22em] border border-white/20 rounded-full px-3 py-1.5"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? "Close" : "Menu"}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile dropdown */}
      <motion.div
        initial={false}
        animate={{
          height: mobileOpen ? "auto" : 0,
          opacity: mobileOpen ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden w-full overflow-hidden bg-black/88 border-b border-white/10"
      >
        <div className="px-4 sm:px-6 py-4 flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 hover:text-white transition-colors duration-200 text-[10px] uppercase tracking-[0.22em] font-medium py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-1 inline-flex w-fit border border-white/20 bg-white/5 hover:bg-white/12 transition-colors duration-200 text-white text-[10px] uppercase tracking-[0.18em] px-4 py-2 rounded-full"
          >
            Book Shoot
          </a>
        </div>
      </motion.div>
    </div>
  );
}