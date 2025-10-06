import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Grid3x3 } from 'lucide-react';
import { useSessionManager } from '@/hooks/useSessionManager';
import { SessionWarningDialog } from './SessionWarningDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';

// Import logo assets
import logoEsports from '@/assets/logo-esports.png';
import logoInternshipsCareer from '@/assets/logo-internships-career.png';
import logoSteam from '@/assets/logo-steam.png';
import logoMovement from '@/assets/logo-movement.png';
import logoAthlete from '@/assets/logo-athlete.png';

const programs = [
  { id: 'college-expo', name: 'College Expo', logo: logoEsports },
  { id: 'internships-career', name: 'Internships & Career', logo: logoInternshipsCareer },
  { id: 'steam', name: 'STEaM', logo: logoSteam },
  { id: 'movement', name: 'Movement Enrichment', logo: logoMovement },
  { id: 'athlete', name: 'Student Athlete', logo: logoAthlete },
];

interface DashboardHeaderProps {
  logo: string;
  logoAlt: string;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export function DashboardHeader({ 
  logo, 
  logoAlt, 
  title, 
  subtitle,
  showBackButton = true 
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showWarning, userEmail, resetActivity, dismissWarning } = useSessionManager();

  const handleProgramSwitch = async (programId: string) => {
    // Update user metadata
    await supabase.auth.updateUser({
      data: { program: programId }
    });
    
    // Navigate to dashboard with new program
    navigate(`/dashboard?program=${programId}`);
  };

  return (
    <>
      <SessionWarningDialog 
        open={showWarning} 
        onContinue={() => {
          resetActivity();
          dismissWarning();
        }} 
      />
      <header className="sticky top-0 z-40 glass-premium border-b border-primary/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={logo} 
              alt={logoAlt} 
              className="h-12 md:h-16 w-auto object-contain logo-glow"
            />
            {(title || subtitle) && (
              <div className="hidden md:block">
                {title && <h1 className="text-xl font-bold text-foreground">{title}</h1>}
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {userEmail && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{userEmail}</span>
              </div>
            )}

            {/* Program Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <Grid3x3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Switch Program</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Available Programs</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {programs.map((program) => (
                  <DropdownMenuItem
                    key={program.id}
                    onClick={() => handleProgramSwitch(program.id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <img 
                      src={program.logo} 
                      alt={program.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span>{program.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {showBackButton && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}