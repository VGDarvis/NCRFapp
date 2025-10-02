import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Target, TrendingUp } from 'lucide-react';

interface HomeTabProps {
  user: User | null;
  isGuest?: boolean;
}

export function MovementHomeTab({ user, isGuest }: HomeTabProps) {
  const navigate = useNavigate();
  const displayName = isGuest ? 'Guest' : user?.user_metadata?.display_name || 'Student';

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
          Welcome, {displayName}!
        </h1>
        <p className="text-muted-foreground">
          Your Movement Enrichment journey starts here
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-light border-pink-500/20 hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-500">85%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>

        <Card className="glass-light border-pink-500/20 hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
            <Activity className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-light border-pink-500/20 hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Met</CardTitle>
            <Target className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">8/10</div>
            <p className="text-xs text-muted-foreground">Great progress!</p>
          </CardContent>
        </Card>

        <Card className="glass-light border-pink-500/20 hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-400">+23%</div>
            <p className="text-xs text-muted-foreground">Since you started</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-light border-pink-500/20">
        <CardHeader>
          <CardTitle>Your Wellness Journey</CardTitle>
          <CardDescription>Track your progress and achieve your goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Physical Activity</span>
              <span className="text-pink-500">80%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 w-[80%] rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Mental Wellness</span>
              <span className="text-rose-500">90%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 w-[90%] rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Nutrition Goals</span>
              <span className="text-pink-600">75%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 w-[75%] rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-light border-pink-500/20">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-pink-500/5 rounded-lg">
              <div>
                <p className="font-medium">Yoga with Coach Sarah</p>
                <p className="text-sm text-muted-foreground">Today, 3:00 PM</p>
              </div>
              <Activity className="h-5 w-5 text-pink-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-pink-500/5 rounded-lg">
              <div>
                <p className="font-medium">Nutrition Workshop</p>
                <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
              </div>
              <Heart className="h-5 w-5 text-rose-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-light border-pink-500/20">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-rose-500/5 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">7-Day Streak!</p>
                <p className="text-sm text-muted-foreground">Stayed active all week</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-rose-500/5 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Wellness Champion</p>
                <p className="text-sm text-muted-foreground">Completed all goals this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        {isGuest ? (
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="w-full max-w-md glass-light border-primary/20"
          >
            Return to Programs
          </Button>
        ) : (
          <Button 
            onClick={() => navigate('/signout')} 
            variant="outline" 
            className="w-full max-w-md glass-light border-destructive/20 text-destructive hover:bg-destructive/10"
          >
            Sign Out →
          </Button>
        )}
      </div>
    </div>
  );
}
