import { Trophy, DollarSign, Users, Target } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: DollarSign,
      title: "XP → USD Conversion",
      description: "Transform your gaming skills into real earnings through our unique XP-to-USD system."
    },
    {
      icon: Trophy,
      title: "National Tournaments",
      description: "Compete in officially sanctioned tournaments representing your HBCU on a national stage."
    },
    {
      icon: Users,
      title: "Mentorship Program",
      description: "Connect with industry professionals and alumni who guide your esports journey."
    },
    {
      icon: Target,
      title: "Skill Development",
      description: "Access coaching resources and training programs designed for competitive excellence."
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            About the 
            <span className="text-primary"> League</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The National HBCU Esports League empowers students at Historically Black Colleges and Universities 
            to compete, grow, and earn through competitive gaming while building lasting connections.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="luxury-card p-8 text-center group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Call-out Box */}
        <div className="mt-16 luxury-card p-8 sm:p-12 text-center animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Why HBCUs Lead in Esports
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Historically Black Colleges and Universities have always been at the forefront of innovation 
              and excellence. Now, we're bringing that same pioneering spirit to competitive gaming, 
              creating opportunities for the next generation of esports champions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Since 1837</div>
                <div className="text-sm text-muted-foreground">HBCU Legacy</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">107</div>
                <div className="text-sm text-muted-foreground">HBCU Partners</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">Future</div>
                <div className="text-sm text-muted-foreground">Esports Champions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};