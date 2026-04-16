import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

const row1 = [
  { id: 1,  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900', location: 'Aligarh',   caption: 'The city that made me',    year: '2024', width: '36vw' },
  { id: 2,  src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900', location: 'NCR',       caption: 'Concrete and sky',         year: '2024', width: '28vw' },
  { id: 3,  src: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=900', location: 'Travel',    caption: 'Between here and there',   year: '2023', width: '34vw' },
  { id: 4,  src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900', location: 'Aligarh',   caption: 'Streets I grew up on',     year: '2024', width: '30vw' },
  { id: 5,  src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900', location: 'Travel',    caption: 'High altitude silence',    year: '2023', width: '38vw' },
  { id: 5,  src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900', location: 'Travel',    caption: 'High altitude silence',    year: '2023', width: '38vw' },
 
  { id: 5,  src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900', location: 'Travel',    caption: 'High altitude silence',    year: '2023', width: '38vw' },
];

const row2 = [
  { id: 6,  src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900', location: 'Travel',    caption: 'Unplanned moments',        year: '2023', width: '32vw' },
  { id: 7,  src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900', location: 'Portraits', caption: 'Just existing',            year: '2024', width: '26vw' },
  { id: 8,  src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900', location: 'NCR',       caption: 'Lines and light',          year: '2024', width: '36vw' },
  { id: 9,  src: 'https://images.unsplash.com/photo-1519608825926-6abf48b54726?w=900', location: 'Portraits', caption: 'In between thoughts',      year: '2023', width: '28vw' },
  { id: 9,  src: 'https://images.unsplash.com/photo-1519608825926-6abf48b54726?w=900', location: 'Portraits', caption: 'In between thoughts',      year: '2023', width: '28vw' },
  { id: 9,  src: 'https://images.unsplash.com/photo-1519608825926-6abf48b54726?w=900', location: 'Portraits', caption: 'In between thoughts',      year: '2023', width: '28vw' },
  
  { id: 9,  src: 'https://images.unsplash.com/photo-1519608825926-6abf48b54726?w=900', location: 'Portraits', caption: 'In between thoughts',      year: '2023', width: '28vw' },
  { id: 10, src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900', location: 'Aligarh',   caption: 'Ordinary world, failed',   year: '2024', width: '34vw' },
];

function PhotoCard({ photo, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', height: '100%', width: photo.width, flexShrink: 0, overflow: 'hidden' }}
    >
      <motion.img
        src={photo.src}
        alt={photo.caption}
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(25%) brightness(0.8)' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,20,27,0.7) 0%, transparent 50%)', opacity: 0.6 }} />
      <motion.div
        animate={{ opacity: hovered ? 0.35 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, background: '#06141B' }}
      />
      <div style={{ position: 'absolute', top: '18px', left: '18px', fontFamily: "'Syne', sans-serif", fontSize: '0.46rem', letterSpacing: '0.22em', color: '#999999' }}>
        {String(photo.id).padStart(2, '0')}
      </div>
      <div style={{ position: 'absolute', bottom: '22px', left: '22px', right: '22px' }}>
        <motion.p
          animate={{ opacity: hovered ? 1 : 0.6, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.4 }}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.46rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999999', marginBottom: '5px' }}
        >
          {photo.location} · {photo.year}
        </motion.p>
        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', color: '#ffffff', lineHeight: 1.1 }}
        >
          {photo.caption}
        </motion.p>
      </div>
    </motion.div>
  );
}

function DragRow({ photos, direction, rowHeight }) {
  const dragRef = useRef(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], direction === 'right' ? ['-5%', '5%'] : ['5%', '-5%']);

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', height: rowHeight }}>
      <motion.div style={{ x, height: '100%' }}>
        <motion.div
          ref={dragRef}
          drag="x"
          dragConstraints={{ right: 0, left: -2400 }}
          dragElastic={0.04}
          whileTap={{ cursor: 'grabbing' }}
          style={{
            display: 'flex', gap: '12px', height: '100%', cursor: 'grab',
            width: 'max-content',
            paddingLeft: direction === 'right' ? '56px' : '0px',
            paddingRight: direction === 'right' ? '0px' : '56px',
          }}
        >
          {photos.map((photo, i) => (
            <PhotoCard key={photo.id} photo={photo} index={i} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Gallery() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', overflow: 'hidden' }}>

      <div style={{ position: 'fixed', left: 0, top: 0, width: '5px', height: '100%', background: '#0a0a0a', zIndex: 20 }} />

      {/* Header */}
      <div style={{ padding: '120px 64px 48px 56px' }}>
        <motion.p
          {...fadeUp(0.1)}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.52rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '18px' }}
        >
          Visual archive · {row1.length + row2.length} frames
        </motion.p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <motion.h1
            {...fadeUp(0.2)}
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: '#ffffff', lineHeight: 1, margin: 0 }}
          >
            Frames from<br />
            <span style={{ color: '#999999' }}>the road.</span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.3)}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.5rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#666666', paddingBottom: '8px' }}
          >
            Drag to explore →
          </motion.p>
        </div>
      </div>

      {/* Row 1 — drags right */}
      <div style={{ marginBottom: '12px' }}>
        <DragRow photos={row1} direction="right" rowHeight="38vh" />
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: '1px', background: '#333333', margin: '0 56px', transformOrigin: 'left' }}
      />

      {/* Row 2 — drags left */}
      <div style={{ marginTop: '12px' }}>
        <DragRow photos={row2} direction="left" rowHeight="38vh" />
      </div>

      {/* Footer */}
      <motion.div
        {...fadeUp(0.1)}
        style={{ padding: '32px 56px', marginTop: '40px', borderTop: '1px solid #333333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.46rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999999' }}>
          @thesameer06 · Aligarh, India
        </p>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', color: '#999999' }}>
          Every place leaves a mark.
        </p>
      </motion.div>

    </div>
  );
}