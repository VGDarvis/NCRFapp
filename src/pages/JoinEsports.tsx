import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Users, Shield } from "lucide-react";
import { GoldButton, GlassButton } from "@/components/ui/button-variants";

const roles = [
  {
    id: "player",
    title: "Player",
    icon: User,
    description: "Compete in tournaments, earn XP, and convert your gaming skills into real rewards.",
    features: ["Tournament Entry", "XP → USD Conversion", "Team Formation", "Skill Rankings"],
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    id: "coach", 
    title: "Coach",
    icon: Users,
    description: "Lead teams to victory, develop strategies, and mentor the next generation of esports athletes.",
    features: ["Team Management", "Strategy Development", "Player Mentoring", "Performance Analytics"],
    gradient: "from-green-600 to-emerald-500"
  },
  {
    id: "admin",
    title: "Administrator", 
    icon: Shield,
    description: "Manage tournaments, oversee operations, and help build the future of HBCU esports.",
    features: ["Tournament Management", "Platform Oversight", "Community Building", "Data Analytics"],
    gradient: "from-primary to-amber-500"
  }
];

export const JoinEsports = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/auth?role=${selectedRole}`);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative z-10 p-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programs
        </button>
      </div>

      {/* Main Content */}
      <section id="role-selection" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary via-primary/80 to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl border-2 border-primary/30 shadow-lg">
              ES
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Join the <span className="text-primary">HBCU Esports League</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Choose your role in the National HBCU Esports League. Compete in tournaments, 
              earn rewards, and represent your school in the ultimate gaming competition.
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {roles.map((role, index) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`luxury-card group cursor-pointer p-8 rounded-lg transition-all duration-500 hover:scale-105 ${
                  selectedRole === role.id 
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/25 bg-primary/5' 
                    : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Role Icon */}
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${role.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>

                {/* Role Content */}
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {role.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {role.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-foreground/70 flex items-center">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${role.gradient} mr-3 flex-shrink-0`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Selection Indicator */}
                {selectedRole === role.id && (
                  <div className="mt-6 p-3 bg-primary/10 border border-primary/30 rounded-lg text-center">
                    <span className="text-primary font-semibold text-sm">Selected</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            {selectedRole ? (
              <GoldButton 
                size="lg" 
                onClick={handleContinue}
                className="animate-glow-pulse min-w-[200px]"
              >
                Continue as {roles.find(r => r.id === selectedRole)?.title}
              </GoldButton>
            ) : (
              <GlassButton size="lg" disabled className="min-w-[200px] opacity-50">
                Choose Your Role
              </GlassButton>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="max-w-3xl mx-auto luxury-card p-8 rounded-lg">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Why Join the HBCU Esports League?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">$50K+</div>
                  <div className="text-sm text-muted-foreground">Prize Pool</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">107</div>
                  <div className="text-sm text-muted-foreground">HBCU Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">5</div>
                  <div className="text-sm text-muted-foreground">Game Titles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};