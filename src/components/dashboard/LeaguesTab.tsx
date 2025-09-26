import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Users, DollarSign, Star } from 'lucide-react';

interface LeaguesTabProps {
  user: User | null;
}

interface Tournament {
  id: string;
  name: string;
  description: string;
  game_title: string;
  status: string;
  start_date: string;
  end_date: string;
  max_teams: number;
  entry_fee_xp: number;
  prize_pool_xp: number;
}

export const LeaguesTab = ({ user }: LeaguesTabProps) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary/20 text-primary';
      case 'active': return 'bg-accent/20 text-accent';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-6">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          <span className="text-primary cyber-text-glow">HBCU Leagues</span>
        </h1>
        <p className="text-muted-foreground">
          Compete in the Black College Expo tournament series
        </p>
      </div>

      {/* Featured Tournament */}
      <Card className="glass-cyber border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center gap-2">
              <Star className="h-5 w-5" />
              Featured Tournament
            </CardTitle>
            <Badge className="bg-accent/20 text-accent">Live Now</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-bold text-xl text-foreground mb-2">
            Black College Expo Championship
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            The premier HBCU esports tournament featuring all major games and substantial prizes
          </p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="h-4 w-4 text-accent" />
              <span className="text-foreground">5,000 XP Pool</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-foreground">32 Teams Max</span>
            </div>
          </div>
          <Button className="w-full glass-light border-primary/20 hover:glass-cyber">
            Join Tournament
          </Button>
        </CardContent>
      </Card>

      {/* All Tournaments */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">All Tournaments</h3>
        {tournaments.length === 0 ? (
          <Card className="glass-light">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tournaments available at the moment</p>
            </CardContent>
          </Card>
        ) : (
          tournaments.map((tournament) => (
            <Card key={tournament.id} className="glass-light border-primary/10 hover:glass-medium transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{tournament.name}</h4>
                    <p className="text-sm text-muted-foreground">{tournament.game_title}</p>
                  </div>
                  <Badge className={getStatusColor(tournament.status)}>
                    {tournament.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{formatDate(tournament.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <span className="text-foreground">{tournament.prize_pool_xp} XP</span>
                  </div>
                </div>

                {tournament.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {tournament.description}
                  </p>
                )}

                <Button 
                  variant="outline" 
                  className="w-full glass-light border-primary/20 hover:glass-cyber"
                  disabled={tournament.status === 'completed'}
                >
                  {tournament.status === 'upcoming' ? 'Register' : 
                   tournament.status === 'active' ? 'Join Match' : 'View Results'}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};