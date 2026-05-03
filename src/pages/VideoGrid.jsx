import { useRef } from 'react';
import { motion } from 'framer-motion';

const galleryItems = [
  {
    id: 1,
    title: 'Neon Portrait',
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Studio Frame',
    src: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Quiet Motion',
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Center Focus',
    src: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Monochrome Light',
    src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    title: 'Creator Pulse',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    title: 'Noir Closeup',
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&auto=format&fit=crop&q=80',
  },
];

const depthMap = [
  { scale: 1.34, opacity: 1, blur: 0, rotateY: -16, y: 18, z: 140 },
  { scale: 1.16, opacity: 0.95, blur: 0, rotateY: -10, y: 8, z: 90 },
  { scale: 1, opacity: 0.9, blur: 0.2, rotateY: -6, y: 0, z: 45 },
  { scale: 0.8, opacity: 0.7, blur: 1.4, rotateY: 0, y: -12, z: -16 },
  { scale: 1, opacity: 0.9, blur: 0.2, rotateY: 6, y: 0, z: 45 },
  { scale: 1.16, opacity: 0.95, blur: 0, rotateY: 10, y: 8, z: 90 },
  { scale: 1.34, opacity: 1, blur: 0, rotateY: 16, y: 18, z: 140 },
];

function VideoCard({ item, visual, index }) {
  const imageRef = useRef(null);

  return (
    <motion.article
      className="relative h-[260px] w-[170px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-[0_24px_60px_rgba(0,0,0,0.55)] md:h-[320px] md:w-[210px] lg:h-[360px] lg:w-[240px]"
      style={{
        transformStyle: 'preserve-3d',
        opacity: visual.opacity,
        filter: `blur(${visual.blur}px)`,
      }}
      initial={{ opacity: 0, y: 46, scale: 0.8 }}
      whileInView={{ opacity: visual.opacity, y: visual.y, scale: visual.scale }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: visual.y - 10,
        scale: visual.scale + 0.05,
        boxShadow: '0 38px 80px rgba(255,255,255,0.16)',
      }}
    >
      <motion.img
        ref={imageRef}
        className="h-full w-full object-cover brightness-75"
        src={item.src}
        alt={item.title}
        loading="lazy"
        whileHover={{ scale: 1.08, filter: 'brightness(1.12)' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <p className="pointer-events-none absolute bottom-3 left-3 text-xs uppercase tracking-[0.24em] text-white/70 md:text-sm">
        {item.title}
      </p>
    </motion.article>
  );
}

function GalleryRow({ items }) {
  return (
    <div
      className="relative mt-12 w-full overflow-hidden"
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="flex items-end justify-center gap-4 px-4 py-8 md:gap-6 md:px-8"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {items.map((item, index) => {
          const config = depthMap[index];
          return (
            <motion.div
              key={`${item.id}-${index}`}
              className="snap-center"
              style={{
                transform: `translate3d(0, ${config.y}px, ${config.z}px) rotateY(${config.rotateY}deg) scale(${config.scale})`,
                transformStyle: 'preserve-3d',
              }}
            >
              <VideoCard item={item} visual={config} index={index} />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black via-black/80 to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black via-black/80 to-transparent md:w-40" />
    </div>
  );
}

export default function VideoGrid() {
  return (
    <section className="w-full bg-black py-24 text-white md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.32em] text-white/55">Creator Showcase</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">
            Cinematic Video Gallery
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm text-white/60 md:text-base">
            Minimal black-and-white composition with motion, perspective, and premium depth.
          </p>
        </motion.div>

        <div className="mt-6 md:hidden">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 pt-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="snap-center"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.05, duration: 0.55 }}
              >
                <VideoCard
                  item={item}
                  visual={{ scale: 1, opacity: 1, blur: 0, rotateY: 0, y: 0, z: 0 }}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <GalleryRow items={galleryItems} />
        </div>
      </div>
    </section>
  );
}