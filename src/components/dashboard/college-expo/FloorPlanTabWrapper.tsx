import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { FloorPlanTab } from "./FloorPlanTab";
import { EventSwitcher } from "./map/EventSwitcher";
import { useEvents } from "@/hooks/useEvents";

export const FloorPlanTabWrapper = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { eventsWithVenues, isLoadingEventsWithVenues } = useEvents();

  // Smart auto-selection: Select most upcoming event or most recent past event
  useEffect(() => {
    if (!eventsWithVenues || eventsWithVenues.length === 0 || selectedEventId) return;

    // Sort events by start date
    const sortedEvents = [...eventsWithVenues].sort(
      (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
    );

    // Find the next upcoming event
    const now = new Date();
    const upcomingEvent = sortedEvents.find(e => new Date(e.start_at) >= now);

    // Auto-select upcoming event, or fall back to most recent past event
    const eventToSelect = upcomingEvent || sortedEvents[sortedEvents.length - 1];
    
    if (eventToSelect) {
      setSelectedEventId(eventToSelect.id);
    }
  }, [eventsWithVenues, selectedEventId]);

  const selectedEvent = eventsWithVenues?.find(e => e.id === selectedEventId);
  const venueId = selectedEvent?.venue_id || null;

  if (isLoadingEventsWithVenues) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading BCE Map...</p>
        </Card>
      </div>
    );
  }

  if (!eventsWithVenues || eventsWithVenues.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No BCE Map Available</h3>
          <p className="text-muted-foreground">
            There are no upcoming events at this time.
          </p>
        </Card>
      </div>
    );
  }

  if (!selectedEventId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">Select an Event</h3>
          <p className="text-muted-foreground mb-4">
            Choose an event to view the BCE Map
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event Switcher */}
      <Card className="p-4 mb-6">
        <EventSwitcher
          events={eventsWithVenues}
          selectedEventId={selectedEventId}
          onEventSelect={setSelectedEventId}
        />
      </Card>

      <FloorPlanTab eventId={selectedEventId} venueId={venueId} />
    </div>
  );
};
