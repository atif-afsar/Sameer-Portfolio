import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const socialLinks = [
  { name: "Instagram", url: "https://instagram.com/thesameer06" },
  { name: "YouTube", url: "https://youtube.com" },
  { name: "Threads", url: "https://threads.net/@thesameer06" },
  { name: "LinkedIn", url: "https://linkedin.com" },
];

const transition = { duration: 1, ease: [0.16, 1, 0.3, 1] };

export default function Footer() {
  const [time, setTime] = useState("");

  // Professional touch: Local time clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        hour12: false, 
        hour: "2-digit", 
        minute: "2-digit",
        timeZone: "Asia/Kolkata" 
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative bg-[#0a0a0a] pt-24 pb-12 overflow-hidden selection:bg-[#FFD400] selection:text-black">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-y-16 lg:gap-y-0">
          
          {/* Big Brand Section */}
          <div className="col-span-12 lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={transition}
              viewport={{ once: true }}
            >
              <span className="text-white/30 text-[10px] uppercase tracking-[0.5em] font-bold">Get in touch</span>
              <h2 
                className="text-white text-[clamp(40px,8vw,120px)] font-bold leading-[0.9] tracking-[-0.05em] mt-6"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Let’s create <br /> something <span className="text-white/20 italic">iconic.</span>
              </h2>
            </motion.div>
          </div>

          {/* Navigation/Info Section */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 grid grid-cols-2 gap-8">
            {/* Socials */}
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Socials</p>
              <ul className="space-y-4">
                {socialLinks.map((link, i) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ ...transition, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a 
                      href={link.url}
                      className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors font-syne text-lg"
                    >
                      <span className="w-0 group-hover:w-4 h-[1px] bg-white transition-all duration-300" />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Availability / Time */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Location</p>
                <div className="text-white/60 font-syne text-lg leading-snug">
                  Aligarh, India <br />
                  <span className="text-white/20 text-sm tracking-widest">{time} IST</span>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="mt-12 lg:mt-0"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white/60 text-[11px] uppercase tracking-widest font-bold">Available for hire</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Massive Footer Signature */}
        <div className="mt-32 lg:mt-48 relative border-t border-white/5 pt-12">
          <motion.h1 
            initial={{ opacity: 0.02 }}
            whileInView={{ opacity: 0.05 }}
            transition={{ duration: 2 }}
            className="absolute -bottom-10 lg:-bottom-20 left-0 right-0 text-[20vw] font-black uppercase tracking-tighter select-none pointer-events-none text-white whitespace-nowrap"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            SAMEER AFSAR
          </motion.h1>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-white/30">
              <p>© 2026</p>
              <p>Designed by me</p>
            </div>
            
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:text-black transition-colors transform rotate-180">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">Back to top</span>
            </motion.button>

            <div className="text-[10px] uppercase tracking-[0.2em] text-white/30">
              Personal Portfolio v2.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 