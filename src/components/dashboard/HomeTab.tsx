import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, TrendingUp, Calendar, Users, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface HomeTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const HomeTab = ({ user, isGuest = false }: HomeTabProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    upcomingTournaments: 0,
    teamMembers: 0,
    totalXP: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setProfile(data);
  };

  const fetchStats = async () => {
    if (!user) return;

    // Fetch tournaments count
    const { count: tournamentsCount } = await supabase
      .from('tournaments')
      .select('*', { count: 'exact' })
      .eq('status', 'upcoming');

    // Fetch team members count for user's teams
    const { count: membersCount } = await supabase
      .from('team_members')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_active', true);

    setStats({
      upcomingTournaments: tournamentsCount || 0,
      teamMembers: membersCount || 0,
      totalXP: profile?.xp_balance || 0,
    });
  };


  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-6">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Welcome back, <span className="text-primary cyber-text-glow">{profile?.display_name || user?.email}</span>
        </h1>
        <p className="text-muted-foreground">
          Ready to compete in the HBCU Esports ecosystem?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-light p-4 rounded-xl border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 glass-cyber rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalXP}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </div>
        </div>

        <div className="glass-light p-4 rounded-xl border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 glass-cyber rounded-lg">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.upcomingTournaments}</p>
              <p className="text-xs text-muted-foreground">Tournaments</p>
            </div>
          </div>
        </div>
      </div>

      {/* HBCU Spotlight */}
      <Card className="glass-medium border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Bell className="h-5 w-5" />
            HBCU Esports News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 glass-light rounded-lg">
              <h4 className="font-semibold text-foreground">Black College Expo Tournament Series</h4>
              <p className="text-sm text-muted-foreground">Registration now open for Spring 2024 championship</p>
            </div>
            <div className="p-3 glass-light rounded-lg">
              <h4 className="font-semibold text-foreground">Weekly HBCU Showdown</h4>
              <p className="text-sm text-muted-foreground">Join every Friday for competitive matches</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="glass-light border-primary/20 hover:glass-cyber">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Practice
          </Button>
          <Button variant="outline" className="glass-light border-primary/20 hover:glass-cyber">
            <Users className="h-4 w-4 mr-2" />
            Find Team
          </Button>
        </div>
      </div>

      {/* Sign Out / Return */}
      <div className="pt-4">
        {isGuest ? (
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="w-full glass-light border-primary/20"
          >
            Return to Programs
          </Button>
        ) : (
          <Button 
            onClick={() => navigate('/signout')} 
            variant="outline" 
            className="w-full glass-light border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            Sign Out →
          </Button>
        )}
      </div>
    </div>
  );
};