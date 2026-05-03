import { motion } from "framer-motion";

const services = [
  {
    number: "01",
    title: "Content Creation",
    description: "High-quality visual content tailored for social media platforms and brand campaigns.",
  },
  {
    number: "02",
    title: "Brand Strategy",
    description: "Strategic planning and positioning to elevate your brand presence and reach.",
  },
  {
    number: "03",
    title: "Social Media Management",
    description: "End-to-end management of social media channels with data-driven insights.",
  },
  {
    number: "04",
    title: "Campaign Development",
    description: "Creative campaigns designed to engage audiences and drive measurable results.",
  },
];

// Custom award-winning easing
const transition = { duration: 1, ease: [0.65, 0, 0.35, 1] };

export default function Services() {
  return (
    <section id="services" className="min-h-screen bg-[#efefef] overflow-hidden">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        
        <header className="mb-20">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={transition}
            viewport={{ once: true }}
            className="text-black/55 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transition}
            viewport={{ once: true }}
            className="mt-4 text-black leading-[0.9] tracking-[-0.04em] font-medium"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(54px, 12vw, 110px)",
            }}
          >
            Services
          </motion.h2>
        </header>

        <div className="flex flex-col">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              viewport={{ once: true, amount: 0.2 }}
              className="group relative border-b border-black/10 py-10 sm:py-14"
            >
              {/* Animated Top Border Reveal */}
              <motion.div 
                className="absolute top-0 left-0 h-[1px] bg-black"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1], delay: index * 0.1 }}
                viewport={{ once: true }}
              />

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
                variants={{
                  hover: { x: 20 } // The "Magnetic" shift
                }}
                transition={transition}
              >
                {/* Number */}
                <div className="md:col-span-1">
                  <motion.p 
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 0.3, y: 0 }
                    }}
                    transition={transition}
                    className="text-black text-[14px] font-bold"
                  >
                    {service.number}
                  </motion.p>
                </div>

                {/* Title with Clip-Path Reveal Effect */}
                <div className="md:col-span-5 overflow-hidden">
                  <motion.h3
                    variants={{
                      initial: { y: "100%" },
                      animate: { y: 0 }
                    }}
                    transition={{ ...transition, delay: 0.1 }}
                    className="text-black text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.1] tracking-[-0.03em] font-medium"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {service.title}
                  </motion.h3>
                </div>

                {/* Description */}
                <div className="md:col-span-5 md:col-start-8">
                  <motion.p
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 0.6, y: 0 }
                    }}
                    transition={{ ...transition, delay: 0.2 }}
                    className="text-black text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.5] max-w-[420px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {service.description}
                  </motion.p>
                </div>
              </motion.div>

              {/* Subtle Hover Reveal: Circle/Icon */}
              <motion.div 
                className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden lg:block"
                variants={{
                  hover: { x: -20, rotate: 45 }
                }}
              >
                <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center">
                  <span className="text-2xl">→</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}