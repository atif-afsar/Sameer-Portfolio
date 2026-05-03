import { useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity, useAnimationFrame, useMotionValue } from 'framer-motion';

const MARQUEE_TEXT = "LET'S MAKE SOMETHING · SAMEER · ALWAYS ON A TRIP · MELOPHILE · NOMAD · ";

function MarqueeRow({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${(v % 100)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden flex flex-nowrap whitespace-nowrap py-4 border-b border-black/10 bg-[#efefef]">
      <motion.div 
        className="flex flex-nowrap whitespace-nowrap text-[clamp(4rem,10vw,12rem)] font-black uppercase leading-none font-bebas"
        style={{ x }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mr-12 block">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ContactForm() {
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center">
        <h2 className="font-syne text-4xl font-bold">Message Received.</h2>
        <p className="font-syne text-black/50 mt-4">I'll catch you on the flip side.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12 mt-12">
      {['name', 'email', 'message'].map((field) => (
        <div key={field} className="group relative">
          <label className={`absolute left-0 transition-all duration-500 font-syne uppercase text-[10px] tracking-widest ${focused === field ? '-top-6 text-black' : 'top-4 text-black/40'}`}>
            {field}
          </label>
          {field === 'message' ? (
            <textarea 
              rows={1}
              onFocus={() => setFocused(field)} 
              onBlur={() => setFocused(null)} 
              className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-4 font-syne text-lg resize-none transition-colors"
            />
          ) : (
            <input 
              onFocus={() => setFocused(field)} 
              onBlur={() => setFocused(null)} 
              className="w-full bg-transparent border-b border-black/20 focus:border-black outline-none py-4 font-syne text-lg transition-colors"
            />
          )}
        </div>
      ))}
      <motion.button
        onClick={() => setSubmitted(true)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-6 bg-black text-white font-syne uppercase tracking-[0.3em] text-[11px] font-bold overflow-hidden relative group"
      >
        <span className="relative z-10">Send Inquiry</span>
        <motion.div className="absolute inset-0 bg-yellow-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
      </motion.button>
    </div>
  );
}

export default function Contact() {
  return (
    <div id="contact" className="bg-[#efefef] text-black min-h-screen overflow-x-hidden selection:bg-yellow-300">
      {/* Decorative Progress Bar (Left) */}
      <div className="fixed left-0 top-0 w-[1px] h-full bg-black/10 z-50 hidden lg:block" />

      {/* Dynamic Scrolling Headers */}
      <section className="pt-20">
        <MarqueeRow baseVelocity={-2}>{MARQUEE_TEXT}</MarqueeRow>
        <MarqueeRow baseVelocity={2}>
            <span style={{ WebkitTextStroke: '1px black', color: 'transparent' }}>{MARQUEE_TEXT}</span>
        </MarqueeRow>
      </section>

      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Content Intro */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-syne text-[11px] uppercase tracking-[0.4em] text-black/40 mb-6">Available globally</p>
              <h1 className="font-syne text-[clamp(3.5rem,8vw,9rem)] leading-[0.85] font-bold tracking-tighter mb-12">
                Let's create <br/> digital magic.
              </h1>
              
              <div className="flex flex-wrap gap-x-20 gap-y-10 mt-20">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/40 mb-6">Socials</p>
                  <div className="flex flex-col gap-4">
                    {['Instagram', 'YouTube', 'Threads'].map(link => (
                      <motion.a 
                        key={link}
                        whileHover={{ x: 10 }}
                        href="#" 
                        className="font-syne text-3xl font-bold flex items-center gap-4 group"
                      >
                        {link} <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
                <div className="max-w-xs">
                   <p className="text-[10px] uppercase tracking-widest text-black/40 mb-6">Inquiries</p>
                   <p className="font-syne text-xl leading-relaxed">
                     Based in Aligarh, working with brands worldwide to define the next era of digital storytelling.
                   </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-5 relative">
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-white/40 backdrop-blur-2xl border border-black/5 p-10 lg:p-14 rounded-sm shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]"
            >
               <div className="flex justify-between items-start mb-10">
                 <p className="font-syne text-[10px] uppercase tracking-widest text-black/40">Direct Message</p>
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               </div>
               <ContactForm />
            </motion.div>
            
            <div className="mt-8 flex justify-between font-syne text-[10px] text-black/30 tracking-widest uppercase">
              <p>ALIGARH, IN</p>
              <p>27.53 N / 78.04 E</p>
            </div>
          </div>

        </div>
      </main>

      <footer className="px-6 lg:px-12 py-12 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-6">
        <p className="font-syne text-[10px] uppercase tracking-[0.2em] text-black/40">© 2026 Sameer — Creative Technologist</p>
        <p className="font-syne text-[10px] uppercase tracking-[0.2em] text-black/40">All rights reserved</p>
      </footer>
    </div>
  );
}