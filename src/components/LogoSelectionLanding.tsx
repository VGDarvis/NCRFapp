import { motion } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { RotatingLogoCircle } from './RotatingLogoCircle';

export const LogoSelectionLanding = () => {
  return (
    <div className="min-h-screen relative overflow-hidden cyber-gradient">
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold cyber-text-glow mb-4">
            NCRF Programs
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your program to begin your journey
          </p>
        </motion.div>

        {/* Rotating Logo Circle */}
        <RotatingLogoCircle />

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            Touch or click a program logo to get started
          </p>
        </motion.div>
      </div>
    </div>
  );
};