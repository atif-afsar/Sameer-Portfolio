import { motion } from "framer-motion";

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

// High-end Bezier curve
const transition = { duration: 1.2, ease: [0.16, 1, 0.3, 1] };

export default function Testimonials() {
  return (
    <section id="testimonials" className="min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-24">
        
        {/* Header Section */}
        <header className="mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-[600px]">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={transition}
              viewport={{ once: true }}
              className="text-white/40 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold"
            >
              Kind Words
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={transition}
              viewport={{ once: true }}
              className="mt-4 text-white leading-[0.9] tracking-[-0.04em] font-bold"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(48px, 10vw, 100px)",
              }}
            >
              Testimonials
            </motion.h2>
          </div>
          
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="hidden md:block"
          >
            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-white transition-colors cursor-pointer">
              <span className="text-sm uppercase tracking-widest rotate-90">Scroll</span>
            </div>
          </motion.div>
        </header>

        {/* Testimonials Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...transition, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="relative p-8 lg:p-10 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col justify-between group"
            >
              {/* Subtle Decorative Quote Icon */}
              <div className="absolute top-8 right-8 text-white/5 text-6xl font-serif select-none group-hover:text-white/10 transition-colors">
                “
              </div>

              <div className="relative z-10">
                <p
                  className="text-white/80 text-[18px] sm:text-[20px] lg:text-[22px] leading-[1.5] font-medium"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {testimonial.quote}
                </p>
              </div>

              <div className="mt-12 flex items-center gap-4">
                {/* Placeholder Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-white/20 to-transparent border border-white/10" />
                
                <div>
                  <h4
                    className="text-white text-[16px] font-bold"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {testimonial.author}
                  </h4>
                  <p className="text-white/40 text-[12px] uppercase tracking-wider">
                    {testimonial.role} — <span className="text-white/20">{testimonial.company}</span>
                  </p>
                </div>
              </div>

              {/* Bottom Glow Effect */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Footer Accent */}
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-[1px] bg-white/10 mt-24"
        />
      </div>
    </section>
  );
}