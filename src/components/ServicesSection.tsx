import { ArrowRight, Check } from "lucide-react";

const services = [
  {
    title: "College Access",
    description: "Direct pathways to higher education with comprehensive support throughout the journey.",
    features: [
      "Direct college connections with HBCU partners",
      "College application fee waivers", 
      "Scholarship matching and applications",
      "Academic preparation and tutoring",
      "Financial aid guidance and FAFSA support"
    ],
    color: "from-blue-600 to-cyan-500"
  },
  {
    title: "Career Resources", 
    description: "Professional development and industry connections to launch successful careers.",
    features: [
      "Corporate internship placements",
      "Professional mentorship programs",
      "Career coaching and resume building",
      "Industry networking opportunities",
      "Job placement assistance and follow-up"
    ],
    color: "from-green-600 to-emerald-500"
  },
  {
    title: "Educational Services",
    description: "Holistic support systems designed to ensure academic and personal success.",
    features: [
      "Academic mentoring and life coaching",
      "Study skills and time management training",
      "College and career planning workshops", 
      "Mental health and wellness support",
      "Community building and peer connections"
    ],
    color: "from-primary to-amber-500"
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6">
            How We <span className="text-primary">Serve</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive support services designed to remove barriers and create pathways 
            to educational and professional success.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="luxury-card group p-8 rounded-lg hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Header */}
              <div className={`w-full h-2 rounded-full bg-gradient-to-r ${service.color} mb-6`}></div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-foreground/80">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mt-0.5 flex-shrink-0`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button className={`w-full p-4 bg-gradient-to-r ${service.color} text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group`}>
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Mission Statement */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto luxury-card p-12 rounded-lg">
            <h3 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Mission in Action
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              "National College Resources Foundation is a 501(c)(3) nonprofit educational enhancement organization. 
              Our mission is to curtail the high school dropout rate and increase degree and/or certificate enrollment 
              among underserved, underrepresented, at-risk, low resource, homeless and foster students."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg hover:scale-105 transition-transform duration-300">
                Support Our Mission
              </button>
              <button className="px-8 py-3 border border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};