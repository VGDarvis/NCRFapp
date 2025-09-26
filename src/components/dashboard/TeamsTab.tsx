import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, MessageCircle, Calendar, Crown, UserPlus } from 'lucide-react';

interface TeamsTabProps {
  user: User | null;
}

interface Team {
  id: string;
  name: string;
  hbcu_name: string;
  captain_id: string;
  team_xp: number;
  wins: number;
  losses: number;
  created_at: string;
}

interface TeamMember {
  id: string;
  role: string;
  user_id: string;
  profiles: {
    display_name: string;
    email: string;
  };
}

export const TeamsTab = ({ user }: TeamsTabProps) => {
  const [myTeams, setMyTeams] = useState<(Team & { members: TeamMember[] })[]>([]);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTeamsData();
    }
  }, [user]);

  const fetchTeamsData = async () => {
    if (!user) return;

    try {
      // Fetch user's teams
      const { data: membershipData } = await supabase
        .from('team_members')
        .select(`
          teams (
            id,
            name,
            hbcu_name,
            captain_id,
            team_xp,
            wins,
            losses,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      const userTeams = membershipData?.map(m => m.teams).filter(Boolean) || [];
      
      // Fetch team members for each team
      const teamsWithMembers = await Promise.all(
        userTeams.map(async (team) => {
          const { data: members } = await supabase
            .from('team_members')
            .select(`
              id,
              role,
              user_id,
              profiles (
                display_name,
                email
              )
            `)
            .eq('team_id', team.id)
            .eq('is_active', true);

          return {
            ...team,
            members: members || []
          };
        })
      );

      setMyTeams(teamsWithMembers);

      // Fetch available teams (not joined by user)
      const userTeamIds = userTeams.map(t => t.id);
      const { data: availableData } = await supabase
        .from('teams')
        .select('*')
        .not('id', 'in', `(${userTeamIds.join(',')})`)
        .limit(10);

      setAvailableTeams(availableData || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWinRate = (wins: number, losses: number) => {
    const total = wins + losses;
    return total > 0 ? Math.round((wins / total) * 100) : 0;
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
          <span className="text-primary cyber-text-glow">My Teams</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your HBCU esports teams and find new ones
        </p>
      </div>

      {/* Create Team Button */}
      <Button className="w-full glass-cyber border-primary/30">
        <Plus className="h-4 w-4 mr-2" />
        Create New Team
      </Button>

      {/* My Teams */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">My Teams ({myTeams.length})</h3>
        {myTeams.length === 0 ? (
          <Card className="glass-light">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You're not part of any teams yet</p>
              <Button variant="outline" className="glass-light border-primary/20">
                <UserPlus className="h-4 w-4 mr-2" />
                Find Teams
              </Button>
            </CardContent>
          </Card>
        ) : (
          myTeams.map((team) => (
            <Card key={team.id} className="glass-light border-primary/10">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      {team.captain_id === user?.id && (
                        <Crown className="h-4 w-4 text-accent" />
                      )}
                      {team.name}
                    </CardTitle>
                    <p className="text-sm text-primary">{team.hbcu_name}</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary">
                    {calculateWinRate(team.wins, team.losses)}% WR
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-accent">{team.team_xp}</p>
                    <p className="text-xs text-muted-foreground">Team XP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{team.wins}</p>
                    <p className="text-xs text-muted-foreground">Wins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{team.losses}</p>
                    <p className="text-xs text-muted-foreground">Losses</p>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Members ({team.members.length})</h4>
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    {team.members.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">
                          {member.profiles.display_name || member.profiles.email}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                    {team.members.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{team.members.length - 3} more members
                      </p>
                    )}
                  </div>
                </div>

                {/* Team Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="glass-light border-primary/20">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm" className="glass-light border-primary/20">
                    <Calendar className="h-4 w-4 mr-1" />
                    Practice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Available Teams */}
      {availableTeams.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Find Teams</h3>
          {availableTeams.map((team) => (
            <Card key={team.id} className="glass-light border-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{team.name}</h4>
                    <p className="text-sm text-primary">{team.hbcu_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{team.team_xp} XP</p>
                    <p className="text-xs text-muted-foreground">
                      {calculateWinRate(team.wins, team.losses)}% WR
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full glass-light border-primary/20">
                  Request to Join
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};