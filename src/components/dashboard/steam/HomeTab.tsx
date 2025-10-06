import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EventHero } from './EventHero';
import { EventActivities } from './EventActivities';
import { EventSchedule } from './EventSchedule';

interface HomeTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const HomeTab = ({ user, isGuest = false }: HomeTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [featuredEvent, setFeaturedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('expo_events')
          .select('*')
          .eq('is_featured', true)
          .eq('event_type', 'tournament')
          .eq('status', 'upcoming')
          .single();
        
        if (error) throw error;
        setFeaturedEvent(data);
      } catch (error) {
        console.error('Error fetching featured event:', error);
        toast({
          title: "Error loading event",
          description: "Could not load the featured event. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvent();
  }, [toast]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="glass-premium p-12 rounded-2xl border border-purple-500/20 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-purple-500/20 rounded mx-auto mb-4"></div>
            <div className="h-4 w-64 bg-purple-500/10 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!featuredEvent) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="glass-premium p-12 rounded-2xl border border-purple-500/20 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">No Featured Events</h2>
          <p className="text-muted-foreground">Check back soon for upcoming STEAM events!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Featured Event Hero */}
      <EventHero event={featuredEvent} />

      {/* Event Activities */}
      {featuredEvent.activities && Array.isArray(featuredEvent.activities) && featuredEvent.activities.length > 0 && (
        <EventActivities activities={featuredEvent.activities} />
      )}

      {/* Event Schedule */}
      {featuredEvent.schedule && Array.isArray(featuredEvent.schedule) && featuredEvent.schedule.length > 0 && (
        <EventSchedule 
          schedule={featuredEvent.schedule} 
          eventDate={featuredEvent.event_date}
        />
      )}

      {/* Return Button */}
      <div className="pt-4">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="w-full glass-light border-primary/20"
        >
          Return to Programs
        </Button>
      </div>
    </div>
  );
};
