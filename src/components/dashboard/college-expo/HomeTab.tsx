import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, GraduationCap, MapPin, TrendingUp, LogOut } from 'lucide-react';
import { CollegeExpoVideo } from './CollegeExpoVideo';
import { ExpoFlyersGallery } from './ExpoFlyersGallery';
import { FeaturedEventHero } from './FeaturedEventHero';
import { calculateBookletScholarshipTotals, formatCurrency } from '@/lib/scholarship-utils';

interface CollegeExpoHomeTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const CollegeExpoHomeTab = ({ user, isGuest }: CollegeExpoHomeTabProps) => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [scholarshipCount, setScholarshipCount] = useState(0);
  const [scholarshipValue, setScholarshipValue] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch upcoming events
      const { data: events } = await supabase
        .from('expo_events')
        .select('*')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(3);
      
      if (events) setUpcomingEvents(events);

      // Fetch total scholarships from booklets
      const { totalScholarships, totalValue } = await calculateBookletScholarshipTotals();
      setScholarshipCount(totalScholarships);
      setScholarshipValue(totalValue);

      // Fetch user's applications count if logged in
      if (user) {
        const { count: applications } = await supabase
          .from('scholarship_applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (applications) setApplicationCount(applications);
      }
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Only if user is logged in */}
      {!isGuest && user && (
        <div className="container mx-auto px-4 pt-8">
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome, {user.email?.split('@')[0]}! 👋
                </h1>
                <p className="text-muted-foreground">
                  Your gateway to college opportunities and success
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Featured Event Hero - Dynamic based on event status */}
      <FeaturedEventHero />

      {/* Video Section */}
      <div className="container mx-auto px-4">
        <CollegeExpoVideo />
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 glass-premium border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{upcomingEvents.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-premium border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{scholarshipCount}+</p>
              <p className="text-sm text-muted-foreground">Worth {formatCurrency(scholarshipValue)}+</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-premium border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{applicationCount}</p>
              <p className="text-sm text-muted-foreground">Your Applications</p>
            </div>
          </div>
        </Card>
        </div>
      </div>

      {/* Expo Flyers Gallery */}
      <div className="container mx-auto px-4">
        <ExpoFlyersGallery />
      </div>

      {/* Upcoming Events */}
      <div className="container mx-auto px-4">
        <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Upcoming College Expo Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Card key={event.id} className="p-6 glass-light border-primary/20 hover:border-primary/40 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.location_name}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                <p className="text-xs text-primary font-medium">
                  {new Date(event.event_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </Card>
            ))
          ) : (
            <Card className="p-6 glass-light border-primary/20 col-span-3">
              <p className="text-center text-muted-foreground">No upcoming events at this time. Check back soon!</p>
            </Card>
          )}
        </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 glass-premium border-primary/20">
          <h3 className="text-xl font-bold text-foreground mb-3">Find Scholarships</h3>
          <p className="text-muted-foreground mb-4">
            Discover scholarship opportunities that match your profile and interests.
          </p>
          <Button className="w-full">Browse Scholarships</Button>
        </Card>

        <Card className="p-6 glass-premium border-primary/20">
          <h3 className="text-xl font-bold text-foreground mb-3">College Prep Resources</h3>
          <p className="text-muted-foreground mb-4">
            Access guides, tools, and resources to help you prepare for college applications.
          </p>
          <Button variant="outline" className="w-full">Explore Resources</Button>
        </Card>
        </div>
      </div>
    </div>
  );
};