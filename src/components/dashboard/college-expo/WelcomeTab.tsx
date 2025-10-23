import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Award, ExternalLink, MapPinned, Building2, Heart, Grid3x3 } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export const WelcomeTab = () => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvent();
  }, []);

  const fetchFeaturedEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(*),
          event_tags(tag:tags(*))
        `)
        .eq('status', 'upcoming')
        .order('start_at', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-96 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">No Upcoming Events</h2>
          <p className="text-muted-foreground">Check back soon for new college expo events!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <Card className="overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div className="space-y-6">
            <div>
              <Badge className="mb-3 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                Next Event
              </Badge>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {event.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(event.start_at), 'MMMM d, yyyy • h:mm a')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{event.venue?.name}, {event.venue?.city}, {event.venue?.state}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span>Capacity: {event.capacity?.toLocaleString()} attendees</span>
              </div>
            </div>

            <div className="flex gap-3">
              {event.registration_url && (
                <Button size="lg" className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700" asChild>
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                    Register Now <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {event.event_flyer_url && (
            <div className="rounded-lg overflow-hidden shadow-xl border border-emerald-500/20">
              <img 
                src={event.event_flyer_url} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group">
            <MapPinned className="w-10 h-10 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">Explore Map</h3>
            <p className="text-sm text-muted-foreground">Find event locations and directions</p>
          </Card>
          
          <Card className="p-6 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group">
            <Grid3x3 className="w-10 h-10 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">View Floor Plan</h3>
            <p className="text-sm text-muted-foreground">Navigate booth layouts and exhibitors</p>
          </Card>
          
          <Card className="p-6 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group">
            <Building2 className="w-10 h-10 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">Browse Colleges</h3>
            <p className="text-sm text-muted-foreground">Discover schools and programs</p>
          </Card>
          
          <Card className="p-6 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group">
            <Heart className="w-10 h-10 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">Support Us</h3>
            <p className="text-sm text-muted-foreground">View donors and contribute</p>
          </Card>
        </div>
      </div>

      {/* Highlights */}
      {event.highlights && event.highlights.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Event Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {event.highlights.map((highlight: string, index: number) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1" />
                  <p className="text-sm">{highlight}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {event.event_tags && event.event_tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {event.event_tags.map((et: any) => (
            <span
              key={et.tag.id}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `${et.tag.color}20`,
                color: et.tag.color 
              }}
            >
              {et.tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
