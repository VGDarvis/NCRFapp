import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { Clock, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  venue?: {
    name: string;
    city: string;
    state: string;
  };
  event_type: string;
}

interface CalendarViewProps {
  events: Event[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

export const CalendarView = ({ events, selectedDate, onSelectDate }: CalendarViewProps) => {
  const eventDates = events.map(e => new Date(e.start_at));
  
  const selectedDayEvents = events.filter(event => 
    selectedDate && isSameDay(new Date(event.start_at), selectedDate)
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Event Calendar</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border"
          modifiers={{
            hasEvent: eventDates
          }}
          modifiersClassNames={{
            hasEvent: "bg-primary/10 font-bold"
          }}
        />
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
        </h3>
        {selectedDayEvents.length > 0 ? (
          selectedDayEvents.map(event => (
            <Card key={event.id} className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-semibold">{event.title}</h4>
                  <Badge variant="outline">{event.event_type}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {format(new Date(event.start_at), "h:mm a")} - {format(new Date(event.end_at), "h:mm a")}
                </div>
                {event.venue && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.venue.name}, {event.venue.city}, {event.venue.state}
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No events on this date</p>
          </Card>
        )}
      </div>
    </div>
  );
};
