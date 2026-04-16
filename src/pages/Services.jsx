import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

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

export default function Services() {
  return (
    <section id="services" className="min-h-screen bg-[#efefef] overflow-hidden">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        <motion.p
          {...fadeUp(0.1)}
          className="text-black/55 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] font-medium"
        >
          What I Offer
        </motion.p>
        <motion.h2
          {...fadeUp(0.2)}
          className="mt-4 sm:mt-6 text-black leading-[0.95] sm:leading-[0.98] tracking-[-0.03em] font-medium"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(42px, 10vw, 92px)",
          }}
        >
          Services
        </motion.h2>

        <div className="mt-12 sm:mt-16 lg:mt-20 space-y-6 sm:space-y-8">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              {...fadeUp(0.1 + index * 0.1)}
              className="group border-t border-black/10 pt-6 sm:pt-8 hover:border-black/30 transition-colors duration-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <p className="text-black/30 text-[12px] sm:text-[14px] tracking-[0.2em] font-medium">
                    {service.number}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <h3
                    className="text-black text-[24px] sm:text-[32px] lg:text-[38px] leading-none tracking-[-0.02em] font-medium"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {service.title}
                  </h3>
                </div>
                <div className="md:col-span-6">
                  <p
                    className="text-black/60 text-[14px] sm:text-[16px] lg:text-[18px] leading-[1.6]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
