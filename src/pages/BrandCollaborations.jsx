import { motion } from "framer-motion";

// Award-winning sites use custom bezier curves for "snappy yet fluid" motion
const transition = { duration: 1, ease: [0.16, 1, 0.3, 1] };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, skewY: 2 },
  visible: { 
    opacity: 1, 
    y: 0, 
    skewY: 0, 
    transition 
  },
};

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
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24"
      >
        {/* Header Section */}
        <header className="max-w-[800px]">
          <motion.p
            variants={itemVariants}
            className="text-black/55 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold"
          >
            Trusted Partners
          </motion.p>
          
          <motion.h2
            variants={itemVariants}
            className="mt-4 sm:mt-6 text-black leading-[0.9] tracking-[-0.04em] font-bold"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(48px, 12vw, 110px)",
            }}
          >
            Brand <br /> Collaborations
          </motion.h2>

          <motion.div variants={itemVariants} className="h-[1px] w-24 bg-black/20 my-8" />

          <motion.p
            variants={itemVariants}
            className="text-black/60 text-[16px] sm:text-[18px] lg:text-[22px] leading-[1.4] max-w-[560px]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Working with leading brands to create authentic content
            that resonates with audiences and drives engagement.
          </motion.p>
        </header>

        {/* Grid Section */}
        <motion.div 
          variants={containerVariants}
          className="mt-16 sm:mt-24 lg:mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.name}
              variants={itemVariants}
              whileHover={{ scale: 0.98 }} // Subtle "press" effect on hover
              className="group relative aspect-[16/10] bg-white border border-black/5 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
            >
              {/* Animated Background Reveal */}
              <motion.div 
                className="absolute inset-0 bg-black translate-y-[100%] transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0" 
              />

              <div className="relative z-10 text-center">
                <motion.p
                  className="text-black group-hover:text-white text-[32px] sm:text-[40px] font-bold tracking-[-0.03em] transition-colors duration-500"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {brand.name}
                </motion.p>
                <p className="mt-1 text-black/40 group-hover:text-white/50 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500">
                  {brand.category}
                </p>
              </div>

              {/* Decorative Corner (Awwwards Style) */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}