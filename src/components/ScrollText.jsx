"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const ITEMS = [
  { label: "CONTENT CREATION", img: "https://i.pinimg.com/736x/ab/42/d1/ab42d1e4b550ce598d6fe8e3d25bfbb0.jpg", cap: "Visual language" },
  { label: "BRAND storytelling", img: "https://images.unsplash.com/photo-1557683316-973673baf926", cap: "Identity systems" },
  { label: "SOCIAL influence", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853", cap: "No-code builds" },
  { label: "PERFORMANCE marketing", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d", cap: "Product interfaces" },
  { label: "SALES conversion", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe", cap: "Motion engineering" },
  { label: "AUDIENCE growth", img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2", cap: "Depth & dimension" },
];

export default function ScrollPortfolio() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="relative bg-[#e8e6e1] py-10 sm:py-16">
      {/* 
         FIX: Changed height to 100dvh (dynamic viewport height) 
         Added py-10 to ensure section has top and bottom breathing room 
      */}
      <div className="sticky top-0 h-[100dvh] w-full flex items-center overflow-hidden py-6 sm:py-10">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 grid grid-cols-12 items-center gap-6 lg:gap-10">
          
          {/* TEXT COLUMN */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center select-none z-20">
            <span className="mb-6 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-black/40 font-semibold">
              Featured Projects
            </span>
            {ITEMS.map((item, i) => {
              const start = i / ITEMS.length;
              const end = (i + 1) / ITEMS.length;
              
              // Tightened the opacity range so items fade out faster before hitting the top/bottom
              const opacity = useTransform(smoothProgress, [start, start + 0.08, end - 0.08, end], [0.05, 1, 1, 0.05]);
              const yTranslate = useTransform(smoothProgress, [start, end], [8, -8]);

              return (
                <motion.div 
                  key={i} 
                  style={{ opacity, y: yTranslate }}
                  className="relative py-3 sm:py-4"
                >
                  <h2 className="text-[clamp(24px,5vw,64px)] font-bold leading-[1.1] tracking-tighter uppercase font-syne text-black">
                    {item.label}
                  </h2>
                  <motion.span 
                    className="absolute -bottom-1 left-0 text-[8px] sm:text-[9px] tracking-[0.35em] font-bold text-black/40 uppercase"
                    style={{ opacity }}
                  >
                    {item.cap}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          {/* IMAGE COLUMN */}
          <div className="hidden lg:col-span-5 lg:flex justify-center items-center z-10">
            <div className="relative w-full aspect-[4/5] max-h-[70vh] overflow-hidden rounded-sm bg-black/5 shadow-2xl">
              {ITEMS.map((item, i) => {
                const start = i / ITEMS.length;
                const end = (i + 1) / ITEMS.length;
                
                const opacity = useTransform(smoothProgress, [start - 0.1, start, end, end + 0.1], [0, 1, 1, 0]);
                const scale = useTransform(smoothProgress, [start, end], [1.15, 1]);

                return (
                  <motion.div
                    key={i}
                    style={{ opacity }}
                    className="absolute inset-0 z-10"
                  >
                    <motion.img
                      src={item.img}
                      alt={item.label}
                      style={{ scale }}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer determines scroll duration */}
      <div className="h-[300vh]" />
    </section>
  );
}