import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';
import { SignUpForm } from './SignUpForm';
import { CollegeExpoSignUpForm } from './CollegeExpoSignUpForm';
import { LoginForm } from './LoginForm';
import { FuturisticButton } from './FuturisticButton';

// Import logo assets
import logoEsports from '@/assets/logo-esports.png';
import logoInternshipsCareer from '@/assets/logo-internships-career.png';
import logoSteam from '@/assets/logo-steam.png';
import logoMovement from '@/assets/logo-movement.png';
import logoAthlete from '@/assets/logo-athlete.png';

interface ProgramConfig {
  id: string;
  name: string;
  fullName: string;
  logo: string;
  description: string;
  color: string;
  gradient: string;
}

const programConfigs: Record<string, ProgramConfig> = {
  'college-expo': {
    id: 'college-expo',
    name: 'College Expo',
    fullName: 'NCRF College Expo Program',
    logo: logoEsports,
    description: 'Navigate your college journey with expert guidance and resources',
    color: 'hsl(210 100% 56%)',
    gradient: 'from-blue-600 to-blue-400'
  },
  'internships-career': {
    id: 'internships-career',
    name: 'Internships & Career',
    fullName: 'Internships & Career Development',
    logo: logoInternshipsCareer,
    description: 'Professional development and career advancement',
    color: 'hsl(210 100% 56%)',
    gradient: 'from-blue-600 to-blue-400'
  },
  steam: {
    id: 'steam',
    name: 'STEaM',
    fullName: 'Science, Technology, Engineering, Arts & Mathematics',
    logo: logoSteam,
    description: 'Innovation through interdisciplinary learning',
    color: 'hsl(280 100% 60%)',
    gradient: 'from-purple-500 to-violet-400'
  },
  movement: {
    id: 'movement',
    name: 'Movement Enrichment',
    fullName: 'Movement Enrichment Program',
    logo: logoMovement,
    description: 'Physical wellness and holistic development',
    color: 'hsl(330 100% 60%)',
    gradient: 'from-pink-500 to-rose-400'
  },
  athlete: {
    id: 'athlete',
    name: 'Student Athlete',
    fullName: 'Student Athlete Program',
    logo: logoAthlete,
    description: 'Excellence in academics and athletics',
    color: 'hsl(60 100% 50%)',
    gradient: 'from-yellow-500 to-amber-400'
  }
};

export const ProgramAuthPage = () => {
  const { program } = useParams<{ program: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  
  const programConfig = program ? programConfigs[program] : null;
  const guestMode = searchParams.get('guest') === 'true';

  useEffect(() => {
    if (!programConfig) {
      navigate('/');
    }
  }, [programConfig, navigate]);

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  const handleGuestAccess = () => {
    navigate(`/guest/${program}`);
  };

  const handleBackToPrograms = () => {
    navigate('/');
  };

  if (!programConfig) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden cyber-gradient">
      <ParticleBackground />
      
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleBackToPrograms}
        className="absolute top-6 left-6 z-20 p-2 rounded-full cyber-glass hover:bg-primary/20 transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </motion.button>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Program Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                className="inline-block mb-6"
                style={{
                  filter: `drop-shadow(0 0 20px ${programConfig.color}60)`
                }}
              >
                <img
                  src={programConfig.logo}
                  alt={programConfig.name}
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto lg:mx-0"
                />
              </motion.div>
              
              <h1 className="text-3xl md:text-5xl font-display font-bold cyber-text-glow mb-4">
                {programConfig.fullName}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
                {programConfig.description}
              </p>

              {/* Guest Access */}
              <FuturisticButton
                variant="outline"
                size="lg"
                onClick={handleGuestAccess}
                className="mb-4"
              >
                Continue as Guest
              </FuturisticButton>
              
              <p className="text-sm text-muted-foreground">
                No account required for guest access
              </p>
            </motion.div>

            {/* Auth Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="cyber-card p-8 rounded-lg">
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    <FuturisticButton
                      variant={authMode === 'signup' ? 'cyber' : 'ghost'}
                      size="sm"
                      onClick={() => setAuthMode('signup')}
                      className="flex-1"
                    >
                      Sign Up
                    </FuturisticButton>
                    <FuturisticButton
                      variant={authMode === 'login' ? 'cyber' : 'ghost'}
                      size="sm"
                      onClick={() => setAuthMode('login')}
                      className="flex-1"
                    >
                      Login
                    </FuturisticButton>
                  </div>
                </div>

                {authMode === 'signup' ? (
                  programConfig.id === 'college-expo' ? (
                    <CollegeExpoSignUpForm 
                      onSuccess={handleAuthSuccess}
                    />
                  ) : (
                    <SignUpForm 
                      role={programConfig.id as 'player' | 'coach' | 'admin'}
                      onSuccess={handleAuthSuccess}
                    />
                  )
                ) : (
                  <LoginForm 
                    onSuccess={handleAuthSuccess}
                    program={program}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};