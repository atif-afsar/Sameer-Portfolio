import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GALLERY_BG = '#0a0a0a';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

/** Image-first dataset to ensure all cards render visibly */
const marqueeItems = [
  { id: 1, imageSrc: '/images/content.png', location: 'Aligarh', caption: 'Content that connects', year: '2024' },
  { id: 2, imageSrc: '/images/sales.jpeg', location: 'NCR', caption: 'Sales with momentum', year: '2024' },
  { id: 3, imageSrc: '/images/performance.jpeg', location: 'Insights', caption: 'Performance at a glance', year: '2024' },
  { id: 4, imageSrc: '/images/story.PNG', location: 'Brand', caption: 'Story-led positioning', year: '2024' },
  { id: 5, imageSrc: '/images/content.png', location: 'Campaigns', caption: 'Creative, shipped faster', year: '2023' },
  { id: 6, imageSrc: '/images/sales.jpeg', location: 'Revenue', caption: 'Pipeline that compounds', year: '2023' },
  { id: 7, imageSrc: '/images/performance.jpeg', location: 'Analytics', caption: 'Clearer decision making', year: '2024' },
  { id: 8, imageSrc: '/images/story.PNG', location: 'Narrative', caption: 'Premium visual language', year: '2024' },
  { id: 9, imageSrc: '/images/content.png', location: 'Execution', caption: 'From idea to launch', year: '2023' },
  { id: 10, imageSrc: '/images/sales.jpeg', location: 'Growth', caption: 'Outcomes over output', year: '2024' },
];

export function GalleryMediaCard({ item, index, cardClassName, onHoverStart, onHoverEnd }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ y: 14 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.28), ease: [0.42, 0, 0.58, 1] }}
      onMouseEnter={() => {
        setHovered(true);
        onHoverStart?.();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverEnd?.();
      }}
      className={`relative shrink-0 overflow-hidden rounded-[20px] bg-[#111] transition-all duration-500 ease-out ${cardClassName} will-change-[transform,opacity]`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[20px]"
        animate={{
          scale: hovered ? 1.06 : 1,
          boxShadow: hovered
            ? '0 28px 56px -12px rgba(0,0,0,0.65), 0 14px 24px -10px rgba(0,0,0,0.45)'
            : '0 8px 22px -6px rgba(0,0,0,0.4)',
        }}
        transition={{ duration: 0.55, ease: [0.42, 0, 0.58, 1] }}
      >
        <img
          src={item.imageSrc}
          alt={item.caption}
          className="h-full w-full object-cover brightness-[0.92]"
          loading="lazy"
          decoding="async"
        />
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06141bb3] via-transparent to-transparent opacity-[0.65]"
        aria-hidden
      />
      <motion.div
        animate={{ opacity: hovered ? 0.32 : 0 }}
        transition={{ duration: 0.35, ease: [0.42, 0, 0.58, 1] }}
        className="pointer-events-none absolute inset-0 bg-[#06141B]"
        aria-hidden
      />
      <div className="absolute left-[18px] top-[18px] font-['Syne',sans-serif] text-[0.46rem] tracking-[0.22em] text-[#999999]">
        {String(item.id).padStart(2, '0')}
      </div>
      <div className="absolute bottom-[22px] left-[22px] right-[22px]">
        <motion.p
          animate={{ opacity: hovered ? 1 : 0.62, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.35, ease: [0.42, 0, 0.58, 1] }}
          className="mb-1 font-['Syne',sans-serif] text-[0.46rem] uppercase tracking-[0.25em] text-[#999999]"
        >
          {item.location} · {item.year}
        </motion.p>
        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.35, delay: 0.03, ease: [0.42, 0, 0.58, 1] }}
          className="font-['Syne',sans-serif] text-[1.12rem] leading-tight text-white"
        >
          {item.caption}
        </motion.p>
      </div>
    </motion.div>
  );
}

