import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import logo assets
import logoEsports from '@/assets/logo-esports.png';
import logoGreenClean from '@/assets/logo-green-clean.png';
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
    id: 'esports',
    name: 'Esports',
    logo: logoEsports,
    route: '/auth/esports',
    color: 'hsl(194 100% 50%)', // Neon Blue
    angle: 0
  },
  {
    id: 'green-clean',
    name: 'Green & Clean',
    logo: logoGreenClean,
    route: '/auth/green-clean',
    color: 'hsl(154 100% 50%)', // Cyber Green
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
              <motion.div
                key={program.id}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
                onClick={() => handleProgramSelect(program)}
              >
                <motion.div
                  className="w-32 h-32 rounded-full cyber-card p-3 logo-glow transition-transform hover:scale-105"
                  style={{
                    boxShadow: `0 0 25px ${program.color}40, 0 0 50px ${program.color}20`
                  }}
                >
                  <motion.img
                    src={program.logo}
                    alt={program.name}
                    className="w-full h-full object-contain"
                    style={{ transformOrigin: "center" }}
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
                <motion.p
                  className="text-xs text-center mt-2 text-foreground font-medium"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {program.name}
                </motion.p>
              </motion.div>
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
              <motion.div
                key={program.id}
                className="absolute top-1/2 left-1/2 cursor-pointer"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
                onClick={() => handleProgramSelect(program)}
              >
                <motion.div
                  className="w-20 h-20 rounded-full cyber-card p-1.5 logo-glow transition-transform hover:scale-105"
                  style={{
                    boxShadow: `0 0 18px ${program.color}40, 0 0 36px ${program.color}20`
                  }}
                >
                  <motion.img
                    src={program.logo}
                    alt={program.name}
                    className="w-full h-full object-contain"
                    style={{ transformOrigin: "center" }}
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
                <motion.p
                  className="text-[10px] text-center mt-1 text-foreground font-medium"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {program.name}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};