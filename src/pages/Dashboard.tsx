import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EsportsDashboard } from '@/components/EsportsDashboard';

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { program } = useParams();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (!currentUser) {
        navigate('/auth');
        setLoading(false);
        return;
      }

      // Fetch user profile to determine program/dashboard type
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();
      
      setProfile(profileData);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully! 👋",
        description: "See you next time!",
      });
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if this is an esports user based on their signup metadata
  const isEsportsProgram = program === 'esports' || 
    // Check for esports-specific metadata fields that are unique to esports signups
    (user?.user_metadata?.attends_college !== undefined) ||
    (user?.user_metadata?.on_esports_team !== undefined) ||
    (user?.user_metadata?.game_preferences !== undefined);

  console.log('Dashboard Debug - Program:', program, 'User metadata:', user?.user_metadata, 'Is Esports:', isEsportsProgram);
  
  // Show EsportsDashboard for esports program users
  if (isEsportsProgram) {
    return <EsportsDashboard />;
  }

  // Default dashboard for other users
  return (
    <div className="min-h-screen bg-gradient-primary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-premium p-8 text-center rounded-2xl">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Welcome to your <span className="text-primary cyber-text-glow">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Welcome back, {profile?.display_name || user?.email}!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass-light p-6 rounded-xl border border-primary/20">
              <h3 className="font-semibold text-lg mb-2 text-foreground">My Teams</h3>
              <p className="text-muted-foreground">Manage your team memberships</p>
            </div>
            
            <div className="glass-light p-6 rounded-xl border border-primary/20">
              <h3 className="font-semibold text-lg mb-2 text-foreground">Tournaments</h3>
              <p className="text-muted-foreground">Join upcoming competitions</p>
            </div>
            
            <div className="glass-light p-6 rounded-xl border border-primary/20">
              <h3 className="font-semibold text-lg mb-2 text-foreground">Statistics</h3>
              <p className="text-muted-foreground">Track your performance</p>
            </div>
          </div>

          <Button onClick={handleSignOut} variant="outline" className="glass-light border-primary/20">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};