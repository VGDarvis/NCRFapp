import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { useSessionManager } from '@/hooks/useSessionManager';
import { SessionWarningDialog } from './SessionWarningDialog';

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
  const { showWarning, userEmail, resetActivity, dismissWarning } = useSessionManager();

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
            
            {showBackButton && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Programs</span>
                <span className="sm:hidden">Programs</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}