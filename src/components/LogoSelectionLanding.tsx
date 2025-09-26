import { motion } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { RotatingLogoCircle } from './RotatingLogoCircle';

export const LogoSelectionLanding = () => {
  return (
    <div className="min-h-screen relative overflow-hidden cyber-gradient">
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title Container with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8 md:mb-12 glass-premium rounded-2xl p-8 md:p-12"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold cyber-text-glow mb-4">
            National College Resources Foundation Programs
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your program to begin your journey
          </p>
        </motion.div>

        {/* Rotating Logo Circle with Glass Container */}
        <div className="my-8 md:my-12">
          <div className="glass-cyber rounded-full p-8 md:p-12 inline-block">
            <RotatingLogoCircle />
          </div>
        </div>

        {/* Instructions with Glass Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-8 md:mt-12 glass-light rounded-xl px-6 py-4 glass-glow"
        >
          <p className="text-sm text-muted-foreground">
            Touch or click a program logo to get started
          </p>
        </motion.div>
      </div>
    </div>
  );
};