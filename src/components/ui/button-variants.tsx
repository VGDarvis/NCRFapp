import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, children, size = 'default', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "btn-gold font-semibold tracking-wide border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300",
          size === 'lg' && "px-8 py-6 text-lg",
          size === 'sm' && "px-4 py-2 text-sm",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GoldButton.displayName = "GoldButton";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size = 'default', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "glass border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 transition-all duration-300",
          size === 'lg' && "px-8 py-6 text-lg",
          size === 'sm' && "px-4 py-2 text-sm",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GlassButton.displayName = "GlassButton";