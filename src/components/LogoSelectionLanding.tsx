import { motion } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { RotatingLogoCircle } from './RotatingLogoCircle';
import { InstagramFeedSection } from './InstagramFeedSection';
import { Button } from './ui/button';
import { Shield, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const LogoSelectionLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden cyber-gradient">
      <ParticleBackground />
      
      {/* Top Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 right-4 z-50 flex gap-2"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast.info('Shop Coming Soon', {
              description: 'Our merchandise store will be available soon!',
              duration: 3000,
            });
          }}
          className="gap-2 glass-premium border-primary/30 hover:border-primary/60"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Shop</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/login')}
          className="gap-2 glass-premium border-primary/30 hover:border-primary/60"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Admin</span>
        </Button>
      </motion.div>
      
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
            National College Resources Foundation
          </h1>
        </motion.div>

        {/* Instagram Feed Section */}
        <InstagramFeedSection />

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