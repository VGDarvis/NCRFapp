import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Navigation, CheckCircle2, Trophy, Sparkles, GraduationCap, FileText, Users, Info, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InteractiveEventsMap } from '@/components/InteractiveEventsMap';
import { EventDetailDialog } from '@/components/EventDetailDialog';
import { EventFilters, EventFiltersState } from '@/components/EventFilters';
import { EventCountdownBadge } from '@/components/EventCountdownBadge';
import { EventStatusBadge } from '@/components/EventStatusBadge';
import { getUserLocation, sortEventsByDistance, calculateDistance, formatDistance } from '@/lib/geolocation-utils';

interface EventsMapTabProps {
  user: User | null;
  isGuest?: boolean;
}

export const EventsMapTab = ({ user, isGuest }: EventsMapTabProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [filters, setFilters] = useState<EventFiltersState>({
    searchQuery: '',
    distanceRadius: 100,
    dateRange: 'all',
    eventType: 'all',
    state: 'all',
    sortBy: 'date',
  });
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
    requestUserLocation();
  }, [toast]);

  const requestUserLocation = async () => {
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      toast({
        title: 'Location enabled',
        description: 'Showing distances to events',
      });
    } catch (error) {
      console.log('Location access denied or unavailable');
    }
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const getFilteredEvents = () => {
    let filtered = [...events];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.city.toLowerCase().includes(query) ||
          event.location_name.toLowerCase().includes(query) ||
          event.featured_colleges?.some((college: string) => college.toLowerCase().includes(query))
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const endDate = new Date();
      if (filters.dateRange === 'thisMonth') {
        endDate.setMonth(now.getMonth() + 1);
      } else if (filters.dateRange === 'next3Months') {
        endDate.setMonth(now.getMonth() + 3);
      } else if (filters.dateRange === 'thisYear') {
        endDate.setFullYear(now.getFullYear() + 1);
      }
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.event_date);
        return eventDate >= now && eventDate <= endDate;
      });
    }

    // Event type filter
    if (filters.eventType !== 'all') {
      filtered = filtered.filter((event) => event.event_type === filters.eventType);
    }

    // State filter
    if (filters.state !== 'all') {
      filtered = filtered.filter((event) => event.state === filters.state);
    }

    // Distance filter
    if (userLocation && filters.distanceRadius < 100) {
      filtered = filtered.filter((event) => {
        if (!event.latitude || !event.longitude) return false;
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          event.latitude,
          event.longitude
        );
        return distance <= filters.distanceRadius;
      });
    }

    // Sorting
    if (filters.sortBy === 'distance' && userLocation) {
      filtered = sortEventsByDistance(filtered, userLocation);
    } else if (filters.sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();
  const availableStates = Array.from(new Set(events.map((e) => e.state))).sort();

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

  const eventBenefits = [
    { icon: Users, text: 'Meet over 50+ colleges', color: 'text-blue-500' },
    { icon: CheckCircle2, text: 'Get accepted on the spot', color: 'text-green-500' },
    { icon: Trophy, text: 'Millions in scholarships available', color: 'text-yellow-500' },
    { icon: FileText, text: 'Some colleges waive applications', color: 'text-purple-500' },
    { icon: GraduationCap, text: 'Certificate and trade schools', color: 'text-orange-500' },
    { icon: Sparkles, text: 'Life-changing seminars', color: 'text-pink-500' },
    { icon: Trophy, text: 'Celebrities & prizes', color: 'text-red-500' },
  ];

  const whatToBring = [
    'High school transcripts or GPA',
    'SAT/ACT scores (if available)',
    'Personal essay or writing samples',
    'List of extracurricular activities',
    'Questions for college representatives',
    'Pen and notebook for notes',
    'Professional attire recommended',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          College Expo <span className="text-primary">Events & Expos</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Your one-stop shop for college expo success - find events, prepare, and get accepted!
        </p>
        
        <div className="flex justify-center gap-3 mb-6">
          {!userLocation && (
            <Button variant="outline" onClick={requestUserLocation}>
              <Navigation className="w-4 h-4 mr-2" />
              Enable Location
            </Button>
          )}
          <Button
            variant={showMap ? "default" : "outline"}
            onClick={() => setShowMap(!showMap)}
          >
            <Map className="w-4 h-4 mr-2" />
            {showMap ? "Hide Map" : "Show Interactive Map"}
          </Button>
        </div>

        <EventFilters
          filters={filters}
          onFiltersChange={setFilters}
          userLocation={userLocation}
          availableStates={availableStates}
        />

        {/* Interactive Map */}
        {showMap && filteredEvents.length > 0 && (
          <div className="mb-8">
            <InteractiveEventsMap events={filteredEvents} onEventClick={handleEventClick} />
          </div>
        )}

        {filteredEvents.length === 0 && (
          <Card className="p-8 glass-light border-primary/20 mb-8">
            <p className="text-center text-muted-foreground">
              No events found matching your filters.
            </p>
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => setFilters({
                searchQuery: '',
                distanceRadius: 100,
                dateRange: 'all',
                eventType: 'all',
                state: 'all',
                sortBy: 'date',
              })}>
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Benefits Showcase */}
        <Card className="p-6 glass-premium border-primary/20 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Attend Our Expos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eventBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Icon className={`h-5 w-5 ${benefit.color} mt-0.5 flex-shrink-0`} />
                  <p className="text-sm font-medium text-foreground">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Success Tips */}
        <Card className="p-6 glass-light border-primary/20 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            What to Bring for Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {whatToBring.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-foreground mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event) => {
              const distance = userLocation && event.latitude && event.longitude
                ? calculateDistance(userLocation.latitude, userLocation.longitude, event.latitude, event.longitude)
                : null;
              
              return (
                <Card key={event.id} className="p-6 glass-premium border-primary/20 hover:border-primary/40 transition-all">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                      <div className="flex flex-col gap-1 ml-2">
                        <EventCountdownBadge eventDate={new Date(event.event_date)} />
                        <EventStatusBadge
                          registrationDeadline={event.registration_deadline ? new Date(event.registration_deadline) : undefined}
                          maxAttendees={event.max_attendees || undefined}
                        />
                      </div>
                    </div>
                <p className="text-muted-foreground mb-4">{event.description}</p>
              </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{event.location_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.address}, {event.city}, {event.state} {event.zip_code}
                      </p>
                      {distance && (
                        <Badge variant="outline" className="mt-1">
                          {formatDistance(distance)}
                        </Badge>
                      )}
                    </div>
                  </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
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

                {/* What to Expect Section */}
                <div className="bg-background/50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-foreground mb-2">What to Expect:</p>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Meet representatives from 50+ colleges
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    On-the-spot admissions available
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Scholarship opportunities worth millions
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
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEventClick(event)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {event.registration_required && (
                  <Button
                    className="flex-1"
                    onClick={() => registerForEvent(event.id)}
                    disabled={isGuest}
                  >
                    Register Now
                  </Button>
                )}
                </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Event Detail Dialog */}
      <EventDetailDialog
        event={selectedEvent}
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        onRegister={registerForEvent}
        isGuest={isGuest}
        userLocation={userLocation}
      />
    </div>
  );
};