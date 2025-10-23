import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isPast, isFuture } from "date-fns";
import { Calendar, Clock, MapPin, Download } from "lucide-react";
import { downloadICSFile } from "@/lib/calendar-export-utils";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description?: string;
  start_at: string;
  end_at: string;
  venue?: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  event_type: string;
  registration_url?: string;
}

interface TimelineViewProps {
  events: Event[];
}

export const TimelineView = ({ events }: TimelineViewProps) => {
  const handleAddToCalendar = (event: Event) => {
    downloadICSFile({
      title: event.title,
      description: event.description || '',
      location: event.venue ? `${event.venue.name}, ${event.venue.address}, ${event.venue.city}, ${event.venue.state}` : '',
      startDate: new Date(event.start_at),
      endDate: new Date(event.end_at),
      url: event.registration_url
    }, `${event.title.replace(/\s+/g, '-').toLowerCase()}.ics`);
    
    toast.success("Calendar event downloaded");
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => {
        const eventDate = new Date(event.start_at);
        const isUpcoming = isFuture(eventDate);
        const hasPassed = isPast(new Date(event.end_at));

        return (
          <Card key={event.id} className={`p-6 ${hasPassed ? 'opacity-60' : ''}`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {format(eventDate, "d")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(eventDate, "MMM")}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      {isUpcoming && <Badge variant="default">Upcoming</Badge>}
                      {hasPassed && <Badge variant="secondary">Past</Badge>}
                      <Badge variant="outline">{event.event_type}</Badge>
                    </div>
                    
                    {event.description && (
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                    )}
                    
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {format(eventDate, "EEEE, MMMM d, yyyy")} · {format(eventDate, "h:mm a")} - {format(new Date(event.end_at), "h:mm a")}
                      </div>
                      
                      {event.venue && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {event.venue.name}, {event.venue.city}, {event.venue.state}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 lg:flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToCalendar(event)}
                  className="w-full lg:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                {event.registration_url && isUpcoming && (
                  <Button
                    size="sm"
                    onClick={() => window.open(event.registration_url, '_blank')}
                    className="w-full lg:w-auto"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}

      {sortedEvents.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
          <p className="text-muted-foreground">Check back soon for upcoming events!</p>
        </Card>
      )}
    </div>
  );
};
