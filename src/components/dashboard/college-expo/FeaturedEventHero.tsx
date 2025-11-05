import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ExternalLink, CheckCircle2 } from 'lucide-react';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  id: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  status: string;
  capacity: number;
  registration_url: string;
  event_flyer_url: string;
  attendee_count?: number;
  venue?: {
    name: string;
    city: string;
    state: string;
  };
}

export const FeaturedEventHero = () => {
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [completedEvent, setCompletedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    // Call the auto-status update function
    updateEventStatuses();
  }, []);

  const updateEventStatuses = async () => {
    try {
      await supabase.rpc('update_event_statuses');
    } catch (error) {
      console.error('Error updating event statuses:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      // Fetch in_progress or upcoming events
      const { data: activeEvents, error: activeError } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .in('status', ['in_progress', 'upcoming'])
        .order('start_at', { ascending: true })
        .limit(1);

      if (activeError) throw activeError;

      if (activeEvents && activeEvents.length > 0) {
        setFeaturedEvent(activeEvents[0]);
      }

      // Fetch most recent completed event
      const { data: completedEvents, error: completedError } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(*)
        `)
        .eq('status', 'completed')
        .order('end_at', { ascending: false })
        .limit(1);

      if (completedError) throw completedError;

      if (completedEvents && completedEvents.length > 0) {
        setCompletedEvent(completedEvents[0]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCountdownText = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const days = differenceInDays(start, now);
    const hours = differenceInHours(start, now);

    if (days < 0) return 'Past Event';
    if (days === 0 && hours < 2) return 'Starting Soon';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `${days} days away`;
    if (days <= 30) return `${Math.floor(days / 7)} weeks away`;
    return `${Math.floor(days / 30)} months away`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Recently Completed Event Banner */}
      {completedEvent && featuredEvent && (
        <Card className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div className="flex-1">
              <p className="font-semibold text-green-700 dark:text-green-400">
                {completedEvent.title} - Successfully Completed!
              </p>
              <p className="text-sm text-muted-foreground">
                Thank you to all attendees! See you next year! 🎓
              </p>
            </div>
            <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
              {format(new Date(completedEvent.end_at), 'MMM d, yyyy')}
            </Badge>
          </div>
        </Card>
      )}

      {/* Featured Event (Upcoming or In Progress) */}
      {featuredEvent ? (
        <Card className="overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={cn(
                    featuredEvent.status === 'in_progress' 
                      ? "bg-red-500/20 text-red-700 dark:text-red-400 animate-pulse" 
                      : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  )}>
                    {featuredEvent.status === 'in_progress' ? '🔴 Happening Now!' : '📅 Next Event'}
                  </Badge>
                  {featuredEvent.status === 'upcoming' && (
                    <Badge variant="outline" className="bg-primary/10">
                      {getCountdownText(featuredEvent.start_at)}
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {featuredEvent.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {featuredEvent.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{format(new Date(featuredEvent.start_at), 'EEEE, MMMM d, yyyy • h:mm a')}</span>
                </div>
                {featuredEvent.venue && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>
                      {featuredEvent.venue.name}, {featuredEvent.venue.city}, {featuredEvent.venue.state}
                    </span>
                  </div>
                )}
                {featuredEvent.capacity && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Capacity: {featuredEvent.capacity.toLocaleString()} attendees</span>
                  </div>
                )}
              </div>

              {featuredEvent.registration_url && featuredEvent.status === 'upcoming' && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    size="lg" 
                    className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700" 
                    asChild
                  >
                    <a 
                      href={featuredEvent.registration_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Register Now <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              )}

              {featuredEvent.status === 'in_progress' && (
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    📍 Event is currently happening! Join us at the venue.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg overflow-hidden shadow-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-green-500/10">
              {featuredEvent.event_flyer_url ? (
                <img 
                  src={featuredEvent.event_flyer_url} 
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-600 text-white">
                  <div className="text-center p-8">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-xl font-semibold">{featuredEvent.title}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : completedEvent ? (
        <Card className="p-12 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h2 className="text-3xl font-bold mb-4 text-green-700 dark:text-green-400">
            {completedEvent.title}
          </h2>
          <p className="text-xl mb-2">Successfully Completed!</p>
          <p className="text-muted-foreground mb-4">
            Thank you to all {completedEvent.attendee_count || 'our'} attendees!
          </p>
          <p className="text-lg font-semibold text-emerald-600">See you next year! 🎓</p>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No Upcoming Events</h2>
          <p className="text-muted-foreground">Check back soon for new college expo events!</p>
        </Card>
      )}
    </div>
  );
};

import { cn } from "@/lib/utils";