function getCardArcStyle(index, total, isHovered) {
  const center = (total - 1) / 2;
  const offset = index - center;
  const distance = Math.abs(offset);

  const translateX = offset * 140;
  const translateY = 22 + distance * 26 - (distance === 0 ? 20 : 0) + (isHovered ? -16 : 0);
  const scale = Math.max(0.72, 1.1 - distance * 0.1) + (isHovered ? 0.1 : 0);
  const rotateY = offset === 0 ? 0 : offset < 0 ? Math.min(20, 8 + distance * 4) : -Math.min(20, 8 + distance * 4);
  const blur = distance >= 4 ? 1.5 : 0;
  const baseOpacity = distance >= 4 ? 0.42 : distance >= 3 ? 0.58 : 1;

  return {
    transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg)`,
    zIndex: isHovered ? 40 : Math.max(1, 18 - distance),
    filter: `blur(${blur}px)`,
    opacity: baseOpacity,
  };
}

function DesktopCurvedStrip({ items }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const cards = items.slice(0, 9);
  const hasHover = hoveredIndex !== null;

  return (
    <div role="presentation" className="relative mx-auto h-[440px] w-full max-w-[1280px] overflow-hidden [perspective:1000px]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[min(92px,14vw)] bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0ac7] to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-[min(92px,14vw)] bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0ac7] to-transparent" aria-hidden />

      <div className="relative flex h-full items-start justify-center">
        {cards.map((item, i) => {
          const isHovered = hoveredIndex === i;
          const cardStyle = getCardArcStyle(i, cards.length, isHovered);
          const dimmed = hasHover && hoveredIndex !== i;
          return (
            <motion.div
              key={`arc-${item.id}-${i}`}
              className="absolute left-1/2 top-0 transition-all duration-500 ease-out"
              style={{
                ...cardStyle,
                opacity: dimmed ? 0.6 : cardStyle.opacity,
              }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4.8 + i * 0.3,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }}
              >
                <GalleryMediaCard
                  item={item}
                  index={i}
                  onHoverStart={() => setHoveredIndex(i)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  cardClassName="h-[295px] w-[200px] md:h-[320px] md:w-[216px] lg:h-[340px] lg:w-[228px]"
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function MobileCurvedStrip({ items }) {
  return (
    <div className="w-full [perspective:1000px] md:hidden">
      <div
        className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden pb-4 pl-3 pr-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item, i) => (
          <div key={`m-${item.id}-${i}`} className="snap-center shrink-0 first:pl-1 last:pr-1">
            <GalleryMediaCard item={item} index={i} cardClassName="w-[58vw] max-w-[220px] aspect-[3/4] sm:w-[52vw] sm:max-w-[240px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GalleryMarqueeSection({ items }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const xParallax = useTransform(scrollYProgress, [0, 1], ['-2%', '2%']);

  return (
    <section ref={sectionRef} className="w-full px-4 pb-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] overflow-hidden">
        <motion.div style={{ x: xParallax }} className="hidden md:block">
          <DesktopCurvedStrip items={items} />
        </motion.div>
        <div className="md:hidden">
          <MobileCurvedStrip items={items} />
        </div>
      </div>
    </section>
  );
}

export default function Gallery() {
  const totalFrames = marqueeItems.length;

  return (
    <div id="gallery" className="min-h-screen overflow-hidden" style={{ background: GALLERY_BG }}>

      <div className="fixed left-0 top-0 z-20 h-full w-[5px] bg-[#0a0a0a]" aria-hidden />

      <div className="px-8 pb-10 pt-[120px] md:px-14">
        <motion.p
          {...fadeUp(0.1)}
          className="mb-4 font-['Syne',sans-serif] text-[0.52rem] uppercase tracking-[0.32em] text-white"
        >
          Visual archive · {totalFrames} frames
        </motion.p>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <motion.h1
            {...fadeUp(0.2)}
            className="font-['Syne',sans-serif] text-[clamp(3rem,6vw,5.5rem)] font-medium leading-none text-white"
          >
            Frames from<br />
            <span className="text-[#999999]">the road.</span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.3)}
            className="pb-2 font-['Syne',sans-serif] text-[0.5rem] uppercase tracking-[0.22em] text-[#666666]"
          >
            Curved perspective · interactive hover · parallax
          </motion.p>
        </div>
      </div>

      <GalleryMarqueeSection items={marqueeItems} />

      <motion.div
        {...fadeUp(0.1)}
        className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-[#333333] px-8 py-8 md:flex-row md:items-center md:px-14"
      >
        <p className="font-['Syne',sans-serif] text-[0.46rem] uppercase tracking-[0.25em] text-[#999999]">
          @thesameer06 · Aligarh, India
        </p>
        <p className="font-['Syne',sans-serif] text-base text-[#999999]">Every place leaves a mark.</p>
      </motion.div>

    </div>
  );
}
