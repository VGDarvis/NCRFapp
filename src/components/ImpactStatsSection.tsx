import { Users, DollarSign, Award, TrendingUp, Globe, BookOpen } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "700,000+",
    label: "Students Empowered",
    description: "Students helped nationwide since 1998",
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    icon: DollarSign,
    value: "$5.0 Billion+",
    label: "Scholarships Secured",
    description: "Total scholarship value secured for students",
    gradient: "from-green-600 to-emerald-500"
  },
  {
    icon: Award,
    value: "100%",
    label: "Success Rate",
    description: "Graduation rate for program participants",
    gradient: "from-primary to-amber-500"
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "College Completion",
    description: "Students completing their degree programs",
    gradient: "from-purple-600 to-violet-500"
  },
  {
    icon: Globe,
    value: "107+",
    label: "HBCU Partners",
    description: "Historically Black Colleges and Universities",
    gradient: "from-rose-600 to-pink-500"
  },
  {
    icon: BookOpen,
    value: "26 Years",
    label: "of Excellence",
    description: "Serving communities across the nation",
    gradient: "from-indigo-600 to-blue-500"
  }
];

export const ImpactStatsSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Impact</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            NCRF's vision is to close the gap in educational achievement, workforce and economic disparities. 
            See how we're making a difference in communities nationwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="luxury-card group p-8 text-center rounded-lg hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              {/* Value */}
              <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3`}>
                {stat.value}
              </div>

              {/* Label */}
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {stat.description}
              </p>

              {/* Decorative line */}
              <div className={`w-12 h-1 mx-auto mt-6 rounded-full bg-gradient-to-r ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to be part of our success story?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg hover:scale-105 transition-transform duration-300">
              Start Your Journey
            </button>
            <button className="px-8 py-3 border border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};