import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate('/auth');
      }
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
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="luxury-card p-8 text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Welcome to your <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Welcome back, {user?.user_metadata?.display_name || user?.email}!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="luxury-card p-6">
              <h3 className="font-semibold text-lg mb-2">My Teams</h3>
              <p className="text-muted-foreground">Manage your team memberships</p>
            </div>
            
            <div className="luxury-card p-6">
              <h3 className="font-semibold text-lg mb-2">Tournaments</h3>
              <p className="text-muted-foreground">Join upcoming competitions</p>
            </div>
            
            <div className="luxury-card p-6">
              <h3 className="font-semibold text-lg mb-2">Statistics</h3>
              <p className="text-muted-foreground">Track your performance</p>
            </div>
          </div>

          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};