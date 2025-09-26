import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Zap, Target, Trophy, Star } from 'lucide-react';

interface StatsTabProps {
  user: User | null;
}

interface PlayerStats {
  totalXP: number;
  achievements: any[];
  seasonalPass: any;
  recentTransactions: any[];
}

export const StatsTab = ({ user }: StatsTabProps) => {
  const [stats, setStats] = useState<PlayerStats>({
    totalXP: 0,
    achievements: [],
    seasonalPass: null,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlayerStats();
    }
  }, [user]);

  const fetchPlayerStats = async () => {
    if (!user) return;

    try {
      // Fetch profile with XP
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp_balance')
        .eq('user_id', user.id)
        .single();

      // Fetch achievements
      const { data: achievements } = await supabase
        .from('player_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(10);

      // Fetch seasonal pass
      const { data: seasonalPass } = await supabase
        .from('seasonal_passes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Fetch recent transactions
      const { data: transactions } = await supabase
        .from('xp_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalXP: profile?.xp_balance || 0,
        achievements: achievements || [],
        seasonalPass: seasonalPass,
        recentTransactions: transactions || []
      });
    } catch (error) {
      console.error('Error fetching player stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getXPLevelInfo = (xp: number) => {
    const level = Math.floor(xp / 1000) + 1;
    const currentLevelXP = xp % 1000;
    const nextLevelXP = 1000;
    const progress = (currentLevelXP / nextLevelXP) * 100;
    
    return { level, currentLevelXP, nextLevelXP, progress };
  };

  const { level, currentLevelXP, nextLevelXP, progress } = getXPLevelInfo(stats.totalXP);

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
          <span className="text-primary cyber-text-glow">Player Stats</span>
        </h1>
        <p className="text-muted-foreground">
          Track your progress and achievements
        </p>
      </div>

      {/* Level & XP Card */}
      <Card className="glass-cyber border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center gap-2">
              <Star className="h-5 w-5" />
              Level {level}
            </CardTitle>
            <Badge className="bg-accent/20 text-accent font-mono">
              {stats.totalXP.toLocaleString()} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {level + 1}</span>
              <span className="text-foreground font-medium">
                {currentLevelXP}/{nextLevelXP} XP
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 glass-light rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{level}</p>
              <p className="text-xs text-muted-foreground">Current Level</p>
            </div>
            <div className="text-center p-3 glass-light rounded-lg">
              <Award className="h-5 w-5 text-accent mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{stats.achievements.length}</p>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Pass */}
      {stats.seasonalPass && (
        <Card className="glass-light border-primary/10">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {stats.seasonalPass.season_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Season Level</span>
                <Badge className={stats.seasonalPass.is_premium ? 'bg-accent/20 text-accent' : 'bg-secondary/20 text-secondary-foreground'}>
                  {stats.seasonalPass.is_premium ? 'Premium' : 'Free'} - Level {stats.seasonalPass.current_level}
                </Badge>
              </div>
              <Progress value={(stats.seasonalPass.current_xp / 1000) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stats.seasonalPass.current_xp}/1000 XP to next tier
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Achievements */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Recent Achievements
        </h3>
        {stats.achievements.length === 0 ? (
          <Card className="glass-light">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No achievements yet</p>
              <p className="text-sm text-muted-foreground">Complete tournaments and challenges to earn achievements</p>
            </CardContent>
          </Card>
        ) : (
          stats.achievements.map((achievement) => (
            <Card key={achievement.id} className="glass-light border-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 glass-cyber rounded-lg">
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-primary mt-1">
                      Earned {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent XP Transactions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Recent XP Activity
        </h3>
        {stats.recentTransactions.length === 0 ? (
          <Card className="glass-light">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {stats.recentTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 glass-light rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {transaction.description || transaction.transaction_type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={transaction.amount > 0 ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} XP
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};