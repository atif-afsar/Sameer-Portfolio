import { motion } from 'framer-motion';
import ParallaxLayout from '../components/ParallaxLayout';

const ParallaxDemo = () => {
  // Define the first 3 parallax sections
  const parallaxSections = [
    // Section 1
    {
      className: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      background: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            className="text-[20vw] font-bold text-white/10"
          >
            01
          </motion.div>
        </div>
      ),
      midground: (
        <div className="w-full h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold text-white/20"
          >
            PARALLAX
          </motion.div>
        </div>
      ),
      foreground: (
        <div className="w-full h-full flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              First Section
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/80"
            >
              Scroll to experience the layered parallax effect
            </motion.p>
          </div>
        </div>
      )
    },
    
    // Section 2
    {
      className: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900',
      background: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(52,211,153,0.3),transparent_50%)]" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            className="text-[20vw] font-bold text-white/10"
          >
            02
          </motion.div>
        </div>
      ),
      midground: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="grid grid-cols-3 gap-8 opacity-20">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-24 h-24 bg-white/30 rounded-lg"
              />
            ))}
          </div>
        </div>
      ),
      foreground: (
        <div className="w-full h-full flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Second Section
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/80"
            >
              Each layer moves at a different speed
            </motion.p>
          </div>
        </div>
      )
    },
    
    // Section 3
    {
      className: 'bg-gradient-to-br from-rose-900 via-pink-900 to-fuchsia-900',
      background: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(244,114,182,0.3),transparent_50%)]" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            className="text-[20vw] font-bold text-white/10"
          >
            03
          </motion.div>
        </div>
      ),
      midground: (
        <div className="w-full h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 0.2, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-96 h-96 border-4 border-white/30 rounded-full"
          />
        </div>
      ),
      foreground: (
        <div className="w-full h-full flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Third Section
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/80"
            >
              The last parallax section before normal scroll
            </motion.p>
          </div>
        </div>
      )
    }
  ];

  // Normal scrolling sections (after the first 3)
  const normalSections = [
    // Section 4 - Normal scroll
    <section className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Normal Scroll Section
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          This section and all following sections scroll normally without any parallax effects.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 bg-gray-100 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Feature {i}</h3>
              <p className="text-gray-600">Clean and simple scrolling experience</p>
            </div>
          ))}
        </div>
      </div>
    </section>,

    // Section 5 - Normal scroll
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Another Section
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          No transforms, no motion effects - just smooth, standard scrolling.
        </p>
        <div className="mt-12 p-12 bg-white rounded-2xl shadow-lg">
          <p className="text-lg text-gray-700 leading-relaxed">
            The transition from parallax to normal scroll is seamless, with no jumps or layout shifts.
            This creates a premium experience where the first impression is dynamic and immersive,
            while the rest of the content remains easy to navigate.
          </p>
        </div>
      </div>
    </section>,

    // Section 6 - Normal scroll
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Final Section
        </h2>
        <p className="text-xl text-white/80">
          Performance optimized with GPU-accelerated transforms
        </p>
      </div>
    </section>
  ];

  return <ParallaxLayout sections={parallaxSections} normalSections={normalSections} />;
};

export default ParallaxDemo;
