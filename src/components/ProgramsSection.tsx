import { useNavigate } from "react-router-dom";
import { GoldButton } from "@/components/ui/button-variants";
import { 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  Beaker, 
  Heart, 
  Gamepad2 
} from "lucide-react";

const programs = [
  {
    id: "college-expos",
    title: "College Expos",
    description: "Direct college recruitment and access programs connecting students with HBCU opportunities.",
    icon: GraduationCap,
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    features: ["HBCU College Fairs", "Direct Admissions", "Application Fee Waivers", "Scholarship Opportunities"]
  },
  {
    id: "internships-careers",
    title: "Internships & Careers", 
    description: "Professional development and job placement services for students and graduates.",
    icon: Briefcase,
    gradient: "from-green-600 via-emerald-500 to-teal-500",
    features: ["Corporate Partnerships", "Career Coaching", "Job Placement", "Professional Development"]
  },
  {
    id: "student-athlete",
    title: "Student Athlete Program",
    description: "Supporting student athletes with academic success and athletic scholarship opportunities.",
    icon: Trophy,
    gradient: "from-orange-600 via-red-500 to-pink-500",
    features: ["Athletic Scholarships", "Academic Support", "Recruiting Assistance", "Performance Analytics"]
  },
  {
    id: "stem",
    title: "STEM Program",
    description: "Science, Technology, Engineering, and Mathematics educational advancement initiatives.", 
    icon: Beaker,
    gradient: "from-purple-600 via-violet-500 to-indigo-500",
    features: ["STEM Scholarships", "Research Opportunities", "Industry Mentorship", "Innovation Labs"]
  },
  {
    id: "movement-enrichment", 
    title: "Movement Enrichment",
    description: "Holistic educational intervention programs for comprehensive student development.",
    icon: Heart,
    gradient: "from-rose-600 via-pink-500 to-fuchsia-500",
    features: ["Wellness Programs", "Mental Health Support", "Life Skills Training", "Community Building"]
  },
  {
    id: "esports",
    title: "Esports Program",
    description: "Competitive gaming platform connecting HBCU students through esports tournaments and scholarships.",
    icon: Gamepad2,
    gradient: "from-amber-600 via-yellow-500 to-primary",
    features: ["Gaming Tournaments", "XP → USD Conversion", "Esports Scholarships", "Team Competition"]
  }
];

export const ProgramsSection = () => {
  const navigate = useNavigate();

  const handleProgramClick = (programId: string) => {
    if (programId === "esports") {
      navigate("/join-esports");
    } else {
      // For other programs, you can add routing later or show coming soon
      console.log(`Navigate to ${programId} program`);
    }
  };

  return (
    <section id="programs" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Programs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive educational support across multiple disciplines, designed to empower 
            students at every stage of their academic and professional journey.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={program.id}
              className="luxury-card group cursor-pointer p-8 rounded-lg transition-all duration-300 hover:scale-105"
              onClick={() => handleProgramClick(program.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Program Icon */}
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${program.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <program.icon className="w-8 h-8 text-white" />
              </div>

              {/* Program Content */}
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {program.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {program.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {program.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-foreground/70 flex items-center">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${program.gradient} mr-3 flex-shrink-0`}></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="mt-auto">
                {program.id === "esports" ? (
                  <GoldButton className="w-full group-hover:scale-105 transition-transform duration-300">
                    Join League
                  </GoldButton>
                ) : (
                  <button className="w-full px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-md hover:bg-primary/10 transition-colors duration-300">
                    Learn More
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};