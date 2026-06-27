import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const testimonials = [
  {
    id: "sarah-johnson",
    quote:
      "Working with Sameer transformed our brand's social presence. His creative direction gave every campaign a clear story and a measurable lift.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "Fashion Brand Co.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "michael-chen",
    quote:
      "Sameer understands the rhythm of digital storytelling. The work was sharp, consistent, and always tuned to what the audience cared about.",
    author: "Michael Chen",
    role: "Founder",
    company: "Tech Startup Inc.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "emma-williams",
    quote:
      "His ability to turn everyday moments into content people actually stop for is rare. He became a true creative partner for our team.",
    author: "Emma Williams",
    role: "Brand Manager",
    company: "Lifestyle Brand",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "jane-davis",
    quote:
      "From scripting to performance strategy, the process felt calm and premium. We got content that looked beautiful and worked hard.",
    author: "Jane Davis",
    role: "Growth Lead",
    company: "Creator Studio",
    rating: 4.5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
  },
];

function ReviewStars({ rating }) {
  return (
    <div className="flex items-center justify-center gap-1 text-[#f4b95f]">
      {Array.from({ length: 5 }).map((_, index) => {
        const fillAmount = Math.max(Math.min(rating - index, 1), 0);

        return (
          <span key={index} className="relative block h-4 w-4 text-white/15">
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.29 3.95a1 1 0 0 0 .95.69h4.16c.97 0 1.37 1.24.59 1.81l-3.37 2.45a1 1 0 0 0-.36 1.12l1.28 3.96c.3.92-.75 1.69-1.54 1.12l-3.37-2.45a1 1 0 0 0-1.17 0l-3.37 2.45c-.79.57-1.84-.2-1.54-1.12l1.28-3.96a1 1 0 0 0-.36-1.12L2.05 9.38c-.78-.57-.38-1.81.59-1.81H6.8a1 1 0 0 0 .95-.69l1.3-3.95Z" />
            </svg>
            <span
              className="absolute inset-0 overflow-hidden text-[#f4b95f]"
              style={{ width: `${fillAmount * 100}%` }}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.29 3.95a1 1 0 0 0 .95.69h4.16c.97 0 1.37 1.24.59 1.81l-3.37 2.45a1 1 0 0 0-.36 1.12l1.28 3.96c.3.92-.75 1.69-1.54 1.12l-3.37-2.45a1 1 0 0 0-1.17 0l-3.37 2.45c-.79.57-1.84-.2-1.54-1.12l1.28-3.96a1 1 0 0 0-.36-1.12L2.05 9.38c-.78-.57-.38-1.81.59-1.81H6.8a1 1 0 0 0 .95-.69l1.3-3.95Z" />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}

function StackedCard({ testimonial, index, total, progress }) {
  const start = index / (total + 1);
  const end = (index + 1) / (total + 1);
  const rotateStart = index % 2 === 0 ? 10 + index * 2 : -10 - index * 2;

  const y = useTransform(progress, [start, end], ["0%", "-178%"]);
  const rotate = useTransform(progress, [start - 0.2, end], [rotateStart, 0]);
  const scale = useTransform(progress, [start - 0.2, end], [0.96, 1]);
  const shadowY = useTransform(progress, [start - 0.2, end], [10, 24]);
  const shadowBlur = useTransform(progress, [start - 0.2, end], [24, 54]);
  const shadowAlpha = useTransform(progress, [start - 0.2, end], [0.12, 0.22]);
  const transform = useMotionTemplate`translateZ(${index * 14}px) translateY(${y}) rotate(${rotate}deg) scale(${scale})`;
  const filter = useMotionTemplate`drop-shadow(0px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha}))`;

  return (
    <motion.article
      style={{
        top: index * 12,
        zIndex: total - index,
        transform,
        filter,
        backfaceVisibility: "hidden",
      }}
      className="absolute flex h-full w-full will-change-transform flex-col items-center justify-between rounded-2xl border border-white/12 bg-[#171717]/88 p-6 text-center backdrop-blur-md sm:p-8"
      aria-labelledby={`testimonial-${testimonial.id}`}
    >
      <div>
        <ReviewStars rating={testimonial.rating} />
        <blockquote className="mx-auto mt-6 max-w-[270px] text-[18px] font-medium leading-[1.45] text-white/86 sm:text-[20px]">
          "{testimonial.quote}"
        </blockquote>
      </div>

      <div className="flex items-center gap-4 text-left">
        <img
          src={testimonial.avatar}
          alt={`Portrait of ${testimonial.author}`}
          className="h-12 w-12 rounded-full border border-white/15 object-cover"
        />
        <div>
          <h3
            id={`testimonial-${testimonial.id}`}
            className="text-[17px] font-bold leading-tight text-white"
          >
            {testimonial.author}
          </h3>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            {testimonial.role}
          </p>
          <p className="text-[12px] text-white/35">{testimonial.company}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  });

  const headingY = useTransform(smoothProgress, [0, 0.2], [24, 0]);
  const headingOpacity = useTransform(smoothProgress, [0, 0.16], [0.35, 1]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative h-[340vh] bg-[#0a0a0a] text-white"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1320px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <motion.div
            style={{ y: headingY, opacity: headingOpacity }}
            className="mx-auto max-w-[580px] text-center lg:mx-0 lg:text-left"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 sm:text-[11px]">
              Kind Words
            </p>
            <h2
              className="mt-4 text-[clamp(46px,9vw,104px)] font-bold leading-[0.9] tracking-normal text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Testimonials
            </h2>
            <p className="mt-6 text-[15px] leading-[1.8] text-white/55 sm:text-[17px]">
              A smooth stack of client notes from brand campaigns, growth work,
              and social-first storytelling.
            </p>
          </motion.div>

          <div className="relative mx-auto h-[430px] w-[min(86vw,360px)] sm:h-[470px] sm:w-[380px]">
            <div
              className="relative h-full w-full"
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
            >
              {testimonials.map((testimonial, index) => (
                <StackedCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                  total={testimonials.length}
                  progress={smoothProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
