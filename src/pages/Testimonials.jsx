import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

const testimonials = [
  {
    quote: "Working with Sameer transformed our brand's social presence. His creative vision and strategic approach delivered results beyond our expectations.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "Fashion Brand Co.",
  },
  {
    quote: "An absolute professional who understands the nuances of digital storytelling. Every campaign was executed flawlessly with measurable impact.",
    author: "Michael Chen",
    role: "CEO",
    company: "Tech Startup Inc.",
  },
  {
    quote: "Sameer's ability to capture authentic moments and turn them into compelling content is unmatched. A true creative partner.",
    author: "Emma Williams",
    role: "Brand Manager",
    company: "Lifestyle Brand",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        <motion.p
          {...fadeUp(0.1)}
          className="text-white/55 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] font-medium"
        >
          Client Feedback
        </motion.p>
        <motion.h2
          {...fadeUp(0.2)}
          className="mt-4 sm:mt-6 text-white leading-[0.95] sm:leading-[0.98] tracking-[-0.03em] font-medium"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(42px, 10vw, 92px)",
          }}
        >
          Testimonials
        </motion.h2>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              {...fadeUp(0.1 + index * 0.15)}
              className="flex flex-col"
            >
              <p
                className="text-white/80 text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] italic"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                "{testimonial.quote}"
              </p>
              <div className="mt-6 sm:mt-8">
                <p
                  className="text-white text-[16px] sm:text-[18px] font-medium"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {testimonial.author}
                </p>
                <p className="mt-1 text-white/50 text-[12px] sm:text-[13px]">
                  {testimonial.role}
                </p>
                <p className="text-white/40 text-[11px] sm:text-[12px] uppercase tracking-[0.18em]">
                  {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
