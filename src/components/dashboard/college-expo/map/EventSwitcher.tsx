import { Calendar, MapPin, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  start_at: string;
  venue?: {
    city: string;
    state: string;
  };
}

interface EventSwitcherProps {
  events: Event[];
  selectedEventId: string | null;
  onEventSelect: (eventId: string | null) => void;
}

export const EventSwitcher = ({
  events,
  selectedEventId,
  onEventSelect,
}: EventSwitcherProps) => {
  const selectedEvent = events.find(e => e.id === selectedEventId);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Select Event</label>
        {selectedEvent && (
          <Badge variant="secondary" className="text-xs">
            Selected
          </Badge>
        )}
      </div>
      <Select
        value={selectedEventId || "all"}
        onValueChange={(value) => onEventSelect(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-full border-2">
          <SelectValue placeholder="Choose an event to view..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>All Events</span>
            </div>
          </SelectItem>
          {events.map((event) => (
            <SelectItem key={event.id} value={event.id}>
              <div className="flex flex-col gap-1 py-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(event.start_at), "MMM d, yyyy")}
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.venue.city}, {event.venue.state}
                    </div>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
