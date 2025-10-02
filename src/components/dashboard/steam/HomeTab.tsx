import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FlaskConical, Rocket, Award, TrendingUp, Sparkles, BookOpen } from 'lucide-react';

interface HomeTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const HomeTab = ({ user, isGuest = false }: HomeTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    projectsCompleted: 0,
    activeCourses: 2,
    labsCompleted: 0,
    skillLevel: 1,
    skillProgress: 35
  });

  useEffect(() => {
    if (user && !isGuest) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(data);
      };

      fetchProfile();
    }
  }, [user, isGuest]);


  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="glass-premium p-6 rounded-2xl border border-purple-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-400 rounded-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Welcome to <span className="text-purple-400">STEaM</span>
            </h1>
            <p className="text-muted-foreground">
              {isGuest ? 'Guest Explorer' : profile?.display_name || user?.email}
            </p>
          </div>
        </div>
        
        {!isGuest && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Skill Level {stats.skillLevel}</span>
              <span className="text-purple-400 font-semibold">{stats.skillProgress}%</span>
            </div>
            <Progress value={stats.skillProgress} className="h-2" />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-light p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <span className="text-2xl font-bold text-foreground">{stats.projectsCompleted}</span>
          </div>
          <p className="text-sm text-muted-foreground">Projects</p>
        </div>

        <div className="glass-light p-4 rounded-xl border border-violet-500/20 hover:border-violet-500/40 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-5 h-5 text-violet-400" />
            <span className="text-2xl font-bold text-foreground">{stats.activeCourses}</span>
          </div>
          <p className="text-sm text-muted-foreground">Active Courses</p>
        </div>

        <div className="glass-light p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-2xl font-bold text-foreground">{stats.labsCompleted}</span>
          </div>
          <p className="text-sm text-muted-foreground">Labs Completed</p>
        </div>

        <div className="glass-light p-4 rounded-xl border border-violet-500/20 hover:border-violet-500/40 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            <span className="text-2xl font-bold text-foreground">Level {stats.skillLevel}</span>
          </div>
          <p className="text-sm text-muted-foreground">Skill Rank</p>
        </div>
      </div>

      {/* Featured Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <div className="glass-premium p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Continue Learning
          </h3>
          <div className="space-y-3">
            <div className="p-4 glass-light rounded-lg hover:bg-purple-400/5 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-foreground">Introduction to Robotics</h4>
                <Badge variant="default" className="bg-purple-500/20 text-purple-300">60%</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Build your first robot</p>
              <Progress value={60} className="h-1" />
            </div>
            <div className="p-4 glass-light rounded-lg hover:bg-violet-400/5 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-foreground">Digital Art Fundamentals</h4>
                <Badge variant="default" className="bg-violet-500/20 text-violet-300">25%</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Creative design principles</p>
              <Progress value={25} className="h-1" />
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="glass-premium p-6 rounded-xl border border-violet-500/20">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-violet-400" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            <div className="p-4 glass-light rounded-lg flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-400 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">First Steps</h4>
                <p className="text-sm text-muted-foreground">Completed your first project</p>
              </div>
            </div>
            <div className="p-4 glass-light rounded-lg flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-400 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Quick Learner</h4>
                <p className="text-sm text-muted-foreground">Completed 3 tutorials in one day</p>
              </div>
            </div>
          </div>
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
