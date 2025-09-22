import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Users, Shield } from "lucide-react";
import { GoldButton } from "@/components/ui/button-variants";

export const RoleSelectionSection = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: 'player',
      title: 'Competitive Player',
      icon: Gamepad2,
      description: 'Join your school\'s team and compete in national leagues for prizes and recognition.',
      features: ['Join HBCU Teams', 'Compete for Prizes', 'Earn XP → USD', 'National Rankings'],
      gradient: 'from-blue-600/20 to-purple-600/20',
      borderGradient: 'from-blue-500 to-purple-500'
    },
    {
      id: 'coach',
      title: 'Coach / Team Manager',
      icon: Users,
      description: 'Lead and mentor teams while managing tournaments and developing talent.',
      features: ['Team Management', 'Tournament Organization', 'Player Development', 'Strategic Planning'],
      gradient: 'from-green-600/20 to-emerald-600/20',
      borderGradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: Shield,
      description: 'Manage the platform, oversee tournaments, and support the HBCU esports community.',
      features: ['Platform Management', 'Tournament Oversight', 'User Support', 'Analytics Access'],
      gradient: 'from-amber-600/20 to-orange-600/20',
      borderGradient: 'from-amber-500 to-orange-500'
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/auth?role=${selectedRole}`);
    }
  };

  return (
    <section id="role-selection" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-secondary/10 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Choose Your
            <span className="text-primary"> Role</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            🎯 Select how you want to participate in the National HBCU Esports League! 
            Each role offers unique opportunities and experiences. Let's get started! ✨
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {roles.map((role, index) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`luxury-card p-8 cursor-pointer group transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 animate-slide-up ${
                selectedRole === role.id 
                  ? 'ring-2 ring-primary shadow-2xl bg-gradient-to-br ' + role.gradient + ' animate-glow-pulse'
                  : 'hover:shadow-xl hover:shadow-primary/10'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Role Icon */}
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${role.borderGradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                  <role.icon className="w-10 h-10 text-primary" />
                </div>
              </div>

              {/* Role Title */}
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {role.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {role.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {role.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Selection Indicator */}
              <div className={`w-full h-1 rounded-full transition-all duration-300 ${
                selectedRole === role.id 
                  ? `bg-gradient-to-r ${role.borderGradient}` 
                  : 'bg-border'
              }`}></div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center animate-fade-in">
          <GoldButton 
            size="lg" 
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`transition-all duration-300 ${
              !selectedRole 
                ? 'opacity-50 cursor-not-allowed' 
                : 'animate-glow-pulse'
            }`}
            >
              🚀 Continue to Sign Up
            </GoldButton>
          
          {selectedRole && (
            <p className="mt-4 text-sm text-muted-foreground animate-fade-in">
              🎉 Awesome choice! Selected: <span className="text-primary font-semibold">
                {roles.find(r => r.id === selectedRole)?.title}
              </span>
            </p>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-16 luxury-card p-6 text-center animate-fade-in">
          <p className="text-sm text-muted-foreground">
            <strong className="text-primary">💡 Pro Tip:</strong> You can change your role preferences later in your profile settings.
            All participants receive access to mentorship programs and community events! 🤝
          </p>
        </div>
      </div>
    </section>
  );
};