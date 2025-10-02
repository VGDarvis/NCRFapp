import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventsMapTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const EventsMapTab = ({ user, isGuest }: EventsMapTabProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('expo_events')
        .select('*')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) {
        toast({
          title: 'Error loading events',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data) setEvents(data);
    };

    fetchEvents();
  }, [toast]);

  const getDirections = (address: string, city: string, state: string) => {
    const fullAddress = `${address}, ${city}, ${state}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
    window.open(mapsUrl, '_blank');
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to register for events',
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase
      .from('event_attendance')
      .insert({
        user_id: user.id,
        event_id: eventId,
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Already registered',
          description: 'You have already registered for this event',
        });
      } else {
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
        });
      }
      return;
    }

    toast({
      title: 'Registered successfully!',
      description: 'You have been registered for this event',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-4xl font-bold text-foreground mb-2">
        College Expo <span className="text-primary">Events & Maps</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Find college expo events near you and get directions
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <Card key={event.id} className="p-6 glass-premium border-primary/20">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                <p className="text-muted-foreground mb-4">{event.description}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{event.location_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.address}, {event.city}, {event.state} {event.zip_code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <p className="text-sm text-foreground">
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {event.parking_info && (
                <div className="bg-background/50 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-foreground mb-1">Parking Info:</p>
                  <p className="text-sm text-muted-foreground">{event.parking_info}</p>
                </div>
              )}

              {event.accessibility_info && (
                <div className="bg-background/50 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-foreground mb-1">Accessibility:</p>
                  <p className="text-sm text-muted-foreground">{event.accessibility_info}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => getDirections(event.address, event.city, event.state)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                {event.registration_required && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => registerForEvent(event.id)}
                    disabled={isGuest}
                  >
                    Register
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 glass-light border-primary/20 col-span-2">
            <p className="text-center text-muted-foreground">
              No upcoming events at this time. Check back soon for new college expo events!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};