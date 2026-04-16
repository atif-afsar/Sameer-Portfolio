import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
});

export default function Home() {
  return (
    <section id="home" className="min-h-screen bg-[#efefef] overflow-hidden">
      <div className="relative min-h-screen mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 lg:pt-20 pb-10 sm:pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <div className="relative overflow-hidden min-h-[56vh] sm:min-h-[64vh] lg:min-h-[72vh] order-1">
          <div className="absolute left-[-25%] sm:left-[-20%] bottom-[-20%] h-[92%] w-[85%] sm:w-[90%] rounded-full bg-black/12 blur-[50px] sm:blur-[58px]" />
          <motion.img
            initial={{ opacity: 0, x: -24, scale: 1.02 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            src="/images/image.png"
            alt="Influencer portfolio portrait"
            className="absolute inset-0 z-10 h-full w-full object-contain object-left sm:object-center lg:object-left grayscale"
            style={{
              filter:
                "grayscale(100%) brightness(0.95) contrast(1.14) saturate(0.95) drop-shadow(20px 14px 44px rgba(0,0,0,0.25)) drop-shadow(35px 0px 25px rgba(0,0,0,0.4))",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#efefef]/50 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[18%] sm:h-[20%] bg-linear-to-t from-[#efefef]/60 via-[#efefef]/28 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 80% at 18% 58%, transparent 72%, rgba(239,239,239,0.18) 90%, rgba(239,239,239,0.36) 100%)",
            }}
          />
        </div>

        <div className="flex flex-col justify-center pl-0 lg:pl-10 order-2">
          <motion.p
            {...fadeUp(0.1)}
            className="text-black/55 text-[10px] sm:text-[11px] lg:text-[12px] uppercase tracking-[0.2em] sm:tracking-[0.22em] lg:tracking-[0.24em] font-medium"
          >
            Insta Influencer Portfolio
          </motion.p>
          <motion.h1
            {...fadeUp(0.2)}
            className="mt-4 sm:mt-5 text-black font-medium leading-[0.96] sm:leading-[0.98] tracking-[-0.03em]"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(44px, 13vw, 112px)",
            }}
          >
            Maris Muse
            <br />
            Portfolio
          </motion.h1>
          <motion.p
            {...fadeUp(0.3)}
            className="mt-5 sm:mt-6 lg:mt-8 text-black/60 text-[15px] sm:text-[17px] lg:text-[19px] leading-[1.55] max-w-[560px]"
          >
            A minimal editorial showcase for an Instagram influencer,
            <span className="hidden sm:inline">
              <br />
            </span>
            designed to spotlight style, collaborations, and
            <span className="hidden sm:inline">
              <br />
            </span>
            visual storytelling with a premium aesthetic tone.
          </motion.p>
          <motion.p
            {...fadeUp(0.4)}
            className="mt-8 sm:mt-9 lg:mt-10 text-black/70 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.24em] font-medium"
          >
            Brand Manual
          </motion.p>
        </div>
      </div>
    </section>
  );
}