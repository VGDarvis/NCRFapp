import { motion } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { Button } from './ui/button';
import { Shield, ShoppingBag, ChevronRight, GraduationCap, Dumbbell, Lightbulb, Briefcase, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

const programs = [
  {
    id: 'college-expo',
    name: 'Black College Expo™',
    description: 'Connecting students with HBCUs and colleges nationwide',
    icon: GraduationCap,
    route: '/bce-programs',
    active: true,
  },
  {
    id: 'steam',
    name: 'STEAM Program',
    description: 'Science, Technology, Engineering, Arts & Math',
    icon: Lightbulb,
    route: '/coming-soon',
    active: false,
  },
  {
    id: 'athlete',
    name: 'Athlete Program',
    description: 'Athletic recruitment and college connections',
    icon: Dumbbell,
    route: '/coming-soon',
    active: false,
  },
  {
    id: 'movement',
    name: 'Movement Program',
    description: 'Mentorship, tutoring, and wellness',
    icon: Users,
    route: '/coming-soon',
    active: false,
  },
  {
    id: 'internships',
    name: 'Internships & Careers',
    description: 'Job readiness and career development',
    icon: Briefcase,
    route: '/coming-soon',
    active: false,
  },
];

export const LogoSelectionLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden cyber-gradient">
      <ParticleBackground />

      {/* Top Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 right-4 z-50 flex gap-2"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast.info('Shop Coming Soon', {
              description: 'Our merchandise store will be available soon!',
              duration: 3000,
            });
          }}
          className="gap-2 glass-premium border-primary/30 hover:border-primary/60"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Shop</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/login')}
          className="gap-2 glass-premium border-primary/30 hover:border-primary/60"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Admin</span>
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-10 md:mb-14"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold cyber-text-glow mb-3">
            National College Resources Foundation
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Empowering students through education, exposure, and opportunity
          </p>
        </motion.div>

        {/* Programs List */}
        <div className="w-full max-w-2xl space-y-4">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <motion.button
                key={program.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                onClick={() => navigate(program.route)}
                className={`w-full flex items-center gap-4 md:gap-6 p-5 md:p-6 rounded-xl border text-left transition-all duration-300 group ${
                  program.active
                    ? 'glass-premium border-primary/40 hover:border-primary hover:shadow-[var(--glow-blue)] cursor-pointer'
                    : 'glass-light border-border/30 hover:border-border/50 cursor-pointer opacity-75'
                }`}
              >
                <div className={`p-3 rounded-lg shrink-0 ${
                  program.active
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-lg md:text-xl font-semibold ${
                      program.active ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {program.name}
                    </span>
                    {!program.active && (
                      <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {program.description}
                  </p>
                </div>
                <ChevronRight className={`w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1 ${
                  program.active ? 'text-primary' : 'text-muted-foreground/50'
                }`} />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
