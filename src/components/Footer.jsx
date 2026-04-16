import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

const socialLinks = [
  { name: "Instagram", url: "https://instagram.com/thesameer06" },
  { name: "YouTube", url: "https://youtube.com" },
  { name: "Threads", url: "https://threads.net/@thesameer06" },
  { name: "LinkedIn", url: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          <div className="lg:col-span-2">
            <motion.h3
              {...fadeUp(0.1)}
              className="text-white text-[32px] sm:text-[42px] font-medium tracking-[-0.02em]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Sameer
            </motion.h3>
            <motion.p
              {...fadeUp(0.2)}
              className="mt-4 text-white/60 text-[14px] sm:text-[16px] leading-[1.6] max-w-[400px]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Creating visual stories that inspire and connect.
              <br />
              Based in Aligarh, working worldwide.
            </motion.p>
          </div>

          <div>
            <motion.p
              {...fadeUp(0.1)}
              className="text-white/55 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-medium mb-4"
            >
              Connect
            </motion.p>
            <motion.div {...fadeUp(0.2)} className="space-y-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-white/70 hover:text-white text-[14px] sm:text-[15px] transition-colors"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          </div>

          <div>
            <motion.p
              {...fadeUp(0.1)}
              className="text-white/55 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-medium mb-4"
            >
              Contact
            </motion.p>
            <motion.div {...fadeUp(0.2)} className="space-y-2">
              <p
                className="text-white/70 text-[14px] sm:text-[15px]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                @thesameer06
              </p>
              <p
                className="text-white/70 text-[14px] sm:text-[15px]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Aligarh, India
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          {...fadeUp(0.3)}
          className="mt-12 sm:mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-white/50 text-[11px] sm:text-[12px] uppercase tracking-[0.18em]">
            © 2025 Sameer · All Rights Reserved
          </p>
          <p
            className="text-white/60 text-[13px] sm:text-[14px]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Made with intention.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
