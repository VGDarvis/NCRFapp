import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, MessageCircle, Calendar } from 'lucide-react';

interface CommunityTabProps {
  user: User | null;
  isGuest?: boolean;
}

export function MovementCommunityTab({ user, isGuest }: CommunityTabProps) {
  const successStories = [
    {
      name: 'Sarah Johnson',
      achievement: 'Lost 20 pounds and gained confidence!',
      story: 'The Movement program changed my life. The mentors were supportive and the community kept me motivated every step of the way.',
    },
    {
      name: 'Michael Chen',
      achievement: 'Improved mental health and stress management',
      story: 'Learning mindfulness techniques and having access to wellness resources has been transformative for my overall wellbeing.',
    },
  ];

  const upcomingEvents = [
    {
      title: 'Community Yoga Session',
      date: 'Saturday, 10:00 AM',
      participants: 15,
    },
    {
      title: 'Wellness Workshop',
      date: 'Next Tuesday, 2:00 PM',
      participants: 22,
    },
    {
      title: 'Group Fitness Challenge',
      date: 'Next Week',
      participants: 34,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
          Community
        </h1>
        <p className="text-muted-foreground">
          Connect with fellow students and share your wellness journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="glass-light border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-500">234</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>

        <Card className="glass-light border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Stories</CardTitle>
            <Heart className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">89</div>
            <p className="text-xs text-muted-foreground">Shared transformations</p>
          </CardContent>
        </Card>

        <Card className="glass-light border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
            <MessageCircle className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">567</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-light border-pink-500/20">
        <CardHeader>
          <CardTitle>Upcoming Community Events</CardTitle>
          <CardDescription>Join us for group activities and workshops</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-pink-500/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-pink-500" />
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.participants} joining</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-light border-pink-500/20">
        <CardHeader>
          <CardTitle>Success Stories</CardTitle>
          <CardDescription>Inspiring transformations from our community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {successStories.map((story, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-pink-500/10 to-rose-400/10 rounded-lg border border-pink-500/20">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium">{story.name}</p>
                  <p className="text-sm text-pink-500">{story.achievement}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">"{story.story}"</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
