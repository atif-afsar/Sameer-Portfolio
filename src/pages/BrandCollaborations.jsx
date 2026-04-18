import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

const brands = [
  { name: "Nike", category: "Sportswear" },
  { name: "Zara", category: "Fashion" },
  { name: "Apple", category: "Technology" },
  { name: "Adidas", category: "Sportswear" },
  { name: "H&M", category: "Fashion" },
  { name: "Samsung", category: "Technology" },
];

export default function BrandCollaborations() {
  return (
    <section id="brand-collaborations" className="min-h-screen bg-[#efefef] overflow-hidden">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        <motion.p
          {...fadeUp(0.1)}
          className="text-black/55 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] font-medium"
        >
          Trusted Partners
        </motion.p>
        <motion.h2
          {...fadeUp(0.2)}
          className="mt-4 sm:mt-6 text-black leading-[0.95] sm:leading-[0.98] tracking-[-0.03em] font-medium"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(42px, 10vw, 92px)",
          }}
        >
          Brand
          <br />
          Collaborations
        </motion.h2>
        <motion.p
          {...fadeUp(0.3)}
          className="mt-5 sm:mt-7 text-black/60 text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.55] max-w-[560px]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Working with leading brands to create authentic content
          <span className="hidden sm:inline">
            <br />
          </span>
          that resonates with audiences and drives engagement.
        </motion.p>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              {...fadeUp(0.1 * index)}
              className="group relative aspect-[4/3] bg-black/5 hover:bg-black/10 transition-colors duration-500 flex flex-col items-center justify-center p-6 sm:p-8"
            >
              <p
                className="text-black text-[28px] sm:text-[36px] lg:text-[44px] font-medium tracking-[-0.02em]"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {brand.name}
              </p>
              <p className="mt-2 text-black/40 text-[9px] sm:text-[10px] uppercase tracking-[0.22em]">
                {brand.category}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
