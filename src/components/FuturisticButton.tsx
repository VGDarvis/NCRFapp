import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FuturisticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'cyber' | 'neon' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  isLoading?: boolean;
}

export const FuturisticButton = forwardRef<HTMLButtonElement, FuturisticButtonProps>(
  ({ className, children, variant = 'cyber', size = 'default', isLoading, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      cyber: "btn-cyber text-primary-foreground",
      neon: "btn-neon text-primary-foreground",
      ghost: "hover:bg-accent/20 hover:text-accent-foreground text-foreground",
      outline: "border border-primary/30 bg-transparent hover:bg-primary/10 hover:border-primary/50 text-foreground"
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      default: "h-11 px-6 py-2",
      lg: "h-12 px-8 text-lg"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center w-full h-full"
        >
          {isLoading ? (
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : children}
        </motion.div>
      </button>
    );
  }
);

FuturisticButton.displayName = "FuturisticButton";