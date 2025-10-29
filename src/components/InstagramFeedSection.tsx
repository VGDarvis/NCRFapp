import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { InstagramMockup } from './InstagramMockup';
import { useInstagramFeed } from '@/hooks/useInstagramFeed';
import { Button } from './ui/button';

export const InstagramFeedSection = () => {
  const { posts, isLoading } = useInstagramFeed();

  // Duplicate posts for seamless infinite scroll
  const duplicatedPosts = [...posts, ...posts];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Mobile Mockup with Instagram Feed */}
        <InstagramMockup>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <motion.div
              animate={{
                y: [0, -(posts.length * 120)],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="grid grid-cols-3 gap-1 p-1"
            >
              {duplicatedPosts.map((post, index) => (
                <motion.a
                  key={`${post.id}-${index}`}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-sm group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={post.thumbnail}
                    alt={`Instagram post ${post.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              ))}
            </motion.div>
          )}
        </InstagramMockup>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center glass-light rounded-xl px-8 py-6 relative overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-xl"
          />
          <div className="relative z-10 flex items-center gap-3 justify-center">
            <Instagram className="w-6 h-6 text-pink-400" />
            <p className="text-lg font-medium cyber-text-glow">
              Stay Connected, Mobile App Coming Soon
            </p>
          </div>
        </motion.div>

        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <Button
            size="lg"
            onClick={() => window.open('https://www.instagram.com/ncrfoundation/?hl=en', '_blank')}
            className="relative overflow-hidden group px-8 py-6 text-lg font-semibold rounded-xl border-0 shadow-2xl"
            style={{
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 flex items-center gap-2 text-white">
              <Instagram className="w-5 h-5" />
              Follow Us @ncrfoundation
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
