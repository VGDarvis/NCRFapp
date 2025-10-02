import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Brain, Users } from 'lucide-react';

interface ProgramsTabProps {
  user: User | null;
  isGuest?: boolean;
}

export function MovementProgramsTab({ user, isGuest }: ProgramsTabProps) {
  const programs = [
    {
      title: 'Physical Wellness',
      description: 'Exercise routines, sports training, and movement therapy',
      icon: Activity,
      color: 'pink',
      activities: ['Yoga & Stretching', 'Cardio Training', 'Strength Building', 'Sports Skills']
    },
    {
      title: 'Mental Wellness',
      description: 'Stress management, mindfulness, and emotional health',
      icon: Brain,
      color: 'rose',
      activities: ['Meditation', 'Stress Relief', 'Mindfulness', 'Self-Care']
    },
    {
      title: 'Nutrition & Health',
      description: 'Healthy eating habits and nutritional guidance',
      icon: Heart,
      color: 'pink',
      activities: ['Meal Planning', 'Healthy Recipes', 'Nutrition Education', 'Wellness Tips']
    },
    {
      title: 'Community Activities',
      description: 'Group fitness, team sports, and social wellness',
      icon: Users,
      color: 'rose',
      activities: ['Group Fitness', 'Team Sports', 'Social Events', 'Peer Support']
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
          Wellness Programs
        </h1>
        <p className="text-muted-foreground">
          Explore our holistic approach to health and wellness
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((program, index) => {
          const Icon = program.icon;
          return (
            <Card key={index} className="glass-light border-pink-500/20 hover-scale">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-br from-${program.color}-500 to-${program.color}-400 flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Available Activities:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {program.activities.map((activity, actIndex) => (
                      <div 
                        key={actIndex}
                        className="p-2 bg-pink-500/5 rounded-lg text-sm text-center"
                      >
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-light border-pink-500/20">
        <CardHeader>
          <CardTitle>Featured Challenge: 30-Day Wellness Journey</CardTitle>
          <CardDescription>Join our community in a month-long wellness transformation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Days Completed</span>
              <span className="text-pink-500">12/30</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 w-[40%] rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-pink-500/5 rounded-lg text-center">
              <Activity className="h-6 w-6 mx-auto mb-1 text-pink-500" />
              <p className="text-xs">Daily Movement</p>
            </div>
            <div className="p-3 bg-rose-500/5 rounded-lg text-center">
              <Heart className="h-6 w-6 mx-auto mb-1 text-rose-500" />
              <p className="text-xs">Healthy Eating</p>
            </div>
            <div className="p-3 bg-pink-500/5 rounded-lg text-center">
              <Brain className="h-6 w-6 mx-auto mb-1 text-pink-600" />
              <p className="text-xs">Mindfulness</p>
            </div>
            <div className="p-3 bg-rose-500/5 rounded-lg text-center">
              <Users className="h-6 w-6 mx-auto mb-1 text-rose-400" />
              <p className="text-xs">Community</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
