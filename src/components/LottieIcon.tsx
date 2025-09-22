import { useRef, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface LottieIconProps {
  animationData: any;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  onHover?: boolean;
}

export const LottieIcon = ({ 
  animationData, 
  className = "w-16 h-16", 
  autoplay = true, 
  loop = true,
  onHover = false 
}: LottieIconProps) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const handleMouseEnter = () => {
    if (onHover && lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (onHover && lottieRef.current) {
      lottieRef.current.stop();
    }
  };

  return (
    <div 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay={autoplay}
        loop={loop}
        className="w-full h-full"
      />
    </div>
  );
};