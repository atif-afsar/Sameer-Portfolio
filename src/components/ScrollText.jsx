"use client";
import { useEffect, useRef } from "react";

const ITEMS = [
  { label: "CONTENT CREATION",      img: "https://i.pinimg.com/736x/ab/42/d1/ab42d1e4b550ce598d6fe8e3d25bfbb0.jpg",      cap: "Visual language"    },
  { label: "BRAND storytelling",    img: "/images/story.PNG",        cap: "Identity systems"   },
  { label: "SOCIAL influence",      img: "/images/branding.HEIC",    cap: "No-code builds"     },
  { label: "PERFORMANCE marketing", img: "/images/performance.jpeg", cap: "Product interfaces" },
  { label: "SALES conversion",      img: "/images/sales.jpeg",       cap: "Motion engineering" },
  { label: "AUDIENCE growth",       img: "/images/growth.HEIC",      cap: "Depth & dimension"  },
];

export default function ScrollPortfolio() {
  const appRef   = useRef(null);
  const fillsRef = useRef([]);
  const imgsRef  = useRef([]);
  const lastIdx  = useRef(0);

  useEffect(() => {
    ITEMS.forEach((item) => { const i = new Image(); i.src = item.img; });

    function scrub() {
      const app = appRef.current;
      if (!app) return;

      const appTop      = app.getBoundingClientRect().top + window.scrollY;
      const scrollStart = appTop + window.innerHeight;
      const scrollEnd   = appTop + app.offsetHeight - window.innerHeight;
      const raw = Math.max(0, Math.min(1,
        (window.scrollY - scrollStart) / (scrollEnd - scrollStart)
      ));

      const n = ITEMS.length;

      fillsRef.current.forEach((fill, i) => {
        if (!fill) return;
        const t0    = i / n;
        const t1    = (i + 1) / n;
        const local = Math.max(0, Math.min(1, (raw - t0) / (t1 - t0)));
        fill.style.clipPath = `inset(0 ${(100 - local * 100).toFixed(2)}% 0 0)`;
      });

      const active = Math.min(n - 1, Math.floor(raw * n + 0.1));
      if (active !== lastIdx.current) {
        imgsRef.current[lastIdx.current]?.classList.remove("active");
        imgsRef.current[active]?.classList.add("active");
        lastIdx.current = active;
      }
    }

    window.addEventListener("scroll", scrub, { passive: true });
    scrub();
    return () => window.removeEventListener("scroll", scrub);
  }, []);

  return (
    <>
      <style>{`
        .sp-base {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 5vw, 72px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          text-transform: uppercase;
          color: #7a7874;
          display: block;
          white-space: nowrap;
          padding: 2px 0;
        }
        .sp-fill {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 5vw, 72px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          text-transform: uppercase;
          color: #1a1a1a;
          display: block;
          white-space: nowrap;
          padding: 2px 0;
          position: absolute;
          top: 0; left: 0;
          clip-path: inset(0 100% 0 0);
          will-change: clip-path;
          pointer-events: none;
        }
        .sp-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0;
          transform: scale(1.06);
          transition:
            opacity 0.65s cubic-bezier(0.22,1,0.36,1),
            transform 0.85s cubic-bezier(0.22,1,0.36,1);
          will-change: opacity, transform;
        }
        .sp-img.active { opacity: 1; transform: scale(1); }
      `}</style>

      <div
        ref={appRef}
        style={{ position: "relative", background: "#e8e6e1" }}
      >
        {/* Sticky scene */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "stretch",
            background: "#e8e6e1",
          }}
        >
          {/* LEFT — text column */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 12px 0 48px",
            overflow: "hidden",
            position: "relative",
          }}>
            <span style={{
              position: "absolute", left: 20, top: "50%",
              transform: "translateY(-50%)",
              writingMode: "vertical-rl", textOrientation: "mixed",
              fontFamily: "'Syne',sans-serif", fontSize: 10,
              letterSpacing: "0.22em", textTransform: "uppercase", color: "#9a9690",
            }}>
              Storytelling
            </span>

            <div style={{ width: "100%", paddingLeft: "40px" }}>
              {ITEMS.map((item, i) => (
                <div key={item.label} style={{ position: "relative", overflow: "hidden" }}>
                  <span className="sp-base">{item.label}</span>
                  <span
                    className="sp-fill"
                    ref={(el) => (fillsRef.current[i] = el)}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — image panel */}
          <div
            style={{
              position: "relative",
              width: "clamp(280px, 32vw, 420px)",
              flexShrink: 0,
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
           

            <div style={{
              width: "100%", 
              maxWidth: "340px",
              aspectRatio: "1/1",
              position: "relative", 
              overflow: "hidden",
              borderRadius: 4, 
              background: "#bbb",
            }}>
              {ITEMS.map((item, i) => (
                <img
                  key={item.label}
                  ref={(el) => (imgsRef.current[i] = el)}
                  src={item.img}
                  alt={item.label}
                  className={`sp-img${i === 0 ? " active" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom spacer — controls scroll speed per item */}
        <div style={{ height: "300vh" }} />
      </div>
    </>
  );
}