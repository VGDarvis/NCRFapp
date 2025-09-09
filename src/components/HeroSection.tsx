import { GoldButton, GlassButton } from "@/components/ui/button-variants";
import heroImage from "@/assets/hero-gaming.jpg";

export const HeroSection = () => {
  const scrollToRoleSelection = () => {
    const element = document.getElementById('role-selection');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="HBCU Students Gaming Tournament" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h2 className="text-sm font-medium text-primary tracking-widest uppercase mb-2">
              Powered by National College Resources Foundation
            </h2>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 hero-text-glow">
            <span className="block text-white">Compete.</span>
            <span className="block text-white">Represent.</span>
            <span className="block text-primary animate-glow-pulse">Earn.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join the official National Esports League for HBCU Colleges.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <GoldButton 
              size="lg" 
              onClick={scrollToRoleSelection}
              className="animate-glow-pulse"
            >
              Join the League
            </GoldButton>
            <GlassButton size="lg">
              Watch Highlights
            </GlassButton>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-slide-up">
              <div className="text-3xl font-bold text-primary mb-2">107</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">HBCU Partners</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-primary mb-2">$50K+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Prize Pool</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Game Titles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};