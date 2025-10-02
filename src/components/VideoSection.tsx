import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState } from 'react';

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = 'eunwF2inM3A';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="glass-premium rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative aspect-video">
          {!isPlaying ? (
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm cursor-pointer group"
              onClick={() => setIsPlaying(true)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-cyber rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-12 h-12 text-primary" fill="currentColor" />
                </div>
              </div>
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-50"
              />
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="NCRF Programs Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};
