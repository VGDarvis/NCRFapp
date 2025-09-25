import { motion } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { RotatingLogoCircle } from './RotatingLogoCircle';

export const LogoSelectionLanding = () => {
  return (
    <div className="min-h-screen relative overflow-hidden onyx-royale-gradient">
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white luxury-text-shadow leading-tight">
            National College Resources Foundation
          </h1>
        </motion.div>

        {/* Subtext Line 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="text-center mb-4"
        >
          <p className="text-2xl md:text-3xl font-sans font-medium text-[#E5E5E5] tracking-wide">
            Programs That Power Your Future
          </p>
        </motion.div>

        {/* Subtext Line 2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-lg md:text-xl font-sans italic text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed">
            Select your path and begin your journey into Esports, STEM, and beyond.
          </p>
        </motion.div>

        {/* Rotating Logo Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
          className="my-8 md:my-12"
        >
          <RotatingLogoCircle />
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
          className="text-center mt-8 md:mt-12"
        >
          <p className="text-sm text-[#B0B0B0] font-sans tracking-wide">
            Touch or click a program logo to get started
          </p>
        </motion.div>
      </div>
    </div>
  );
};