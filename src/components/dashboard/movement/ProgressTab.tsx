import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';

interface ProgressTabProps {
  user: User | null;
  isGuest?: boolean;
}

export function MovementProgressTab({ user, isGuest }: ProgressTabProps) {
  const achievements = [
    { title: 'First Steps', description: 'Completed your first session', earned: true },
    { title: 'Week Warrior', description: '7 consecutive active days', earned: true },
    { title: 'Wellness Champion', description: 'Reached all monthly goals', earned: true },
    { title: 'Community Star', description: 'Participated in 10 group activities', earned: false },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
          Your Progress
        </h1>
        <p className="text-muted-foreground">
          Track your wellness journey and celebrate achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-light border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Trophy className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-500">42</div>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </CardContent>
        </Card>

        <Card className="glass-light border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
            <Target className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">28</div>
            <p className="text-xs text-muted-foreground">80% success rate</p>
          </CardContent>
        </Card>

        <Card className="glass-light border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">92/100</div>
            <p className="text-xs text-muted-foreground">Excellent progress!</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-light border-pink-500/20">
        <CardHeader>
          <CardTitle>Monthly Goals Progress</CardTitle>
          <CardDescription>Keep up the great work!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Physical Activity (15 sessions)</span>
              <span className="text-pink-500">12/15</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Mindfulness Practice (20 sessions)</span>
              <span className="text-rose-500">18/20</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Nutrition Goals (25 days)</span>
              <span className="text-pink-600">22/25</span>
            </div>
            <Progress value={88} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Community Participation (10 events)</span>
              <span className="text-rose-400">7/10</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-light border-pink-500/20">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Badges you've earned on your wellness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg text-center space-y-2 ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-pink-500/20 to-rose-400/20 border border-pink-500/30'
                    : 'bg-muted/50 opacity-50'
                }`}
              >
                <div className={`h-12 w-12 mx-auto rounded-full flex items-center justify-center ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-pink-500 to-rose-400'
                    : 'bg-muted'
                }`}>
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
