import { GoldButton, GlassButton } from "@/components/ui/button-variants";

export const NCRFHeroSection = () => {
  const scrollToPrograms = () => {
    const element = document.getElementById('programs');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with NCRF-inspired gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/50 to-background"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {/* NCRF Logo/Brand */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="w-full h-full bg-gradient-to-br from-primary via-primary/80 to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold text-2xl border-2 border-primary/30 shadow-lg">
                NCRF
              </div>
            </div>
            <h2 className="text-lg font-medium text-primary tracking-widest uppercase mb-2">
              National College Resources Foundation
            </h2>
            <p className="text-sm text-muted-foreground">
              Est. 1998 • Celebrating 26 Years of Service Nationwide
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 hero-text-glow">
            <span className="block text-foreground mb-4">Empowering Students</span>
            <span className="block text-foreground mb-4">to Be</span>
            <span className="block text-primary animate-glow-pulse">Successful</span>
            <span className="block text-muted-foreground text-3xl sm:text-4xl lg:text-5xl font-normal mt-6">
              in School and Life
            </span>
          </h1>

          {/* Mission Statement */}
          <p className="text-xl sm:text-2xl text-foreground/80 mb-12 max-w-5xl mx-auto leading-relaxed">
            Our mission is to curtail the high school dropout rate and increase degree and certificate enrollment 
            among underserved, underrepresented, at-risk, low resource, homeless and foster students.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <GoldButton 
              size="lg" 
              onClick={scrollToPrograms}
              className="animate-glow-pulse min-w-[200px]"
            >
              Explore Programs
            </GoldButton>
            <GlassButton size="lg" className="min-w-[200px]">
              Get Support
            </GlassButton>
          </div>

          {/* Key Impact Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-slide-up">
              <div className="text-4xl font-bold text-primary mb-2">700,000+</div>
              <div className="text-foreground/80 text-sm uppercase tracking-wide">Students Helped</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-primary mb-2">$5.0B+</div>
              <div className="text-foreground/80 text-sm uppercase tracking-wide">Scholarships Secured</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-foreground/80 text-sm uppercase tracking-wide">Graduation Rate</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-foreground/80 text-sm uppercase tracking-wide">College Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};