import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useScroll, useTransform } from 'framer-motion';

const MARQUEE_TEXT = "LET'S MAKE SOMETHING · SAMEER · ALWAYS ON A TRIP · MELOPHILE · NOMAD · ";

function MarqueeRow({ direction, speedFactor = 1 }) {
  const baseX = useRef(0);
  const speed = direction === 'left' ? -0.8 * speedFactor : 0.8 * speedFactor;

  const [x, setX] = useState(0);

  useAnimationFrame((t, delta) => {
    let moveBy = speed * (delta / 10);
    baseX.current += moveBy;
    
    // Smooth reset for infinite look
    if (direction === 'left' && baseX.current <= -1000) baseX.current = 0;
    if (direction === 'right' && baseX.current >= 0) baseX.current = -1000;
    
    setX(baseX.current);
  });

  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', padding: '10px 0', background: '#efefef' }}>
      <motion.div style={{ display: 'inline-block', whiteSpace: 'nowrap', x }}>
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(5rem, 10vw, 8rem)',
              color: i % 2 === 0 ? '#000000' : 'transparent',
              letterSpacing: '0.02em',
              paddingRight: '60px',
              WebkitTextStroke: i % 2 === 0 ? 'none' : '1px #000000',
              opacity: 0.9
            }}
          >
            {MARQUEE_TEXT}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ContactForm() {
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = (field) => ({
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${focused === field ? '#000000' : '#c0c0c0'}`,
    outline: 'none',
    width: '100%',
    padding: '20px 0',
    fontFamily: "'Syne', sans-serif",
    fontSize: '1rem',
    color: '#000000',
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    transform: focused === field ? 'translateY(-4px)' : 'translateY(0)',
  });

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '60px 0' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: 500 }}>Message Sent.</h2>
        <p style={{ fontFamily: "'Syne', sans-serif", color: '#666', marginTop: '10px' }}>Sameer will get back to you shortly.</p>
      </motion.div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      {['name', 'email', 'message'].map((field) => (
        <div key={field} style={{ marginBottom: '30px' }}>
          <label style={{ 
            fontFamily: "'Syne', sans-serif", 
            fontSize: '0.6rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em', 
            color: focused === field ? '#000' : '#888',
            transition: 'color 0.3s'
          }}>
            {field}
          </label>
          {field === 'message' ? (
            <textarea 
              rows={3} 
              onFocus={() => setFocused(field)} 
              onBlur={() => setFocused(null)} 
              style={{ ...inputStyle(field), resize: 'none' }} 
              placeholder={`Enter your ${field}...`}
            />
          ) : (
            <input 
              onFocus={() => setFocused(field)} 
              onBlur={() => setFocused(null)} 
              style={inputStyle(field)} 
              placeholder={`Enter your ${field}...`}
            />
          )}
        </div>
      ))}
      <motion.button
        onClick={() => setSubmitted(true)}
        whileHover={{ scale: 1.02, backgroundColor: '#000', color: '#fff' }}
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          padding: '20px',
          border: '1px solid #000',
          background: 'transparent',
          fontFamily: "'Syne', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          fontSize: '0.7rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        Send Inquiry
      </motion.button>
    </div>
  );
}

export default function Contact() {
  return (
    <div id="contact" style={{ background: '#efefef', color: '#000', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Structural Accent */}
      <div style={{ position: 'fixed', left: 0, top: 0, width: '4px', height: '100%', background: '#000', zIndex: 100 }} />

      {/* Marquee Header */}
      <section style={{ paddingTop: '60px', borderBottom: '1px solid #d0d0d0' }}>
        <MarqueeRow direction="right" speedFactor={0.5} />
        <MarqueeRow direction="left" speedFactor={0.7} />
      </section>

      {/* Main Content Container */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>
          
          {/* Left Column: Intro */}
          <div style={{ gridColumn: '1 / span 6' }}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#888' }}
            >
              Available for Freelance
            </motion.span>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(3.5rem, 7vw, 6rem)', fontWeight: 600, lineHeight: 0.9, margin: '20px 0 40px 0' }}>
              Let's create <br/> digital magic.
            </h1>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', color: '#555', maxWidth: '400px', lineHeight: 1.6 }}>
              Whether you're looking for a collaboration, a nomad's perspective, or a high-performance web experience—reach out.
            </p>
            
            <div style={{ marginTop: '80px' }}>
              <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888' }}>Socials</p>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {['Instagram', 'YouTube', 'Threads'].map(link => (
                  <motion.a 
                    key={link}
                    whileHover={{ x: 10 }}
                    href="#" 
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', textDecoration: 'none', color: '#000', display: 'flex', alignItems: 'center', gap: '15px' }}
                  >
                    {link} <span style={{ fontSize: '1rem', color: '#888' }}>↗</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div style={{ gridColumn: '8 / span 5' }}>
            <div style={{ background: 'rgba(255,255,255,0.4)', padding: '50px', borderRadius: '2px', border: '1px solid rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)' }}>
               <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888' }}>
                 Send a direct message
               </p>
               <ContactForm />
            </div>
            
            <div style={{ marginTop: '40px', paddingLeft: '50px' }}>
               <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.7rem', color: '#888' }}>
                 ALIGARH, INDIA — 27° 53' N, 78° 4' E
               </p>
            </div>
          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer style={{ padding: '40px', borderTop: '1px solid #d0d0d0', display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.6rem', letterSpacing: '0.1em' }}>© 2026 SAMEER</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.6rem', letterSpacing: '0.1em' }}>EST. IN ALIGARH</span>
      </footer>
    </div>
  );
}