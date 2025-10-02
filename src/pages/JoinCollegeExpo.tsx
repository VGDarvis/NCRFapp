import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, BookOpen, MapPin } from "lucide-react";
import { GoldButton, GlassButton } from "@/components/ui/button-variants";

const roles = [
  {
    id: "student",
    title: "Student",
    icon: GraduationCap,
    description: "Access college expo events, discover scholarships, and prepare for your college journey.",
    features: ["Event Registration", "Scholarship Search", "College Prep Resources", "Application Tracking"],
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    id: "parent", 
    title: "Parent/Guardian",
    icon: BookOpen,
    description: "Support your student's college journey with resources, event information, and financial aid guidance.",
    features: ["Event Updates", "Financial Aid Info", "College Resources", "Student Progress"],
    gradient: "from-green-600 to-emerald-500"
  },
  {
    id: "counselor",
    title: "Counselor", 
    icon: MapPin,
    description: "Guide students through the college application process with our comprehensive tools and resources.",
    features: ["Student Management", "Resource Sharing", "Event Planning", "Progress Tracking"],
    gradient: "from-primary to-amber-500"
  }
];

const JoinCollegeExpo = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/auth/college-expo?role=${selectedRole}`);
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
              CE
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Join <span className="text-primary">College Expo</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Choose your role in the College Expo program. Access college preparation resources,
              discover scholarship opportunities, and navigate your path to higher education.
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
                Why Join College Expo?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Scholarships</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Expo Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground">Resources</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinCollegeExpo;