import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { LogOut, ArrowLeft, Loader2 } from 'lucide-react';
import esportsLogo from '@/assets/logo-esports.png';
import steamLogo from '@/assets/logo-steam.png';
import movementLogo from '@/assets/logo-movement.png';

export default function SignOut() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedOut, setIsSignedOut] = useState(false);
  const [userProgram, setUserProgram] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      // Get user's program from metadata
      const program = session.user.user_metadata?.program || '';
      setUserProgram(program);
      
      // Get user's name
      if (session.user.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name);
      } else if (session.user.email) {
        setUserName(session.user.email.split('@')[0]);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      setIsSignedOut(true);
      toast({
        title: "Signed out successfully! 👋",
        description: "Come back soon!",
      });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  const getProgramTheme = () => {
    switch (userProgram) {
      case 'esports':
        return {
          gradient: 'from-cyan-500/20 via-purple-500/20 to-pink-500/20',
          logo: esportsLogo,
          color: 'text-cyan-400',
          name: 'NCRF Esports',
        };
      case 'steam':
        return {
          gradient: 'from-purple-500/20 via-violet-500/20 to-background',
          logo: steamLogo,
          color: 'text-purple-400',
          name: 'NCRF STEAM',
        };
      case 'movement':
        return {
          gradient: 'from-pink-500/20 via-rose-500/20 to-background',
          logo: movementLogo,
          color: 'text-pink-400',
          name: 'Movement Enrichment',
        };
      default:
        return {
          gradient: 'from-primary/20 to-background',
          logo: esportsLogo,
          color: 'text-primary',
          name: 'NCRF Program',
        };
    }
  };

  const theme = getProgramTheme();

  if (isSignedOut) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4`}>
        <Card className="glass-premium max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <img src={theme.logo} alt={theme.name} className="h-24 w-auto object-contain logo-glow" />
          </div>
          
          <div className="space-y-2">
            <h1 className={`text-2xl font-bold ${theme.color}`}>
              See You Soon!
            </h1>
            <p className="text-muted-foreground">
              Redirecting you to the home page...
            </p>
          </div>

          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4`}>
      <Card className="glass-premium max-w-md w-full p-8 space-y-6">
        <div className="flex justify-center">
          <img src={theme.logo} alt={theme.name} className="h-24 w-auto object-contain logo-glow" />
        </div>

        <div className="text-center space-y-2">
          <h1 className={`text-3xl font-bold ${theme.color}`}>
            Sign Out
          </h1>
          {userName && (
            <p className="text-lg text-muted-foreground">
              Goodbye, <span className="text-foreground font-medium">{userName}</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Are you sure you want to sign out of {theme.name}?
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Confirm Sign Out
              </>
            )}
          </Button>

          <Button
            onClick={() => navigate(-1)}
            disabled={isLoading}
            variant="outline"
            className="w-full glass-light border-primary/20"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          You can always sign back in anytime to continue your journey.
        </p>
      </Card>
    </div>
  );
}
