import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import logo assets
import logoGreenClean from '@/assets/logo-green-clean.png';
import logoInternshipsCareer from '@/assets/logo-internships-career.png';
import logoSteam from '@/assets/logo-steam.png';
import logoMovement from '@/assets/logo-movement.png';
import logoAthlete from '@/assets/logo-athlete.png';

interface Program {
  id: string;
  name: string;
  logo: string;
  route: string;
  color: string;
  angle: number;
}

const programs: Program[] = [
  {
    id: 'college-expo',
    name: 'College Expo',
    logo: logoGreenClean,
    route: '/auth/college-expo',
    color: 'hsl(210 100% 56%)', // Professional Blue
    angle: 0
  },
  {
    id: 'internships-career',
    name: 'Internships & Career',
    logo: logoInternshipsCareer,
    route: '/auth/internships-career',
    color: 'hsl(210 100% 56%)', // Professional Blue
    angle: 72
  },
  {
    id: 'steam',
    name: 'STEaM',
    logo: logoSteam,
    route: '/auth/steam',
    color: 'hsl(280 100% 60%)', // Purple
    angle: 144
  },
  {
    id: 'movement',
    name: 'Movement Enrichment',
    logo: logoMovement,
    route: '/auth/movement',
    color: 'hsl(330 100% 60%)', // Pink
    angle: 216
  },
  {
    id: 'athlete',
    name: 'Student Athlete',
    logo: logoAthlete,
    route: '/auth/athlete',
    color: 'hsl(60 100% 50%)', // Yellow
    angle: 288
  }
];

export const RotatingLogoCircle = () => {
  const navigate = useNavigate();

  const handleProgramSelect = (program: Program) => {
    navigate(program.route);
  };

  const circleRadius = 180; // Desktop radius
  const mobileRadius = 130; // Mobile radius

  return (
    <div className="relative">
      {/* Desktop Circle */}
      <div className="hidden md:block">
        <motion.div
          className="relative w-96 h-96"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {programs.map((program) => {
            const radian = (program.angle * Math.PI) / 180;
            const x = Math.cos(radian) * circleRadius;
            const y = Math.sin(radian) * circleRadius;
            
            return (
              <div
                key={program.id}
                className="absolute cursor-pointer"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleProgramSelect(program)}
              >
                <div
                  className="w-32 h-32 rounded-full glass-premium p-3 logo-glow glass-hover glass-glow transition-all duration-300 flex items-center justify-center"
                  style={{
                    boxShadow: `0 0 25px ${program.color}40, 0 0 50px ${program.color}20`
                  }}
                >
                  <img
                    src={program.logo}
                    alt={program.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-center mt-2 text-foreground font-medium">
                  {program.name}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Mobile Circle */}
      <div className="md:hidden">
        <motion.div
          className="relative w-72 h-72"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {programs.map((program) => {
            const radian = (program.angle * Math.PI) / 180;
            const x = Math.cos(radian) * mobileRadius;
            const y = Math.sin(radian) * mobileRadius;
            
            return (
              <div
                key={program.id}
                className="absolute cursor-pointer"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleProgramSelect(program)}
              >
                <div
                  className="w-20 h-20 rounded-full glass-premium p-1.5 logo-glow glass-hover glass-glow transition-all duration-300 flex items-center justify-center"
                  style={{
                    boxShadow: `0 0 18px ${program.color}40, 0 0 36px ${program.color}20`
                  }}
                >
                  <img
                    src={program.logo}
                    alt={program.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[10px] text-center mt-1 text-foreground font-medium">
                  {program.name}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};