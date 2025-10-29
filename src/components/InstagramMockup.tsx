import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InstagramMockupProps {
  children: ReactNode;
}

export const InstagramMockup = ({ children }: InstagramMockupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mx-auto"
      style={{ width: '340px', height: '680px' }}
    >
      {/* Phone Frame */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-full h-full rounded-[40px] bg-gradient-to-b from-background/80 to-background/60 p-3 shadow-2xl backdrop-blur-sm border border-primary/20"
        style={{
          boxShadow: '0 50px 100px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 212, 255, 0.2)'
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-background/90 rounded-b-3xl z-10 border-x border-b border-primary/20" />
        
        {/* Screen Content */}
        <div className="relative w-full h-full rounded-[32px] bg-gradient-to-b from-background to-background/95 overflow-hidden border border-primary/10">
          {/* Instagram Header Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-primary/10">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                @ncrfoundation
              </span>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-50" />
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="absolute top-14 left-0 right-0 bottom-0 overflow-hidden">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
