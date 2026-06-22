"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home",     href: "#home"     },
    { label: "About",    href: "#about"    },
    { label: "Gallery",  href: "#gallery"  },
    { label: "Services", href: "#services" },
  ];

  const handleClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const sectionOrder = [
      "home","about","digital","gallery","anime",
      "brand-collaborations","stats","services","testimonials","contact",
    ];
    const idx = sectionOrder.indexOf(targetId);
    if (idx !== -1) {
      window.scrollTo({ top: idx * window.innerHeight, behavior: "smooth" });
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* ── Main bar ───────────────────────────────────────────────────────── */}
      {/*
        KEY FIX: replaced width+borderRadius animation (layout-triggering) with
        scaleX + clipPath on a full-width element. GPU-only — zero reflow.
      */}
      <motion.div
        initial={{ scaleX: 0.08, opacity: 0, y: -4 }}
        animate={{ scaleX: 1,    opacity: 1, y:  0 }}
        transition={{
          scaleX:  { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
          opacity: { duration: 0.25, delay: 0.1 },
          y:       { duration: 0.5,  ease: [0.22, 1, 0.36, 1], delay: 0.15 },
        }}
        style={{ transformOrigin: "center top", willChange: "transform, opacity" }}
        className="w-full  backdrop-blur-xl  border-white/10"
      >
        <div className="w-full px-4 sm:px-6 md:px-12 py-4 md:py-5 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => handleClick(e, "#home")}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="text-black text-[20px] sm:text-[23px] font-semibold tracking-[-0.025em] leading-none"
          >
            sameer.
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.85 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="text-black/60 hover:text-black transition-colors duration-200 text-[10px] uppercase tracking-[0.22em] font-medium"
              >
                {link.label}
              </motion.a>
            ))}

            <motion.button
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="text-black/80 hover:text-black transition-colors duration-200 text-[10px] uppercase tracking-[0.24em]"
            >
              Instagram
            </motion.button>

            <motion.a
              href="#contact"
              onClick={(e) => handleClick(e, "#contact")}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 1.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="border border-black/20 bg-black/5 hover:bg-black/12 transition-colors duration-200 text-black text-[10px] uppercase tracking-[0.18em] px-4 py-2 rounded-full"
            >
              Contact
            </motion.a>
          </div>

          {/* Mobile toggle — plain button, no entry animation to avoid jank */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden inline-flex items-center justify-center text-white/85 hover:text-white text-[10px] uppercase tracking-[0.22em] border border-white/20 rounded-full px-3 py-1.5 transition-colors duration-150"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </motion.div>

      {/* ── Mobile dropdown ─────────────────────────────────────────────────── */}
      {/*
        KEY FIX: AnimatePresence + translateY instead of animating `height`.
        Height animation forces layout on every frame → stutter on low-end phones.
        We unmount completely when closed so backdrop-filter isn't composited when idle.
      */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="md:hidden w-full bg-black/90 border-b border-white/10"
          >
            <div className="px-4 sm:px-6 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-white/80 hover:text-white transition-colors duration-150 text-[10px] uppercase tracking-[0.22em] font-medium py-1"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleClick(e, "#contact")}
                className="mt-1 inline-flex w-fit border border-white/20 bg-white/5 hover:bg-white/12 transition-colors duration-150 text-white text-[10px] uppercase tracking-[0.18em] px-4 py-2 rounded-full"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}